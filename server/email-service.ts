import nodemailer from 'nodemailer';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private isConfigured = false;

  constructor() {
    this.setupTransporter();
  }

  private setupTransporter() {
    // Check if email configuration is available
    const emailHost = process.env.EMAIL_HOST;
    const emailPort = process.env.EMAIL_PORT;
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    if (emailHost && emailPort && emailUser && emailPass) {
      const config: EmailConfig = {
        host: emailHost,
        port: parseInt(emailPort),
        secure: parseInt(emailPort) === 465, // true for 465, false for other ports
        auth: {
          user: emailUser,
          pass: emailPass,
        },
      };

      this.transporter = nodemailer.createTransport(config);
      this.isConfigured = true;
      console.log('✅ Email service configured successfully');
    } else {
      console.log('⚠️ Email service not configured - missing environment variables');
      console.log('Required: EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS');
    }
  }

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean> {
    if (!this.isConfigured || !this.transporter) {
      console.log(`📧 Email not sent (service not configured) - Reset token for ${email}: ${resetToken}`);
      console.log(`🔗 Reset link: https://mystartup.ai/app?reset=${resetToken}`);
      return false;
    }

    try {
      const resetUrl = `https://mystartup.ai/app?reset=${resetToken}`;
      
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Reset Your MyStartup.ai Password',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
              .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .footer { text-align: center; color: #666; font-size: 14px; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🚀 MyStartup.ai</h1>
                <p>Password Reset Request</p>
              </div>
              <div class="content">
                <h2>Reset Your Password</h2>
                <p>We received a request to reset your password for your MyStartup.ai account.</p>
                <p>Click the button below to create a new password:</p>
                <a href="${resetUrl}" class="button">Reset Password</a>
                <p>Or copy and paste this link into your browser:</p>
                <p style="word-break: break-all; background: #eee; padding: 10px; border-radius: 4px;">${resetUrl}</p>
                <p><strong>This link will expire in 1 hour.</strong></p>
                <p>If you didn't request this password reset, you can safely ignore this email.</p>
              </div>
              <div class="footer">
                <p>© 2025 MyStartup.ai - AI-Powered Startup Accelerator</p>
                <p>This email was sent to ${email}</p>
              </div>
            </div>
          </body>
          </html>
        `,
        text: `
Reset Your MyStartup.ai Password

We received a request to reset your password for your MyStartup.ai account.

Click this link to create a new password:
${resetUrl}

This link will expire in 1 hour.

If you didn't request this password reset, you can safely ignore this email.

© 2025 MyStartup.ai - AI-Powered Startup Accelerator
        `
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Password reset email sent to ${email}`);
      return true;
    } catch (error) {
      console.error('❌ Error sending password reset email:', error);
      console.log(`📧 Fallback - Reset token for ${email}: ${resetToken}`);
      console.log(`🔗 Reset link: https://mystartup.ai/app?reset=${resetToken}`);
      return false;
    }
  }

  async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    if (!this.isConfigured || !this.transporter) {
      console.log(`📧 Welcome email not sent (service not configured) for ${email}`);
      return false;
    }

    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Welcome to MyStartup.ai! 🚀',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
              .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .footer { text-align: center; color: #666; font-size: 14px; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🚀 Welcome to MyStartup.ai!</h1>
                <p>Your AI-Powered Startup Journey Begins Now</p>
              </div>
              <div class="content">
                <h2>Hello ${name}!</h2>
                <p>Welcome to MyStartup.ai! We're excited to help you transform your startup ideas into investor-ready businesses.</p>
                <h3>What you can do with MyStartup.ai:</h3>
                <ul>
                  <li>🎯 Generate comprehensive business plans in minutes</li>
                  <li>📊 Create professional pitch decks</li>
                  <li>💰 Build detailed financial models</li>
                  <li>🤖 Access our agentic AI platform for smart guidance</li>
                  <li>🔍 Find matching investors and grants</li>
                  <li>🚀 Build and launch your MVP</li>
                </ul>
                <a href="https://mystartup.ai/app" class="button">Start Building Your Startup</a>
                <p>Ready to turn your ideas into reality? Log in and start your first project!</p>
              </div>
              <div class="footer">
                <p>© 2025 MyStartup.ai - AI-Powered Startup Accelerator</p>
                <p>Need help? Contact us at support@mystartup.ai</p>
              </div>
            </div>
          </body>
          </html>
        `,
        text: `
Welcome to MyStartup.ai! 🚀

Hello ${name}!

Welcome to MyStartup.ai! We're excited to help you transform your startup ideas into investor-ready businesses.

What you can do with MyStartup.ai:
- Generate comprehensive business plans in minutes
- Create professional pitch decks  
- Build detailed financial models
- Access our agentic AI platform for smart guidance
- Find matching investors and grants
- Build and launch your MVP

Ready to turn your ideas into reality? Visit https://mystartup.ai/app to start building your startup!

© 2025 MyStartup.ai - AI-Powered Startup Accelerator
Need help? Contact us at support@mystartup.ai
        `
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Welcome email sent to ${email}`);
      return true;
    } catch (error) {
      console.error('❌ Error sending welcome email:', error);
      return false;
    }
  }

  isReady(): boolean {
    return this.isConfigured;
  }
}

export const emailService = new EmailService();