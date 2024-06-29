import { baseUrl } from 'app/lib/config';
import { supabase } from 'app/lib/supabase';

export async function GET() {
  let today = new Date();

  let { data: posts, error } = await supabase
  .from('posts')
  .select('id, title, summary, published_at')
  .not('published_at', 'is', null)
  .lte('published_at', today.toISOString())
  .order('published_at', { ascending: false });

  if (error) {
    console.error(error);
    return ;
  }

  if (!posts) {
    return
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
