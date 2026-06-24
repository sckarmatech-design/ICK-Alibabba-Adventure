import type { MetaFunction } from "react-router";
import { Breadcrumb } from "~/components/Breadcrumb";
import { SectionTitle } from "~/components/SectionTitle";
import { StatsBar } from "~/components/StatsBar";
import { Users, Target, Heart, Mountain } from "lucide-react";
import { team } from "~/data/team";

export const meta: MetaFunction = () => [
  { title: "About Us | Akhtar Abbasi Hiking" },
  {
    name: "description",
    content:
      "Learn about Akhtar Abbasi Hiking — our mission, vision, experienced guides, and commitment to unforgettable mountain adventures.",
  },
];

export default function About() {
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
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "About" }]} />

        <div className="mt-8 mb-12">
          <SectionTitle
            title="About Akhtar Abbasi Hiking"
            subtitle="Leading adventures in Gilgit Baltistan since the beginning"
            centered={true}
          />
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-white mb-4">Who We Are</h2>
            <p className="text-[#9ca3af] leading-relaxed mb-4">
              Akhtar Abbasi Hiking is a premier adventure company dedicated to
              providing world-class trekking and expedition experiences in Gilgit
              Baltistan. Founded with a passion for the mountains, we've been
              guiding adventurers to some of the world's most spectacular peaks
              and valleys.
            </p>
            <p className="text-[#9ca3af] leading-relaxed mb-4">
              Our team of experienced guides, logistics coordinators, and support
              staff work together to ensure every expedition is safe, memorable,
              and transformative. We believe that mountain adventures aren't just
              about reaching a summit—they're about connecting with nature,
              challenging ourselves, and building lifelong memories.
            </p>
            <p className="text-[#9ca3af] leading-relaxed">
              With deep knowledge of local terrain, weather patterns, and cultural
              traditions, we provide authentic experiences that go beyond standard
              tourism.
            </p>
          </div>

          <div className="relative">
            <img
              src="/images/about/team.webp"
              alt="Our Team"
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
        </div>

        {/* Stats */}
        <StatsBar stats={stats} />

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-16">
          <div className="bg-[#111827] rounded-lg border border-[#1f2937] p-8">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-8 h-8 text-[#16a34a]" />
              <h3 className="text-2xl font-bold text-white">Our Mission</h3>
            </div>
            <p className="text-[#9ca3af] leading-relaxed">
              To provide the highest quality trekking and expedition experiences in
              Gilgit Baltistan while maintaining the safety, well-being, and
              cultural respect of our clients and local communities.
            </p>
          </div>

          <div className="bg-[#111827] rounded-lg border border-[#1f2937] p-8">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-8 h-8 text-[#16a34a]" />
              <h3 className="text-2xl font-bold text-white">Our Vision</h3>
            </div>
            <p className="text-[#9ca3af] leading-relaxed">
              To be the most trusted and respected adventure company in the
              Karakoram region, known for exceptional service, environmental
              stewardship, and unforgettable mountain experiences.
            </p>
          </div>
        </div>

        {/* Team Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member) => (
              <div
                key={member.id}
                className="bg-[#111827] rounded-lg border border-[#1f2937] overflow-hidden"
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
                  <h3 className="text-xl font-semibold text-white mb-1">
                    {member.name}
                  </h3>
                  <p className="text-[#16a34a] text-sm font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-[#9ca3af] text-sm leading-relaxed mb-3">
                    {member.bio}
                  </p>
                  {member.specialization && (
                    <p className="text-xs text-[#9ca3af] border-t border-[#1f2937] pt-3 mt-3">
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
        <div className="bg-[#111827] rounded-lg border border-[#1f2937] p-8 mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-[#16a34a] mb-2">Safety First</h4>
              <p className="text-[#9ca3af]">
                Safety is our top priority. All guides are trained in first aid and
                high-altitude rescue.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-[#16a34a] mb-2">
                Environmental Responsibility
              </h4>
              <p className="text-[#9ca3af]">
                We practice leave-no-trace principles and support conservation
                efforts.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-[#16a34a] mb-2">
                Cultural Respect
              </h4>
              <p className="text-[#9ca3af]">
                We celebrate local traditions and ensure fair treatment of mountain
                communities.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-[#16a34a] mb-2">
                Client Excellence
              </h4>
              <p className="text-[#9ca3af]">
                We're committed to exceeding expectations and creating memories
                that last a lifetime.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-[#16a34a] rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            Ready to Start Your Adventure?
          </h3>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Join us for an unforgettable trekking experience in the mountains of
            Gilgit Baltistan.
          </p>
          <a
            href="/contact"
            className="inline-block px-8 py-3 bg-white text-[#16a34a] rounded-lg hover:bg-[#f9fafb] transition font-semibold"
          >
            Get in Touch
          </a>
        </div>
      </div>
    </div>
  );
}
