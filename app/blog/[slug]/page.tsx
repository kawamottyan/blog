import { notFound } from 'next/navigation'
import { CustomMDX } from 'app/components/mdx'
import { formatDate } from 'app/blog/utils'
import { getBlogPosts } from 'app/action/getPost'

const baseUrl = 'https://www.kawamottyan.com'

async function fetchPostBySlug(slug) {
  let posts = await getBlogPosts();
  if (!posts) {
    return null;
  }
  return posts.find((post) => post.slug === slug);
}

export async function generateStaticParams() {
  let posts = await getBlogPosts();
  if (!posts) {
    return [];
  }
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  let post = await fetchPostBySlug(params.slug);
  if (!post) {
    return;
  }
  let { title, published_at: publishedTime, summary: description, image } = post;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime,
      url: `${baseUrl}/blog/${post.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function Blog({ params }) {
  let posts = await getBlogPosts();
  if (!posts) {
    notFound();
    return;
  }
  let post = posts.find((post) => post.slug === params.slug);

  if (!post) {
    notFound();
    return;
  }

  const { title, published_at, summary, image } = post;
  if (!title || !published_at || !summary) {
    notFound();
    return;
  }

  return (
    <section>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: title,
            datePublished: published_at,
            dateModified: published_at,
            description: summary,
            image: image ? `${baseUrl}${image}` : `/og?title=${encodeURIComponent(title)}`,
            url: `${baseUrl}/blog/${post.slug}`,
            author: {
              '@type': 'Person',
              name: 'My Portfolio',
            },
          }),
        }}
      />
      <h1 className="title font-semibold text-2xl tracking-tighter">
        {title}
      </h1>
      <div className="flex justify-between items-center mt-2 mb-8 text-sm">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {formatDate(published_at)}
        </p>
      </div>
      <article className="prose">
        <CustomMDX source={post.content} />
      </article>
    </section>
  )
}