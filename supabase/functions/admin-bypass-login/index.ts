import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const ADMIN_EMAIL = "admin@hexa.ai";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const expected = Deno.env.get("ADMIN_PASSKEY") ?? "";
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const body = await req.json().catch(() => ({}));
    const passkey = String(body?.passkey ?? "");

    if (!expected || passkey.length < 4) {
      return new Response(JSON.stringify({ error: "Invalid passkey" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Constant-time compare
    const a = new TextEncoder().encode(passkey);
    const b = new TextEncoder().encode(expected);
    let ok = a.length === b.length;
    let diff = 0;
    const len = Math.max(a.length, b.length);
    for (let i = 0; i < len; i++) diff |= (a[i] ?? 0) ^ (b[i] ?? 0);
    if (!(ok && diff === 0)) {
      return new Response(JSON.stringify({ error: "Incorrect passkey" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Ensure admin user exists
    const { data: list } = await admin.auth.admin.listUsers();
    let adminUser = list?.users?.find((u: any) => u.email === ADMIN_EMAIL);
    if (!adminUser) {
      const { data: created, error: createErr } = await admin.auth.admin.createUser({
        email: ADMIN_EMAIL,
        email_confirm: true,
        user_metadata: { full_name: "Hexa Admin" },
      });
      if (createErr) throw createErr;
      adminUser = created.user!;
    }

    // Ensure admin role
    await admin.from("user_roles").upsert(
      { user_id: adminUser.id, role: "admin" },
      { onConflict: "user_id,role" }
    );

    // Generate a magic link token the client can verify to obtain a session
    const { data: linkData, error: linkErr } = await admin.auth.admin.generateLink({
      type: "magiclink",
      email: ADMIN_EMAIL,
    });
    if (linkErr) throw linkErr;

    const token_hash = (linkData?.properties as any)?.hashed_token;
    if (!token_hash) throw new Error("Failed to generate session token");

    return new Response(
      JSON.stringify({ success: true, email: ADMIN_EMAIL, token_hash }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: String((e as Error).message ?? e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
