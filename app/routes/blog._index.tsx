import type { MetaFunction } from "react-router";
import { Breadcrumb } from "~/components/Breadcrumb";
import { SectionTitle } from "~/components/SectionTitle";
import { blogPosts } from "~/data/blog-posts";
import { generateMetaTags, SITE_CONFIG } from "~/lib/seo";

export const meta: MetaFunction = () => [
  ...generateMetaTags({
    title: "Blog | Akhtar Abbasi Hiking",
    description:
      "Stories from the trail, trekking tips, and travel guides from our mountain adventures.",
    image: "https://akhtarabbasi-hiking.com/images/og/blog.webp",
    url: `${SITE_CONFIG.url}/blog`,
  }),
  {
    name: "keywords",
    content: "trekking blog, hiking tips, adventure guides, mountain stories, travel tips",
  },
];

type BlogCategory = "Trekking" | "Expeditions" | "Travel Tips" | "Culture";

export default function BlogIndex() {
  const categories: BlogCategory[] = ["Trekking", "Expeditions", "Travel Tips", "Culture"];

  return (
    <div>
      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <Breadcrumb
          items={[{ label: "Home", href: "/" }, { label: "Blog" }]}
        />

        <div className="mt-8 mb-12">
          <SectionTitle
            title="Stories from the Trail"
            subtitle="Tips, guides, and adventures from our mountain expeditions"
            centered={true}
          />
        </div>

        {/* All Posts */}
        <div className="space-y-12">
          {categories.map((category) => {
            const categoryPosts = blogPosts.filter(
              (post) => post.category === category
            );

            if (categoryPosts.length === 0) return null;

            return (
              <div key={category}>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                  {category}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryPosts.map((post) => (
                    <a
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="group bg-[#111827] rounded-lg border border-[#1f2937] overflow-hidden hover:border-[#16a34a] transition"
                    >
                      <div className="h-48 overflow-hidden">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs text-[#16a34a] font-medium">
                            {post.date}
                          </p>
                          <p className="text-xs text-[#9ca3af]">
                            {post.readingTime} min read
                          </p>
                        </div>
                        <h3 className="font-semibold text-[#f9fafb] mb-2 line-clamp-2 group-hover:text-[#16a34a] transition">
                          {post.title}
                        </h3>
                        <p className="text-sm text-[#9ca3af] line-clamp-2">
                          {post.excerpt}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
