import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, CheckCircle, AlertCircle } from "lucide-react";

export default function MercadopagoIntegration() {
  const [paymentData, setPaymentData] = useState({
    enrollmentId: "",
    amount: "",
    paymentMethod: "credit_card",
  });

  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "error">("idle");

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentStatus("processing");

    // Simulação de processamento de pagamento
    setTimeout(() => {
      setPaymentStatus("success");
    }, 2000);
  };

  const paymentMethods = [
    { id: "credit_card", label: "Cartão de Crédito" },
    { id: "debit_card", label: "Cartão de Débito" },
    { id: "pix", label: "PIX" },
    { id: "boleto", label: "Boleto Bancário" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Pagamento com MercadoPago</h1>
          <p className="text-slate-600">Processe pagamentos de forma segura e rápida</p>
        </div>

        {/* Payment Form */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard size={24} />
              Dados do Pagamento
            </CardTitle>
            <CardDescription>Preencha os dados para processar o pagamento</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePaymentSubmit} className="space-y-6">
              {/* Enrollment ID */}
              <div className="space-y-2">
                <Label htmlFor="enrollmentId">ID da Matrícula</Label>
                <Input
                  id="enrollmentId"
                  type="number"
                  placeholder="Ex: 12345"
                  value={paymentData.enrollmentId}
                  onChange={(e) =>
                    setPaymentData({ ...paymentData, enrollmentId: e.target.value })
                  }
                  required
                />
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount">Valor (R$)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Ex: 99.90"
                  step="0.01"
                  value={paymentData.amount}
                  onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                  required
                />
              </div>

              {/* Payment Method */}
              <div className="space-y-2">
                <Label htmlFor="method">Método de Pagamento</Label>
                <Select value={paymentData.paymentMethod} onValueChange={(value) =>
                  setPaymentData({ ...paymentData, paymentMethod: value })
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((method) => (
                      <SelectItem key={method.id} value={method.id}>
                        {method.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={paymentStatus === "processing"}
              >
                {paymentStatus === "processing" ? "Processando..." : "Processar Pagamento"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Status Messages */}
        {paymentStatus === "success" && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-600" size={24} />
                <div>
                  <h3 className="font-semibold text-green-900">Pagamento Aprovado!</h3>
                  <p className="text-sm text-green-700">
                    Seu pagamento foi processado com sucesso. ID da transação: MP-{Math.random().toString(36).substr(2, 9).toUpperCase()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {paymentStatus === "error" && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="text-red-600" size={24} />
                <div>
                  <h3 className="font-semibold text-red-900">Erro no Pagamento</h3>
                  <p className="text-sm text-red-700">
                    Ocorreu um erro ao processar seu pagamento. Tente novamente.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Segurança</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-600">
              Seus dados são criptografados e processados de forma segura pelo MercadoPago.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Suporte</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-600">
              Em caso de dúvidas, entre em contato com nosso suporte: suporte@educadq.com.br
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
