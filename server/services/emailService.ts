/**
 * Email Service for EducaDQ
 * Handles sending emails for notifications, alerts, and reminders
 */

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send email notification
 * In production, integrate with SendGrid, AWS SES, or similar service
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    // TODO: Integrate with email service provider
    // For now, log to console
    console.log("[Email Service] Sending email to:", options.to);
    console.log("[Email Service] Subject:", options.subject);
    console.log("[Email Service] HTML:", options.html);
    return true;
  } catch (error) {
    console.error("[Email Service] Error sending email:", error);
    return false;
  }
}

/**
 * Send payment reminder email
 */
export async function sendPaymentReminderEmail(
  studentEmail: string,
  studentName: string,
  installmentNumber: number,
  dueDate: Date,
  amount: number,
  pixKey: string
): Promise<boolean> {
  const html = `
    <h2>Aviso de Vencimento de Parcela</h2>
    <p>Olá ${studentName},</p>
    <p>Você tem uma parcela vencendo em breve:</p>
    
    <div style="background: #f0f0f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p><strong>Parcela:</strong> ${installmentNumber}</p>
      <p><strong>Valor:</strong> R$ ${amount.toFixed(2)}</p>
      <p><strong>Data de Vencimento:</strong> ${dueDate.toLocaleDateString("pt-BR")}</p>
    </div>
    
    <h3>Como Pagar</h3>
    <p>Você pode pagar via PIX usando a chave:</p>
    <p style="font-family: monospace; background: #f0f0f0; padding: 10px; border-radius: 4px;">
      ${pixKey}
    </p>
    
    <p>Obrigado por sua confiança na EducaDQ!</p>
  `;

  return sendEmail({
    to: studentEmail,
    subject: `Aviso de Vencimento - Parcela ${installmentNumber}`,
    html,
    text: `Você tem uma parcela vencendo em ${dueDate.toLocaleDateString("pt-BR")} no valor de R$ ${amount.toFixed(2)}. PIX: ${pixKey}`,
  });
}

/**
 * Send course completion notification
 */
export async function sendCourseCompletionEmail(
  studentEmail: string,
  studentName: string,
  courseName: string,
  certificateUrl?: string
): Promise<boolean> {
  const html = `
    <h2>Parabéns! Você Concluiu um Curso!</h2>
    <p>Olá ${studentName},</p>
    <p>Você concluiu com sucesso o curso:</p>
    
    <div style="background: #f0f0f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3>${courseName}</h3>
    </div>
    
    <p>Seu certificado está sendo preparado e será enviado em breve.</p>
    <p>Você pode acessar seus cursos em: <a href="https://educadq.com">educadq.com</a></p>
    
    <p>Parabéns novamente!</p>
  `;

  return sendEmail({
    to: studentEmail,
    subject: `Parabéns! Você concluiu ${courseName}`,
    html,
  });
}

/**
 * Send approval notification
 */
export async function sendApprovalEmail(
  studentEmail: string,
  studentName: string,
  courseName: string,
  score: number
): Promise<boolean> {
  const html = `
    <h2>Você Foi Aprovado!</h2>
    <p>Olá ${studentName},</p>
    <p>Parabéns! Você foi aprovado no curso:</p>
    
    <div style="background: #f0f0f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3>${courseName}</h3>
      <p><strong>Sua Pontuação:</strong> ${score}%</p>
    </div>
    
    <p>Seu certificado será emitido em breve.</p>
    <p>Obrigado por estudar com a EducaDQ!</p>
  `;

  return sendEmail({
    to: studentEmail,
    subject: `Aprovado em ${courseName}`,
    html,
  });
}

/**
 * Send overdue payment alert
 */
export async function sendOverduePaymentEmail(
  studentEmail: string,
  studentName: string,
  installmentNumber: number,
  daysOverdue: number,
  amount: number,
  pixKey: string
): Promise<boolean> {
  const html = `
    <h2>Atenção: Parcela em Atraso</h2>
    <p>Olá ${studentName},</p>
    <p>Sua parcela está em atraso há ${daysOverdue} dias:</p>
    
    <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
      <p><strong>Parcela:</strong> ${installmentNumber}</p>
      <p><strong>Valor:</strong> R$ ${amount.toFixed(2)}</p>
      <p><strong>Dias em Atraso:</strong> ${daysOverdue}</p>
    </div>
    
    <h3>Regularize Sua Situação</h3>
    <p>Por favor, realize o pagamento o quanto antes usando a chave PIX:</p>
    <p style="font-family: monospace; background: #f0f0f0; padding: 10px; border-radius: 4px;">
      ${pixKey}
    </p>
    
    <p>Se tiver dúvidas, entre em contato conosco pelo WhatsApp: 41 98891-3431</p>
  `;

  return sendEmail({
    to: studentEmail,
    subject: `Urgente: Parcela em Atraso - ${installmentNumber}`,
    html,
  });
}

/**
 * Send new enrollment notification to teacher
 */
export async function sendNewEnrollmentEmail(
  teacherEmail: string,
  teacherName: string,
  studentName: string,
  courseName: string
): Promise<boolean> {
  const html = `
    <h2>Novo Aluno Inscrito</h2>
    <p>Olá ${teacherName},</p>
    <p>Um novo aluno se inscreveu em seu curso:</p>
    
    <div style="background: #f0f0f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p><strong>Aluno:</strong> ${studentName}</p>
      <p><strong>Curso:</strong> ${courseName}</p>
    </div>
    
    <p>Você pode acompanhar o progresso do aluno em seu painel.</p>
  `;

  return sendEmail({
    to: teacherEmail,
    subject: `Novo Aluno: ${studentName} em ${courseName}`,
    html,
  });
}

/**
 * Send student approval notification to teacher
 */
export async function sendStudentApprovalEmail(
  teacherEmail: string,
  teacherName: string,
  studentName: string,
  courseName: string,
  score: number
): Promise<boolean> {
  const html = `
    <h2>Aluno Aprovado</h2>
    <p>Olá ${teacherName},</p>
    <p>Um de seus alunos foi aprovado:</p>
    
    <div style="background: #f0f0f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p><strong>Aluno:</strong> ${studentName}</p>
      <p><strong>Curso:</strong> ${courseName}</p>
      <p><strong>Pontuação:</strong> ${score}%</p>
    </div>
    
    <p>Você pode emitir o certificado no painel administrativo.</p>
  `;

  return sendEmail({
    to: teacherEmail,
    subject: `Aluno Aprovado: ${studentName}`,
    html,
  });
}
