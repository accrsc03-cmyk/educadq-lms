import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Users, TrendingUp, BookOpen, Award } from "lucide-react";

export default function EducationalAnalytics() {
  // Dados simulados de analytics
  const enrollmentTrend = [
    { month: "Jan", enrollments: 45, completed: 12 },
    { month: "Fev", enrollments: 62, completed: 18 },
    { month: "Mar", enrollments: 78, completed: 25 },
    { month: "Abr", enrollments: 95, completed: 35 },
    { month: "Mai", enrollments: 112, completed: 48 },
    { month: "Jun", enrollments: 138, completed: 62 },
  ];

  const coursePerformance = [
    { name: "React Avançado", students: 45, avgGrade: 8.2 },
    { name: "Node.js Completo", students: 38, avgGrade: 7.9 },
    { name: "Python para IA", students: 52, avgGrade: 8.5 },
    { name: "Web Design", students: 31, avgGrade: 7.6 },
  ];

  const completionRates = [
    { name: "Completado", value: 62, color: "#10b981" },
    { name: "Em Progresso", value: 28, color: "#3b82f6" },
    { name: "Não Iniciado", value: 10, color: "#ef4444" },
  ];

  const stats = [
    {
      title: "Total de Alunos",
      value: "1,248",
      change: "+12% este mês",
      icon: Users,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Cursos Ativos",
      value: "24",
      change: "+3 novos cursos",
      icon: BookOpen,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Taxa de Conclusão",
      value: "62%",
      change: "+5% em relação ao mês anterior",
      icon: Award,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Engajamento Médio",
      value: "8.1/10",
      change: "Excelente desempenho",
      icon: TrendingUp,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Analytics Educacional</h1>
          <p className="text-slate-600">Visualize métricas e desempenho da plataforma</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-slate-600">
                      {stat.title}
                    </CardTitle>
                    <div className={`p-2 rounded-lg ${stat.color}`}>
                      <Icon size={20} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</div>
                  <p className="text-xs text-slate-500">{stat.change}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Enrollment Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Tendência de Matrículas</CardTitle>
              <CardDescription>Matrículas e conclusões nos últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={enrollmentTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="enrollments" stroke="#3b82f6" name="Matrículas" />
                  <Line type="monotone" dataKey="completed" stroke="#10b981" name="Concluídos" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Completion Rates */}
          <Card>
            <CardHeader>
              <CardTitle>Taxa de Conclusão</CardTitle>
              <CardDescription>Status dos alunos na plataforma</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={completionRates}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {completionRates.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Course Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Desempenho dos Cursos</CardTitle>
            <CardDescription>Número de alunos e nota média por curso</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={coursePerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="students" fill="#3b82f6" name="Alunos" />
                <Bar yAxisId="right" dataKey="avgGrade" fill="#10b981" name="Nota Média" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
