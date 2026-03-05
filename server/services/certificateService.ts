/**
 * Certificate Service
 * Handles certificate generation and management
 */

import { getDb } from "../db";
import { eq, and } from "drizzle-orm";
import { enrollments, progress, courses, users } from "../../drizzle/schema";

interface CertificateData {
  studentName: string;
  courseName: string;
  completionDate: Date;
  courseHours: number;
  certificateCode: string;
  professorName: string;
}

/**
 * Generate a unique certificate code
 */
function generateCertificateCode(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `CERT-${timestamp}-${random}`;
}

/**
 * Check if student should receive certificate
 */
export async function shouldIssueCertificate(
  studentId: number,
  courseId: number
): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    // Get course info
    const course = await db
      .select()
      .from(courses)
      .where(eq(courses.id, courseId))
      .limit(1);

    if (!course.length) return false;

    // Check if student completed all lessons
    const lessons = await db
      .select({ id: progress.id })
      .from(progress)
      .where(eq(progress.studentId, studentId));

    if (!lessons.length) return false;

    // Check if all lessons are completed
    const completedLessons = await db
      .select({ id: progress.id })
      .from(progress)
      .where(
        and(
          eq(progress.studentId, studentId),
          eq(progress.completed, true)
        )
      );

    // If 80% of lessons are completed, issue certificate
    const completionRate = completedLessons.length / lessons.length;
    return completionRate >= 0.8;
  } catch (error) {
    console.error("[Certificate] Error checking certificate eligibility:", error);
    return false;
  }
}

/**
 * Generate certificate data
 */
export async function generateCertificateData(
  studentId: number,
  courseId: number
): Promise<CertificateData | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    // Get student info
    const student = await db
      .select()
      .from(users)
      .where(eq(users.id, studentId))
      .limit(1);

    if (!student.length) return null;

    // Get course info
    const course = await db
      .select()
      .from(courses)
      .where(eq(courses.id, courseId))
      .limit(1);

    if (!course.length) return null;

    // Get professor info
    const professor = await db
      .select()
      .from(users)
      .where(eq(users.id, course[0].professorId))
      .limit(1);

    if (!professor.length) return null;

    // Get completion date
    const completion = await db
      .select({ completedAt: progress.completedAt })
      .from(progress)
      .where(
        and(
          eq(progress.studentId, studentId),
          eq(progress.completed, true)
        )
      )
      .orderBy(progress.completedAt)
      .limit(1);

    const completionDate = completion.length ? completion[0].completedAt : new Date();

    return {
      studentName: student[0].name || "Aluno",
      courseName: course[0].title,
      completionDate: completionDate || new Date(),
      courseHours: course[0].loadHours,
      certificateCode: generateCertificateCode(),
      professorName: professor[0].name || "Professor",
    };
  } catch (error) {
    console.error("[Certificate] Error generating certificate data:", error);
    return null;
  }
}

/**
 * Generate HTML certificate
 */
export function generateCertificateHTML(data: CertificateData): string {
  const formattedDate = data.completionDate.toLocaleDateString("pt-BR");

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            margin: 0;
            padding: 20px;
            font-family: 'Georgia', serif;
            background: #f5f5f5;
          }
          .certificate {
            width: 100%;
            max-width: 900px;
            margin: 0 auto;
            background: linear-gradient(135deg, #0D2333 0%, #06B2C9 100%);
            padding: 60px;
            border-radius: 10px;
            color: white;
            text-align: center;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            page-break-after: always;
          }
          .header {
            margin-bottom: 40px;
          }
          .logo {
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .title {
            font-size: 48px;
            font-weight: bold;
            margin: 30px 0;
            text-transform: uppercase;
            letter-spacing: 2px;
          }
          .content {
            margin: 40px 0;
            font-size: 18px;
            line-height: 1.8;
          }
          .student-name {
            font-size: 28px;
            font-weight: bold;
            margin: 20px 0;
            text-decoration: underline;
          }
          .course-name {
            font-size: 24px;
            margin: 20px 0;
            font-style: italic;
          }
          .details {
            margin: 30px 0;
            font-size: 16px;
          }
          .signature-section {
            margin-top: 60px;
            display: flex;
            justify-content: space-around;
            padding-top: 40px;
            border-top: 2px solid rgba(255,255,255,0.5);
          }
          .signature {
            text-align: center;
            width: 200px;
          }
          .signature-line {
            border-top: 2px solid white;
            margin: 40px 0 10px 0;
          }
          .code {
            margin-top: 30px;
            font-size: 12px;
            opacity: 0.8;
          }
          @media print {
            body {
              background: white;
              padding: 0;
            }
            .certificate {
              box-shadow: none;
              border-radius: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="header">
            <div class="logo">EducaDQ</div>
            <p>Centro de Formação e Estudos sobre Álcool e outras Drogas</p>
          </div>

          <div class="title">Certificado de Conclusão</div>

          <div class="content">
            <p>Certificamos que</p>
            <div class="student-name">${data.studentName}</div>
            <p>completou com êxito o curso</p>
            <div class="course-name">${data.courseName}</div>
            <div class="details">
              <p><strong>Carga Horária:</strong> ${data.courseHours} horas</p>
              <p><strong>Data de Conclusão:</strong> ${formattedDate}</p>
            </div>
          </div>

          <div class="signature-section">
            <div class="signature">
              <div class="signature-line"></div>
              <p>${data.professorName}</p>
              <p>Professor</p>
            </div>
            <div class="signature">
              <div class="signature-line"></div>
              <p>EducaDQ</p>
              <p>Administração</p>
            </div>
          </div>

          <div class="code">
            <p>Código do Certificado: ${data.certificateCode}</p>
            <p>Este certificado é válido como comprovante de conclusão do curso.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Generate PDF certificate (requires external service in production)
 */
export async function generateCertificatePDF(
  data: CertificateData
): Promise<Buffer | null> {
  try {
    // In production, use a service like:
    // - Puppeteer (headless Chrome)
    // - wkhtmltopdf
    // - Manus PDF generation API

    // For now, return the HTML that can be converted to PDF
    const html = generateCertificateHTML(data);

    // This would be implemented with an actual PDF library
    console.log("[Certificate] PDF generation requires external service");
    return null;
  } catch (error) {
    console.error("[Certificate] Error generating PDF:", error);
    return null;
  }
}

/**
 * Store certificate in database
 */
export async function storeCertificate(
  studentId: number,
  courseId: number,
  certificateCode: string,
  certificateUrl: string
): Promise<boolean> {
  try {
    // This would store the certificate in a certificates table
    // For now, we'll just log it
    console.log(
      `[Certificate] Stored certificate ${certificateCode} for student ${studentId} in course ${courseId}`
    );
    return true;
  } catch (error) {
    console.error("[Certificate] Error storing certificate:", error);
    return false;
  }
}

/**
 * Verify certificate authenticity
 */
export async function verifyCertificate(
  certificateCode: string
): Promise<CertificateData | null> {
  try {
    // This would query the certificates table
    // For now, return null
    console.log(`[Certificate] Verifying certificate ${certificateCode}`);
    return null;
  } catch (error) {
    console.error("[Certificate] Error verifying certificate:", error);
    return null;
  }
}
