import type { MetaFunction } from "react-router";
import { Breadcrumb } from "~/components/Breadcrumb";
import { Accordion } from "~/components/Accordion";
import { SectionTitle } from "~/components/SectionTitle";
import { faqs } from "~/data/faqs";

export const meta: MetaFunction = () => [
  { title: "FAQ | Akhtar Abbasi Hiking" },
  {
    name: "description",
    content:
      "Frequently asked questions about our trekking packages, expeditions, and adventures.",
  },
];

type FAQCategory = "General" | "Preparation" | "Logistics" | "Safety" | "Finance";

export default function FAQ() {
  const categories: FAQCategory[] = [
    "General",
    "Preparation",
    "Logistics",
    "Safety",
    "Finance",
  ];

  return (
    <div>
      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "FAQ" }]} />

        <div className="mt-8 mb-12">
          <SectionTitle
            title="Frequently Asked Questions"
            subtitle="Find answers to common questions about our treks and expeditions"
            centered={true}
          />
        </div>

        {/* FAQ Sections */}
        <div className="space-y-12">
          {categories.map((category) => {
            const categoryFAQs = faqs.filter((faq) => faq.category === category);

            return (
              <div key={category}>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                  {category}
                </h2>

                <Accordion
                  items={categoryFAQs.map((faq) => ({
                    id: faq.id,
                    title: faq.question,
                    content: faq.answer,
                  }))}
                />
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-lg p-8 text-center mt-16">
          <h3 className="text-2xl font-bold text-white mb-4">
            Didn't find your answer?
          </h3>
          <p className="text-[#9ca3af] mb-6">
            Contact us directly and our team will be happy to help.
          </p>
          <a
            href="/contact"
            className="inline-block px-8 py-3 bg-[#16a34a] text-white rounded-lg hover:bg-[#15803d] transition font-semibold"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}
