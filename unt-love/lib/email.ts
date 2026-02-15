import { Resend } from "resend";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const SUBJECT = "Your UNT Love Code";

function getResendConfig(): { apiKey: string; from: string } | null {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
  if (!apiKey) return null;
  return { apiKey, from };
}

function getSesConfig(): {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  fromEmail: string;
} | null {
  const region = process.env.AWS_REGION;
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const fromEmail = process.env.SES_FROM_EMAIL;
  if (!region || !accessKeyId || !secretAccessKey || !fromEmail) return null;
  return { region, accessKeyId, secretAccessKey, fromEmail };
}

let sesClient: SESClient | null = null;

function getSesClient(config: NonNullable<ReturnType<typeof getSesConfig>>): SESClient {
  if (!sesClient) {
    sesClient = new SESClient({
      region: config.region,
      credentials: { accessKeyId: config.accessKeyId, secretAccessKey: config.secretAccessKey },
    });
  }
  return sesClient;
}

export async function sendEmail(email: string, code: string): Promise<void> {
  const body = `Your verification code is: ${code}`;

  const resendConfig = getResendConfig();
  if (resendConfig) {
    const resend = new Resend(resendConfig.apiKey);
    const { error } = await resend.emails.send({
      from: resendConfig.from,
      to: email,
      subject: SUBJECT,
      html: `<p>Your verification code is: <strong>${code}</strong></p>`,
    });
    if (error) throw new Error(`Resend send failed: ${error.message}`);
    return;
  }

  const sesConfig = getSesConfig();
  if (sesConfig) {
    const command = new SendEmailCommand({
      Source: sesConfig.fromEmail,
      Destination: { ToAddresses: [email] },
      Message: {
        Subject: { Data: SUBJECT, Charset: "UTF-8" },
        Body: { Text: { Data: body, Charset: "UTF-8" } },
      },
    });
    const response = await getSesClient(sesConfig).send(command);
    if (response.$metadata.httpStatusCode !== 200) {
      throw new Error(`SES send failed: HTTP ${response.$metadata.httpStatusCode}`);
    }
    return;
  }

  if (process.env.NODE_ENV === "development") {
    console.log(`[sendEmail dev] ${email} -> code: ${code}`);
    return;
  }
  throw new Error(
    "Set RESEND_API_KEY (and optionally RESEND_FROM_EMAIL) or AWS SES env vars for email"
  );
}
