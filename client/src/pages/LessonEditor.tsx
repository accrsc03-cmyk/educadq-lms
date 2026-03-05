import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, ArrowLeft } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { useState } from "react";

interface LessonEditorProps {
  params: { courseId?: string; lessonId?: string };
}

export default function LessonEditor({ params }: LessonEditorProps) {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const courseId = params.courseId ? parseInt(params.courseId) : 0;
  const lessonId = params.lessonId ? parseInt(params.lessonId) : null;

  const [formData, setFormData] = useState({
    title: "",
    type: "text" as "video" | "text" | "live",
    content: "",
    videoUrl: "",
    liveUrl: "",
    order: 1,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const createMutation = trpc.lessons.create.useMutation();
  const updateMutation = trpc.lessons.update.useMutation();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
      </div>
    );
  }

  if (!user || user.role !== "professor") {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">Acesso negado.</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (lessonId) {
        await updateMutation.mutateAsync({
          lessonId,
          title: formData.title,
          type: formData.type,
          content: formData.type === "text" ? formData.content : undefined,
          videoUrl: formData.type === "video" ? formData.videoUrl : undefined,
          liveUrl: formData.type === "live" ? formData.liveUrl : undefined,
        });
      } else {
        await createMutation.mutateAsync({
          courseId,
          title: formData.title,
          type: formData.type,
          content: formData.type === "text" ? formData.content : undefined,
          videoUrl: formData.type === "video" ? formData.videoUrl : undefined,
          liveUrl: formData.type === "live" ? formData.liveUrl : undefined,
          order: formData.order,
        });
      }
      setLocation(`/professor/courses/${courseId}/lessons`);
    } catch (error) {
      alert("Erro ao salvar aula");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 py-8">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            className="text-slate-400 hover:text-white mb-4"
            onClick={() => setLocation(`/professor/courses/${courseId}/lessons`)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold text-white">
            {lessonId ? "Editar Aula" : "Nova Aula"}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Informações da Aula</CardTitle>
            <CardDescription className="text-slate-400">
              Preencha os dados da aula
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-white">
                  Título da Aula
                </Label>
                <Input
                  id="title"
                  placeholder="Ex: Introdução ao tema"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>

              {/* Type */}
              <div className="space-y-2">
                <Label htmlFor="type" className="text-white">
                  Tipo de Aula
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value as "video" | "text" | "live" })
                  }
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="text">Texto</SelectItem>
                    <SelectItem value="video">Vídeo (YouTube)</SelectItem>
                    <SelectItem value="live">Ao Vivo (Google Meet)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Content based on type */}
              {formData.type === "text" && (
                <div className="space-y-2">
                  <Label htmlFor="content" className="text-white">
                    Conteúdo da Aula
                  </Label>
                  <Textarea
                    id="content"
                    placeholder="Digite o conteúdo da aula (suporta HTML)"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white min-h-40"
                    required
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
                    placeholder="Ex: https://www.youtube.com/watch?v=..."
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
              )}

              {formData.type === "live" && (
                <div className="space-y-2">
                  <Label htmlFor="liveUrl" className="text-white">
                    URL da Aula Ao Vivo (Google Meet)
                  </Label>
                  <Input
                    id="liveUrl"
                    placeholder="Ex: https://meet.google.com/..."
                    value={formData.liveUrl}
                    onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
              )}

              {/* Order */}
              {!lessonId && (
                <div className="space-y-2">
                  <Label htmlFor="order" className="text-white">
                    Ordem da Aula
                  </Label>
                  <Input
                    id="order"
                    type="number"
                    min="1"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation(`/professor/courses/${courseId}/lessons`)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-cyan-600 hover:bg-cyan-700"
                >
                  {isSubmitting ? "Salvando..." : "Salvar Aula"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
