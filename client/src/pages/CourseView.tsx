import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2, Play, FileText, Video, Users, Download, Lock } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useContentProtection, useVideoProtection } from "@/hooks/useContentProtection";
import { useRef, useState } from "react";

interface CourseViewProps {
  params: { courseId: string };
}

export default function CourseView({ params }: CourseViewProps) {
  const { user, loading } = useAuth();
  const courseId = parseInt(params.courseId);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);

  // Protect content
  useContentProtection();
  useVideoProtection(videoRef);

  // Fetch course
  const { data: course, isLoading: courseLoading } = trpc.courses.getById.useQuery(
    { courseId },
    { enabled: !!user }
  );

  // Fetch progress
  const { data: progress } = trpc.progress.getCourseProgress.useQuery(
    { courseId },
    { enabled: !!user }
  );

  // Record completion
  const completionMutation = trpc.progress.recordCompletion.useMutation();

  const handleLessonComplete = async (lessonId: number) => {
    try {
      await completionMutation.mutateAsync({ lessonId });
      alert("Aula marcada como concluída!");
    } catch (error) {
      alert("Erro ao marcar aula como concluída");
    }
  };

  if (loading || courseLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
      </div>
    );
  }

  if (!user || !course) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">Curso não encontrado.</p>
      </div>
    );
  }

  const progressPercentage = progress?.percentage || 0;
  const currentLesson = course.lessons?.[selectedLesson || 0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-2">{course.title}</h1>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Progresso do Curso</span>
                <span className="text-white font-semibold">{progressPercentage}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2 bg-slate-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {currentLesson ? (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">{currentLesson.title}</CardTitle>
                  <CardDescription className="text-slate-400">
                    Tipo: {currentLesson.type === "video" ? "Vídeo" : currentLesson.type === "text" ? "Texto" : "Ao Vivo"}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Video */}
                  {currentLesson.type === "video" && currentLesson.videoUrl && (
                    <div className="bg-black rounded-lg overflow-hidden">
                      <video
                        ref={videoRef}
                        src={currentLesson.videoUrl || undefined}
                        controls
                        className="w-full"
                      />
                    </div>
                  )}

                  {/* Live */}
                  {currentLesson.type === "live" && currentLesson.liveUrl && (
                    <div className="bg-slate-700 rounded-lg p-6 text-center">
                      <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-400 mb-4">Aula ao vivo</p>
                      {currentLesson.liveUrl && (
                        <Button
                          onClick={() => currentLesson.liveUrl && window.open(currentLesson.liveUrl, "_blank")}
                          className="bg-cyan-600 hover:bg-cyan-700"
                        >
                          Entrar na Aula
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Text Content */}
                  {currentLesson.type === "text" && currentLesson.content && (
                    <div className="prose prose-invert max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
                    </div>
                  )}

                  {/* Materials - TODO: Fetch materials separately */}
                  <div className="border-t border-slate-700 pt-6">
                    <h3 className="text-white font-semibold mb-4">Materiais Complementares</h3>
                    <p className="text-slate-400 text-sm">Materiais disponíveis em breve</p>
                  </div>

                  {/* Complete Button */}
                  <Button
                    onClick={() => handleLessonComplete(currentLesson.id)}
                    disabled={completionMutation.isPending}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    {completionMutation.isPending ? "Marcando..." : "Marcar como Concluída"}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-400">Selecione uma aula para começar.</p>
              </div>
            )}
          </div>

          {/* Sidebar - Lessons List */}
          <div>
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Aulas ({course.lessons?.length || 0})</CardTitle>
              </CardHeader>

              <CardContent>
                <div className="space-y-2">
                  {course.lessons?.map((lesson, index) => {
                    const isCompleted = progress?.progress?.some((p) => p.lessonId === lesson.id);
                    const isLocked = index > 0 && !progress?.progress?.some((p) => p.lessonId === course.lessons![index - 1].id);

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => !isLocked && setSelectedLesson(index)}
                        disabled={isLocked}
                        className={`w-full text-left p-3 rounded-lg transition-colors flex items-center gap-2 ${
                          selectedLesson === index
                            ? "bg-cyan-600 text-white"
                            : isLocked
                            ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                            : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                        }`}
                      >
                        {isLocked ? (
                          <Lock className="w-4 h-4" />
                        ) : lesson.type === "video" ? (
                          <Video className="w-4 h-4" />
                        ) : lesson.type === "text" ? (
                          <FileText className="w-4 h-4" />
                        ) : (
                          <Users className="w-4 h-4" />
                        )}
                        <span className="flex-1 truncate">{lesson.title}</span>
                        {isCompleted && <span className="text-green-400">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
