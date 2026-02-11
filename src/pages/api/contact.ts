export const prerender = false;

import type { APIRoute } from "astro";

interface ContactPayload {
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  subject: string;
  message: string;
}

const SUBJECT_LABELS: Record<string, string> = {
  demo: "Request a Demo",
  pricing: "Pricing Enquiry",
  enterprise: "Enterprise Edition",
  support: "Technical Support",
  partnership: "Partnership",
  other: "Other",
};

export const POST: APIRoute = async (context) => {
  const headers = { "Content-Type": "application/json" };

  // Parse body
  let body: ContactPayload;
  try {
    body = await context.request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body." }), {
      status: 400,
      headers,
    });
  }

  const { firstName, lastName, email, company, subject, message } = body;

  // Validate required fields
  if (
    !firstName?.trim() ||
    !lastName?.trim() ||
    !email?.trim() ||
    !subject?.trim() ||
    !message?.trim()
  ) {
    return new Response(
      JSON.stringify({ error: "All required fields must be filled in." }),
      {
        status: 400,
        headers,
      },
    );
  }

  // Basic email validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(
      JSON.stringify({ error: "Please provide a valid email address." }),
      {
        status: 400,
        headers,
      },
    );
  }

  // Get Brevo API key from Cloudflare Workers environment (set via wrangler secret put BREVO_API_KEY)
  const runtime = (context.locals as any).runtime;
  const apiKey: string = runtime?.env?.BREVO_API_KEY ?? "";
  if (!apiKey) {
    console.error("BREVO_API_KEY is not configured.");
    return new Response(
      JSON.stringify({
        error: "Server configuration error. Please try again later.",
      }),
      {
        status: 500,
        headers,
      },
    );
  }

  const subjectLabel = SUBJECT_LABELS[subject] ?? subject;

  // Build the email via Brevo Transactional Email API
  const brevoPayload = {
    sender: {
      name: "Area 1337 Website",
      email: "noreply@area1337.com",
    },
    to: [
      {
        email: "contact@area1337.com",
        name: "Area 1337",
      },
    ],
    replyTo: {
      email: email.trim(),
      name: `${firstName.trim()} ${lastName.trim()}`,
    },
    subject: `[Website] ${subjectLabel} - ${firstName.trim()} ${lastName.trim()}`,
    htmlContent: `
      <h2>New contact form submission</h2>
      <table style="border-collapse:collapse;width:100%;max-width:600px;">
        <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Name</td><td style="padding:8px;border-bottom:1px solid #eee;">${escapeHtml(firstName.trim())} ${escapeHtml(lastName.trim())}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Email</td><td style="padding:8px;border-bottom:1px solid #eee;"><a href="mailto:${escapeHtml(email.trim())}">${escapeHtml(email.trim())}</a></td></tr>
        ${company?.trim() ? `<tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Company</td><td style="padding:8px;border-bottom:1px solid #eee;">${escapeHtml(company.trim())}</td></tr>` : ""}
        <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Subject</td><td style="padding:8px;border-bottom:1px solid #eee;">${escapeHtml(subjectLabel)}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;vertical-align:top;">Message</td><td style="padding:8px;white-space:pre-wrap;">${escapeHtml(message.trim())}</td></tr>
      </table>
    `,
  };

  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
        Accept: "application/json",
      },
      body: JSON.stringify(brevoPayload),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`Brevo API error (${res.status}): ${errText}`);
      return new Response(
        JSON.stringify({
          error: "Failed to send message. Please try again later.",
        }),
        {
          status: 502,
          headers,
        },
      );
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers,
    });
  } catch (err) {
    console.error("Brevo request failed:", err);
    return new Response(
      JSON.stringify({
        error: "Failed to send message. Please try again later.",
      }),
      {
        status: 500,
        headers,
      },
    );
  }
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
