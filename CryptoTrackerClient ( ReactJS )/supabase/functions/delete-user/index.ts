import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response("Unauthorized", {
        status: 401,
        headers: corsHeaders,
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { password } = await req.json();

    if (!password) {
      return new Response("Password required", {
        status: 400,
        headers: corsHeaders,
      });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
    const SERVICE_ROLE_KEY = Deno.env.get("SERVICE_ROLE_KEY")!;

    const userClient = createClient(
      SUPABASE_URL,
      SUPABASE_ANON_KEY,
      {
        global: {
          headers: { Authorization: `Bearer ${token}` },
        },
      }
    );

    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser();

    if (userError || !user) {
      return new Response("Invalid user", {
        status: 401,
        headers: corsHeaders,
      });
    }

    const { error: reAuthError } = await userClient.auth.signInWithPassword({
      email: user.email!,
      password,
    });

    if (reAuthError) {
      return new Response("Incorrect password", {
        status: 403,
        headers: corsHeaders,
      });
    }

    const adminClient = createClient(
      SUPABASE_URL,
      SERVICE_ROLE_KEY
    );

    await adminClient.from("profiles").delete().eq("id", user.id);

    const { error: deleteError } =
      await adminClient.auth.admin.deleteUser(user.id);

    if (deleteError) {
      return new Response(deleteError.message, {
        status: 400,
        headers: corsHeaders,
      });
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: corsHeaders,
      }
    );

  } catch (err) {
    return new Response("Server error", {
      status: 500,
      headers: corsHeaders,
    });
  }
});