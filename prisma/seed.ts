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
        },
        {
            name: 'Mouse',
            description: 'The latest mouse',
            categoryId: accessories.id,
            slug: 'mouse',
            image: 'https://i.pinimg.com/736x/49/2f/5a/492f5a4a9a6a9f4a6c0b1b5e45f5b1dc.jpg',
            price: 19900,
            inventory: 10
        },
        {
            name: 'Keyboard',
            description: 'The latest keyboard',
            categoryId: accessories.id,
            slug: 'keyboard',
            image: 'https://i.pinimg.com/736x/5c/5e/1e/5c5e1ecf9c0c7ed9f0c7b13f1e9e9f63.jpg',
            price: 29900,
            inventory: 10
        },
        {
            name: 'Headphones',
            description: 'The latest headphones',
            categoryId: accessories.id,
            slug: 'headphones',
            image: 'https://i.pinimg.com/736x/ab/5a/35/ab5a35e99d0f5c7ad4c7e0f5f5fdcf4a.jpg',
            price: 49900,
            inventory: 10
        },
        {
            name: 'Speaker',
            description: 'The latest speaker',
            categoryId: accessories.id,
            slug: 'speaker',
            image: 'https://i.pinimg.com/736x/da/6b/4d/da6b4dab6f4f4c2c7c3b0b80e4e5cbf9.jpg',
            price: 39900,
            inventory: 10
        },
        {
            name: 'Power Bank',
            description: 'The latest power bank',
            categoryId: accessories.id,
            slug: 'power-bank',
            image: 'https://i.pinimg.com/736x/15/3e/a6/153ea6f6f9f0c7d2b45f2f5e4f4f8b63.jpg',
            price: 29900,
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
