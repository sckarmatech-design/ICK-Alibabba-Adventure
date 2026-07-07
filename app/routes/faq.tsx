import { useLoaderData } from "react-router";
import type { MetaFunction, LoaderFunctionArgs } from "react-router";
import { Breadcrumb } from "~/components/Breadcrumb";
import { Accordion } from "~/components/Accordion";
import { SectionTitle } from "~/components/SectionTitle";
import prisma from "~/lib/prisma.server";
import { mapFAQFromPrisma } from "~/lib/mappers";
import { generateMetaTags, SITE_CONFIG } from "~/lib/seo";

export async function loader(_args: LoaderFunctionArgs) {
  const faqs = await prisma.fAQ.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return faqs.map(mapFAQFromPrisma);
}

export const meta: MetaFunction = () => [
  ...generateMetaTags({
    title: "FAQ | Akhtar Abbasi Hiking",
    description:
      "Frequently asked questions about our trekking packages, expeditions, and adventures.",
    image: "https://akhtarabbasi-hiking.com/images/og/faq.webp",
    url: `${SITE_CONFIG.url}/faq`,
  }),
  {
    name: "keywords",
    content:
      "FAQ, frequently asked questions, trekking information, expedition preparation",
  },
];

type FAQCategory =
  | "General"
  | "Preparation"
  | "Logistics"
  | "Safety"
  | "Finance";

export default function FAQ() {
  const faqs = useLoaderData<typeof loader>();
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
            const categoryFAQs = faqs.filter(
              (faq) => faq.category === category,
            );

            return (
              <div key={category}>
                <h2 className="text-2xl md:text-3xl font-bold text-ink mb-6">
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
        <div className="bg-surface border border-border rounded-lg p-8 text-center mt-16">
          <h3 className="text-2xl font-bold text-ink mb-4">
            Didn't find your answer?
          </h3>
          <p className="text-muted mb-6">
            Contact us directly and our team will be happy to help.
          </p>
          {/* CTA — fixed brand green */}
          <a
            href="/contact"
            className="inline-block px-8 py-3 bg-cta text-white rounded-lg hover:bg-cta-hover transition font-semibold"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}
