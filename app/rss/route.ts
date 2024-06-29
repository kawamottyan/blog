import { baseUrl } from 'app/lib/config';
import { supabase } from 'app/lib/supabase';
import { notFound } from 'next/navigation';

export async function GET() {
  let { data: posts, error } = await supabase
  .from('posts')
  .select('id, title, published_at, summary');

  if (error) {
    console.error(error);
    return [];
  }

  if (!posts) {
    notFound()
  }

  const itemsXml = posts
    .map(
      (post) =>
        `<item>
          <title>${post.title}</title>
          <link>${baseUrl}/blog/${post.id}</link>
          <description>${post.summary || ''}</description>
          <pubDate>${new Date(
            post.published_at
          ).toUTCString()}</pubDate>
        </item>`
    )
    .join('\n')

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
        <title>My Portfolio</title>
        <link>${baseUrl}</link>
        <description>This is my portfolio RSS feed</description>
        ${itemsXml}
    </channel>
  </rss>`

  return new Response(rssFeed, {
    headers: {
      'Content-Type': 'text/xml',
    },
  })
}
