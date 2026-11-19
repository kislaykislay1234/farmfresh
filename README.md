# FarmFresh (FreshGrid)

A smart, simple agricultural platform connecting Farmers, Buyers, Cold Storages, and Transporters across India.

---

## What is FarmFresh?

**FarmFresh** is an all-in-one digital platform built to help Indian farmers:

- **AI Camera Scanner**: Check crop quality, freshness score (0-100%), and shelf life.
- **AI Voice Assistant**: Listen to price reports, profits, and recommendations in 12 Indian languages.
- **Mandi Bhav**: Get real-time commodity market prices directly from Agmarknet.
- **Marketplace & Auctions**: Sell produce directly to buyers with zero middleman deductions.
- **Logistics & Storage**: Book nearby cold storage space and track transport vehicles live via GPS.

---

## User Roles

| Role | Description & Features |
| --- | --- |
| **Farmer** | Scan produce freshness, check Mandi rates, list crops, book cold storage and transport. |
| **Buyer** | Purchase produce directly from farmers, participate in crop auctions, track deliveries. |
| **Cold Storage** | List available storage chambers, manage farmer bookings, monitor cooling temperatures. |
| **Transporter** | Find transport loads, optimize routes, track fleet shipments live with GPS. |

---

## Key Features

### 1. AI Freshness & Quality Scanner
- Point your smartphone camera or upload a photo of any crop.
- AI detects the produce accurately and ignores hands or fingers holding it in farm photos.
- Generates an instant Freshness Score (0-100%), Quality Grade (A+/A/B/C), Brix ripeness, and shelf life.

### 2. AI Voice Read & Explain ("Listen / सुनें")
- Tap the **Listen** button next to any report or card.
- AI explains the data aloud in simple, conversational language.
- Supported in 12 languages: Hindi, English, Gujarati, Marathi, Bengali, Punjabi, Tamil, Telugu, Kannada, Malayalam, Odia, and Assamese.

### 3. Full 12-Language Translation
- Easily switch languages from the top navigation bar.
- The entire website translates across all pages, forms, and alerts.

### 4. Live Mandi Bhav (Market Rates)
- Real government Mandi prices across Indian states and districts.
- Interactive price trend charts and arrival volume alerts.

### 5. Direct Marketplace & Live Auctions
- Farmers list produce with verified quality badges.
- Real-time bidding arena for bulk crop auctions with live countdown timers.

### 6. Cold Storage & Live GPS Logistics
- Find and reserve nearby cold storage chambers to reduce post-harvest waste.
- Real-time vehicle GPS tracking with temperature telematics on an interactive map.

---

## Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (.env)
Create a `.env` file in the project root with your Supabase credentials:
```env
VITE_SUPABASE_URL=https://ezyiwlninhpaytznakra.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Run Development Server
```bash
npm run dev
```
Open your browser at: `http://localhost:5173/`

### 4. Build for Production
```bash
npm run build
```

---

## Page Routes Directory

| Feature | URL Route | Description |
| --- | --- | --- |
| **Home** | `/` | Platform landing page & features |
| **Farmer Dashboard** | `/dashboard/farmer` | Harvest stats, profits, Mandi alerts, listings |
| **Buyer Dashboard** | `/dashboard/buyer` | Orders, active bids, supplier catalog |
| **Cold Storage Dashboard** | `/dashboard/cold-storage` | Chamber capacity, bookings, temperature alerts |
| **Transporter Dashboard** | `/dashboard/transporter` | Fleet utilization, trip routes, active dispatches |
| **Marketplace** | `/marketplace` | Browse & buy fresh crops directly from farmers |
| **AI Freshness Scanner** | `/freshness-scanner` | Neural quality evaluation via camera or photo upload |
| **Mandi Bhav** | `/mandi-rates` | Real-time government commodity market rates |
| **Live Auctions** | `/auctions` | Real-time bidding rooms on crop batches |
| **Cold Storage** | `/cold-storage` | Search and reserve cold storage space |
| **Live Fleet Tracking** | `/tracking` | Live GPS map tracking of transport vehicles |
| **Government Schemes** | `/schemes` | Farmer subsidies & PM-KISAN schemes |
| **Login / Register** | `/auth` | Supabase Authentication & demo role switcher |

---

## Tech Stack

- **Frontend**: React 18, Vite 6, Tailwind CSS
- **Icons & UI**: Lucide React, React Hot Toast
- **Database & Auth**: Supabase (PostgreSQL)
- **Maps & Analytics**: Leaflet, React-Leaflet, Recharts
- **Speech Engine**: Web Speech Synthesis API

---

## License

This project is licensed under the **MIT License**.
