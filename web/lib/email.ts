export const sendEmail = async (to: string, subject: string, html: string) => {
    console.log(`[EMAIL_MOCK] Sending to ${to} | Subject: ${subject}`);

    // In production, this would use Resend or SendGrid
    // await resend.emails.send({ from: 'onboarding@resend.dev', to, subject, html });

    return { success: true, id: "mock_email_" + Date.now() };
};
