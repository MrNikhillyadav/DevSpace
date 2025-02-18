import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

async function main() {
  // Get all posts that don't have a slug
  const posts = await prisma.post.findMany({
    where: {
      slug: null
    }
  });

  // Update each post with a unique slug
  for (const post of posts) {
    let baseSlug = generateSlug(post.title);
    let finalSlug = baseSlug;
    let counter = 1;

    // Keep trying until we find a unique slug
    while (true) {
      const existingPost = await prisma.post.findUnique({
        where: { slug: finalSlug },
      });

      if (!existingPost) break;

      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    await prisma.post.update({
      where: { id: post.id },
      data: { slug: finalSlug },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });