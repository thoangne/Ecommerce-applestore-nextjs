import Image from "next/image";

const blogPosts: any = {
  "trai-nghiem-iphone-16-pro": {
    title: "Trải nghiệm iPhone 16 Pro – đỉnh cao thiết kế và hiệu năng",
    image: "/images/blog/iphone16pro.jpg",
    content: `
      iPhone 16 Pro mang đến một trải nghiệm hoàn toàn mới nhờ chip A18 Bionic,
      thiết kế khung titan nhẹ hơn, cùng camera tele 5x ấn tượng.
      ...
      Với sự kết hợp giữa hiệu năng, độ bền và hệ sinh thái Apple, đây là lựa chọn hoàn hảo cho người dùng cao cấp.
    `,
  },
};

export default function BlogDetail({ params }: { params: { slug: string } }) {
  const post = blogPosts[params.slug];

  if (!post)
    return (
      <div className="text-center mt-20 text-gray-500">
        Bài viết không tồn tại.
      </div>
    );

  return (
    <main className="container mx-auto px-6 py-10 max-w-3xl">
      <Image
        src={post.image}
        alt={post.title}
        width={800}
        height={400}
        className="rounded-2xl mb-6"
      />
      <h1 className="text-3xl font-bold mb-6">{post.title}</h1>
      <article className="prose dark:prose-invert leading-relaxed">
        {post.content}
      </article>
    </main>
  );
}
