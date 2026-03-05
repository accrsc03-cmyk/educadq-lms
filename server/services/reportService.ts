import { Workbook } from "exceljs";
import { getCourses, getCourseEnrollments, getPaymentsByStudent, getOverdueInstallments } from "../db";

/**
 * Generate Excel report for courses
 */
export async function generateCoursesReport(): Promise<any> {
  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet("Cursos");

  // Headers
  worksheet.columns = [
    { header: "ID", key: "id", width: 10 },
    { header: "Título", key: "title", width: 30 },
    { header: "Professor", key: "professor", width: 20 },
    { header: "Carga Horária", key: "loadHours", width: 15 },
    { header: "Valor", key: "price", width: 15 },
    { header: "Alunos Inscritos", key: "enrollments", width: 18 },
    { header: "Alunos Concluídos", key: "completed", width: 18 },
    { header: "Taxa de Conclusão", key: "completionRate", width: 18 },
    { header: "Receita Total", key: "revenue", width: 15 },
  ];

  // Fetch data
  const courses = await getCourses(1000, 0);

  for (const course of courses) {
    const enrollments = await getCourseEnrollments(course.id);
    let revenue = 0;

    for (const enrollment of enrollments) {
      const payments = await getPaymentsByStudent(enrollment.studentId);
      revenue += payments.reduce((sum, p) => sum + parseFloat(p.totalValue.toString()), 0);
    }

    const completionRate = enrollments.length > 0 ? "0%" : "0%"; // TODO: Calculate actual rate

    worksheet.addRow({
      id: course.id,
      title: course.title,
      professor: "N/A", // TODO: Get professor name
      loadHours: course.loadHours,
      price: parseFloat(course.price.toString()).toFixed(2),
      enrollments: enrollments.length,
      completed: 0, // TODO: Count completed
      completionRate,
      revenue: revenue.toFixed(2),
    });
  }

  // Style headers
  worksheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
  worksheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF0D2333" },
  };

  return await workbook.xlsx.writeBuffer();
}

/**
 * Generate Excel report for students
 */
export async function generateStudentsReport(): Promise<any> {
  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet("Alunos");

  // Headers
  worksheet.columns = [
    { header: "ID", key: "id", width: 10 },
    { header: "Nome", key: "name", width: 25 },
    { header: "Email", key: "email", width: 30 },
    { header: "Cursos Inscritos", key: "enrollments", width: 18 },
    { header: "Cursos Concluídos", key: "completed", width: 18 },
    { header: "Progresso Médio", key: "averageProgress", width: 18 },
    { header: "Última Atividade", key: "lastActivity", width: 20 },
  ];

  // TODO: Fetch and populate student data

  // Style headers
  worksheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
  worksheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF0D2333" },
  };

  return await workbook.xlsx.writeBuffer();
}

/**
 * Generate Excel report for payments
 */
export async function generatePaymentsReport(): Promise<any> {
  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet("Pagamentos");

  // Headers
  worksheet.columns = [
    { header: "ID", key: "id", width: 10 },
    { header: "Aluno", key: "student", width: 25 },
    { header: "Curso", key: "course", width: 25 },
    { header: "Valor Total", key: "totalValue", width: 15 },
    { header: "Valor Pago", key: "paidValue", width: 15 },
    { header: "Status", key: "status", width: 15 },
    { header: "Data", key: "date", width: 15 },
  ];

  // TODO: Fetch and populate payment data

  // Style headers
  worksheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
  worksheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF0D2333" },
  };

  return await workbook.xlsx.writeBuffer();
}

/**
 * Generate Excel report for installments
 */
export async function generateInstallmentsReport(): Promise<any> {
  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet("Parcelas");

  // Headers
  worksheet.columns = [
    { header: "ID", key: "id", width: 10 },
    { header: "Aluno", key: "student", width: 25 },
    { header: "Parcela", key: "installmentNumber", width: 12 },
    { header: "Valor", key: "amount", width: 15 },
    { header: "Data Vencimento", key: "dueDate", width: 18 },
    { header: "Status", key: "status", width: 15 },
    { header: "Dias Atrasado", key: "daysOverdue", width: 15 },
  ];

  // Fetch overdue installments
  const overdueInstallments = await getOverdueInstallments();

  for (const installment of overdueInstallments) {
    const daysOverdue = Math.floor(
      (Date.now() - new Date(installment.dueDate).getTime()) / (1000 * 60 * 60 * 24)
    );

    worksheet.addRow({
      id: installment.id,
      student: "N/A", // TODO: Get student name
      installmentNumber: installment.installmentNumber,
      amount: parseFloat(installment.value.toString()).toFixed(2),
      dueDate: new Date(installment.dueDate).toLocaleDateString("pt-BR"),
      status: installment.status,
      daysOverdue,
    });
  }

  // Style headers
  worksheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
  worksheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF0D2333" },
  };

  return await workbook.xlsx.writeBuffer();
}

/**
 * Generate report based on type
 */
export async function generateReport(
  reportType: "courses" | "students" | "payments" | "installments"
): Promise<any> {
  switch (reportType) {
    case "courses":
      return generateCoursesReport();
    case "students":
      return generateStudentsReport();
    case "payments":
      return generatePaymentsReport();
    case "installments":
      return generateInstallmentsReport();
    default:
      throw new Error("Invalid report type");
  }
}
