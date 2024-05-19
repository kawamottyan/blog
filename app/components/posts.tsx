'use client';

import { getBlogPosts } from 'app/action/getPost';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { SafeBlog } from 'app/types';
import { formatDate } from 'app/blog/utils';

export function BlogPosts() {
  const [blogs, setBlogs] = useState<SafeBlog[]>([]);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const blogPosts = await getBlogPosts();
        if (blogPosts) {
          setBlogs(blogPosts.map(post => ({
            id: post.id,
            title: post.title,
            published_at: new Date(post.published_at),
            summary: post.summary,
            content: post.content,
            slug: post.slug,
            image: post.image,
            language: post.language,
            category: post.category,
          })));
        } else {
          setBlogs([]);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    }
    fetchBlogs();
  }, []);

  return (
    <div>
      {blogs
        .sort((a, b) => new Date(a.published_at) > new Date(b.published_at) ? -1 : 1)
        .map((post) => (
          <Link
            key={post.slug}
            className="flex flex-col space-y-1 mb-4"
            href={`/blog/${post.slug}`}
          >
            <div className="w-full flex flex-col md:flex-row space-x-0 md:space-x-2">
              <p className="text-neutral-600 dark:text-neutral-400 w-[100px] tabular-nums">
                {formatDate(post.published_at.toISOString())}
              </p>
              <p className="text-neutral-900 dark:text-neutral-100 tracking-tight">
                {post.title}
              </p>
            </div>
          </Link>
        ))}
    </div>
  );
}