import { useLoaderData, Form, useActionData } from "react-router";
import type {
  MetaFunction,
  LoaderFunctionArgs,
  ActionFunctionArgs,
} from "react-router";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { Breadcrumb } from "~/components/Breadcrumb";
import { SectionTitle } from "~/components/SectionTitle";
import prisma from "~/lib/prisma.server";
import type { CompanyInfo } from "~/data/nav";
import { generateMetaTags, SITE_CONFIG } from "~/lib/seo";
import { getString, getOptionalString, getNumber } from "~/lib/admin";

export async function loader(_args: LoaderFunctionArgs) {
  const settings = await prisma.siteSetting.findMany();
  const map = Object.fromEntries(
    settings.map((s) => [s.key, s.value]),
  ) as unknown as {
    companyInfo: CompanyInfo;
  };
  return map;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const fullName = getString(formData, "fullName").trim();
  const email = getString(formData, "email").trim();

  const errors: Record<string, string> = {};
  if (!fullName) errors.fullName = "Full name is required";
  if (!email) errors.email = "Email is required";

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  await prisma.contactSubmission.create({
    data: {
      fullName,
      email,
      phone: getOptionalString(formData, "phone"),
      tripInterest: getOptionalString(formData, "tripInterest"),
      travelMonth: getOptionalString(formData, "travelMonth"),
      groupSize: getNumber(formData, "groupSize") || null,
      message: getOptionalString(formData, "message"),
    },
  });

  return { success: true, errors: null };
}

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
  const { companyInfo } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

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
              <h3 className="text-2xl font-bold text-white mb-6">
                Send us a Message
              </h3>

              {actionData?.success ? (
                <div className="p-4 bg-green-900/30 border border-green-800 rounded-lg text-green-100">
                  <p className="font-semibold">Thank you!</p>
                  <p>
                    Your inquiry has been received. We'll get back to you soon.
                  </p>
                </div>
              ) : (
                <Form method="post" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="fullName"
                        className="block text-sm font-medium text-[#9ca3af] mb-2"
                      >
                        Full Name *
                      </label>
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        required
                        className="w-full px-4 py-2 bg-[#0a0f1a] border border-[#1f2937] rounded text-[#f9fafb] placeholder-[#9ca3af] hover:border-[#16a34a] focus:outline-none focus:border-[#16a34a] transition"
                        placeholder="Your name"
                      />
                      {actionData?.errors?.fullName && (
                        <p className="mt-1 text-sm text-red-400">
                          {actionData.errors.fullName}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-[#9ca3af] mb-2"
                      >
                        Email *
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="w-full px-4 py-2 bg-[#0a0f1a] border border-[#1f2937] rounded text-[#f9fafb] placeholder-[#9ca3af] hover:border-[#16a34a] focus:outline-none focus:border-[#16a34a] transition"
                        placeholder="your@email.com"
                      />
                      {actionData?.errors?.email && (
                        <p className="mt-1 text-sm text-red-400">
                          {actionData.errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-[#9ca3af] mb-2"
                      >
                        Phone / WhatsApp
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        className="w-full px-4 py-2 bg-[#0a0f1a] border border-[#1f2937] rounded text-[#f9fafb] placeholder-[#9ca3af] hover:border-[#16a34a] focus:outline-none focus:border-[#16a34a] transition"
                        placeholder="+92 300 1234567"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="tripInterest"
                        className="block text-sm font-medium text-[#9ca3af] mb-2"
                      >
                        Trip of Interest
                      </label>
                      <select
                        id="tripInterest"
                        name="tripInterest"
                        className="w-full px-4 py-2 bg-[#0a0f1a] border border-[#1f2937] rounded text-[#9ca3af] hover:border-[#16a34a] focus:outline-none focus:border-[#16a34a] transition"
                      >
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
                      <label
                        htmlFor="travelMonth"
                        className="block text-sm font-medium text-[#9ca3af] mb-2"
                      >
                        Preferred Travel Month
                      </label>
                      <select
                        id="travelMonth"
                        name="travelMonth"
                        className="w-full px-4 py-2 bg-[#0a0f1a] border border-[#1f2937] rounded text-[#9ca3af] hover:border-[#16a34a] focus:outline-none focus:border-[#16a34a] transition"
                      >
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
                      <label
                        htmlFor="groupSize"
                        className="block text-sm font-medium text-[#9ca3af] mb-2"
                      >
                        Group Size
                      </label>
                      <input
                        id="groupSize"
                        name="groupSize"
                        type="number"
                        min="1"
                        className="w-full px-4 py-2 bg-[#0a0f1a] border border-[#1f2937] rounded text-[#f9fafb] placeholder-[#9ca3af] hover:border-[#16a34a] focus:outline-none focus:border-[#16a34a] transition"
                        placeholder="Number of people"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-[#9ca3af] mb-2"
                    >
                      Message / Questions
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      className="w-full px-4 py-2 bg-[#0a0f1a] border border-[#1f2937] rounded text-[#f9fafb] placeholder-[#9ca3af] hover:border-[#16a34a] focus:outline-none focus:border-[#16a34a] transition resize-none"
                      placeholder="Tell us about your adventure plans..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-[#16a34a] hover:bg-[#15803d] text-white rounded-lg transition font-semibold"
                  >
                    Send Message
                  </button>
                </Form>
              )}

              <div className="mt-6 bg-[#0a0f1a] p-4 rounded border border-[#1f2937]">
                <p className="text-sm text-[#9ca3af]">
                  <span className="font-semibold">Prefer direct contact?</span>{" "}
                  Reach us via WhatsApp or email for the fastest response.
                </p>
              </div>
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
