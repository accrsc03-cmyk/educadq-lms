import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Download, FileText } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { useState } from "react";

interface ReportsPageProps {
  params: { reportType: "courses" | "students" | "payments" | "installments" };
}

export default function ReportsPage({ params }: ReportsPageProps) {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [isGenerating, setIsGenerating] = useState(false);

  const reportType = params.reportType;

  const generateMutation = trpc.admin.generateExcelReport.useMutation();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">Acesso negado. Apenas administradores podem gerar relatórios.</p>
      </div>
    );
  }

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      const result = await generateMutation.mutateAsync({
        reportType: reportType as "courses" | "students" | "payments" | "installments",
      });

      // Download file
      const link = document.createElement("a");
      link.href = result.url;
      link.download = `relatorio-${reportType}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      alert("Erro ao gerar relatório");
    } finally {
      setIsGenerating(false);
    }
  };

  const reportConfig = {
    courses: {
      title: "Relatório de Cursos",
      description: "Taxa de conclusão, inscrições e receita por curso",
      fields: ["Curso", "Alunos Inscritos", "Alunos Concluídos", "Taxa de Conclusão", "Receita Total"],
    },
    students: {
      title: "Relatório de Alunos",
      description: "Progresso, desempenho e status de cada aluno",
      fields: ["Aluno", "Cursos Inscritos", "Cursos Concluídos", "Progresso Médio", "Última Atividade"],
    },
    payments: {
      title: "Relatório de Pagamentos",
      description: "Status de pagamentos, valores e datas",
      fields: ["Aluno", "Curso", "Valor Total", "Valor Pago", "Status", "Data"],
    },
    installments: {
      title: "Relatório de Parcelas",
      description: "Parcelas vencidas, pendentes e pagas",
      fields: ["Aluno", "Parcela", "Valor", "Data Vencimento", "Status", "Dias Atrasado"],
    },
  };

  const config = reportConfig[reportType];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 py-8">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            className="text-slate-400 hover:text-white mb-4"
            onClick={() => setLocation("/admin")}
          >
            ← Voltar
          </Button>
          <h1 className="text-3xl font-bold text-white">{config.title}</h1>
          <p className="text-slate-400 mt-2">{config.description}</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Campos Inclusos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {config.fields.map((field) => (
                  <li key={field} className="text-slate-300 flex items-center gap-2">
                    <span className="w-2 h-2 bg-cyan-500 rounded-full" />
                    {field}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Informações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-slate-400 text-sm">Formato</p>
                <p className="text-white font-semibold">Excel (.xlsx)</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Atualização</p>
                <p className="text-white font-semibold">Em Tempo Real</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Período</p>
                <p className="text-white font-semibold">Todos os Dados</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <Card className="bg-slate-800 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Prévia dos Dados</CardTitle>
            <CardDescription className="text-slate-400">
              Os dados abaixo são uma amostra do que será incluído no relatório
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-slate-300">
                <thead>
                  <tr className="border-b border-slate-700">
                    {config.fields.map((field) => (
                      <th key={field} className="text-left py-2 px-4 text-white font-semibold">
                        {field}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-700">
                    {config.fields.map((_, i) => (
                      <td key={i} className="py-2 px-4">
                        <span className="bg-slate-700 text-slate-400 px-2 py-1 rounded text-xs">
                          Dados...
                        </span>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Action */}
        <div className="flex gap-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setLocation("/admin")}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="flex-1 bg-cyan-600 hover:bg-cyan-700"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Gerar e Baixar Relatório
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
