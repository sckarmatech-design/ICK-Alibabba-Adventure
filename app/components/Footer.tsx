import { Link } from "react-router";
import { ArrowUp } from "lucide-react";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import type { CompanyInfo, FooterLink } from "~/data/nav";

interface FooterProps {
  footerLinks: FooterLink[];
  companyInfo: CompanyInfo;
}

export function Footer({ footerLinks, companyInfo }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-primary border-t border-border">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-ink mb-2">
                <span className="text-accent">Akhtar</span> Abbasi
              </h3>
              <p className="text-sm text-muted">Hiking Adventures</p>
            </div>
            <p className="text-muted text-sm leading-relaxed mb-4">
              {companyInfo.description}
            </p>
            <div className="flex gap-4">
              {companyInfo.socialMedia.facebook && (
                <a
                  href={companyInfo.socialMedia.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted hover:text-accent transition"
                  aria-label="Facebook"
                >
                  <FaFacebook size={20} />
                </a>
              )}
              {companyInfo.socialMedia.instagram && (
                <a
                  href={companyInfo.socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted hover:text-accent transition"
                  aria-label="Instagram"
                >
                  <FaInstagram size={20} />
                </a>
              )}
              {companyInfo.socialMedia.youtube && (
                <a
                  href={companyInfo.socialMedia.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted hover:text-accent transition"
                  aria-label="YouTube"
                >
                  <FaYoutube size={20} />
                </a>
              )}
            </div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section) => (
            <div key={section.category}>
              <h4 className="font-semibold text-ink mb-4">
                {section.category}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-muted hover:text-accent transition text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {/* Bottom Footer */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted text-sm text-center md:text-left">
            © 2026 Akhtar Abbasi Hiking. All rights reserved.
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-muted hover:text-accent transition text-sm"
            aria-label="Back to top"
          >
            Back to Top
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
}
