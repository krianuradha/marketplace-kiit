# Hostel Marketplace Platform

A modern, full-stack marketplace application built specifically for university hostel residents to buy, sell, and exchange items safely within their community. 

## 🚀 Key Features

- **Secure Authentication:** Integrated dual-auth system supporting both email/password (custom JWT implementation) and Google OAuth (NextAuth).
- **Gender-Specific Marketplaces (Hostel Segregation):** The platform strictly segments users based on their hostel type to ensure privacy and comfort.
  - **Queen's Castle:** Exclusive marketplace for the girls' hostel.
  - **King Palace:** Exclusive marketplace for the boys' hostel.
  *Note: Users can only view, list, and interact with products and sellers within their designated section.*
- **Product Management:** Complete CRUD functionality for product listings, including categorization, pricing, and condition details.
- **Communication:** Built-in messaging system enabling direct communication between buyers and sellers without leaving the platform.
- **Trust & Safety:** Comprehensive seller profile system with ratings and reviews to build community trust.
- **Premium UI/UX:** Responsive, accessible interface featuring custom Neumorphic design elements, dark mode support, and smooth micro-interactions.

## 💻 Tech Stack

- **Frontend:** Next.js 16 (App Router), React, TypeScript
- **Styling:** Tailwind CSS v4, Radix UI Primitives, Custom Neumorphic CSS
- **Backend:** Next.js Route Handlers (Serverless API)
- **Database:** PostgreSQL (Neon Serverless)
- **ORM:** Drizzle ORM
- **Authentication:** NextAuth.js & `jose` (JWT)
- **Deployment:** Vercel (Standalone Mode)

## 🏗️ Architecture Highlights

- **Serverless First:** Designed to run efficiently on Vercel's serverless infrastructure.
- **Optimized Data Fetching:** Utilizes Next.js server components and API routes for secure, fast data retrieval.
- **Stateless Communication:** Implemented a robust HTTP polling mechanism for chat to ensure seamless compatibility with serverless environments where WebSockets are restricted.
- **Type Safety:** End-to-end type safety with TypeScript and Zod validation schemas for all API inputs and database models.

## 🛠️ Local Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd marketplace-web-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory and add the necessary configuration. (Refer to `.env.example` for the required structure).

4. **Initialize the Database**
   Push the schema to your PostgreSQL database:
   ```bash
   npm run db:push
   ```

5. **Start the Development Server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.
