import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

const WHATSAPP_NUMBER = "41988913431"; // EducaDQ official number
const WHATSAPP_MESSAGE = "Olá! Gostaria de saber mais sobre os cursos da EducaDQ.";

export default function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show button after 2 seconds
    const timer = setTimeout(() => setIsVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(WHATSAPP_MESSAGE);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110 animate-bounce"
      title="Fale conosco no WhatsApp"
      aria-label="Abrir WhatsApp"
    >
      <MessageCircle size={24} />
    </button>
  );
}
