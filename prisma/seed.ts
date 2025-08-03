import { Product } from '@prisma/client';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


async function main() {
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();


    const eletronics = await prisma.category.create({
        data: {
            name: 'Eletronics',
            slug: 'eletronics'
        }
    })
    
    const furniture = await prisma.category.create({
        data: {
            name: 'Furniture',
            slug: 'furniture'
        }
    })
    const accessories = await prisma.category.create({
        data: {
            name: 'Accessories',
            slug: 'accessories'
        }
    })
    const apple = await prisma.category.create({
        data: {
            name: 'Apple',
            slug: 'apple'
        }
    })
    const products: Omit<Product, 'id'>[] = [
        {
            name: 'iPhone 13',
            description: 'The latest iPhone',
            categoryId: apple.id,
            slug: 'iphone-13',
            image: 'https://i.pinimg.com/736x/8b/bc/f6/8bbcf6aa7cb7222f77bd9ddaf6d0e95a.jpg',
            price: 99900,
            inventory: 10
        },
        {
            name: 'MacBook Air',
            description: 'The latest MacBook Air',
            categoryId: apple.id,
            slug: 'macbook-air',
            image: 'https://i.pinimg.com/1200x/63/2e/3d/632e3df5cbf9082d7bebfbbb18c69be9.jpg',
            price: 129900,
            inventory: 5
        },
        {
            name: 'Apple Watch',
            description: 'The latest Apple Watch',
            categoryId: apple.id,
            slug: 'apple-watch',
            image: 'https://i.pinimg.com/736x/5b/c5/9f/5bc59f3488e344d2e272dd00181cda0f.jpg',
            price: 39900,
            inventory: 10
        },
        {
            name: 'Apple Pencil',
            description: 'The latest Apple Pencil',
            categoryId: apple.id,
            slug: 'apple-pencil',
            image: 'https://i.pinimg.com/736x/59/5a/40/595a4083d18ee46baff2e2edaa85e778.jpg',
            price: 12900,
            inventory: 10
        },
        {
            name: 'Apple AirPods',
            description: 'The latest Apple AirPods',
            categoryId: apple.id,
            slug: 'airpods',
            image: 'https://i.pinimg.com/736x/c6/cd/4c/c6cd4c602f2b23e28e1707cecc60e92c.jpg',
            price: 19900,
            inventory: 10
        },
        {
            name: 'Samsung TV',
            description: 'The latest Samsung TV',
            categoryId: eletronics.id,
            slug: 'samsung-tv',
            image: 'https://i.pinimg.com/736x/58/7b/c2/587bc2e59610d9c6cdd29e3e51d046ad.jpg',
            price: 79900,
            inventory: 10
        },
        {
            name: 'Sony TV',
            description: 'The latest Sony TV',
            categoryId: eletronics.id,
            slug: 'sony-tv',
            image: 'https://i.pinimg.com/1200x/74/e5/24/74e52424f03fc9ddff44f1c2ce04dfb6.jpg',
            price: 74900,
            inventory: 5
        },
        {
            name: 'LG TV',
            description: 'The latest LG TV',
            categoryId: eletronics.id,
            slug: 'lg-tv',
            image: 'https://i.pinimg.com/736x/c6/d6/d0/c6d6d07259aeffe54ecb27dfac5f90e8.jpg',
            price: 69900,
            inventory: 10
        },
        {
            name: 'Chair',
            description: 'The latest chair',
            categoryId: furniture.id,
            slug: 'chair',
            image: 'https://i.pinimg.com/736x/c0/e5/5e/c0e55e0468942918429d5ef7de80adda.jpg',
            price: 69900,
            inventory: 10
        },
        {
            name: 'Table',
            description: 'The latest table',
            categoryId: furniture.id,
            slug: 'table',
            image: 'https://i.pinimg.com/736x/0b/6b/df/0b6bdf667bc93e7f2fbdb52ba24bb212.jpg',
            price: 69900,
            inventory: 10
        }
    ];

    await prisma.product.createMany({
        data: products
    })




}



main()
    .then(async () => {
      console.log(`Data has been seeded!`);
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
