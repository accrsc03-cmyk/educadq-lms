import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Plus, Edit2, Trash2, FileText, Download } from "lucide-react";

export default function MaterialsManagement() {
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    url: "",
  });

  const { data: courses = [] } = trpc.courses.list.useQuery({ limit: 100, offset: 0 });
  // Materiais são gerenciados através de aulas, então vamos usar um estado local
  const [materials, setMaterials] = useState<any[]>([]);

  // Placeholder para criar material
  const createMaterialMutation = {
    mutate: (data: any) => {
      toast.success("Material criado com sucesso!");
      resetForm();
      setMaterials([...materials, { id: Date.now(), ...data }]);
    },
    isPending: false,
  };

  const resetForm = () => {
    setFormData({ title: "", url: "" });
    setIsOpen(false);
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.url || !selectedCourse) {
      toast.error("Preencha todos os campos");
      return;
    }

    createMaterialMutation.mutate({
      title: formData.title,
      url: formData.url,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-white">Gerenciar Materiais</h1>
          <p className="text-slate-400">Adicione materiais complementares do Google Drive</p>
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

          {/* Materials List */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">
                {selectedCourse ? "Materiais" : "Selecione um curso"}
              </h2>
              {selectedCourse && (
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => resetForm()}
                      className="bg-cyan-600 hover:bg-cyan-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Novo Material
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-800 border-slate-700">
                    <DialogHeader>
                      <DialogTitle className="text-white">
                        Novo Material Complementar
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
                          placeholder="Ex: Apostila Completa"
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="url" className="text-white">
                          URL do Google Drive *
                        </Label>
                        <Input
                          id="url"
                          value={formData.url}
                          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                          placeholder="https://drive.google.com/..."
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                        <p className="text-xs text-slate-400">
                          Compartilhe o arquivo no Google Drive e cole o link aqui
                        </p>
                      </div>

                      <Button
                        onClick={handleSubmit}
                        disabled={createMaterialMutation.isPending}
                        className="w-full bg-cyan-600 hover:bg-cyan-700"
                      >
                        Adicionar Material
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            {selectedCourse ? (
              <div className="space-y-3">
                {materials?.length === 0 ? (
                  <Card className="bg-slate-800 border-slate-700">
                    <CardContent className="pt-6 text-center text-slate-400">
                      Nenhum material adicionado ainda
                    </CardContent>
                  </Card>
                ) : (
                  materials?.map((material: any) => (
                    <Card key={material.id} className="bg-slate-800 border-slate-700">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <FileText className="w-5 h-5 text-cyan-500" />
                            <div className="flex-1">
                              <h3 className="font-semibold text-white">{material.title}</h3>
                              <p className="text-sm text-slate-400 truncate">{material.url}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(material.url, "_blank")}
                              className="text-white border-slate-600 hover:bg-slate-700"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
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
                  Selecione um curso para gerenciar seus materiais
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
