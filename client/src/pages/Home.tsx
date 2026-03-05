import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Play, Users, Award, BookOpen } from "lucide-react";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);

  // Fetch courses
  const { data: courses, isLoading: coursesLoading } = trpc.courses.list.useQuery({
    limit: 20,
    offset: 0,
  });

  const enrollMutation = trpc.courses.enroll.useMutation();

  const handleEnroll = async (courseId: number) => {
        if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }

    try {
      await enrollMutation.mutateAsync({ courseId });
      alert("Enrolled successfully!");
    } catch (error) {
      alert("Failed to enroll");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-cyan-500" />
            <h1 className="text-2xl font-bold text-white">EducaDQ</h1>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-slate-300">{user?.name}</span>
                <Button variant="outline" size="sm">
                  Dashboard
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => (window.location.href = getLoginUrl())}
                className="bg-cyan-600 hover:bg-cyan-700"
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-4">
            Plataforma de Educação a Distância
          </h2>
          <p className="text-xl text-slate-400 mb-8">
            Aprenda com flexibilidade. Cursos de qualidade para sua formação profissional.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="bg-cyan-600 hover:bg-cyan-700">
              Explorar Cursos
            </Button>
            <Button size="lg" variant="outline" className="border-slate-600 text-white">
              Saiba Mais
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Cursos Disponíveis</p>
                  <p className="text-3xl font-bold text-white">{courses?.length || 0}</p>
                </div>
                <BookOpen className="w-12 h-12 text-cyan-500 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Alunos Ativos</p>
                  <p className="text-3xl font-bold text-white">1.2K+</p>
                </div>
                <Users className="w-12 h-12 text-cyan-500 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Taxa de Conclusão</p>
                  <p className="text-3xl font-bold text-white">87%</p>
                </div>
                <Award className="w-12 h-12 text-cyan-500 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Courses Section */}
      <section className="container mx-auto px-4 py-12">
        <h3 className="text-3xl font-bold text-white mb-8">Cursos em Destaque</h3>

        {coursesLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
          </div>
        ) : courses && courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card
                key={course.id}
                className="bg-slate-800 border-slate-700 hover:border-cyan-500 transition-colors overflow-hidden"
              >
                {course.coverUrl && (
                  <div className="relative h-40 bg-slate-700 overflow-hidden">
                    <img
                      src={course.coverUrl}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    {course.trailerUrl && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 hover:bg-black/30 transition-colors cursor-pointer">
                        <Play className="w-12 h-12 text-white" />
                      </div>
                    )}
                  </div>
                )}

                <CardHeader>
                  <CardTitle className="text-white">{course.title}</CardTitle>
                  <CardDescription className="text-slate-400">
                    {course.description?.substring(0, 100)}...
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Carga Horária</span>
                      <span className="text-white font-semibold">{course.loadHours}h</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Valor</span>
                      <span className="text-cyan-500 font-semibold">
                        R$ {parseFloat(course.price.toString()).toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Nota Mínima</span>
                      <span className="text-white font-semibold">{course.minGrade}%</span>
                    </div>

                    <Button
                      onClick={() => handleEnroll(course.id)}
                      disabled={enrollMutation.isPending}
                      className="w-full bg-cyan-600 hover:bg-cyan-700"
                    >
                      {enrollMutation.isPending ? "Inscrevendo..." : "Tenho Acesso"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-400">Nenhum curso disponível no momento.</p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700 mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-semibold mb-4">Sobre</h4>
              <p className="text-slate-400 text-sm">
                Plataforma de educação a distância para formação profissional.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Links</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-cyan-500">Cursos</a></li>
                <li><a href="#" className="hover:text-cyan-500">Sobre</a></li>
                <li><a href="#" className="hover:text-cyan-500">Contato</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Redes Sociais</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="https://instagram.com/educadq" target="_blank" className="hover:text-cyan-500">Instagram</a></li>
                <li><a href="https://facebook.com/educadq" target="_blank" className="hover:text-cyan-500">Facebook</a></li>
                <li><a href="https://youtube.com/@educadq" target="_blank" className="hover:text-cyan-500">YouTube</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Contato</h4>
              <p className="text-slate-400 text-sm">
                WhatsApp: <a href="https://wa.me/5541988913431" className="hover:text-cyan-500">41 98891-3431</a>
              </p>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-8 text-center text-slate-400 text-sm">
            <p>&copy; 2026 EducaDQ - Centro de Formação e Estudos sobre Álcool e outras Drogas. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* WhatsApp Button - Only on Home */}
      <WhatsAppButton />
    </div>
  );
}
