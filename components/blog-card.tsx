import Link from "next/link";
import Image from "next/image";

export function BlogCard({ post }: { post: any }) {
  return (
    <div className="rounded-2xl shadow-md border border-gray-200 hover:shadow-xl transition p-4 bg-white dark:bg-neutral-900">
      <Image
        src={post.image}
        alt={post.title}
        width={400}
        height={250}
        className="rounded-xl mb-4 w-full object-cover h-52"
      />
      <h2 className="text-lg font-semibold mb-2 hover:text-blue-600">
        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
      </h2>
      <p className="text-sm text-gray-500 mb-3">
        {post.date} – {post.author}
      </p>
      <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-3 mb-3">
        {post.excerpt}
      </p>
      <Link
        href={`/blog/${post.slug}`}
        className="text-blue-600 text-sm font-medium hover:underline"
      >
        Đọc thêm →
      </Link>
    </div>
  );
}
