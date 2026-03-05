import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Trash2, Edit2, Plus } from "lucide-react";

export default function UsersManagement() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user" as "admin" | "professor" | "user",
  });

  const { data: users = [], refetch } = trpc.admin.getUsers.useQuery({ limit: 100, offset: 0 });
  
  const createUserMutation = trpc.admin.createUser.useMutation({
    onSuccess: () => {
      toast.success("Usuário criado com sucesso!");
      resetForm();
      refetch();
    },
    onError: (error: any) => toast.error(`Erro: ${error?.message || 'Erro desconhecido'}`),
  });

  const updateUserMutation = trpc.admin.updateUserRole.useMutation({
    onSuccess: () => {
      toast.success("Usuário atualizado com sucesso!");
      resetForm();
      refetch();
    },
    onError: (error: any) => toast.error(`Erro: ${error?.message || 'Erro desconhecido'}`),
  });

  const deleteUserMutation = trpc.admin.deleteUser.useMutation({
    onSuccess: () => {
      toast.success("Usuário deletado com sucesso!");
      refetch();
    },
    onError: (error: any) => toast.error(`Erro: ${error?.message || 'Erro desconhecido'}`),
  });

  const resetForm = () => {
    setFormData({ name: "", email: "", role: "user" });
    setEditingId(null);
    setIsOpen(false);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.email) {
      toast.error("Preencha todos os campos");
      return;
    }

    if (editingId) {
      updateUserMutation.mutate({
        userId: editingId,
        role: formData.role,
      });
    } else {
      createUserMutation.mutate({
        name: formData.name,
        email: formData.email,
        role: formData.role,
      });
    }
  };

  const handleEdit = (user: any) => {
    setFormData({
      name: user.name || "",
      email: user.email || "",
      role: user.role || "user",
    });
    setEditingId(user.id);
    setIsOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Gerenciamento de Usuários</h2>
          <p className="text-slate-400">Gerencie administradores, professores e alunos</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setIsOpen(true);
          }}
          className="bg-cyan-600 hover:bg-cyan-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Usuário
        </Button>
      </div>

      <div className="grid gap-4">
        {users.length === 0 ? (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6 text-center text-slate-400">
              Nenhum usuário cadastrado
            </CardContent>
          </Card>
        ) : (
          users.map((user: any) => (
            <Card key={user.id} className="bg-slate-800 border-slate-700">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{user.name}</h3>
                    <p className="text-sm text-slate-400">{user.email}</p>
                    <span className="inline-block mt-2 px-3 py-1 bg-cyan-900 text-cyan-200 rounded-full text-xs font-medium">
                      {user?.role === "admin" ? "Administrador" : user?.role === "professor" ? "Professor" : "Aluno"}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(user)}
                      className="text-white border-slate-600 hover:bg-slate-700"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteUserMutation.mutate({ userId: user.id })}
                      className="bg-red-900 hover:bg-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingId ? "Editar Usuário" : "Novo Usuário"}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              {editingId ? "Atualize os dados do usuário" : "Crie um novo usuário"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">
                Nome
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nome completo"
                className="bg-slate-700 border-slate-600 text-white"
                disabled={!!editingId}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@exemplo.com"
                className="bg-slate-700 border-slate-600 text-white"
                disabled={!!editingId}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-white">
                Função
              </Label>
              <Select value={formData.role} onValueChange={(role: any) => setFormData({ ...formData, role })}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="admin" className="text-white">Administrador</SelectItem>
                  <SelectItem value="professor" className="text-white">Professor</SelectItem>
                  <SelectItem value="user" className="text-white">Aluno</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleSubmit}
                disabled={createUserMutation.isPending || updateUserMutation.isPending}
                className="bg-cyan-600 hover:bg-cyan-700 text-white"
              >
                {editingId ? "Atualizar" : "Criar"}
              </Button>
              <Button
                variant="outline"
                onClick={resetForm}
                className="text-white border-slate-600 hover:bg-slate-700"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
