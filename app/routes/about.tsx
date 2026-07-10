import { useLoaderData } from "react-router";
import type { MetaFunction, LoaderFunctionArgs } from "react-router";
import { Breadcrumb } from "~/components/Breadcrumb";
import { SectionTitle } from "~/components/SectionTitle";
import { StatsBar } from "~/components/StatsBar";
import { Users, Target, Heart, Mountain } from "lucide-react";
import prisma from "~/lib/prisma.server";
import { mapTeamMemberFromPrisma } from "~/lib/mappers";
import { generateMetaTags, SITE_CONFIG } from "~/lib/seo";
import { companyInfo as defaultCompanyInfo, type CompanyInfo } from "~/data/nav";

export async function loader(_args: LoaderFunctionArgs) {
  const [team, companyInfoSetting] = await Promise.all([
    prisma.teamMember.findMany({
      orderBy: { sortOrder: "asc" },
    }),
    prisma.siteSetting.findUnique({
      where: { key: "companyInfo" },
    }),
  ]);

  const companyInfo: CompanyInfo = {
    ...defaultCompanyInfo,
    ...(companyInfoSetting?.value &&
    typeof companyInfoSetting.value === "object"
      ? (companyInfoSetting.value as Record<string, unknown>)
      : {}),
  } as CompanyInfo;

  return {
    team: team.map(mapTeamMemberFromPrisma),
    companyInfo,
  };
}

export const meta: MetaFunction = () => [
  ...generateMetaTags({
    title: "About Us | ICK Alibabba Adventure",
    description:
      "Learn about ICK Alibabba Adventure — our mission, vision, experienced guides, and commitment to unforgettable mountain adventures.",
    image: "https://akhtarabbasi-hiking.com/images/og/about.webp",
    url: `${SITE_CONFIG.url}/about`,
  }),
  {
    name: "keywords",
    content:
      "about us, our mission, experienced guides, trekking company, Gilgit Baltistan",
  },
];

export default function About() {
  const { team, companyInfo } = useLoaderData<typeof loader>();
  const aboutImage = companyInfo.aboutImage || "/images/about/team.webp";
  const stats = [
    { icon: Mountain, label: "Years of Experience", value: "25+" },
    { icon: Users, label: "Happy Clients", value: "2000+" },
    { icon: Target, label: "Treks Completed", value: "500+" },
    { icon: Heart, label: "Peaks Summited", value: "100+" },
  ];

  return (
    <div>
      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <Breadcrumb
          items={[{ label: "Home", href: "/" }, { label: "About" }]}
        />

        <div className="mt-8 mb-12">
          <SectionTitle
            title="About ICK Alibabba Adventure"
            subtitle="Leading adventures in Gilgit Baltistan since the beginning"
            centered={true}
          />
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-ink mb-4">Who We Are</h2>
            <p className="text-muted leading-relaxed mb-4">
              ICK Alibabba Adventure is a premier adventure company dedicated to
              providing world-class trekking and expedition experiences in
              Gilgit Baltistan. Founded with a passion for the mountains, we've
              been guiding adventurers to some of the world's most spectacular
              peaks and valleys.
            </p>
            <p className="text-muted leading-relaxed mb-4">
              Our team of experienced guides, logistics coordinators, and
              support staff work together to ensure every expedition is safe,
              memorable, and transformative. We believe that mountain adventures
              aren't just about reaching a summit—they're about connecting with
              nature, challenging ourselves, and building lifelong memories.
            </p>
            <p className="text-muted leading-relaxed">
              With deep knowledge of local terrain, weather patterns, and
              cultural traditions, we provide authentic experiences that go
              beyond standard tourism.
            </p>
          </div>

          <div className="relative">
            <img
              src={aboutImage}
              alt="Our Team"
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
        </div>

        {/* Stats */}
        <StatsBar stats={stats} />

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-16">
          <div className="bg-surface rounded-lg border border-border p-8">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-8 h-8 text-accent" />
              <h3 className="text-2xl font-bold text-ink">Our Mission</h3>
            </div>
            <p className="text-muted leading-relaxed">
              To provide the highest quality trekking and expedition experiences
              in Gilgit Baltistan while maintaining the safety, well-being, and
              cultural respect of our clients and local communities.
            </p>
          </div>

          <div className="bg-surface rounded-lg border border-border p-8">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-8 h-8 text-accent" />
              <h3 className="text-2xl font-bold text-ink">Our Vision</h3>
            </div>
            <p className="text-muted leading-relaxed">
              To be the most trusted and respected adventure company in the
              Karakoram region, known for exceptional service, environmental
              stewardship, and unforgettable mountain experiences.
            </p>
          </div>
        </div>

        {/* Team Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-ink mb-8">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member) => (
              <div
                key={member.id}
                className="bg-surface rounded-lg border border-border overflow-hidden"
              >
                {member.image && (
                  <div className="h-56 overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-ink mb-1">
                    {member.name}
                  </h3>
                  <p className="text-accent text-sm font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-muted text-sm leading-relaxed mb-3">
                    {member.bio}
                  </p>
                  {member.specialization && (
                    <p className="text-xs text-muted border-t border-border pt-3 mt-3">
                      <span className="font-semibold">Specialization:</span>{" "}
                      {member.specialization}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Values Section */}
        <div className="bg-surface rounded-lg border border-border p-8 mb-16">
          <h2 className="text-2xl font-bold text-ink mb-6">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-accent mb-2">Safety First</h4>
              <p className="text-muted">
                Safety is our top priority. All guides are trained in first aid
                and high-altitude rescue.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-accent mb-2">
                Environmental Responsibility
              </h4>
              <p className="text-muted">
                We practice leave-no-trace principles and support conservation
                efforts.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-accent mb-2">
                Cultural Respect
              </h4>
              <p className="text-muted">
                We celebrate local traditions and ensure fair treatment of
                mountain communities.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-accent mb-2">
                Client Excellence
              </h4>
              <p className="text-muted">
                We're committed to exceeding expectations and creating memories
                that last a lifetime.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Banner — fixed brand green */}
        <div className="bg-cta rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            Ready to Start Your Adventure?
          </h3>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Join us for an unforgettable trekking experience in the mountains of
            Gilgit Baltistan.
          </p>
          {/* Inverse button on CTA banner */}
          <a
            href="/contact"
            className="inline-block px-8 py-3 bg-white text-accent rounded-lg hover:bg-ink transition font-semibold"
          >
            Get in Touch
          </a>
        </div>
      </div>
    </div>
  );
}
