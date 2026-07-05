import { useState } from "react";
import { Link } from "react-router";
import { Menu, X, ChevronDown } from "lucide-react";
import type { CompanyInfo, NavItem } from "~/data/nav";

interface HeaderProps {
  mainNav: NavItem[];
  companyInfo: CompanyInfo;
}

export function Header({ mainNav, companyInfo }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-b from-[#0a0f1a] to-[#0a0f1a]/95 backdrop-blur-md border-b border-[#1f2937]">
      {/* Top Info Bar */}
      <div className="hidden md:block bg-[#111827] text-sm text-[#9ca3af] py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <span>📍</span>
              <span>{companyInfo.location}</span>
            </div>
            <a
              href={`mailto:${companyInfo.email}`}
              className="flex items-center gap-2 hover:text-[#16a34a] transition"
            >
              <span>✉️</span>
              <span>{companyInfo.email}</span>
            </a>
          </div>
          <a
            href={`tel:${companyInfo.phone}`}
            className="flex items-center gap-2 hover:text-[#16a34a] transition"
          >
            <span>📞</span>
            <span>{companyInfo.phone}</span>
          </a>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <div className="text-2xl font-bold text-white">
            <span className="text-[#16a34a]">Akhtar</span> Abbasi
          </div>
          <div className="text-xs text-[#9ca3af]">Hiking Adventures</div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {mainNav.map((item) => (
            <div key={item.label} className="relative group">
              <Link
                to={item.href || "#"}
                className="text-[#f9fafb] hover:text-[#16a34a] transition flex items-center gap-1 py-2"
              >
                {item.label}
                {item.submenu && (
                  <ChevronDown
                    size={16}
                    className="group-hover:rotate-180 transition"
                  />
                )}
              </Link>

              {/* Desktop Dropdown */}
              {item.submenu && (
                <div className="absolute left-0 mt-0 w-48 bg-[#1f2937] rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
                  {item.submenu.map((subitem) => (
                    <Link
                      key={subitem.label}
                      to={subitem.href || "#"}
                      className="block px-4 py-2 text-sm text-[#9ca3af] hover:text-[#16a34a] hover:bg-[#111827] transition"
                    >
                      {subitem.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Button & Mobile Menu */}
        <div className="flex items-center gap-4">
          <a
            href={`https://wa.me/${companyInfo.whatsapp.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-block px-6 py-2 bg-[#16a34a] text-white rounded-lg hover:bg-[#15803d] transition font-medium text-sm"
          >
            Contact Us
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-[#f9fafb] hover:text-[#16a34a] transition"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#111827] border-t border-[#1f2937] max-h-96 overflow-y-auto">
          {mainNav.map((item) => (
            <div key={item.label}>
              <button
                onClick={() =>
                  setOpenDropdown(
                    openDropdown === item.label ? null : item.label,
                  )
                }
                className="w-full text-left px-4 py-3 text-[#f9fafb] hover:bg-[#1f2937] transition flex items-center justify-between"
              >
                {item.label}
                {item.submenu && (
                  <ChevronDown
                    size={16}
                    className={`transform transition ${openDropdown === item.label ? "rotate-180" : ""}`}
                  />
                )}
              </button>

              {/* Mobile Dropdown */}
              {item.submenu && openDropdown === item.label && (
                <div className="bg-[#0a0f1a]">
                  {item.submenu.map((subitem) => (
                    <Link
                      key={subitem.label}
                      to={subitem.href || "#"}
                      className="block px-8 py-2 text-sm text-[#9ca3af] hover:text-[#16a34a] hover:bg-[#1f2937] transition"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {subitem.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="border-t border-[#1f2937] px-4 py-3">
            <a
              href={`https://wa.me/${companyInfo.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full px-4 py-2 bg-[#16a34a] text-white rounded-lg hover:bg-[#15803d] transition font-medium text-center text-sm"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact Us
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
