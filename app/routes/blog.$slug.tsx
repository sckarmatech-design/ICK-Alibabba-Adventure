import { useLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import type { MetaFunction } from "react-router";
import { useState, useEffect } from "react";
import { Play } from "lucide-react";
import { Breadcrumb } from "~/components/Breadcrumb";
import prisma from "~/lib/prisma.server";
import { mapBlogPostFromPrisma } from "~/lib/mappers";
import type { BlogPost } from "~/data/blog-posts";
import { generateMetaTags, SITE_CONFIG } from "~/lib/seo";

export async function loader({ params }: LoaderFunctionArgs) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
  });
  if (!post) throw new Response("Not Found", { status: 404 });
  return mapBlogPostFromPrisma(post);
}

export const meta: MetaFunction = ({ loaderData }) => {
  const post = loaderData as BlogPost | undefined;
  if (!post) return [];
  return [
    ...generateMetaTags({
      title: `${post.title} | Akhtar Abbasi Hiking`,
      description: post.excerpt,
      image:
        post.image || "https://akhtarabbasi-hiking.com/images/og/blog.webp",
      url: `${SITE_CONFIG.url}/blog/${post.slug}`,
      type: "article",
      author: post.author,
      publishedDate: post.date,
    }),
    {
      name: "keywords",
      content: `${post.title}, ${post.category}, trekking tips, hiking guide`,
    },
  ];
};

export default function BlogPost() {
  const post = useLoaderData<typeof loader>();
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    setCurrentUrl(currentUrl);
  }, []);

  return (
    <div>
      {/* Hero */}
      <div className="relative w-full h-96 md:h-[500px] overflow-hidden rounded-lg mb-8">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        {/* Dark image overlay — not a theme color */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8">
          {/* text-white on dark image overlay stays */}
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
        <div className="flex gap-4 text-muted text-sm my-6">
          <span>{post.date}</span>
          <span>•</span>
          <span>By {post.author}</span>
          <span>•</span>
          <span>{post.readingTime} min read</span>
          <span>•</span>
          <span className="text-accent">{post.category}</span>
        </div>

        {/* Article Body */}
        <div className="prose prose-invert max-w-none">
          <div
            dangerouslySetInnerHTML={{ __html: post.content }}
            className="space-y-4 text-muted leading-relaxed"
          >
            {/* Content rendered as HTML */}
          </div>
        </div>

        {/* Article Content as Text */}
        <div className="space-y-4 text-muted leading-relaxed mt-8">
          {post.content.split("\n\n").map((paragraph, index) => {
            if (paragraph.startsWith("##")) {
              return (
                <h3
                  key={index}
                  className="text-xl md:text-2xl font-bold text-ink mt-8 mb-4"
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

        {/* Video */}
        {post.videoUrl && (
          <div className="mt-12">
            <h4 className="text-ink font-semibold mb-4">Watch the video</h4>
            <a
              href={post.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-video block rounded-lg overflow-hidden group bg-surface"
            >
              <img
                src={post.image || "/images/video-placeholder.jpg"}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition">
                <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center pl-1">
                  <Play className="w-7 h-7 text-gray-900 fill-current" />
                </div>
              </div>
            </a>
          </div>
        )}

        {/* Social Share */}
        <div className="mt-12 pt-8 border-t border-border">
          <h4 className="text-ink font-semibold mb-4">Share this article</h4>
          <div className="flex gap-4">
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-surface text-ink rounded border border-border hover:bg-accent hover:text-white transition"
            >
              Facebook
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${currentUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-surface text-ink rounded border border-border hover:bg-accent hover:text-white transition"
            >
              Twitter
            </a>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(post.title + " " + currentUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-surface text-ink rounded border border-border hover:bg-accent hover:text-white transition"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
