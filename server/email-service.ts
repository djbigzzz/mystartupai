import { Resend } from 'resend';

class EmailService {
  private resend: Resend | null = null;
  private isConfigured = false;
  private fromEmail = 'MyStartup.ai <onboarding@resend.dev>'; // Default Resend test email

  constructor() {
    this.setupResend();
  }

  private setupResend() {
    const apiKey = process.env.RESEND_API_KEY;

    if (apiKey) {
      this.resend = new Resend(apiKey);
      this.isConfigured = true;
      console.log('✅ Resend email service configured successfully');
    } else {
      console.log('⚠️ Email service not configured - missing RESEND_API_KEY');
    }
  }

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean> {
    if (!this.isConfigured || !this.resend) {
      console.log(`📧 Email not sent (service not configured)`);
      // SECURITY: Never log the actual token in production
      console.log(`⚠️ Password reset requested for ${email} but email service is not configured`);
      return false;
    }

    try {
      const resetUrl = `https://mystartup.ai/app?reset=${resetToken}`;
      
      const { data, error } = await this.resend.emails.send({
        from: this.fromEmail,
        to: email,
        subject: 'Reset Your MyStartup.ai Password',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6; 
                color: #333;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
              }
              .container { 
                max-width: 600px; 
                margin: 40px auto; 
                background: white;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              }
              .header { 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                color: white; 
                padding: 40px 30px; 
                text-align: center;
              }
              .header h1 {
                margin: 0;
                font-size: 28px;
                font-weight: 600;
              }
              .header p {
                margin: 10px 0 0;
                opacity: 0.9;
              }
              .content { 
                padding: 40px 30px;
              }
              .content h2 {
                margin-top: 0;
                color: #333;
                font-size: 24px;
              }
              .button { 
                display: inline-block; 
                background: #667eea; 
                color: white !important; 
                padding: 14px 32px; 
                text-decoration: none; 
                border-radius: 6px; 
                margin: 20px 0;
                font-weight: 500;
              }
              .button:hover {
                background: #5568d3;
              }
              .link-box {
                word-break: break-all; 
                background: #f8f9fa; 
                padding: 12px; 
                border-radius: 4px;
                border: 1px solid #e9ecef;
                font-size: 14px;
                color: #495057;
              }
              .footer { 
                text-align: center; 
                color: #6c757d; 
                font-size: 13px; 
                padding: 30px;
                background: #f8f9fa;
              }
              .warning {
                background: #fff3cd;
                border-left: 4px solid #ffc107;
                padding: 12px;
                margin: 20px 0;
                border-radius: 4px;
              }
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
                <div style="text-align: center;">
                  <a href="${resetUrl}" class="button">Reset Password</a>
                </div>
                <p>Or copy and paste this link into your browser:</p>
                <div class="link-box">${resetUrl}</div>
                <div class="warning">
                  <strong>⏰ This link will expire in 1 hour.</strong>
                </div>
                <p>If you didn't request this password reset, you can safely ignore this email. Your password will remain unchanged.</p>
              </div>
              <div class="footer">
                <p><strong>© 2025 MyStartup.ai</strong> - AI-Powered Startup Accelerator</p>
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
      });

      if (error) {
        console.error('❌ Resend API error:', error);
        return false;
      }

      console.log(`✅ Password reset email sent to ${email} (ID: ${data?.id})`);
      return true;
    } catch (error) {
      console.error('❌ Error sending password reset email:', error);
      return false;
    }
  }

  async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    if (!this.isConfigured || !this.resend) {
      console.log(`📧 Welcome email not sent (service not configured) for ${email}`);
      return false;
    }

    try {
      const { data, error } = await this.resend.emails.send({
        from: this.fromEmail,
        to: email,
        subject: 'Welcome to MyStartup.ai! 🚀',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6; 
                color: #333;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
              }
              .container { 
                max-width: 600px; 
                margin: 40px auto; 
                background: white;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              }
              .header { 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                color: white; 
                padding: 50px 30px; 
                text-align: center;
              }
              .header h1 {
                margin: 0;
                font-size: 32px;
                font-weight: 600;
              }
              .header p {
                margin: 10px 0 0;
                opacity: 0.9;
                font-size: 16px;
              }
              .content { 
                padding: 40px 30px;
              }
              .content h2 {
                margin-top: 0;
                color: #333;
                font-size: 24px;
              }
              .feature-list {
                list-style: none;
                padding: 0;
                margin: 20px 0;
              }
              .feature-list li {
                padding: 10px 0;
                border-bottom: 1px solid #f0f0f0;
              }
              .feature-list li:last-child {
                border-bottom: none;
              }
              .button { 
                display: inline-block; 
                background: #667eea; 
                color: white !important; 
                padding: 16px 36px; 
                text-decoration: none; 
                border-radius: 6px; 
                margin: 20px 0;
                font-weight: 600;
                font-size: 16px;
              }
              .button:hover {
                background: #5568d3;
              }
              .footer { 
                text-align: center; 
                color: #6c757d; 
                font-size: 13px; 
                padding: 30px;
                background: #f8f9fa;
              }
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
                <ul class="feature-list">
                  <li>🎯 <strong>Generate comprehensive business plans</strong> in minutes</li>
                  <li>📊 <strong>Create professional pitch decks</strong></li>
                  <li>💰 <strong>Build detailed financial models</strong></li>
                  <li>🤖 <strong>Access our agentic AI platform</strong> for smart guidance</li>
                  <li>🔍 <strong>Find matching investors and grants</strong></li>
                  <li>🚀 <strong>Build and launch your MVP</strong></li>
                </ul>
                <div style="text-align: center;">
                  <a href="https://mystartup.ai/dashboard" class="button">Start Building Your Startup</a>
                </div>
                <p>Ready to turn your ideas into reality? Log in and start your first project!</p>
              </div>
              <div class="footer">
                <p><strong>© 2025 MyStartup.ai</strong> - AI-Powered Startup Accelerator</p>
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
- 🎯 Generate comprehensive business plans in minutes
- 📊 Create professional pitch decks  
- 💰 Build detailed financial models
- 🤖 Access our agentic AI platform for smart guidance
- 🔍 Find matching investors and grants
- 🚀 Build and launch your MVP

Ready to turn your ideas into reality? Visit https://mystartup.ai/dashboard to start building your startup!

© 2025 MyStartup.ai - AI-Powered Startup Accelerator
Need help? Contact us at support@mystartup.ai
        `
      });

      if (error) {
        console.error('❌ Resend API error:', error);
        return false;
      }

      console.log(`✅ Welcome email sent to ${email} (ID: ${data?.id})`);
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
