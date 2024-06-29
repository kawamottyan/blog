import { baseUrl } from './lib/config';
import { supabase } from './lib/supabase';
import { notFound } from 'next/navigation';



export default async function sitemap() {

  let { data: posts, error } = await supabase
    .from('posts')
    .select('id, title, published_at');

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
