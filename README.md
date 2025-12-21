# 🍎 Ecommerce Apple Store – Next.js

## 📌 Overview

**Ecommerce Apple Store** is a full-stack e-commerce web application inspired by the Apple Store experience.  
The project is built with **Next.js (App Router)** and includes advanced features such as an **AI-powered chatbot**, **admin dashboard**, and **cloud-based image management**.

This project demonstrates modern full-stack development skills, scalable architecture, and real-world e-commerce workflows.
This project is **built for learning and educational purposes**,
---

## 🚀 Tech Stack

### Frontend
- **Next.js (App Router)**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** (modern UI components)
- **Zustand / Context API** (state management)

### Backend
- **Node.js**
- **REST API**
- **Next.js Server Actions / API Routes**

### Services & Tools
- **AI Chatbot** (LLM-powered assistant for user support)
- **Cloudinary** (image upload & media management)
- **Stripe** (payment integration – optional)
- **Prisma + PostgreSQL** (database – optional)
- **Authentication** (optional)

---
## ✨ Features

### User Features
- Apple product listing & detail pages
- Shopping cart management
- Order total calculation
- Checkout flow
- AI-powered chatbot for product support and Q&A
- Responsive UI (desktop & mobile)
- SEO-optimized pages

### Admin Features
- Admin dashboard for product management
- Create / update / delete products
- Upload and manage product images via Cloudinary
- Order & content management

---

## ⚙️ Installation & Setup
### 1️⃣ Clone the repository
```bash
git clone https://github.com/thoangne/Ecommerce-applestore-nextjs.git
cd Ecommerce-applestore-nextjs
```
### 2️⃣ Install dependencies 
```bash
npm i
```
### 2️⃣ Environment Variables
Create a .env.local file:
```bash
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/applestore

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# AI
OPENAI_API_KEY=        # optional (if using OpenAI)
OLLAMA_BASE_URL=http://localhost:11434

# Qdrant
QDRANT_URL=http://localhost:6333
```
### 🐳 Run Infrastructure with Docker
### 3️⃣ Start PostgreSQL (Database)
```bash
docker run -d \
  --name applestore-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=applestore \
  -p 5432:5432 \
  postgres:15
  ```
  ### 4️⃣ Start Qdrant (Vector Database)

  ```bash
  docker run -d \
  --name applestore-qdrant \
  -p 6333:6333 \
  -p 6334:6334 \
  qdrant/qdrant
  ```
  ### 5️⃣ Install Ollama 
  👉 https://ollama.com/download 

  ### 6️⃣ Pull & Run LLM Model 
  ```bash
    ollama pull llama3
  ```  
  ### 🗄️ Database Migration & Seeding
   ### 7️⃣ Install dependencies
 ```bash
 npm install
 ``` 
 ### 8️⃣ Run Prisma migration
 ```bash
npx prisma migrate dev 
 ```  
 ### 9️⃣ Seed the database
 ```bash
 npx prisma db seed
 ``` 
  ### ▶️ Run the Application
  ### 1️⃣0️⃣ Start development server
    ```bash
    npm run dev  
    ``` 

  ### 🏠 Homepage
![Homepage](public/picture/screenshots/Home%20-%201.png)


### 📱 Product Listing
![Product Listing](public/picture/screenshots/products-details.png)

### 📦 Product Cart
![Product Detail](public/picture/screenshots/shopping-cart.png)


### 🧑‍💼 Admin Dashboard
![Admin Dashboard](public/picture/screenshots/admin-panel.png)

### Sign in
![AI Chatbot](public/picture/screenshots/sign-in.png)
