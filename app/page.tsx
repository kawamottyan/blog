import { BlogPosts } from 'app/components/posts'
import { supabase } from './lib/supabase'
import { notFound } from 'next/navigation';

export default async function Page() {

  let today = new Date();

  let { data: posts, error } = await supabase
  .from('posts')
  .select('id, title, published_at')
  .not('published_at', 'is', null)
  .lte('published_at', today.toISOString())
  .order('published_at', { ascending: false })
  .limit(5);

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
      <h1 className="mb-4 text-2xl font-semibold tracking-tighter">
        Masato Kawamoto
      </h1>
      <p className="mb-4">
        {`data scientist / music producer based in tokyo`}
      </p>
      <div className="my-8">
        <BlogPosts posts={posts} />
      </div>
    </section>
  )
}
