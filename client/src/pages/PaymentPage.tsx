import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState } from "react";

export default function PaymentPage() {
  const { user, loading } = useAuth();
  const [selectedPayment, setSelectedPayment] = useState<number | null>(null);

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

  // Fetch payments
  const { data: payments, isLoading: paymentsLoading } = trpc.payments.getStudentPayments.useQuery(
    undefined,
    { enabled: !!user }
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-600">Pago</Badge>;
      case "pending":
        return <Badge className="bg-yellow-600">Pendente</Badge>;
      case "partial":
        return <Badge className="bg-blue-600">Parcial</Badge>;
      case "overdue":
        return <Badge className="bg-red-600">Atrasado</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "overdue":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-2">Meus Pagamentos</h1>
          <p className="text-slate-400">Acompanhe o status de seus pagamentos e parcelas</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        {paymentsLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
          </div>
        ) : payments && Array.isArray(payments) && payments.length > 0 ? (
          <div className="space-y-6">
            {payments?.map((payment: any) => (
              <Card
                key={payment.id}
                className="bg-slate-800 border-slate-700 hover:border-cyan-500 transition-colors cursor-pointer"
                onClick={() => setSelectedPayment(selectedPayment === payment.id ? null : payment.id)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(payment.status)}
                      <div>
                        <CardTitle className="text-white">Pagamento #{payment.id}</CardTitle>
                        <CardDescription className="text-slate-400">
                          Curso: Curso #{payment.courseId}
                        </CardDescription>
                      </div>
                    </div>
                    {getStatusBadge(payment.status)}
                  </div>
                </CardHeader>

                {selectedPayment === payment.id && (
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-slate-400 text-sm">Valor Total</p>
                        <p className="text-white font-semibold">R$ {parseFloat(payment.totalValue.toString()).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Entrada</p>
                        <p className="text-white font-semibold">R$ {parseFloat(payment.downPayment.toString()).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Parcelas</p>
                        <p className="text-white font-semibold">{payment.installmentCount}x</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Pagas</p>
                        <p className="text-cyan-500 font-semibold">{payment.paidInstallments}/{payment.installmentCount}</p>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Progresso de Pagamento</span>
                        <span className="text-cyan-500">
                          {Math.round((payment.paidInstallments / payment.installmentCount) * 100)}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-cyan-500 transition-all"
                          style={{
                            width: `${(payment.paidInstallments / payment.installmentCount) * 100}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Payment info */}
                    <div className="bg-slate-700 rounded-lg p-4 space-y-3">
                      <h4 className="text-white font-semibold">Informações de Pagamento</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Chave PIX</span>
                          <span className="text-white font-mono">41 98891-3431</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Status</span>
                          <span className="text-white capitalize">{payment.status}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action button */}
                    {payment.status !== "paid" && (
                      <Button className="w-full bg-cyan-600 hover:bg-cyan-700">
                        Realizar Pagamento
                      </Button>
                    )}
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-400">Você não tem pagamentos registrados.</p>
          </div>
        )}
      </div>
    </div>
  );
}
