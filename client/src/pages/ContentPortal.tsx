import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowRight } from "lucide-react";

export default function ContentPortal() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Dados simulados de artigos
  const articles = [
    {
      id: 1,
      title: "Guia Completo de Educação Digital",
      slug: "guia-educacao-digital",
      excerpt: "Aprenda as melhores práticas para educação online",
      category: "educacao",
      views: 1250,
      createdAt: new Date("2026-03-01"),
    },
    {
      id: 2,
      title: "Tendências em EAD para 2026",
      slug: "tendencias-ead-2026",
      excerpt: "Descubra as principais tendências em educação a distância",
      category: "tendencias",
      views: 890,
      createdAt: new Date("2026-02-28"),
    },
    {
      id: 3,
      title: "Como Estruturar um Curso Online",
      slug: "estruturar-curso-online",
      excerpt: "Passo a passo para criar um curso online eficaz",
      category: "criacao",
      views: 2100,
      createdAt: new Date("2026-02-25"),
    },
  ];

  const categories = [
    { id: "educacao", label: "Educação", count: 12 },
    { id: "tendencias", label: "Tendências", count: 8 },
    { id: "criacao", label: "Criação de Cursos", count: 15 },
    { id: "tecnologia", label: "Tecnologia", count: 10 },
  ];

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Centro de Conteúdo</h1>
          <p className="text-lg text-slate-600">
            Artigos, notícias e recursos educacionais para aprimorar seu aprendizado
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-3 text-slate-400" size={20} />
            <Input
              type="text"
              placeholder="Buscar artigos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 py-3 text-base"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Categories */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg">Categorias</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setSelectedCategory(null)}
                >
                  Todas as categorias
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    className="w-full justify-between"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <span>{category.label}</span>
                    <Badge variant="secondary">{category.count}</Badge>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Articles */}
          <div className="lg:col-span-3 space-y-6">
            {filteredArticles.length > 0 ? (
              filteredArticles.map((article) => (
                <Card key={article.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{article.title}</CardTitle>
                        <CardDescription>{article.excerpt}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{article.category}</Badge>
                        <span className="text-sm text-slate-500">
                          {article.views.toLocaleString()} visualizações
                        </span>
                      </div>
                      <span className="text-sm text-slate-500">
                        {article.createdAt.toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button variant="ghost" className="gap-2">
                      Ler artigo
                      <ArrowRight size={16} />
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-slate-500 text-lg">
                    Nenhum artigo encontrado com os filtros selecionados.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
