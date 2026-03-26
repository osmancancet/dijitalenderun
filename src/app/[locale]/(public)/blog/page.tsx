"use client";

import { useCollection } from "@/hooks/useCollection";
import { Link } from "@/i18n/navigation";
import PageTitle from "@/components/shared/PageTitle";
import EmptyState from "@/components/shared/EmptyState";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Calendar, Tag, ArrowRight } from "lucide-react";
import type { BlogPost } from "@/types";

export default function BlogPage() {
  const { items, loading } = useCollection<BlogPost>("blog");
  const posts = items.filter((p) => p.isPublished);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <PageTitle title="Blog & Duyurular" subtitle="Güncel haberler, duyurular ve makaleler" />

      {posts.length === 0 ? (
        <EmptyState description="Henüz blog yazısı eklenmemiş." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <article key={post.id} className="bg-white border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
              {post.coverImageUrl ? (
                <div className="h-48 bg-gray-100 overflow-hidden">
                  <img src={post.coverImageUrl} alt={post.title} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="h-48 bg-gradient-to-br from-primary/80 to-primary-dark flex items-center justify-center">
                  <span className="text-white/30 text-6xl font-bold">DE</span>
                </div>
              )}

              <div className="p-5">
                <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
                  {post.publishedAt && (
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(post.publishedAt.seconds * 1000).toLocaleDateString("tr-TR")}
                    </span>
                  )}
                  {post.tags.length > 0 && (
                    <span className="flex items-center gap-1">
                      <Tag size={12} />
                      {post.tags.join(", ")}
                    </span>
                  )}
                </div>

                <h2 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">
                  {post.title}
                </h2>

                <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                  {post.excerpt}
                </p>

                <Link
                  href={`/blog/${post.slug}`}
                  className="text-sm text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all"
                >
                  Devamını Oku <ArrowRight size={14} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
