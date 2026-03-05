import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Users, BookOpen, DollarSign, AlertCircle, Plus } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { useState } from "react";

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");

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
        <p className="text-slate-400">Acesso negado. Apenas administradores podem acessar esta página.</p>
      </div>
    );
  }

  // Fetch statistics
  const { data: stats, isLoading: statsLoading } = trpc.admin.getStatistics.useQuery(
    undefined,
    { enabled: !!user }
  );

  const { data: courses, isLoading: coursesLoading } = trpc.courses.list.useQuery({
    limit: 50,
    offset: 0,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Painel Administrativo</h1>
              <p className="text-slate-400">Gerenciamento completo da plataforma</p>
            </div>
            <Button className="bg-cyan-600 hover:bg-cyan-700" onClick={() => setLocation("/admin/courses/new")}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Curso
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800 border border-slate-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-cyan-600">Visão Geral</TabsTrigger>
            <TabsTrigger value="courses" className="data-[state=active]:bg-cyan-600">Cursos</TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-cyan-600">Usuários</TabsTrigger>
            <TabsTrigger value="payments" className="data-[state=active]:bg-cyan-600">Pagamentos</TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-cyan-600">Relatórios</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            {statsLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-sm font-medium">Total de Cursos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-3xl font-bold text-white">{stats?.totalCourses || 0}</p>
                        <p className="text-xs text-slate-400 mt-1">Cursos cadastrados</p>
                      </div>
                      <BookOpen className="w-12 h-12 text-cyan-500 opacity-20" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-sm font-medium">Total de Alunos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-3xl font-bold text-white">{stats?.totalStudents || 0}</p>
                        <p className="text-xs text-slate-400 mt-1">Alunos inscritos</p>
                      </div>
                      <Users className="w-12 h-12 text-cyan-500 opacity-20" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-sm font-medium">Receita Total</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-3xl font-bold text-white">R$ {(stats?.totalRevenue || 0).toFixed(2)}</p>
                        <p className="text-xs text-slate-400 mt-1">Pagamentos realizados</p>
                      </div>
                      <DollarSign className="w-12 h-12 text-green-500 opacity-20" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-sm font-medium">Parcelas Atrasadas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-3xl font-bold text-red-500">{stats?.overdueInstallments || 0}</p>
                        <p className="text-xs text-slate-400 mt-1">Atenção necessária</p>
                      </div>
                      <AlertCircle className="w-12 h-12 text-red-500 opacity-20" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Recent Activity */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Atividade Recente</CardTitle>
                <CardDescription className="text-slate-400">Últimas ações no sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                    <div>
                      <p className="text-white font-medium">Novo aluno inscrito</p>
                      <p className="text-xs text-slate-400">Há 2 horas</p>
                    </div>
                    <span className="text-cyan-500">+1</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                    <div>
                      <p className="text-white font-medium">Curso concluído</p>
                      <p className="text-xs text-slate-400">Há 4 horas</p>
                    </div>
                    <span className="text-green-500">✓</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                    <div>
                      <p className="text-white font-medium">Parcela vencida</p>
                      <p className="text-xs text-slate-400">Há 1 dia</p>
                    </div>
                    <span className="text-red-500">!</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-6 mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Gerenciamento de Cursos</h3>
              <Button className="bg-cyan-600 hover:bg-cyan-700" onClick={() => setLocation("/admin/courses/new")}>
                <Plus className="w-4 h-4 mr-2" />
                Novo Curso
              </Button>
            </div>

            {coursesLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
              </div>
            ) : courses && courses.length > 0 ? (
              <div className="space-y-3">
                {courses.map((course) => (
                  <Card key={course.id} className="bg-slate-800 border-slate-700 hover:border-cyan-500 transition-colors">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="text-white font-semibold">{course.title}</h4>
                          <p className="text-sm text-slate-400 mt-1">{course.description?.substring(0, 100)}...</p>
                          <div className="flex gap-4 mt-2 text-sm">
                            <span className="text-slate-400">Carga: {course.loadHours}h</span>
                            <span className="text-cyan-500">R$ {parseFloat(course.price.toString()).toFixed(2)}</span>
                            <span className="text-slate-400">Nota Mín: {course.minGrade}%</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setLocation(`/admin/courses/${course.id}/edit`)}
                          >
                            Editar
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-500">
                            Deletar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-400">Nenhum curso cadastrado.</p>
              </div>
            )}
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6 mt-6">
            <h3 className="text-xl font-bold text-white">Gerenciamento de Usuários</h3>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="pt-6">
                <p className="text-slate-400">Interface de gerenciamento de usuários em desenvolvimento...</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6 mt-6">
            <h3 className="text-xl font-bold text-white">Gerenciamento de Pagamentos</h3>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="pt-6">
                <p className="text-slate-400">Interface de gerenciamento de pagamentos em desenvolvimento...</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6 mt-6">
            <h3 className="text-xl font-bold text-white">Relatórios</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Button
                variant="outline"
                className="h-24 border-slate-700 hover:border-cyan-500 text-white"
                onClick={() => setLocation("/admin/reports/courses")}
              >
                <div className="text-left">
                  <p className="font-semibold">Relatório de Cursos</p>
                  <p className="text-xs text-slate-400">Taxa de conclusão e inscrições</p>
                </div>
              </Button>
              <Button
                variant="outline"
                className="h-24 border-slate-700 hover:border-cyan-500 text-white"
                onClick={() => setLocation("/admin/reports/students")}
              >
                <div className="text-left">
                  <p className="font-semibold">Relatório de Alunos</p>
                  <p className="text-xs text-slate-400">Progresso e desempenho</p>
                </div>
              </Button>
              <Button
                variant="outline"
                className="h-24 border-slate-700 hover:border-cyan-500 text-white"
                onClick={() => setLocation("/admin/reports/payments")}
              >
                <div className="text-left">
                  <p className="font-semibold">Relatório de Pagamentos</p>
                  <p className="text-xs text-slate-400">Status e atrasos</p>
                </div>
              </Button>
              <Button
                variant="outline"
                className="h-24 border-slate-700 hover:border-cyan-500 text-white"
                onClick={() => setLocation("/admin/reports/installments")}
              >
                <div className="text-left">
                  <p className="font-semibold">Relatório de Parcelas</p>
                  <p className="text-xs text-slate-400">Vencidas e pendentes</p>
                </div>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
