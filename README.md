# Sports Shop Inventory Management System (v2)

A comprehensive inventory management solution built with modern web technologies, designed to streamline operations for sports retail businesses.

## 🚀 Features

### 📦 Product Management

-   **CRUD Operations**: Complete Create, Read, Update, Delete functionality for products.
-   **Image Handling**: Support for product image uploads to Supabase Storage, with automatic cleanup on deletion.
-   **Search & Filtering**: Advanced filtering by category, brand, price, and stock status.
-   **CSV Import**: Bulk import capability for seamless data migration.
-   **Barcode Support**: Integration for scanning barcodes during sales and product lookup.
-   **Archive System**: Soft delete/archive functionality to maintain data integrity.

### 💰 Transactions & Inventory

-   **Sales Recording**: Intuitive interface for recording customer sales (Stock Out).
-   **Purchase Recording**: Track inventory replenishment (Stock In).
-   **Manual Adjustments**: Tools for stock correction and auditing.
-   **Low Stock Alerts**: Real-time notifications for items running low.

### 📊 Dashboard & Analytics

-   **Interactive Dashboard**: Visual overview of key metrics using Recharts.
-   **Reporting**:
    -   Low Stock Reports
    -   Stock Valuation Reports
    -   Sales & Movement History
-   **Optimization**: Server-side caching for high-performance data retrieval.

### 🔐 Security & Roles

-   **Authentication**: Secure login system powered by Auth.js (NextAuth v5).
-   **Role-Based Access**: Granular permissions for Admins, Managers, and Clerks.

## 🛠️ Technology Stack

-   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Database**: [PostgreSQL](https://www.postgresql.org/) (via [Neon](https://neon.tech/))
-   **ORM**: [Prisma](https://www.prisma.io/)
-   **Authentication**: [Auth.js (NextAuth v5)](https://authjs.dev/)
-   **Storage**: [Supabase Storage](https://supabase.com/storage)
-   **UI Components**: [Radix UI](https://www.radix-ui.com/) & [Lucide Icons](https://lucide.dev/)

## 🏁 Getting Started

### Prerequisites

-   Node.js & npm/pnpm
-   PostgreSQL Database (Neon recommended)
-   Supabase Account (for storage)

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/rhvsingh/inventory-mgmt-sys.git
    cd inventory-mgmt-sys
    ```

2.  **Install dependencies**

    ```bash
    pnpm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory:

    ```env
    DATABASE_URL="postgresql://..."
    AUTH_SECRET="your-auth-secret"
    NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
    NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
    SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
    SUPABASE_BUCKET="products"
    ```

4.  **Database Setup**

    ```bash
    npx prisma generate
    npx prisma db push
    ```

5.  **Run the application**
    ```bash
    pnpm dev
    ```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
