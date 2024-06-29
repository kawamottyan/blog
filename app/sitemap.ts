import { baseUrl } from './lib/config';
import { supabase } from './lib/supabase';
import { notFound } from 'next/navigation';



export default async function sitemap() {
  let today = new Date();

  let { data: posts, error } = await supabase
  .from('posts')
  .select('id, title, summary, published_at')
  .not('published_at', 'is', null)
  .lte('published_at', today.toISOString())
  .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }

  if (!posts) {
    notFound()
  }

  let blogs = posts.map(post => ({
    url: `${baseUrl}/blog/${post.id}`,
    lastModified: post.published_at,
  }));

  let routes = ['', '/blog'].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }));

  return [...routes, ...blogs]
}
