import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useLocation, useRoute } from "wouter";
import { Loader2, Save, ArrowLeft, Plus, Edit2, BookOpen, Video } from "lucide-react";

export default function EditCoursePage() {
  const [, params] = useRoute("/admin/courses/:courseId/edit");
  const [, setLocation] = useLocation();
  const courseId = params?.courseId ? parseInt(params.courseId) : null;
  const [isLessonDialogOpen, setIsLessonDialogOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<any>(null);
  const [lessonFormData, setLessonFormData] = useState({
    title: "",
    type: "text" as "text" | "video" | "live",
    content: "",
    videoUrl: "",
    liveUrl: "",
  });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    courseHours: "",
    price: "",
    coverImage: "",
    trailerUrl: "",
    professorId: "",
    minimumGrade: "",
    installments: "",
  });

  const { data: course, isLoading: courseLoading } = trpc.courses.getById.useQuery(
    { courseId: courseId || 0 },
    { enabled: !!courseId }
  );

  const { data: lessons = [], refetch: refetchLessons } = trpc.lessons.getByCourse.useQuery(
    { courseId: courseId || 0 },
    { enabled: !!courseId }
  );

  const createLessonMutation = trpc.lessons.create.useMutation({
    onSuccess: () => {
      toast.success("Aula criada com sucesso!");
      resetLessonForm();
      refetchLessons();
    },
    onError: (error: any) => toast.error(`Erro: ${error?.message}`),
  });

  const updateLessonMutation = trpc.lessons.update.useMutation({
    onSuccess: () => {
      toast.success("Aula atualizada com sucesso!");
      resetLessonForm();
      refetchLessons();
    },
    onError: (error: any) => toast.error(`Erro: ${error?.message}`),
  });

  const updateCourseMutation = trpc.courses.update.useMutation({
    onSuccess: () => {
      toast.success("Curso atualizado com sucesso!");
      setLocation("/admin");
    },
    onError: (error: any) => toast.error(`Erro: ${error?.message || 'Erro desconhecido'}`),
  });

  const resetLessonForm = () => {
    setLessonFormData({ title: "", type: "text", content: "", videoUrl: "", liveUrl: "" });
    setEditingLesson(null);
    setIsLessonDialogOpen(false);
  };

  const handleLessonSubmit = () => {
    if (!lessonFormData.title || !courseId) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }

    if (editingLesson) {
      updateLessonMutation.mutate({
        lessonId: editingLesson.id,
        title: lessonFormData.title,
        type: lessonFormData.type,
        content: lessonFormData.type === "text" ? lessonFormData.content : undefined,
        videoUrl: lessonFormData.type === "video" ? lessonFormData.videoUrl : undefined,
        liveUrl: lessonFormData.type === "live" ? lessonFormData.liveUrl : undefined,
      });
    } else {
      createLessonMutation.mutate({
        courseId,
        title: lessonFormData.title,
        type: lessonFormData.type,
        content: lessonFormData.type === "text" ? lessonFormData.content : undefined,
        videoUrl: lessonFormData.type === "video" ? lessonFormData.videoUrl : undefined,
        liveUrl: lessonFormData.type === "live" ? lessonFormData.liveUrl : undefined,
        order: (lessons?.length || 0) + 1,
      });
    }
  };

  const handleEditLesson = (lesson: any) => {
    setEditingLesson(lesson);
    setLessonFormData({
      title: lesson.title,
      type: lesson.type,
      content: lesson.content || "",
      videoUrl: lesson.videoUrl || "",
      liveUrl: lesson.liveUrl || "",
    });
    setIsLessonDialogOpen(true);
  };

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title || "",
        description: course.description || "",
        courseHours: "40",
        price: course.price?.toString() || "",
        coverImage: "",
        trailerUrl: course.trailerUrl || "",
        professorId: course.professorId?.toString() || "",
        minimumGrade: "70",
        installments: "3",
      });
    }
  }, [course]);

  const handleSubmit = () => {
    if (!formData.title || !formData.description || !formData.courseHours || !formData.price) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (!courseId) {
      toast.error("ID do curso não encontrado");
      return;
    }

    updateCourseMutation.mutate({
      courseId,
      title: formData.title,
      description: formData.description,
      trailerUrl: formData.trailerUrl,
    });
  };

  if (courseLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLocation("/admin")}
              className="text-white border-slate-600 hover:bg-slate-700"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white">Editar Curso</h1>
              <p className="text-slate-400">Atualize os dados do curso e suas aulas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Informações Básicas</CardTitle>
                <CardDescription className="text-slate-400">Dados principais do curso</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-white">
                    Título do Curso *
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: Python Avançado"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-white">
                    Descrição *
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descreva o conteúdo do curso..."
                    className="bg-slate-700 border-slate-600 text-white"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="courseHours" className="text-white">
                      Carga Horária (horas) *
                    </Label>
                    <Input
                      id="courseHours"
                      type="number"
                      value={formData.courseHours}
                      onChange={(e) => setFormData({ ...formData, courseHours: e.target.value })}
                      placeholder="40"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-white">
                      Preço (R$) *
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="299.90"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Mídia</CardTitle>
                <CardDescription className="text-slate-400">Capa e trailer do curso</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="coverImage" className="text-white">
                    URL da Capa
                  </Label>
                  <Input
                    id="coverImage"
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    placeholder="https://..."
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="trailerUrl" className="text-white">
                    URL do Trailer (YouTube)
                  </Label>
                  <Input
                    id="trailerUrl"
                    value={formData.trailerUrl}
                    onChange={(e) => setFormData({ ...formData, trailerUrl: e.target.value })}
                    placeholder="https://youtube.com/watch?v=..."
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Aulas do Curso</CardTitle>
                <CardDescription className="text-slate-400">Gerenciar aulas (vídeo, texto, ao vivo)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Dialog open={isLessonDialogOpen} onOpenChange={setIsLessonDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => resetLessonForm()}
                      className="w-full bg-cyan-600 hover:bg-cyan-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Nova Aula
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-800 border-slate-700">
                    <DialogHeader>
                      <DialogTitle className="text-white">
                        {editingLesson ? "Editar Aula" : "Nova Aula"}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="lesson-title" className="text-white">
                          Título *
                        </Label>
                        <Input
                          id="lesson-title"
                          value={lessonFormData.title}
                          onChange={(e) => setLessonFormData({ ...lessonFormData, title: e.target.value })}
                          placeholder="Título da aula"
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="lesson-type" className="text-white">
                          Tipo de Aula
                        </Label>
                        <Select value={lessonFormData.type} onValueChange={(value: any) => setLessonFormData({ ...lessonFormData, type: value })}>
                          <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-700 border-slate-600">
                            <SelectItem value="text" className="text-white">Texto</SelectItem>
                            <SelectItem value="video" className="text-white">Vídeo (YouTube)</SelectItem>
                            <SelectItem value="live" className="text-white">Ao Vivo (Google Meet)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {lessonFormData.type === "text" && (
                        <div className="space-y-2">
                          <Label htmlFor="lesson-content" className="text-white">
                            Conteúdo
                          </Label>
                          <Textarea
                            id="lesson-content"
                            value={lessonFormData.content}
                            onChange={(e) => setLessonFormData({ ...lessonFormData, content: e.target.value })}
                            placeholder="Conteúdo da aula..."
                            className="bg-slate-700 border-slate-600 text-white"
                            rows={4}
                          />
                        </div>
                      )}

                      {lessonFormData.type === "video" && (
                        <div className="space-y-2">
                          <Label htmlFor="lesson-video" className="text-white">
                            URL do Vídeo (YouTube)
                          </Label>
                          <Input
                            id="lesson-video"
                            value={lessonFormData.videoUrl}
                            onChange={(e) => setLessonFormData({ ...lessonFormData, videoUrl: e.target.value })}
                            placeholder="https://youtube.com/watch?v=..."
                            className="bg-slate-700 border-slate-600 text-white"
                          />
                        </div>
                      )}

                      {lessonFormData.type === "live" && (
                        <div className="space-y-2">
                          <Label htmlFor="lesson-live" className="text-white">
                            URL da Aula ao Vivo (Google Meet)
                          </Label>
                          <Input
                            id="lesson-live"
                            value={lessonFormData.liveUrl}
                            onChange={(e) => setLessonFormData({ ...lessonFormData, liveUrl: e.target.value })}
                            placeholder="https://meet.google.com/..."
                            className="bg-slate-700 border-slate-600 text-white"
                          />
                        </div>
                      )}

                      <Button
                        onClick={handleLessonSubmit}
                        disabled={createLessonMutation.isPending || updateLessonMutation.isPending}
                        className="w-full bg-cyan-600 hover:bg-cyan-700"
                      >
                        {editingLesson ? "Atualizar" : "Criar"} Aula
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {lessons && lessons.length > 0 ? (
                    lessons.map((lesson: any) => (
                      <Card key={lesson.id} className="bg-slate-700 border-slate-600">
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 flex-1">
                              {lesson.type === "video" ? (
                                <Video className="w-4 h-4 text-cyan-500" />
                              ) : (
                                <BookOpen className="w-4 h-4 text-cyan-500" />
                              )}
                              <div>
                                <p className="text-white text-sm font-medium">{lesson.title}</p>
                                <p className="text-xs text-slate-400">
                                  {lesson.type === "text" ? "Texto" : lesson.type === "video" ? "Vídeo" : "Ao Vivo"}
                                </p>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditLesson(lesson)}
                              className="text-cyan-500 hover:bg-slate-600"
                            >
                              <Edit2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400 text-center py-4">Nenhuma aula criada ainda</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Configurações</CardTitle>
                <CardDescription className="text-slate-400">Parâmetros do curso</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="professorId" className="text-white">
                      Professor
                    </Label>
                    <Input
                      type="number"
                      value={formData.professorId}
                      onChange={(e) => setFormData({ ...formData, professorId: e.target.value })}
                      placeholder="ID do professor"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="minimumGrade" className="text-white">
                      Nota Mínima (%)
                    </Label>
                    <Input
                      id="minimumGrade"
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={formData.minimumGrade}
                      onChange={(e) => setFormData({ ...formData, minimumGrade: e.target.value })}
                      placeholder="70"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="installments" className="text-white">
                    Número de Parcelas
                  </Label>
                  <Input
                    id="installments"
                    type="number"
                    value={formData.installments}
                    onChange={(e) => setFormData({ ...formData, installments: e.target.value })}
                    placeholder="3"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview */}
          <div className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Pré-visualização</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.coverImage && (
                  <img
                    src={formData.coverImage}
                    alt={formData.title}
                    className="w-full h-40 object-cover rounded"
                  />
                )}
                <div>
                  <h3 className="font-semibold text-white">{formData.title || "Título do curso"}</h3>
                  <p className="text-sm text-slate-400 mt-2">{formData.description || "Descrição do curso"}</p>
                  <div className="mt-4 space-y-2 text-sm">
                    <p className="text-slate-400">
                      <span className="font-semibold text-white">{formData.courseHours || "0"}</span> horas
                    </p>
                    <p className="text-cyan-400 font-semibold">
                      R$ {formData.price || "0.00"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={handleSubmit}
              disabled={updateCourseMutation.isPending}
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
              size="lg"
            >
              <Save className="w-4 h-4 mr-2" />
              Salvar Alterações
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
