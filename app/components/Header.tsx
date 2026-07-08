import { useState } from "react";
import { Link } from "react-router";
import { Menu, X, ChevronDown, MapPin, Mail, Phone } from "lucide-react";
import type { CompanyInfo, NavItem } from "~/data/nav";
import { ThemeSwitcher } from "~/components/ThemeSwitcher";

interface HeaderProps {
  mainNav: NavItem[];
  companyInfo: CompanyInfo;
}

export function Header({ mainNav, companyInfo }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 bg-linear-to-b from-primary to-primary/95 backdrop-blur-md border-b border-border">
      {/* Top Info Bar */}
      <div className="hidden md:block bg-surface text-sm text-muted py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-accent" />
              <span>{companyInfo.location}</span>
            </div>
            <a
              href={`mailto:${companyInfo.email}`}
              className="flex items-center gap-2 hover:text-accent transition"
            >
              <Mail size={14} className="text-accent" />
              <span>{companyInfo.email}</span>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={`tel:${companyInfo.phone}`}
              className="flex items-center gap-2 hover:text-accent transition"
            >
              <Phone size={14} className="text-accent" />
              <span>{companyInfo.phone}</span>
            </a>
            <ThemeSwitcher variant="desktop" />
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="group shrink-0 flex items-center -my-4 py-1 focus-visible:outline-hidden"
        >
          {companyInfo.logo ? (
            <img
              src={companyInfo.logo}
              alt={companyInfo.name}
              className="h-14 w-auto min-w-15 max-w-50 object-contain sm:h-18 md:h-22 lg:h-26 xl:max-w-70 transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div>
              <div className="text-2xl font-bold text-ink">
                <span className="text-accent">
                  {companyInfo.name.split(" ")[0]}
                </span>{" "}
                {companyInfo.name.split(" ").slice(1).join(" ")}
              </div>
              <div className="text-xs text-muted">Hiking Adventures</div>
            </div>
          )}
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {mainNav.map((item) => (
            <div key={item.label} className="relative group">
              <Link
                to={item.href || "#"}
                className="text-ink hover:text-accent transition flex items-center gap-1 py-2"
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
                <div className="absolute left-0 mt-0 w-48 bg-surface rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2 border border-border">
                  {item.submenu.map((subitem) => (
                    <Link
                      key={subitem.label}
                      to={subitem.href || "#"}
                      className="block px-4 py-2 text-sm text-muted hover:text-accent hover:bg-primary transition"
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
            className="hidden sm:inline-block px-6 py-2 bg-cta text-white rounded-lg hover:bg-cta-hover transition font-medium text-sm"
          >
            Contact Us
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-ink hover:text-accent transition"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface border-t border-border max-h-96 overflow-y-auto">
          {mainNav.map((item) => (
            <div key={item.label}>
              <button
                onClick={() =>
                  setOpenDropdown(
                    openDropdown === item.label ? null : item.label,
                  )
                }
                className="w-full text-left px-4 py-3 text-ink hover:bg-primary transition flex items-center justify-between"
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
                <div className="bg-primary">
                  {item.submenu.map((subitem) => (
                    <Link
                      key={subitem.label}
                      to={subitem.href || "#"}
                      className="block px-8 py-2 text-sm text-muted hover:text-accent hover:bg-surface transition"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {subitem.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          <ThemeSwitcher variant="mobile" />

          <div className="border-t border-border px-4 py-3">
            <a
              href={`https://wa.me/${companyInfo.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full px-4 py-2 bg-cta text-white rounded-lg hover:bg-cta-hover transition font-medium text-center text-sm"
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
