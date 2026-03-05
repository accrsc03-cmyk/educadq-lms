import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Loader2, Plus, Edit2, Trash2, Video, BookOpen } from "lucide-react";

export default function LessonsManagement() {
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    type: "text" as "text" | "video" | "live",
    content: "",
    videoUrl: "",
    liveUrl: "",
  });

  const { data: courses = [] } = trpc.courses.list.useQuery({ limit: 100, offset: 0 });
  const { data: lessons = [], refetch: refetchLessons } = trpc.lessons.getByCourse.useQuery(
    { courseId: selectedCourse || 0 },
    { enabled: !!selectedCourse }
  );

  const createLessonMutation = trpc.lessons.create.useMutation({
    onSuccess: () => {
      toast.success("Aula criada com sucesso!");
      resetForm();
      refetchLessons();
    },
    onError: (error: any) => toast.error(`Erro: ${error?.message}`),
  });

  const updateLessonMutation = trpc.lessons.update.useMutation({
    onSuccess: () => {
      toast.success("Aula atualizada com sucesso!");
      resetForm();
      refetchLessons();
    },
    onError: (error: any) => toast.error(`Erro: ${error?.message}`),
  });

  // const deleteLessonMutation = trpc.lessons.delete.useMutation({
  //   onSuccess: () => {
  //     toast.success("Aula deletada com sucesso!");
  //     refetchLessons();
  //   },
  //   onError: (error: any) => toast.error(`Erro: ${error?.message}`),
  // });

  const resetForm = () => {
    setFormData({ title: "", type: "text", content: "", videoUrl: "", liveUrl: "" });
    setEditingLesson(null);
    setIsOpen(false);
  };

  const handleSubmit = () => {
    if (!formData.title || !selectedCourse) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }

    if (editingLesson) {
      updateLessonMutation.mutate({
        lessonId: editingLesson.id,
        title: formData.title,
        type: formData.type,
        content: formData.type === "text" ? formData.content : undefined,
        videoUrl: formData.type === "video" ? formData.videoUrl : undefined,
        liveUrl: formData.type === "live" ? formData.liveUrl : undefined,
      });
    } else {
      createLessonMutation.mutate({
        courseId: selectedCourse,
        title: formData.title,
        type: formData.type,
        content: formData.type === "text" ? formData.content : undefined,
        videoUrl: formData.type === "video" ? formData.videoUrl : undefined,
        liveUrl: formData.type === "live" ? formData.liveUrl : undefined,
        order: lessons.length + 1,
      });
    }
  };

  const handleEdit = (lesson: any) => {
    setEditingLesson(lesson);
    setFormData({
      title: lesson.title,
      type: lesson.type,
      content: lesson.content || "",
      videoUrl: lesson.videoUrl || "",
      liveUrl: lesson.liveUrl || "",
    });
    setIsOpen(true);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="w-4 h-4" />;
      case "live":
        return <Video className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "video":
        return "Vídeo";
      case "live":
        return "Ao Vivo";
      default:
        return "Texto";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-white">Gerenciar Aulas</h1>
          <p className="text-slate-400">Crie e edite aulas para seus cursos</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Course Selector */}
          <Card className="bg-slate-800 border-slate-700 h-fit">
            <CardHeader>
              <CardTitle className="text-white">Cursos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {courses?.map((course: any) => (
                <Button
                  key={course.id}
                  variant={selectedCourse === course.id ? "default" : "outline"}
                  className={`w-full justify-start ${
                    selectedCourse === course.id
                      ? "bg-cyan-600 hover:bg-cyan-700"
                      : "text-white border-slate-600 hover:bg-slate-700"
                  }`}
                  onClick={() => setSelectedCourse(course.id)}
                >
                  {course.title}
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Lessons List */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">
                {selectedCourse ? "Aulas" : "Selecione um curso"}
              </h2>
              {selectedCourse && (
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => resetForm()}
                      className="bg-cyan-600 hover:bg-cyan-700"
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
                        <Label htmlFor="title" className="text-white">
                          Título *
                        </Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="Título da aula"
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="type" className="text-white">
                          Tipo de Aula
                        </Label>
                        <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
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

                      {formData.type === "text" && (
                        <div className="space-y-2">
                          <Label htmlFor="content" className="text-white">
                            Conteúdo
                          </Label>
                          <Textarea
                            id="content"
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            placeholder="Conteúdo da aula..."
                            className="bg-slate-700 border-slate-600 text-white"
                            rows={4}
                          />
                        </div>
                      )}

                      {formData.type === "video" && (
                        <div className="space-y-2">
                          <Label htmlFor="videoUrl" className="text-white">
                            URL do Vídeo (YouTube)
                          </Label>
                          <Input
                            id="videoUrl"
                            value={formData.videoUrl}
                            onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                            placeholder="https://youtube.com/watch?v=..."
                            className="bg-slate-700 border-slate-600 text-white"
                          />
                        </div>
                      )}

                      {formData.type === "live" && (
                        <div className="space-y-2">
                          <Label htmlFor="liveUrl" className="text-white">
                            URL da Aula ao Vivo (Google Meet)
                          </Label>
                          <Input
                            id="liveUrl"
                            value={formData.liveUrl}
                            onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                            placeholder="https://meet.google.com/..."
                            className="bg-slate-700 border-slate-600 text-white"
                          />
                        </div>
                      )}

                      <Button
                        onClick={handleSubmit}
                        disabled={createLessonMutation.isPending || updateLessonMutation.isPending}
                        className="w-full bg-cyan-600 hover:bg-cyan-700"
                      >
                        {editingLesson ? "Atualizar" : "Criar"} Aula
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            {selectedCourse ? (
              <div className="space-y-3">
                {lessons?.length === 0 ? (
                  <Card className="bg-slate-800 border-slate-700">
                    <CardContent className="pt-6 text-center text-slate-400">
                      Nenhuma aula criada ainda
                    </CardContent>
                  </Card>
                ) : (
                  lessons?.map((lesson: any) => (
                    <Card key={lesson.id} className="bg-slate-800 border-slate-700">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            {getTypeIcon(lesson.type)}
                            <div>
                              <h3 className="font-semibold text-white">{lesson.title}</h3>
                              <p className="text-sm text-slate-400">{getTypeLabel(lesson.type)}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(lesson)}
                              className="text-white border-slate-600 hover:bg-slate-700"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            {/* <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteLessonMutation.mutate({ lessonId: lesson.id })}
                              disabled={deleteLessonMutation.isPending}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button> */}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            ) : (
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="pt-6 text-center text-slate-400">
                  Selecione um curso para gerenciar suas aulas
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
