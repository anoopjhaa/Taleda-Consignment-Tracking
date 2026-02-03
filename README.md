# Consignment Tracking System

A full-stack, production-ready consignment tracking application built with Next.js 15.

## Features
- **Public Tracking**: Track consignments by ID with real-time progress simulation.
- **Interactive Map**: Visual route from Sender to Receiver with progress visualization on realistic roads.
- **Admin Dashboard**: Secure login for creating and managing shipments.
- **Automatic Geocoding**: Enter "City, Country" and the system resolves coordinates automatically.
- **Route Calculation**: Calculates distance and ETA logic.

## Setup

1. **Install Dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Initialize Database**:
   The database is automatically initialized on first run, but you can seed it with sample data:
   ```bash
   node scripts/seed.js
   ```
   *Note: Creates Admin user `admin` / `admin123` and a sample consignment `CN-123456`.*

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

4. **Access the App**:
   - **Tracking**: [http://localhost:3000](http://localhost:3000)
   - **Admin Panel**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

## credentials
- **Admin Username**: `admin`
- **Admin Password**: `admin123`

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Database**: SQLite (via `better-sqlite3`)
- **Map**: Leaflet / OpenStreetMap / OSRM
- **Styling**: Vanilla CSS Modules / Global CSS variables
