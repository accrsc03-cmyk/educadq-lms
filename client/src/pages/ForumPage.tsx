import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, ThumbsUp, Eye } from "lucide-react";

export default function ForumPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showNewTopic, setShowNewTopic] = useState(false);
  const [newTopic, setNewTopic] = useState({ title: "", content: "", category: "geral" });

  // Dados simulados de tópicos
  const topics = [
    {
      id: 1,
      title: "Como estruturar um projeto React?",
      author: "João Silva",
      avatar: "JS",
      category: "react",
      replies: 12,
      views: 245,
      lastReply: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
      solved: true,
    },
    {
      id: 2,
      title: "Melhor forma de gerenciar estado global",
      author: "Maria Santos",
      avatar: "MS",
      category: "javascript",
      replies: 8,
      views: 156,
      lastReply: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 horas atrás
      solved: false,
    },
    {
      id: 3,
      title: "Dúvida sobre TypeScript e tipos genéricos",
      author: "Pedro Costa",
      avatar: "PC",
      category: "typescript",
      replies: 15,
      views: 312,
      lastReply: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hora atrás
      solved: true,
    },
  ];

  const categories = [
    { id: "geral", label: "Geral", count: 45 },
    { id: "react", label: "React", count: 28 },
    { id: "javascript", label: "JavaScript", count: 32 },
    { id: "typescript", label: "TypeScript", count: 19 },
    { id: "projetos", label: "Projetos", count: 15 },
  ];

  const filteredTopics = topics.filter((topic) => {
    const matchesSearch =
      topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || topic.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateTopic = () => {
    if (newTopic.title && newTopic.content) {
      console.log("Novo tópico criado:", newTopic);
      setNewTopic({ title: "", content: "", category: "geral" });
      setShowNewTopic(false);
    }
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return "agora";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m atrás`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h atrás`;
    return `${Math.floor(seconds / 86400)}d atrás`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Fórum da Comunidade</h1>
          <p className="text-slate-600">Tire dúvidas, compartilhe conhecimento e conecte-se com outros alunos</p>
        </div>

        {/* Search and Create */}
        <div className="flex gap-4 mb-8">
          <Input
            type="text"
            placeholder="Buscar tópicos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Button onClick={() => setShowNewTopic(!showNewTopic)} className="whitespace-nowrap">
            + Novo Tópico
          </Button>
        </div>

        {/* New Topic Form */}
        {showNewTopic && (
          <Card className="mb-8 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle>Criar Novo Tópico</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Título</label>
                <Input
                  placeholder="Qual é sua dúvida?"
                  value={newTopic.title}
                  onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Descrição</label>
                <Textarea
                  placeholder="Descreva sua dúvida em detalhes..."
                  value={newTopic.content}
                  onChange={(e) => setNewTopic({ ...newTopic, content: e.target.value })}
                  rows={5}
                  className="mt-1"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreateTopic} className="flex-1">
                  Publicar Tópico
                </Button>
                <Button variant="outline" onClick={() => setShowNewTopic(false)}>
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Categories */}
        <div className="mb-8 flex gap-2 flex-wrap">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => setSelectedCategory(null)}
            size="sm"
          >
            Todas as categorias
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(cat.id)}
              size="sm"
            >
              {cat.label} ({cat.count})
            </Button>
          ))}
        </div>

        {/* Topics List */}
        <div className="space-y-4">
          {filteredTopics.length > 0 ? (
            filteredTopics.map((topic) => (
              <Card key={topic.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    {/* Avatar */}
                    <Avatar>
                      <AvatarFallback>{topic.avatar}</AvatarFallback>
                    </Avatar>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-slate-900 hover:text-blue-600">
                              {topic.title}
                            </h3>
                            {topic.solved && (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                ✓ Resolvido
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-600">
                            por <span className="font-medium">{topic.author}</span> •{" "}
                            <span className="text-slate-500">{formatTimeAgo(topic.lastReply)}</span>
                          </p>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex gap-6 mt-3 text-sm text-slate-600">
                        <div className="flex items-center gap-1">
                          <MessageCircle size={16} />
                          <span>{topic.replies} respostas</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye size={16} />
                          <span>{topic.views} visualizações</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-slate-500 text-lg">Nenhum tópico encontrado</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
