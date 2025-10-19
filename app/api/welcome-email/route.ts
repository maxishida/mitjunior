import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface WelcomeEmailRequest {
  email: string;
  name: string;
  userId?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: WelcomeEmailRequest = await request.json();
    const { email, name, userId } = body;

    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email e nome são obrigatórios' },
        { status: 400 }
      );
    }

    // In a real implementation, you would use an email service like:
    // - SendGrid
    // - Amazon SES
    // - Mailgun
    // - Resend
    // - Brevo

    // For this example, I'll simulate the email sending
    console.log('Sending welcome email:', { email, name, userId });

    // Here you would integrate with your email service
    // Example with Resend (uncomment and configure):
    /*
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { data, error } = await resend.emails.send({
      from: 'Comunidade Flix <noreply@comunidadeflix.com>',
      to: [email],
      subject: 'Bem-vindo à Comunidade Flix! 🎉',
      html: generateWelcomeEmailTemplate(name),
    });

    if (error) {
      console.error('Email send error:', error);
      return NextResponse.json(
        { error: 'Failed to send welcome email' },
        { status: 500 }
      );
    }
    */

    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Log the email sent for analytics
    if (typeof process.env.NEXT_PUBLIC_ANALYTICS_ID !== 'undefined') {
      console.log('Welcome email sent tracked', { email, userId });
    }

    return NextResponse.json({
      success: true,
      message: 'Welcome email sent successfully'
    });

  } catch (error: any) {
    console.error('Welcome email error:', error);

    return NextResponse.json(
      { error: 'Failed to send welcome email', details: error.message },
      { status: 500 }
    );
  }
}

function generateWelcomeEmailTemplate(name: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Bem-vindo à Comunidade Flix</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          background: white;
          padding: 40px 30px;
          border: 1px solid #e5e5e5;
          border-top: none;
        }
        .footer {
          background: #f8f9fa;
          padding: 30px;
          text-align: center;
          border-radius: 0 0 10px 10px;
          border: 1px solid #e5e5e5;
          border-top: none;
        }
        .button {
          display: inline-block;
          padding: 12px 24px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
          margin: 20px 0;
        }
        .gift-box {
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 5px;
          padding: 20px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🎉 Bem-vindo à Comunidade Flix!</h1>
        <p>Sua jornada para liberdade financeira começa agora</p>
      </div>

      <div class="content">
        <p>Olá <strong>${name}</strong>,</p>

        <p>Estamos muito felizes em ter você como parte da nossa comunidade! Seu cadastro foi realizado com sucesso e você já tem acesso a todo o conteúdo exclusivo da plataforma.</p>

        <div class="gift-box">
          <h3>🎁 Seu Presente de Boas-Vindas</h3>
          <p>Ganhou acesso gratuito ao módulo <strong>"Primeiros Passos em Investimentos"</strong> (normalmente R$197)!</p>
        </div>

        <h3>Próximos Passos:</h3>
        <ol>
          <li>Complete seu perfil e personalização</li>
          <li>Defina seus objetivos financeiros</li>
          <li>Assista ao módulo de introdução</li>
          <li>Participe da nossa comunidade</li>
        </ol>

        <div style="text-align: center;">
          <a href="https://comunidadeflix.com/onboarding" class="button">
            Começar Agora
          </a>
        </div>

        <h3>O que você encontrará na plataforma:</h3>
        <ul>
          <li>✅ +50 aulas práticas de educação financeira</li>
          <li>✅ Comunidade exclusiva com mais de 10.000 alunos</li>
          <li>✅ Ferramentas e calculadoras financeiras</li>
          <li>✅ Suporte direto com especialistas</li>
          <li>✅ Conteúdo atualizado mensalmente</li>
        </ul>
      </div>

      <div class="footer">
        <p>Precisa de ajuda? Responda a este email ou entre em contato:</p>
        <p>📧 suporte@comunidadeflix.com | 💬 WhatsApp: (11) 99999-9999</p>

        <p style="margin-top: 20px; font-size: 12px; color: #666;">
          Este email foi enviado para ${email}. Se você não se cadastrou na Comunidade Flix,
          por favor ignore este email ou nos contate.
        </p>
      </div>
    </body>
    </html>
  `;
}