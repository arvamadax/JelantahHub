# JelantahHub - Circular Economy & Waste Revolution

## Problem Statement
Improper disposal of Used Cooking Oil (UCO) is a critical environmental hazard, contributing significantly to water pollution and ecosystem degradation. When disposed of in drains, it causes severe blockages and contaminates clean water sources. JelantahHub aims to address this issue by providing a centralized platform that facilitates the collection, tracking, and repurposing of UCO into biodiesel, thereby promoting a circular economy and protecting our water ecosystems.

## Core Features
This Minimum Viable Product (MVP) focuses on demonstrating the core value proposition for the IYREF 2026 Hackathon:
* **User Authentication**: Secure signup and login for contributors and collectors (powered by Firebase Auth).
* **Collection Tracking**: Users can log their UCO contributions and track total volumes collected.
* **Real-time Dashboard**: Interactive dashboard visualizing collection metrics and environmental impact.
* **Responsive UI**: A mobile-first, tactile interface built with React and Tailwind CSS.
* **Secure Backend**: Firestore integration with strict security rules to protect user data and ensure data integrity.

## Installation & Local Setup

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* npm (comes with Node.js)
* A Firebase Project (for backend services)

### Step-by-Step Setup

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd jelantahhub
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   * Copy the `.env.example` file to create a new `.env` file:
     ```bash
     cp .env.example .env
     ```
   * Open the `.env` file and populate it with your Firebase project configuration credentials. You will need your API key, auth domain, project ID, storage bucket, messaging sender ID, and app ID.

4. **Run the Application Locally**
   ```bash
   npm run dev
   ```
   * The application will typically start on `http://localhost:3000` (or `5173` depending on Vite configuration). Open this URL in your browser to view the application.

## Acknowledgements
Developed for the IYREF 2026 Hackathon - Phase 2 (Pre-Elimination).
