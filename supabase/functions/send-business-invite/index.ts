import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

type InvitePayload = {
  businessName: string;
  inviteeEmail: string;
  inviteeName?: string;
  inviterName: string;
  roleLabel: string;
  inviteLink: string;
};

const resendApiKey = Deno.env.get("RESEND_API_KEY");
const fromEmail = Deno.env.get("BUSINESS_INVITE_FROM_EMAIL");

function jsonResponse(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return jsonResponse(405, {
      success: false,
      provider: "resend",
      error: "Method not allowed.",
    });
  }

  const authHeader = request.headers.get("Authorization");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

  if (!authHeader || !supabaseUrl || !supabaseAnonKey) {
    return jsonResponse(401, {
      success: false,
      provider: "resend",
      error: "Missing Supabase auth context.",
    });
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: authHeader,
      },
    },
  });

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return jsonResponse(401, {
      success: false,
      provider: "resend",
      error: "Authentication required.",
    });
  }

  if (!resendApiKey || !fromEmail) {
    return jsonResponse(503, {
      success: false,
      provider: "resend",
      error: "Email delivery is not configured yet. Add RESEND_API_KEY and BUSINESS_INVITE_FROM_EMAIL.",
    });
  }

  let payload: InvitePayload;

  try {
    payload = (await request.json()) as InvitePayload;
  } catch {
    return jsonResponse(400, {
      success: false,
      provider: "resend",
      error: "Invalid JSON body.",
    });
  }

  if (!payload.businessName || !payload.inviteeEmail || !payload.inviterName || !payload.roleLabel || !payload.inviteLink) {
    return jsonResponse(400, {
      success: false,
      provider: "resend",
      error: "Missing required invite fields.",
    });
  }

  const inviteeName = payload.inviteeName?.trim() || "there";
  const subject = `${payload.inviterName} invited you to ${payload.businessName} on Scout`;
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
      <p>Hi ${inviteeName},</p>
      <p><strong>${payload.inviterName}</strong> invited you to join <strong>${payload.businessName}</strong> on Scout as <strong>${payload.roleLabel}</strong>.</p>
      <p>
        <a href="${payload.inviteLink}" style="display: inline-block; padding: 12px 18px; background: #10b981; color: #04121a; text-decoration: none; border-radius: 10px; font-weight: 700;">
          Open business portal invite
        </a>
      </p>
      <p>If the button does not work, paste this link into your browser:</p>
      <p><a href="${payload.inviteLink}">${payload.inviteLink}</a></p>
      <p>This invite works with your Scout business portal sign-in.</p>
    </div>
  `;

  const text = [
    `Hi ${inviteeName},`,
    "",
    `${payload.inviterName} invited you to join ${payload.businessName} on Scout as ${payload.roleLabel}.`,
    "",
    `Open your invite: ${payload.inviteLink}`,
  ].join("\n");

  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [payload.inviteeEmail],
      subject,
      html,
      text,
    }),
  });

  const responseBody = await resendResponse.json().catch(() => null);

  if (!resendResponse.ok) {
    return jsonResponse(502, {
      success: false,
      provider: "resend",
      error:
        (responseBody &&
          typeof responseBody === "object" &&
          "message" in responseBody &&
          typeof responseBody.message === "string" &&
          responseBody.message) ||
        "Resend rejected the email request.",
    });
  }

  const messageId =
    responseBody &&
    typeof responseBody === "object" &&
    "id" in responseBody &&
    typeof responseBody.id === "string"
      ? responseBody.id
      : null;

  return jsonResponse(200, {
    success: true,
    provider: "resend",
    id: messageId,
  });
});
