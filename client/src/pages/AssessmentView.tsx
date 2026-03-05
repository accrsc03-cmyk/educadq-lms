import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useContentProtection } from "@/hooks/useContentProtection";
import { useLocation } from "wouter";
import { useState } from "react";

interface AssessmentViewProps {
  params: { assessmentId: string };
}

export default function AssessmentView({ params }: AssessmentViewProps) {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const assessmentId = parseInt(params.assessmentId);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<{ correct: number; total: number; percentage: number } | null>(null);

  // Protect content
  useContentProtection();

  // Fetch assessment
  const { data: assessment, isLoading: assessmentLoading } = trpc.assessments.getById.useQuery(
    { assessmentId },
    { enabled: !!user }
  );

  const submitMutation = trpc.progress.submitAnswer.useMutation();

  if (loading || assessmentLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
      </div>
    );
  }

  if (!user || !assessment) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">Avaliação não encontrada.</p>
      </div>
    );
  }

  const questions = assessment.questions || [];
  const question = questions[currentQuestion];

  const handleAnswerSelect = (alternativeId: number) => {
    setAnswers({
      ...answers,
      [question.id]: alternativeId,
    });
  };

  const handleSubmit = async () => {
    try {
      // Submit all answers
      for (const [questionId, alternativeId] of Object.entries(answers)) {
        await submitMutation.mutateAsync({
          assessmentId,
          questionId: parseInt(questionId),
          alternativeId: alternativeId,
        });
      }

      // Calculate score
      let correct = 0;
      for (const [questionId, alternativeId] of Object.entries(answers)) {
        const q = questions.find((q) => q.id === parseInt(questionId));
        const alt = q?.alternatives?.find((a) => a.id === alternativeId);
        if (alt?.isCorrect) {
          correct++;
        }
      }

      const percentage = Math.round((correct / questions.length) * 100);
      setScore({
        correct,
        total: questions.length,
        percentage,
      });
      setSubmitted(true);
    } catch (error) {
      alert("Erro ao enviar avaliação");
    }
  };

  if (submitted && score) {
    const passed = score.percentage >= 70;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Card className="bg-slate-800 border-slate-700 max-w-md w-full mx-4">
          <CardContent className="pt-12 text-center">
            {passed ? (
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            ) : (
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            )}

            <h2 className="text-2xl font-bold text-white mb-2">
              {passed ? "Parabéns!" : "Não Aprovado"}
            </h2>

            <p className="text-slate-400 mb-6">
              Você acertou {score.correct} de {score.total} questões
            </p>

            <div className="bg-slate-700 rounded-lg p-4 mb-6">
              <p className="text-slate-400 text-sm">Sua Pontuação</p>
              <p className="text-4xl font-bold text-cyan-500">{score.percentage}%</p>
            </div>

            <Button
              onClick={() => setLocation("/")}
              className="w-full bg-cyan-600 hover:bg-cyan-700"
            >
              Voltar ao Início
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">Nenhuma questão disponível.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-2">Avaliação</h1>
          <div className="flex items-center justify-between">
            <p className="text-slate-400">
              Questão {currentQuestion + 1} de {questions.length}
            </p>
            <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-500 transition-all"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">{question.questionText}</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Alternatives */}
            <RadioGroup
              value={answers[question.id]?.toString() || ""}
              onValueChange={(value) => handleAnswerSelect(parseInt(value))}
            >
              <div className="space-y-3">
                {question.alternatives?.map((alt) => (
                  <div key={alt.id} className="flex items-center space-x-2 p-3 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors cursor-pointer">
                    <RadioGroupItem value={alt.id.toString()} id={`alt-${alt.id}`} />
                    <Label
                      htmlFor={`alt-${alt.id}`}
                      className="flex-1 text-white cursor-pointer"
                    >
                      {alt.text}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>

            {/* Navigation */}
            <div className="flex gap-4 pt-6">
              <Button
                variant="outline"
                disabled={currentQuestion === 0}
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                className="flex-1"
              >
                Anterior
              </Button>

              {currentQuestion < questions.length - 1 ? (
                <Button
                  onClick={() => setCurrentQuestion(currentQuestion + 1)}
                  className="flex-1 bg-cyan-600 hover:bg-cyan-700"
                >
                  Próxima
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={Object.keys(answers).length !== questions.length}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Enviar Avaliação
                </Button>
              )}
            </div>

            {/* Progress indicator */}
            <div className="text-sm text-slate-400 text-center">
              {Object.keys(answers).length} de {questions.length} questões respondidas
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
