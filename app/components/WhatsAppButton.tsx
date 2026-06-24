import { MessageCircle } from "lucide-react";
import { companyInfo } from "~/data/nav";

export function WhatsAppButton() {
  const whatsappNumber = companyInfo.whatsapp.replace(/\D/g, "");
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=Hi%20Akhtar%20Abbasi%20Hiking%2C%20I%20would%20like%20to%20know%20more%20about%20your%20trekking%20packages.`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-40 flex items-center gap-2 bg-[#16a34a] text-white rounded-full p-4 shadow-lg hover:bg-[#15803d] transition transform hover:scale-110 group"
      aria-label="Chat with us on WhatsApp"
    >
      <MessageCircle size={24} />
      <span className="hidden group-hover:inline text-sm font-medium whitespace-nowrap">Chat with us</span>
    </a>
  );
}
