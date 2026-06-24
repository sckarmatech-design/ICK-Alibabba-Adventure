import { Link } from "react-router";
import { Share2, ArrowUp } from "lucide-react";
import { companyInfo, footerLinks } from "~/data/nav";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#0a0f1a] border-t border-[#1f2937]">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-white mb-2">
                <span className="text-[#16a34a]">Akhtar</span> Abbasi
              </h3>
              <p className="text-sm text-[#9ca3af]">Hiking Adventures</p>
            </div>
            <p className="text-[#9ca3af] text-sm leading-relaxed mb-4">
              {companyInfo.description}
            </p>
            <div className="flex gap-4">
              <a
                href={companyInfo.socialMedia.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#9ca3af] hover:text-[#16a34a] transition"
                aria-label="Facebook"
              >
                <Share2 size={20} />
              </a>
              <a
                href={companyInfo.socialMedia.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#9ca3af] hover:text-[#16a34a] transition"
                aria-label="Instagram"
              >
                <Share2 size={20} />
              </a>
              <a
                href={companyInfo.socialMedia.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#9ca3af] hover:text-[#16a34a] transition"
                aria-label="YouTube"
              >
                <Share2 size={20} />
              </a>
            </div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section) => (
            <div key={section.category}>
              <h4 className="font-semibold text-white mb-4">{section.category}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-[#9ca3af] hover:text-[#16a34a] transition text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-[#9ca3af]">
              <li>
                <p className="font-medium text-white mb-1">Email</p>
                <a href={`mailto:${companyInfo.email}`} className="hover:text-[#16a34a] transition">
                  {companyInfo.email}
                </a>
              </li>
              <li>
                <p className="font-medium text-white mb-1">Phone</p>
                <a href={`tel:${companyInfo.phone}`} className="hover:text-[#16a34a] transition">
                  {companyInfo.phone}
                </a>
              </li>
              <li>
                <p className="font-medium text-white mb-1">WhatsApp</p>
                <a
                  href={`https://wa.me/${companyInfo.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#16a34a] transition"
                >
                  {companyInfo.whatsapp}
                </a>
              </li>
              <li>
                <p className="font-medium text-white mb-1">Location</p>
                <p>{companyInfo.location}</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-[#1f2937] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#9ca3af] text-sm text-center md:text-left">
            © 2026 Akhtar Abbasi Hiking. All rights reserved.
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-[#9ca3af] hover:text-[#16a34a] transition text-sm"
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
