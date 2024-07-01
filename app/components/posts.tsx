import Link from 'next/link'
import { formatDate } from 'app/components/utils'

interface BlogPostsProps {
  posts: {
    id: any;
    title: any;
    published_at: any;
  }[];
}

export function BlogPosts({ posts }: BlogPostsProps) {

  return (
    <div>
      {posts
        .map((post) => (
          <Link
            key={post.id}
            className="flex flex-col space-y-1 mb-4"
            href={`/blog/${post.id}`}
          >
            <div className="w-full flex flex-col md:flex-row space-x-0 md:space-x-2">
              <p className="text-neutral-600 dark:text-neutral-400 tabular-nums">
                {formatDate(post.published_at)}
              </p>
              <p className="text-neutral-900 dark:text-neutral-100 tracking-tight">
                {post.title}
              </p>
            </div>
          </Link>
        ))}
    </div>
  )
}
