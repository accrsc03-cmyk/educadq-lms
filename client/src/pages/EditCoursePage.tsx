import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useLocation, useRoute } from "wouter";
import { Loader2, Save, ArrowLeft } from "lucide-react";

export default function EditCoursePage() {
  const [, params] = useRoute("/admin/courses/:courseId/edit");
  const [, setLocation] = useLocation();
  const courseId = params?.courseId ? parseInt(params.courseId) : null;

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

  // const { data: professors = [] } = trpc.admin.getProfessors.useQuery();

  const updateCourseMutation = trpc.courses.update.useMutation({
    onSuccess: () => {
      toast.success("Curso atualizado com sucesso!");
      setLocation("/admin");
    },
    onError: (error: any) => toast.error(`Erro: ${error?.message || 'Erro desconhecido'}`),
  });

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
              <p className="text-slate-400">Atualize os dados do curso</p>
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
