import { BlogPosts } from 'app/components/posts'
import { supabase } from 'app/lib/supabase';
import { notFound } from 'next/navigation';

export const metadata = {
  title: 'Blog',
  description: 'Read my blog.',
}

export default async function Page() {
  let today = new Date();

  let { data: posts, error } = await supabase
  .from('posts')
  .select('id, title, published_at')
  .not('published_at', 'is', null)
  .lte('published_at', today.toISOString())
  .order('published_at', { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  if (!posts || posts.length === 0) {
    notFound();
    return;
  }

  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">My Blog</h1>
      <BlogPosts posts={posts}/>
    </section>
  )
}
