import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2, BookOpen, CheckCircle, Clock } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useContentProtection } from "@/hooks/useContentProtection";
import { useLocation } from "wouter";

export default function StudentDashboard() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  // Protect content
  useContentProtection();

  // Fetch student courses
  const { data: enrollments, isLoading: enrollmentsLoading } = trpc.courses.getStudentCourses.useQuery(
    undefined,
    { enabled: !!user }
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">Você precisa estar logado para acessar esta página.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-2">Meus Cursos</h1>
          <p className="text-slate-400">Acompanhe seu progresso e continue aprendendo</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        {enrollmentsLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
          </div>
        ) : enrollments && enrollments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map((enrollment) => (
              <Card
                key={enrollment.id}
                className="bg-slate-800 border-slate-700 hover:border-cyan-500 transition-colors"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-white">Curso {enrollment.courseId}</CardTitle>
                      <CardDescription className="text-slate-400">
                        {enrollment.status === "completed" ? "Concluído" : "Em andamento"}
                      </CardDescription>
                    </div>
                    {enrollment.status === "completed" ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                      <Clock className="w-6 h-6 text-cyan-500" />
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400">Progresso</span>
                      <span className="text-white font-semibold">75%</span>
                    </div>
                    <Progress value={75} className="h-2 bg-slate-700" />
                  </div>

                  <div className="text-sm text-slate-400">
                    <p>Aulas concluídas: 3 de 4</p>
                    <p>Avaliações: 2 de 2</p>
                  </div>

                  <Button
                    onClick={() => setLocation(`/course/${enrollment.courseId}`)}
                    className="w-full bg-cyan-600 hover:bg-cyan-700"
                  >
                    Continuar Aprendendo
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 mb-4">Você ainda não está inscrito em nenhum curso.</p>
            <Button
              onClick={() => setLocation("/")}
              className="bg-cyan-600 hover:bg-cyan-700"
            >
              Explorar Cursos
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
