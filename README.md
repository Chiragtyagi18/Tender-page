TenderHub
TenderHub is a modern B2B tender management platform designed to connect businesses, streamline procurement processes, and facilitate collaboration. It allows companies to create and publish tender opportunities, and other businesses to discover and apply for them.

Features
User Authentication: Secure sign-up and sign-in using email and password, powered by Supabase Auth.

Company Onboarding: A guided process for new users to create their company profile, including company name, industry, description, and logo upload.

Dynamic Company Profiles: Showcase detailed information about registered companies.

Tender Listing: Browse a comprehensive list of active and past tender opportunities.

Tender Creation: Companies can easily create and publish new tender opportunities with details like title, description, deadline, budget, and requirements.

Tender Details Page: View in-depth information for individual tenders.

Responsive Design: Built with Tailwind CSS to ensure a seamless experience across various devices.

Real-time Data: Leverages Supabase for real-time data updates.

Technologies Used
Next.js 14+ (App Router): React framework for building modern web applications.

React: JavaScript library for building user interfaces.

TypeScript: Strongly typed superset of JavaScript for enhanced code quality.

Tailwind CSS: A utility-first CSS framework for rapid UI development.

Supabase: Open-source Firebase alternative providing:

Authentication: User management and secure authentication.

PostgreSQL Database: Relational database for storing application data.

Storage: For storing company logos and other files.

Realtime: For instant data updates.

Lucide React: A collection of beautiful and customizable open-source icons.

Shadcn/ui: Reusable components built with Radix UI and Tailwind CSS.

Sonner: A modern toast library for notifications.

Getting Started
Follow these steps to set up and run TenderHub locally.

Prerequisites
Node.js (v18 or higher)

npm or Yarn

Git

A Supabase project (free tier is sufficient for development)

1. Clone the Repository
git clone <your-repository-url>
cd web-page # or your project folder name

2. Install Dependencies
npm install
# or
yarn install

3. Set up Supabase
a. Create a Supabase Project
Go to Supabase and sign in or create an account.

Click "New project" and follow the instructions to create a new project. Remember your database password.

b. Get Supabase Credentials
Once your project is created, navigate to Project Settings (gear icon) > API.

Copy your Project URL and anon (public) key. These will be used in your environment variables.

Also, note your service_role (secret) key. While not directly used client-side, it's good to have for server-side operations or future API routes.

c. Run SQL Commands to Create Tables and RLS Policies
Go to your Supabase project dashboard, click on SQL Editor (the > icon in the left sidebar), and run the following SQL scripts. Run them in the order specified.

i. Create Tables:
(Refer to create-tables-sql or full-schema-recreation-sql immersive for the complete script)
Run the SQL commands to create users, companies, tenders, applications, and company_services tables, along with the update_updated_at_column function and its triggers.

ii. Enable Row Level Security (RLS):
For each of the public.users, public.companies, public.tenders, public.applications, and public.company_services tables, go to Authentication > Policies and ensure RLS is enabled.

iii. Create RLS Policies:
(Refer to create-rls-policies-sql immersive for the complete script)
Run the SQL commands to create the RLS policies for all your tables. These policies define who can read, insert, update, and delete data.

iv. Create Storage Bucket and RLS Policies for Photos:

Go to Storage (bucket icon) in your Supabase dashboard.

Click "New bucket" and name it photos.

Ensure the Public buckets toggle is ON if you want uploaded company logos to be publicly accessible. If not, you'll need to fetch them with a signed URL.

Go to Storage > Policies and select the photos bucket.

(Refer to storage-rls-policies-photos immersive for the complete script)
Run the SQL commands to create RLS policies for your photos bucket. At a minimum, you'll need policies for INSERT (for users to upload their logos) and SELECT (for others to view them).

4. Configure Environment Variables
Create a .env.local file in the root of your project and add the following:

NEXT_PUBLIC_SUPABASE_URL="YOUR_SUPABASE_PROJECT_URL"
NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
# This is used for authentication redirects. Vercel will automatically set VERCEL_URL.
# For local development, it defaults to http://localhost:3000/
NEXT_PUBLIC_SITE_URL="http://localhost:3000/"

Replace YOUR_SUPABASE_PROJECT_URL and YOUR_SUPABASE_ANON_KEY with the values you copied from your Supabase dashboard.

5. Run the Development Server
npm run dev
# or
yarn dev

Open http://localhost:3000 in your browser.

Deployment
This application is designed for deployment on Vercel.

Vercel Environment Variables
When deploying to Vercel, you will need to set the same environment variables in your Vercel project settings:

NEXT_PUBLIC_SUPABASE_URL

NEXT_PUBLIC_SUPABASE_ANON_KEY

NEXT_PUBLIC_SITE_URL: Set this to https://${VERCEL_URL}. Vercel automatically populates VERCEL_URL with the correct domain for each deployment (production, preview).

Supabase Redirect URLs for Vercel
Crucially, you must update your Supabase project's Authentication > URL Configuration to include your Vercel deployment URLs:

Site URL: Your primary production domain (e.g., https://your-app-name.vercel.app or your custom domain).

Redirect URLs: Add the following to the list:

http://localhost:3000/*

https://<YOUR_VERCEL_PROJECT_NAME>.vercel.app/* (replace <YOUR_VERCEL_PROJECT_NAME> with your actual Vercel project name)

https://<YOUR_VERCEL_PROJECT_NAME>-*.vercel.app/* (for preview deployments)

If you use a custom domain, also add https://your-custom-domain.com/*

Project Structure
.
├── app/
│   ├── auth/
│   │   ├── signin/
│   │   │   └── page.tsx      # Sign-in page
│   │   └── signup/
│   │       └── page.tsx      # Sign-up page
│   ├── dashboard/
│   │   └── page.tsx          # User dashboard
│   ├── tenders/
│   │   ├── [id]/
│   │   │   └── page.tsx      # Individual tender details page
│   │   ├── create/
│   │   │   └── page.tsx      # Create new tender page
│   │   └── page.tsx          # List of all tenders
│   ├── globals.css           # Global Tailwind CSS styles
│   ├── layout.tsx            # Root layout for the application
│   └── page.tsx              # Home page
├── components/
│   └── ui/                   # Shadcn UI components
│       ├── alert.tsx
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── checkbox.tsx
│       ├── input.tsx
│       ├── label.tsx
│       └── ...
├── hooks/
│   └── use-auth.tsx          # Custom React hook for Supabase authentication context
├── lib/
│   ├── supabase.ts           # Supabase client initialization and database types
│   └── utils.ts              # Utility functions (e.g., for Tailwind CSS class merging)
├── public/                   # Static assets
├── .env.local                # Environment variables (local)
├── next.config.mjs           # Next.js configuration
├── package.json              # Project dependencies and scripts
├── postcss.config.mjs        # PostCSS configuration
├── tailwind.config.ts        # Tailwind CSS configuration
└── tsconfig.json             # TypeScript configuration

Contributing
Feel free to fork the repository, open issues, and submit pull requests.
