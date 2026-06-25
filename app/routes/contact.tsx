import type { MetaFunction } from "react-router";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { Breadcrumb } from "~/components/Breadcrumb";
import { SectionTitle } from "~/components/SectionTitle";
import { companyInfo } from "~/data/nav";
import { generateMetaTags, SITE_CONFIG } from "~/lib/seo";

export const meta: MetaFunction = () => [
  ...generateMetaTags({
    title: "Contact Us | Akhtar Abbasi Hiking",
    description:
      "Get in touch with Akhtar Abbasi Hiking. Contact us via email, phone, WhatsApp, or fill out our contact form.",
    image: "https://akhtarabbasi-hiking.com/images/og/contact.webp",
    url: `${SITE_CONFIG.url}/contact`,
  }),
  {
    name: "keywords",
    content: "contact us, email, phone, WhatsApp, inquiry, booking",
  },
];

export default function Contact() {
  return (
    <div>
      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <Breadcrumb
          items={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        />

        <div className="mt-8 mb-12">
          <SectionTitle
            title="Get in Touch"
            subtitle="Have questions? We'd love to hear from you."
            centered={true}
          />
        </div>

        {/* Contact Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-[#111827] rounded-lg border border-[#1f2937] p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Send us a Message</h3>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#9ca3af] mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2 bg-[#0a0f1a] border border-[#1f2937] rounded text-[#f9fafb] placeholder-[#9ca3af] hover:border-[#16a34a] focus:outline-none focus:border-[#16a34a] transition"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#9ca3af] mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-2 bg-[#0a0f1a] border border-[#1f2937] rounded text-[#f9fafb] placeholder-[#9ca3af] hover:border-[#16a34a] focus:outline-none focus:border-[#16a34a] transition"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#9ca3af] mb-2">
                      Phone / WhatsApp
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-2 bg-[#0a0f1a] border border-[#1f2937] rounded text-[#f9fafb] placeholder-[#9ca3af] hover:border-[#16a34a] focus:outline-none focus:border-[#16a34a] transition"
                      placeholder="+92 300 1234567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#9ca3af] mb-2">
                      Trip of Interest
                    </label>
                    <select className="w-full px-4 py-2 bg-[#0a0f1a] border border-[#1f2937] rounded text-[#9ca3af] hover:border-[#16a34a] focus:outline-none focus:border-[#16a34a] transition">
                      <option value="">Select a trip</option>
                      <option value="k2">K2 Base Camp Trek</option>
                      <option value="fairy">Fairy Meadows Trek</option>
                      <option value="hunza">Hunza Valley Trek</option>
                      <option value="nanga">Nanga Parbat Expedition</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#9ca3af] mb-2">
                      Preferred Travel Month
                    </label>
                    <select className="w-full px-4 py-2 bg-[#0a0f1a] border border-[#1f2937] rounded text-[#9ca3af] hover:border-[#16a34a] focus:outline-none focus:border-[#16a34a] transition">
                      <option value="">Select month</option>
                      <option value="april">April</option>
                      <option value="may">May</option>
                      <option value="june">June</option>
                      <option value="july">July</option>
                      <option value="august">August</option>
                      <option value="september">September</option>
                      <option value="october">October</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#9ca3af] mb-2">
                      Group Size
                    </label>
                    <input
                      type="number"
                      min="1"
                      className="w-full px-4 py-2 bg-[#0a0f1a] border border-[#1f2937] rounded text-[#f9fafb] placeholder-[#9ca3af] hover:border-[#16a34a] focus:outline-none focus:border-[#16a34a] transition"
                      placeholder="Number of people"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#9ca3af] mb-2">
                    Message / Questions
                  </label>
                  <textarea
                    rows={5}
                    className="w-full px-4 py-2 bg-[#0a0f1a] border border-[#1f2937] rounded text-[#f9fafb] placeholder-[#9ca3af] hover:border-[#16a34a] focus:outline-none focus:border-[#16a34a] transition resize-none"
                    placeholder="Tell us about your adventure plans..."
                  ></textarea>
                </div>

                <div className="bg-[#0a0f1a] p-4 rounded border border-[#1f2937]">
                  <p className="text-sm text-[#9ca3af]">
                    <span className="font-semibold">Note:</span> Since this is a static
                    website, please share your details via WhatsApp or email directly
                    for the fastest response. We'll get back to you within 24 hours.
                  </p>
                </div>

                <div className="flex gap-4">
                  <a
                    href={`https://wa.me/${companyInfo.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent("Hi, I'm interested in booking a trek...")}`}
                    className="flex-1 px-6 py-3 bg-[#16a34a] text-white rounded-lg hover:bg-[#15803d] transition font-semibold text-center"
                  >
                    Send via WhatsApp
                  </a>
                  <a
                    href={`mailto:${companyInfo.email}`}
                    className="flex-1 px-6 py-3 border border-[#16a34a] text-[#16a34a] rounded-lg hover:bg-[#16a34a]/10 transition font-semibold text-center"
                  >
                    Send via Email
                  </a>
                </div>
              </form>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Email */}
            <div className="bg-[#111827] rounded-lg border border-[#1f2937] p-6">
              <div className="flex items-center gap-3 mb-3">
                <Mail className="w-6 h-6 text-[#16a34a]" />
                <h4 className="font-semibold text-white">Email</h4>
              </div>
              <a
                href={`mailto:${companyInfo.email}`}
                className="text-[#16a34a] hover:text-[#15803d] transition break-all"
              >
                {companyInfo.email}
              </a>
            </div>

            {/* Phone */}
            <div className="bg-[#111827] rounded-lg border border-[#1f2937] p-6">
              <div className="flex items-center gap-3 mb-3">
                <Phone className="w-6 h-6 text-[#16a34a]" />
                <h4 className="font-semibold text-white">Phone</h4>
              </div>
              <a
                href={`tel:${companyInfo.phone}`}
                className="text-[#16a34a] hover:text-[#15803d] transition"
              >
                {companyInfo.phone}
              </a>
            </div>

            {/* WhatsApp */}
            <div className="bg-[#111827] rounded-lg border border-[#1f2937] p-6">
              <div className="flex items-center gap-3 mb-3">
                <MessageCircle className="w-6 h-6 text-[#16a34a]" />
                <h4 className="font-semibold text-white">WhatsApp</h4>
              </div>
              <a
                href={`https://wa.me/${companyInfo.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#16a34a] hover:text-[#15803d] transition"
              >
                {companyInfo.whatsapp}
              </a>
            </div>

            {/* Location */}
            <div className="bg-[#111827] rounded-lg border border-[#1f2937] p-6">
              <div className="flex items-center gap-3 mb-3">
                <MapPin className="w-6 h-6 text-[#16a34a]" />
                <h4 className="font-semibold text-white">Location</h4>
              </div>
              <p className="text-[#9ca3af]">{companyInfo.location}</p>
            </div>

            {/* Social Media */}
            <div className="bg-[#111827] rounded-lg border border-[#1f2937] p-6">
              <h4 className="font-semibold text-white mb-4">Follow Us</h4>
              <div className="space-y-2">
                <a
                  href={companyInfo.socialMedia.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-[#16a34a] hover:text-[#15803d] transition text-sm"
                >
                  → Facebook
                </a>
                <a
                  href={companyInfo.socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-[#16a34a] hover:text-[#15803d] transition text-sm"
                >
                  → Instagram
                </a>
                <a
                  href={companyInfo.socialMedia.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-[#16a34a] hover:text-[#15803d] transition text-sm"
                >
                  → YouTube
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
