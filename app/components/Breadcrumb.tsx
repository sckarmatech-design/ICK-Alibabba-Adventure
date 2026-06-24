import { Link } from "react-router";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 text-sm text-[#9ca3af]" aria-label="Breadcrumb">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {index > 0 && <span className="text-[#1f2937]">/</span>}
          {item.href ? (
            <Link
              to={item.href}
              className="hover:text-[#16a34a] transition"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-[#f9fafb]">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
