"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import DOMPurify from "dompurify";
import PageTitle from "@/components/shared/PageTitle";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import type { BlogPost } from "@/types";

export default function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const t = useTranslations("blog");
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [slug, setSlug] = useState("");

  useEffect(() => {
    params.then((p) => setSlug(p.slug));
  }, [params]);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/public/blog/${slug}`)
      .then((res) => res.json())
      .then((d) => setPost(d.post ?? null))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <LoadingSpinner />;

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-primary mb-6 hover:underline">
          <ArrowLeft size={16} />
          {t("backToList")}
        </Link>
        <div className="bg-white border border-border rounded-lg p-8 shadow-sm text-center">
          <p className="text-gray-500">{t("notFound")}</p>
        </div>
      </div>
    );
  }

  const cleanContent = DOMPurify.sanitize(post.content);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-primary mb-6 hover:underline">
        <ArrowLeft size={16} />
        {t("backToList")}
      </Link>

      <PageTitle title={post.title} />

      <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
        {post.publishedAt && (
          <span className="flex items-center gap-1">
            <Calendar size={14} />
            {new Date(((post.publishedAt as unknown as Record<string, number>)._seconds ?? (post.publishedAt as unknown as Record<string, number>).seconds) * 1000).toLocaleDateString("tr-TR")}
          </span>
        )}
        {post.tags.length > 0 && (
          <span className="flex items-center gap-1">
            <Tag size={14} />
            {post.tags.join(", ")}
          </span>
        )}
      </div>

      {post.coverImageUrl && (
        <div className="mb-6 rounded-lg overflow-hidden">
          <img src={post.coverImageUrl} alt={post.title} className="w-full h-auto" />
        </div>
      )}

      <div className="bg-white border border-border rounded-lg p-8 shadow-sm">
        <div
          className="rich-content text-gray-600 leading-relaxed prose max-w-none"
          dangerouslySetInnerHTML={{ __html: cleanContent }}
        />
      </div>
    </div>
  );
}
