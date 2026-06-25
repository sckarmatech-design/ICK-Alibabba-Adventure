import { useLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "@react-router/dev/routes";
import type { MetaFunction } from "react-router";
import { Breadcrumb } from "~/components/Breadcrumb";
import { blogPosts } from "~/data/blog-posts";
import { generateMetaTags, SITE_CONFIG } from "~/lib/seo";

export async function loader({ params }: LoaderFunctionArgs) {
  const post = blogPosts.find((p) => p.slug === params.slug);
  if (!post) throw new Response("Not Found", { status: 404 });
  return post;
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) return [];
  return [
    ...generateMetaTags({
      title: `${data.title} | Akhtar Abbasi Hiking`,
      description: data.excerpt,
      image: data.image || "https://akhtarabbasi-hiking.com/images/og/blog.webp",
      url: `${SITE_CONFIG.url}/blog/${data.slug}`,
      type: "article",
      author: data.author,
      publishedDate: data.date,
    }),
    {
      name: "keywords",
      content: `${data.title}, ${data.category}, trekking tips, hiking guide`,
    },
  ];
};

export default function BlogPost() {
  const post = useLoaderData<typeof loader>();

  return (
    <div>
      {/* Hero */}
      <div className="relative w-full h-96 md:h-[500px] overflow-hidden rounded-lg mb-8">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            {post.title}
          </h1>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Blog", href: "/blog" },
            { label: post.title },
          ]}
        />

        {/* Meta Info */}
        <div className="flex gap-4 text-[#9ca3af] text-sm my-6">
          <span>{post.date}</span>
          <span>•</span>
          <span>By {post.author}</span>
          <span>•</span>
          <span>{post.readingTime} min read</span>
          <span>•</span>
          <span className="text-[#16a34a]">{post.category}</span>
        </div>

        {/* Article Body */}
        <div className="prose prose-invert max-w-none">
          <div
            dangerouslySetInnerHTML={{ __html: post.content }}
            className="space-y-4 text-[#9ca3af] leading-relaxed"
          >
            {/* Content rendered as HTML */}
          </div>
        </div>

        {/* Article Content as Text (since we don't have HTML parser) */}
        <div className="space-y-4 text-[#9ca3af] leading-relaxed mt-8">
          {post.content.split("\n\n").map((paragraph, index) => {
            if (paragraph.startsWith("##")) {
              return (
                <h3
                  key={index}
                  className="text-xl md:text-2xl font-bold text-white mt-8 mb-4"
                >
                  {paragraph.replace(/^#+\s*/, "")}
                </h3>
              );
            }
            if (paragraph.startsWith("-")) {
              return (
                <ul key={index} className="list-disc list-inside space-y-2">
                  {paragraph
                    .split("\n")
                    .filter((l) => l.startsWith("-"))
                    .map((line, i) => (
                      <li key={i}>{line.replace(/^-\s*/, "")}</li>
                    ))}
                </ul>
              );
            }
            return (
              <p key={index} className="text-base md:text-lg">
                {paragraph}
              </p>
            );
          })}
        </div>

        {/* Social Share */}
        <div className="mt-12 pt-8 border-t border-[#1f2937]">
          <h4 className="text-white font-semibold mb-4">Share this article</h4>
          <div className="flex gap-4">
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[#1f2937] text-white rounded hover:bg-[#16a34a] transition"
            >
              Facebook
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${window.location.href}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[#1f2937] text-white rounded hover:bg-[#16a34a] transition"
            >
              Twitter
            </a>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(post.title + " " + window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[#1f2937] text-white rounded hover:bg-[#16a34a] transition"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
