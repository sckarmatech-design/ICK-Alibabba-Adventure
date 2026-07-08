import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  defaultOpen?: string;
}

export function Accordion({ items, defaultOpen }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(defaultOpen || null);

  return (
    <div className="space-y-2 md:space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="border border-border rounded-lg overflow-hidden hover:border-accent transition"
        >
          <button
            onClick={() => setOpenId(openId === item.id ? null : item.id)}
            className="w-full px-4 md:px-6 py-4 flex items-center justify-between bg-surface hover:bg-primary transition text-left"
          >
            <h3 className="font-semibold text-ink text-sm md:text-base">
              {item.title}
            </h3>
            <ChevronDown
              size={20}
              className={`text-accent transform transition-transform flex-shrink-0 ${
                openId === item.id ? "rotate-180" : ""
              }`}
            />
          </button>

          {openId === item.id && (
            <div className="px-4 md:px-6 py-4 bg-primary border-t border-border text-muted text-sm md:text-base leading-relaxed">
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
