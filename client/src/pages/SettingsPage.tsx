import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Settings, Bell, Lock, Palette } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);

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
        <p className="text-slate-400">Você precisa estar autenticado.</p>
      </div>
    );
  }

  const handleSave = async () => {
    setIsSaving(true);
    // TODO: Implement save logic
    setTimeout(() => setIsSaving(false), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="w-8 h-8 text-cyan-500" />
            <h1 className="text-3xl font-bold text-white">Configurações</h1>
          </div>
          <p className="text-slate-400">Gerencie suas preferências e configurações da conta</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800 border border-slate-700">
            <TabsTrigger value="profile" className="data-[state=active]:bg-cyan-600">Perfil</TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-cyan-600">Notificações</TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-cyan-600">Segurança</TabsTrigger>
            <TabsTrigger value="branding" className="data-[state=active]:bg-cyan-600">Marca</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6 mt-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Informações do Perfil</CardTitle>
                <CardDescription className="text-slate-400">
                  Atualize suas informações pessoais
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">Nome Completo</Label>
                  <Input
                    id="name"
                    defaultValue={user?.name || ""}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Seu nome"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={user?.email || ""}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="seu@email.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role" className="text-white">Tipo de Usuário</Label>
                  <Input
                    id="role"
                    disabled
                    value={user?.role === "admin" ? "Administrador" : user?.role === "professor" ? "Professor" : "Aluno"}
                    className="bg-slate-700 border-slate-600 text-slate-400"
                  />
                </div>

                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-cyan-600 hover:bg-cyan-700"
                >
                  {isSaving ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6 mt-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Preferências de Notificações
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Escolha como você deseja ser notificado
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                  <div>
                    <p className="text-white font-medium">Notificações por Email</p>
                    <p className="text-sm text-slate-400">Receba atualizações importantes</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                  <div>
                    <p className="text-white font-medium">Alertas de Pagamento</p>
                    <p className="text-sm text-slate-400">Notificações sobre parcelas vencidas</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                  <div>
                    <p className="text-white font-medium">Novos Cursos</p>
                    <p className="text-sm text-slate-400">Avise-me sobre novos cursos disponíveis</p>
                  </div>
                  <input type="checkbox" className="w-4 h-4" />
                </div>

                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full bg-cyan-600 hover:bg-cyan-700"
                >
                  {isSaving ? "Salvando..." : "Salvar Preferências"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6 mt-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Segurança da Conta
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Gerencie a segurança da sua conta
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-slate-700 rounded-lg">
                  <p className="text-white font-medium mb-2">Alterar Senha</p>
                  <p className="text-sm text-slate-400 mb-4">
                    Atualize sua senha regularmente para manter sua conta segura
                  </p>
                  <Button variant="outline" className="text-white">
                    Alterar Senha
                  </Button>
                </div>

                <div className="p-4 bg-slate-700 rounded-lg">
                  <p className="text-white font-medium mb-2">Sessões Ativas</p>
                  <p className="text-sm text-slate-400 mb-4">
                    Você tem 1 sessão ativa neste dispositivo
                  </p>
                  <Button variant="outline" className="text-red-500">
                    Encerrar Todas as Sessões
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Branding Tab */}
          <TabsContent value="branding" className="space-y-6 mt-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Identidade Visual EducaDQ
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Informações sobre a marca e cores oficiais
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Logo */}
                  <div>
                    <p className="text-white font-medium mb-3">Logotipo</p>
                    <div className="bg-slate-700 rounded-lg p-6 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-cyan-500 mb-2">EducaDQ</div>
                        <p className="text-sm text-slate-400">Logo oficial preservado</p>
                      </div>
                    </div>
                  </div>

                  {/* Colors */}
                  <div>
                    <p className="text-white font-medium mb-3">Cores Oficiais</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-cyan-500 rounded-lg" />
                        <div>
                          <p className="text-white text-sm">Cyan Primário</p>
                          <p className="text-slate-400 text-xs">#06B6D4</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-slate-800 rounded-lg border border-slate-600" />
                        <div>
                          <p className="text-white text-sm">Fundo Escuro</p>
                          <p className="text-slate-400 text-xs">#0F172A</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div>
                  <p className="text-white font-medium mb-3">Redes Sociais</p>
                  <div className="space-y-2 text-sm">
                    <p className="text-slate-300">📱 Instagram: @educadq</p>
                    <p className="text-slate-300">📘 Facebook: @educadq</p>
                    <p className="text-slate-300">📺 YouTube: @educadq</p>
                    <p className="text-slate-300">💬 WhatsApp: 41 98891-3431</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
