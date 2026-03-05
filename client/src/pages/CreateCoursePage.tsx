import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import type { TRPCClientError } from "@trpc/client";
import { toast } from "sonner";

export default function CreateCoursePage() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    price: "",
    minimumGrade: "60",
    maxInstallments: "3",
    coverImage: "",
    trailerUrl: "",
  });

  const createCourseMutation = trpc.courses.create.useMutation({
    onSuccess: () => {
      toast.success("Curso criado com sucesso!");
      setLocation("/admin");
    },
    onError: (error: any) => {
      toast.error(`Erro ao criar curso: ${error.message}`);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    createCourseMutation.mutate({
      title: formData.title,
      description: formData.description,
      loadHours: parseInt(formData.duration) || 0,
      price: formData.price || "0",
      minGrade: parseInt(formData.minimumGrade) || 60,
      maxInstallments: parseInt(formData.maxInstallments) || 1,
      coverUrl: formData.coverImage || "",
      trailerUrl: formData.trailerUrl || "",
      professorId: 1, // TODO: Get from context
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Novo Curso</h1>
          <p className="text-slate-400">Crie um novo curso para sua plataforma</p>
        </div>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Informações do Curso</CardTitle>
            <CardDescription className="text-slate-400">Preencha os dados básicos do curso</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-white">
                  Título do Curso *
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Ex: Introdução a Python"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-white">
                  Descrição *
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Descreva o conteúdo e objetivos do curso"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500 min-h-32"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-white">
                    Carga Horária (horas) *
                  </Label>
                  <Input
                    id="duration"
                    name="duration"
                    type="number"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="Ex: 40"
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price" className="text-white">
                    Valor (R$) *
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Ex: 199.90"
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minimumGrade" className="text-white">
                    Nota Mínima (%)
                  </Label>
                  <Input
                    id="minimumGrade"
                    name="minimumGrade"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.minimumGrade}
                    onChange={handleChange}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxInstallments" className="text-white">
                    Máx. Parcelas
                  </Label>
                  <Input
                    id="maxInstallments"
                    name="maxInstallments"
                    type="number"
                    min="1"
                    value={formData.maxInstallments}
                    onChange={handleChange}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="coverImage" className="text-white">
                  URL da Capa
                </Label>
                <Input
                  id="coverImage"
                  name="coverImage"
                  value={formData.coverImage}
                  onChange={handleChange}
                  placeholder="https://exemplo.com/imagem.jpg"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="trailerUrl" className="text-white">
                  URL do Trailer (YouTube)
                </Label>
                <Input
                  id="trailerUrl"
                  name="trailerUrl"
                  value={formData.trailerUrl}
                  onChange={handleChange}
                  placeholder="https://youtube.com/watch?v=..."
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={createCourseMutation.isPending}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white"
                >
                  {createCourseMutation.isPending ? "Criando..." : "Criar Curso"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation("/admin")}
                  className="text-white border-slate-600 hover:bg-slate-700"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
