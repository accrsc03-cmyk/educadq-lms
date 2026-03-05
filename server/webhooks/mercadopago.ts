import { Router } from "express";
import { getDb } from "../db";
import { eq } from "drizzle-orm";
import crypto from "crypto";

const router = Router();

// Webhook para receber notificações do MercadoPago
router.post("/mercadopago", async (req, res) => {
  try {
    const { action, data } = req.body;

    // Validar assinatura do webhook (opcional, mas recomendado)
    // const signature = req.headers["x-signature"];
    // const requestId = req.headers["x-request-id"];

    if (action === "payment.created" || action === "payment.updated") {
      const paymentId = data.id;
      const status = data.status; // approved, pending, rejected, etc

      const db = await getDb();
      if (!db) {
        return res.status(500).json({ error: "Database connection failed" });
      }

      // Atualizar status do pagamento no banco de dados
      // Em produção, seria:
      // await db.update(payments).set({ status }).where(eq(payments.mpPaymentId, paymentId));

      // Log do webhook recebido
      console.log(`[MercadoPago Webhook] Payment ${paymentId} - Status: ${status}`);

      // Enviar notificação por email (simulado)
      if (status === "approved") {
        console.log(`[Email] Pagamento aprovado - ID: ${paymentId}`);
        // Aqui seria enviado um email real
      } else if (status === "rejected") {
        console.log(`[Email] Pagamento rejeitado - ID: ${paymentId}`);
      }

      return res.json({ success: true, message: "Webhook processed" });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("[Webhook Error]", error);
    res.status(500).json({ error: "Webhook processing failed" });
  }
});

// Endpoint para validar webhook do MercadoPago
router.get("/mercadopago/validate", (req, res) => {
  res.json({ status: "ok", message: "Webhook endpoint is active" });
});

export default router;
