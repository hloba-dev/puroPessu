import 'server-only';
import nodemailer, {type Transporter} from 'nodemailer';

interface Mail {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
  attachments?: {filename: string; content: Buffer}[];
}

const escapeMap: Record<string, string> = {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'};
/** Escape user-provided text before it goes into e-mail HTML. */
export const esc = (value: string | number | undefined | null) =>
  String(value ?? '').replace(/[&<>"']/g, (ch) => escapeMap[ch]);

let transport: Transporter | null | undefined;

/** SMTP transport from env; null when SMTP is not configured (local development, demo mode). */
function smtp(): Transporter | null {
  if (transport !== undefined) return transport;
  const host = process.env.SMTP_HOST;
  if (!host) return (transport = null);
  const port = Number(process.env.SMTP_PORT || 587);
  // 465 = implicit TLS; 587/25 upgrade with STARTTLS
  const secureEnv = (process.env.SMTP_SECURE ?? '').trim().toLowerCase();
  const secure = secureEnv ? secureEnv === 'true' : port === 465;
  const auth = process.env.SMTP_USER ? {user: process.env.SMTP_USER, pass: process.env.SMTP_PASS ?? ''} : undefined;
  transport = nodemailer.createTransport({
    host,
    port,
    secure,
    // a password is never sent over a connection that did not upgrade to TLS
    requireTLS: !secure && Boolean(auth),
    auth,
    // a wrong or firewalled host must not keep a request waiting for minutes
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000
  });
  return transport;
}

/** Sends through your own SMTP server. Without SMTP_HOST the message is only logged. */
export async function sendMail(mail: Mail): Promise<boolean> {
  const client = smtp();
  const from = process.env.MAIL_FROM ?? 'Puro <varaukset@puropesu.fi>';
  if (!client) {
    console.info(`[mail] (not sent, SMTP_HOST missing) to=${mail.to} subject="${mail.subject}"`);
    return false;
  }
  try {
    await client.sendMail({
      from,
      to: mail.to,
      subject: mail.subject,
      html: mail.html,
      replyTo: mail.replyTo,
      attachments: mail.attachments?.map((a) => ({filename: a.filename, content: a.content}))
    });
    return true;
  } catch (error) {
    console.error('[mail] send failed', error);
    return false;
  }
}

/** Where owner notifications go: OWNER_EMAIL, or the public address from settings when it is not set. */
export const ownerEmail = (fallback?: string) => process.env.OWNER_EMAIL || fallback || null;

/** Plain, client-safe e-mail shell (tables + inline styles). */
export function emailLayout(opts: {title: string; body: string; footer: string}) {
  return `<!doctype html><html><body style="margin:0;padding:0;background:#eef2f6;font-family:Arial,Helvetica,sans-serif;color:#0b1220">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef2f6;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:14px;overflow:hidden">
<tr><td style="background:#020204;padding:20px 28px;color:#ffffff;font-size:20px;font-weight:bold">Puro</td></tr>
<tr><td style="padding:28px">
<h1 style="margin:0 0 16px;font-size:22px;line-height:1.3">${opts.title}</h1>
${opts.body}
</td></tr>
<tr><td style="padding:18px 28px;background:#f6f8fa;color:#5b6675;font-size:13px;line-height:1.5">${opts.footer}</td></tr>
</table></td></tr></table></body></html>`;
}

export const emailRow = (label: string, value: string) =>
  `<tr><td style="padding:6px 12px 6px 0;color:#5b6675;vertical-align:top;white-space:nowrap">${label}</td><td style="padding:6px 0;font-weight:bold">${value}</td></tr>`;

export const emailButton = (href: string, label: string) =>
  `<p style="margin:22px 0"><a href="${href}" style="display:inline-block;background:#006180;color:#ffffff;text-decoration:none;font-weight:bold;padding:12px 22px;border-radius:10px">${label}</a></p>`;
