# Apex Motor Co. — Pre-owned. Fully trusted.

A production-ready used-car luxury dealership web platform built with React 18, Vite, TypeScript, Tailwind CSS, Motion (Framer Motion), React Router v6, Zustand (with persistent localStorage), Recharts, and React Helmet Async.

Designed with automotive agency polish (inspired by Porsche, Polestar, and Carvana), featuring the signature **Ignition** gradient (`#FF4D2E` to `#FF8A00` to `#FFC14D`), dark obsidian surfaces (`#0A0B0F`), Archivo and Manrope typography, and zero-pill metadata discipline.

---

## 🚗 Dealership Configuration

All dealership details are centralized in a single configuration file so you can rebrand or relocate the entire dealership in seconds:

📂 `src/config/dealership.ts`

- **Name**: Apex Motor Co.
- **Location**: Dallas, Texas, USA (4500 W Airport Fwy, Dallas, TX 75261)
- **Tagline**: *"Pre-owned. Fully trusted."*
- **Contact**: (214) 833-2800 · `concierge@apexmotor.com`
- **Pricing & Taxes**: Texas 8.25% sales tax, $150 dealer documentation fee, $500 refundable deposit hold
- **Guarantees**: 150-Point Certified Inspection, 7-Day / 250-Mile Return Policy

---

## 🔐 Demo Admin Access

The dealership management console is accessible at `/admin`:

- **URL**: `/admin`
- **Email**: `admin@apexmotor.com`
- **Password**: `demo1234`
- **Features**:
  - Showroom KPIs (floor inventory valuation, pending reviews, reservation queue, weekly views)
  - Interactive Recharts analytics (weekly traffic line chart, body style distribution donut)
  - Complete Vehicle CRUD (add, update specs, image URL preview, standard/featured, toggle status between Available/Reserved/Sold)
  - Customer review moderation (approve, reject, delete, official dealership replies)
  - Blog article management (draft/publish, live markdown preview)
  - Reservation queue audit with customer contact and payment holds
  - One-click "Reset demo data" to restore factory defaults

---

## 🛠 Local Setup & Development

```bash
# Install dependencies
npm install

# Start local development server (runs on port 3000)
npm run dev

# Run TypeScript linter
npm run lint

# Build production bundle
npm run build
```

---

## 🚀 Vercel Deployment

This project includes a pre-configured `vercel.json` routing configuration to ensure seamless client-side routing on refreshes and deep links:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Steps to Deploy to Vercel:
1. Push your repository to GitHub, GitLab, or Bitbucket.
2. In the [Vercel Dashboard](https://vercel.com/new), select **Import Project**.
3. Framework Preset: **Vite**
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Click **Deploy**. All routes (`/inventory`, `/vehicle/:slug`, `/compare`, `/cart`, `/admin`, etc.) will resolve instantly.

---

## 📦 How to Edit Mock Data

- **Vehicles**: Edit `src/data/mockVehicles.ts` to add or modify vehicles with 17-character VINs, realistic mileage, features, and specs.
- **Reviews**: Edit `src/data/mockReviews.ts` to add or edit testimonials.
- **Articles**: Edit `src/data/mockBlog.ts` to add or edit 300–500 word guides.
- **Staff**: Edit `src/data/mockTeam.ts` to add or update advisors.
