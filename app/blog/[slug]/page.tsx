import { notFound } from 'next/navigation'
import { CustomMDX } from 'app/components/mdx'
import { formatDate } from 'app/components/utils'
import { supabase } from 'app/lib/supabase'
import { baseUrl } from 'app/lib/config';

export async function generateStaticParams() {
  let { data: posts, error } = await supabase
  .from('posts')
  .select('*');

  if (error) {
    console.error(error);
    return [];
  }

  if (!posts) {
    notFound()
  }

  return posts.map(post => ({
    id: post.id,
  }));
}

export async function generateMetadata({ params }) {
  let { data: posts, error } = await supabase
  .from('posts')
  .select('id, title, summary, published_at')
  .eq("id", params.slug);

  if (error) {
    console.error(error);
    return [];
  }

  if (!posts || posts.length === 0) {
    notFound();
    return;
  }

  const { id, title, summary, published_at } = posts[0];

  return {
    title,
    summary,
    openGraph: {
      title,
      summary,
      type: 'article',
      published_at,
      url: `${baseUrl}/blog/${id}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      summary,
    },
  }
}

export default async function Blog({ params }) {
  let { data: posts, error } = await supabase
  .from('posts')
  .select('id, title, summary, content, published_at')
  .eq("id", params.slug);

  if (error) {
    console.error(error);
    return [];
  }

  if (!posts || posts.length === 0) {
    notFound();
    return;
  }

  const { id, title, summary, content, published_at } = posts[0];

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
            url: `${baseUrl}/blog/${id}`,
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
        <CustomMDX source={content} />
      </article>
    </section>
  )
}
