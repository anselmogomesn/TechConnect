"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { blogPosts } from "@/data/blog";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { formatDate } from "@/lib/utils";

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <SiteLayout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <span className="text-6xl block mb-4">📝</span>
            <h1 className="font-poppins font-bold text-2xl text-gray-400 mb-2">Artigo não encontrado</h1>
            <p className="text-gray-400 mb-6">O artigo que você procura não está disponível.</p>
            <Link href="/blog" className="btn btn-primary">Ver Blog</Link>
          </div>
        </div>
      </SiteLayout>
    );
  }

  const related = blogPosts.filter((p) => p.category === post.category && p.id !== post.id).slice(0, 3);

  return (
    <SiteLayout>
      <article className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] text-white">
          <div className="container-site py-20 md:py-28">
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex items-center justify-center gap-3 text-sm text-[#A5D6A7] mb-4">
                <span className="px-3 py-1 bg-white/10 rounded-full text-xs">{post.category}</span>
                <span>{formatDate(post.date)}</span>
                <span>{post.readTime} de leitura</span>
              </div>
              <h1 className="font-poppins font-bold text-3xl md:text-4xl lg:text-5xl text-white leading-tight mb-4">
                {post.title}
              </h1>
              <p className="text-lg text-[#A5D6A7] max-w-xl mx-auto">{post.excerpt}</p>
              <div className="flex items-center justify-center gap-3 mt-8">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-lg font-bold">
                  {post.author.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="text-left">
                  <p className="font-medium text-sm">{post.author}</p>
                  <p className="text-xs text-[#A5D6A7]">{post.authorRole}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container-site py-12">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl p-6 md:p-10 shadow-card">
              <div className="aspect-video rounded-xl bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] flex items-center justify-center mb-8">
                <span className="text-6xl">📝</span>
              </div>

              <div className="prose prose-green max-w-none">
                {post.content.split("\n").map((line, i) => {
                  if (line.startsWith("## ")) {
                    return <h2 key={i} className="font-poppins font-bold text-xl text-[#212121] mt-8 mb-3">{line.replace("## ", "")}</h2>;
                  }
                  if (line.startsWith("- ")) {
                    return <li key={i} className="text-gray-600 ml-4 mb-1">{line.replace("- ", "")}</li>;
                  }
                  if (line.trim() === "") return <br key={i} />;
                  return <p key={i} className="text-gray-600 leading-relaxed mb-4">{line}</p>;
                })}
              </div>

              <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-gray-100">
                {post.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Author Card */}
            <div className="bg-white rounded-2xl p-6 shadow-card mt-6 flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#1B5E20] text-white flex items-center justify-center text-xl font-bold shrink-0">
                {post.author.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <h3 className="font-poppins font-bold text-[#212121]">{post.author}</h3>
                <p className="text-sm text-gray-500">{post.authorRole}</p>
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-2xl p-6 shadow-card mt-6">
              <h3 className="font-poppins font-bold text-lg text-[#212121] mb-4">
                Comentários ({post.comments.length})
              </h3>
              {post.comments.length > 0 ? (
                <div className="space-y-4">
                  {post.comments.filter(c => c.approved).map((comment) => (
                    <div key={comment.id} className="pb-4 border-b border-gray-100 last:border-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                          {comment.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#212121]">{comment.name}</p>
                          <p className="text-xs text-gray-400">{formatDate(comment.date)}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{comment.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400">Seja o primeiro a comentar!</p>
              )}
            </div>

            {/* Related Posts */}
            {related.length > 0 && (
              <div className="mt-12">
                <h2 className="font-poppins font-bold text-xl text-[#212121] mb-6">Artigos Relacionados</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {related.map((p) => (
                    <Link key={p.id} href={`/blog/${p.slug}`} className="group">
                      <div className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
                        <div className="aspect-video bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] flex items-center justify-center">
                          <span className="text-4xl">📝</span>
                        </div>
                        <div className="p-4">
                          <h3 className="font-poppins font-semibold text-sm text-[#212121] group-hover:text-[#1B5E20] line-clamp-2">{p.title}</h3>
                          <p className="text-xs text-gray-400 mt-2">{formatDate(p.date)}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </article>
    </SiteLayout>
  );
}
