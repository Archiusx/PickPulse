<div align="center">

<img src="https://img.shields.io/badge/PickPulse-Dark%20Store%20OS-6366f1?style=for-the-badge&logoColor=white" alt="PickPulse" height="45"/>

# PickPulse

### Intelligent Dark Store Management Platform

**Real-time inventory · Smart picking · Compliance tracking · AI-powered insights**

<svg width="1400" height="900" viewBox="0 0 1400 900" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" font-family="'Segoe UI', system-ui, -apple-system, sans-serif">
  <defs>
    <!-- Background gradient -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0f0f1a;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#131525;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0d1117;stop-opacity:1" />
    </linearGradient>

    <!-- Card gradients -->
    <linearGradient id="clientGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1e2d5a;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#162347;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="firebaseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#2a1f0e;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1e1508;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="aiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a0f2e;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#120a22;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="vercelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#12121f;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="mongoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0a1f0a;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#061506;stop-opacity:1" />
    </linearGradient>

    <!-- Glow filters -->
    <filter id="glowBlue" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
      <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="glowOrange" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
      <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="glowPurple" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
      <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="glowGreen" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
      <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="softShadow">
      <feDropShadow dx="0" dy="4" stdDeviation="12" flood-color="#000000" flood-opacity="0.5"/>
    </filter>
    <filter id="iconGlow">
      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
      <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>

    <!-- Arrow markers -->
    <marker id="arrowBlue" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="#4f8ef7" opacity="0.9"/>
    </marker>
    <marker id="arrowOrange" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="#ff9500" opacity="0.9"/>
    </marker>
    <marker id="arrowPurple" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="#a855f7" opacity="0.9"/>
    </marker>
    <marker id="arrowGreen" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="#4ade80" opacity="0.9"/>
    </marker>
    <marker id="arrowWhite" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="#ffffff60" opacity="0.9"/>
    </marker>
    <marker id="arrowBlueBi" markerWidth="8" markerHeight="8" refX="2" refY="3" orient="auto">
      <path d="M8,0 L8,6 L0,3 z" fill="#4f8ef7" opacity="0.9"/>
    </marker>
  </defs>

  <!-- Background -->
  <rect width="1400" height="900" fill="url(#bgGrad)"/>

  <!-- Subtle ambient glows -->
  <ellipse cx="300" cy="200" rx="250" ry="150" fill="#4f8ef710" filter="url(#glowBlue)"/>
  <ellipse cx="1100" cy="650" rx="200" ry="120" fill="#ff950010" filter="url(#glowOrange)"/>
  <ellipse cx="700" cy="450" rx="180" ry="100" fill="#a855f708"/>

  <!-- ===== TITLE ===== -->
  <text x="700" y="46" text-anchor="middle" font-size="13" font-weight="600" letter-spacing="4" fill="#ffffff30" font-family="'Segoe UI', sans-serif">SYSTEM ARCHITECTURE</text>
  <text x="700" y="78" text-anchor="middle" font-size="28" font-weight="700" fill="#ffffff" font-family="'Segoe UI', sans-serif" letter-spacing="-0.5">PickPulse · Dark Store Platform</text>
  <line x1="560" y1="92" x2="840" y2="92" stroke="#ffffff15" stroke-width="1"/>

  <!-- ============================== -->
  <!-- LAYER 1: CLIENT / FRONTEND     -->
  <!-- ============================== -->
  <!-- Card -->
  <rect x="60" y="120" width="360" height="260" rx="16" fill="url(#clientGrad)" stroke="#4f8ef730" stroke-width="1.5" filter="url(#softShadow)"/>
  <rect x="60" y="120" width="360" height="4" rx="2" fill="#4f8ef7" opacity="0.8"/>

  <!-- Label -->
  <text x="240" y="148" text-anchor="middle" font-size="10" font-weight="700" letter-spacing="3" fill="#4f8ef7cc" font-family="'Segoe UI', sans-serif">CLIENT · LAYER</text>
  <text x="240" y="168" text-anchor="middle" font-size="17" font-weight="700" fill="#e8eeff" font-family="'Segoe UI', sans-serif">Frontend Application</text>

  <!-- React logo (real image) -->
  <image href="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" x="90" y="190" width="48" height="48" filter="url(#iconGlow)"/>
  <text x="114" y="252" text-anchor="middle" font-size="9" font-weight="700" fill="#61DAFB" font-family="'Segoe UI', sans-serif">React 19</text>

  <!-- TypeScript logo (real image) -->
  <image href="https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg" x="177" y="190" width="44" height="44"/>
  <text x="199" y="252" text-anchor="middle" font-size="9" font-weight="700" fill="#3178C6cc" font-family="'Segoe UI', sans-serif">TypeScript</text>

  <!-- Vite logo (real image) -->
  <image href="https://upload.wikimedia.org/wikipedia/commons/f/f1/Vitejs-logo.svg" x="263" y="190" width="48" height="48" filter="url(#iconGlow)"/>
  <text x="287" y="252" text-anchor="middle" font-size="9" font-weight="700" fill="#646CFFcc" font-family="'Segoe UI', sans-serif">Vite</text>

  <!-- Tailwind logo (real image) -->
  <image href="https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg" x="355" y="196" width="48" height="30"/>
  <text x="379" y="252" text-anchor="middle" font-size="9" font-weight="700" fill="#06B6D4cc" font-family="'Segoe UI', sans-serif">Tailwind</text>

  <!-- Bottom row of client layer -->
  <rect x="80" y="280" width="155" height="28" rx="6" fill="#ffffff08" stroke="#4f8ef720" stroke-width="1"/>
  <text x="158" y="299" text-anchor="middle" font-size="10" fill="#94a3b8" font-family="'Segoe UI', sans-serif">Framer Motion · Lucide Icons</text>

  <rect x="245" y="280" width="155" height="28" rx="6" fill="#ffffff08" stroke="#4f8ef720" stroke-width="1"/>
  <text x="323" y="299" text-anchor="middle" font-size="10" fill="#94a3b8" font-family="'Segoe UI', sans-serif">PWA · Mobile-First Design</text>

  <!-- Role badges -->
  <rect x="80" y="318" width="75" height="20" rx="10" fill="#4f8ef718" stroke="#4f8ef740" stroke-width="1"/>
  <text x="118" y="332" text-anchor="middle" font-size="9" font-weight="600" fill="#4f8ef7" font-family="'Segoe UI', sans-serif">👤 Admin</text>
  <rect x="163" y="318" width="80" height="20" rx="10" fill="#4f8ef718" stroke="#4f8ef740" stroke-width="1"/>
  <text x="203" y="332" text-anchor="middle" font-size="9" font-weight="600" fill="#4f8ef7" font-family="'Segoe UI', sans-serif">👤 Manager</text>
  <rect x="251" y="318" width="75" height="20" rx="10" fill="#4f8ef718" stroke="#4f8ef740" stroke-width="1"/>
  <text x="289" y="332" text-anchor="middle" font-size="9" font-weight="600" fill="#4f8ef7" font-family="'Segoe UI', sans-serif">👤 Picker</text>

  <!-- ============================== -->
  <!-- LAYER 2: VERCEL HOSTING        -->
  <!-- ============================== -->
  <rect x="490" y="120" width="260" height="130" rx="16" fill="url(#vercelGrad)" stroke="#ffffff20" stroke-width="1.5" filter="url(#softShadow)"/>
  <rect x="490" y="120" width="260" height="4" rx="2" fill="#ffffff" opacity="0.7"/>

  <text x="620" y="148" text-anchor="middle" font-size="10" font-weight="700" letter-spacing="3" fill="#ffffffaa" font-family="'Segoe UI', sans-serif">HOSTING · LAYER</text>
  <text x="620" y="168" text-anchor="middle" font-size="17" font-weight="700" fill="#e8eeff" font-family="'Segoe UI', sans-serif">Vercel Edge Network</text>

  <!-- Vercel logo (real image) -->
  <image href="https://assets.vercel.com/image/upload/front/favicon/vercel/180x180.png" x="584" y="182" width="48" height="48" filter="url(#iconGlow)"/>
  <text x="620" y="238" text-anchor="middle" font-size="10" fill="#ffffff60" font-family="'Segoe UI', sans-serif">Global CDN · Serverless Functions</text>

  <!-- ============================== -->
  <!-- LAYER 3: FIREBASE SUITE        -->
  <!-- ============================== -->
  <rect x="60" y="430" width="560" height="320" rx="16" fill="url(#firebaseGrad)" stroke="#ff950030" stroke-width="1.5" filter="url(#softShadow)"/>
  <rect x="60" y="430" width="560" height="4" rx="2" fill="#ff9500" opacity="0.8"/>

  <text x="340" y="458" text-anchor="middle" font-size="10" font-weight="700" letter-spacing="3" fill="#ff9500cc" font-family="'Segoe UI', sans-serif">BACKEND · LAYER</text>
  <text x="340" y="478" text-anchor="middle" font-size="17" font-weight="700" fill="#fde8c8" font-family="'Segoe UI', sans-serif">Firebase Suite · Google Cloud</text>

  <!-- Firebase logo (real image) -->
  <image href="https://www.gstatic.com/mobilesdk/160503_mobilesdk/logo/2x/firebase_28dp.png" x="300" y="488" width="56" height="56" filter="url(#iconGlow)"/>

  <!-- Firebase Auth card -->
  <rect x="80" y="545" width="155" height="80" rx="10" fill="#ffffff08" stroke="#ff950025" stroke-width="1"/>
  <!-- Firebase Auth - real logo -->
  <image href="https://firebase.google.com/static/images/brand-guidelines/logo-logomark.png" x="120" y="558" width="36" height="36" filter="url(#iconGlow)"/>
  <text x="158" y="606" text-anchor="middle" font-size="11" font-weight="700" fill="#FFCA28" font-family="'Segoe UI', sans-serif">Auth</text>
  <text x="158" y="620" text-anchor="middle" font-size="9" fill="#ffffff60" font-family="'Segoe UI', sans-serif">Email / Password</text>

  <!-- Firestore card -->
  <rect x="248" y="545" width="160" height="80" rx="10" fill="#ffffff08" stroke="#ff950025" stroke-width="1"/>
  <!-- Firestore - real logo -->
  <image href="https://firebase.google.com/static/images/brand-guidelines/logo-logomark.png" x="297" y="557" width="36" height="36" filter="url(#iconGlow)"/>
  <text x="328" y="606" text-anchor="middle" font-size="11" font-weight="700" fill="#FF9500" font-family="'Segoe UI', sans-serif">Firestore</text>
  <text x="328" y="620" text-anchor="middle" font-size="9" fill="#ffffff60" font-family="'Segoe UI', sans-serif">Real-time Database</text>

  <!-- Firestore badge - realtime -->
  <rect x="248" y="630" width="160" height="22" rx="6" fill="#ff950015" stroke="#ff950030" stroke-width="1"/>
  <circle cx="263" cy="641" r="4" fill="#4ade80"/>
  <text x="340" y="645" text-anchor="middle" font-size="9" fill="#ff9500cc" font-family="'Segoe UI', sans-serif">Live Sync · No Polling</text>

  <!-- Storage card -->
  <rect x="422" y="545" width="155" height="80" rx="10" fill="#ffffff08" stroke="#ff950025" stroke-width="1"/>
  <!-- Storage - real logo -->
  <image href="https://www.gstatic.com/mobilesdk/160503_mobilesdk/logo/2x/firebase_28dp.png" x="460" y="557" width="36" height="36" filter="url(#iconGlow)"/>
  <text x="500" y="606" text-anchor="middle" font-size="11" font-weight="700" fill="#FFA726" font-family="'Segoe UI', sans-serif">Storage</text>
  <text x="500" y="620" text-anchor="middle" font-size="9" fill="#ffffff60" font-family="'Segoe UI', sans-serif">Files &amp; Media</text>

  <!-- Features row -->
  <rect x="80" y="655" width="155" height="20" rx="6" fill="#ff950010" stroke="#ff950020" stroke-width="1"/>
  <text x="158" y="669" text-anchor="middle" font-size="9" fill="#ff9500aa" font-family="'Segoe UI', sans-serif">Role-Based Rules</text>
  <rect x="248" y="655" width="160" height="20" rx="6" fill="#ff950010" stroke="#ff950020" stroke-width="1"/>
  <text x="328" y="669" text-anchor="middle" font-size="9" fill="#ff9500aa" font-family="'Segoe UI', sans-serif">Inventory · Compliance · Tickets</text>
  <rect x="422" y="655" width="155" height="20" rx="6" fill="#ff950010" stroke="#ff950020" stroke-width="1"/>
  <text x="500" y="669" text-anchor="middle" font-size="9" fill="#ff9500aa" font-family="'Segoe UI', sans-serif">Barcode · QR Scans</text>

  <!-- ============================== -->
  <!-- LAYER 4: AI / GEMINI           -->
  <!-- ============================== -->
  <rect x="760" y="430" width="340" height="320" rx="16" fill="url(#aiGrad)" stroke="#a855f730" stroke-width="1.5" filter="url(#softShadow)"/>
  <rect x="760" y="430" width="340" height="4" rx="2" fill="#a855f7" opacity="0.8"/>

  <text x="930" y="458" text-anchor="middle" font-size="10" font-weight="700" letter-spacing="3" fill="#a855f7cc" font-family="'Segoe UI', sans-serif">AI · LAYER</text>
  <text x="930" y="478" text-anchor="middle" font-size="17" font-weight="700" fill="#e8d8ff" font-family="'Segoe UI', sans-serif">Google Gen AI · Gemini</text>

  <!-- Gemini logo (real image) -->
  <image href="https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg" x="893" y="488" width="72" height="72" filter="url(#iconGlow)"/>

  <!-- Gemini feature cards -->
  <rect x="780" y="570" width="145" height="75" rx="10" fill="#ffffff08" stroke="#a855f725" stroke-width="1"/>
  <text x="852" y="592" text-anchor="middle" font-size="20">🔮</text>
  <text x="852" y="612" text-anchor="middle" font-size="11" font-weight="700" fill="#c084fc" font-family="'Segoe UI', sans-serif">Demand Forecast</text>
  <text x="852" y="627" text-anchor="middle" font-size="9" fill="#ffffff60" font-family="'Segoe UI', sans-serif">Predictive Stock Analysis</text>
  <text x="852" y="640" text-anchor="middle" font-size="9" fill="#ffffff60" font-family="'Segoe UI', sans-serif">Local Context Signals</text>

  <rect x="935" y="570" width="145" height="75" rx="10" fill="#ffffff08" stroke="#a855f725" stroke-width="1"/>
  <text x="1007" y="592" text-anchor="middle" font-size="20">🗺️</text>
  <text x="1007" y="612" text-anchor="middle" font-size="11" font-weight="700" fill="#c084fc" font-family="'Segoe UI', sans-serif">Shelf Slotting</text>
  <text x="1007" y="627" text-anchor="middle" font-size="9" fill="#ffffff60" font-family="'Segoe UI', sans-serif">Pick-Path Optimization</text>
  <text x="1007" y="640" text-anchor="middle" font-size="9" fill="#ffffff60" font-family="'Segoe UI', sans-serif">Zone Assignment AI</text>

  <rect x="780" y="655" width="300" height="22" rx="6" fill="#a855f710" stroke="#a855f730" stroke-width="1"/>
  <text x="930" y="670" text-anchor="middle" font-size="9" fill="#a855f7cc" font-family="'Segoe UI', sans-serif">gemini-2.0-flash-exp · Google Gen AI SDK · REST API</text>

  <rect x="780" y="683" width="300" height="22" rx="6" fill="#a855f710" stroke="#a855f730" stroke-width="1"/>
  <text x="930" y="698" text-anchor="middle" font-size="9" fill="#a855f7cc" font-family="'Segoe UI', sans-serif">Graceful Degradation · No Key = UI Only Mode</text>

  <rect x="780" y="710" width="300" height="22" rx="6" fill="#a855f710" stroke="#a855f730" stroke-width="1"/>
  <text x="930" y="725" text-anchor="middle" font-size="9" fill="#a855f7cc" font-family="'Segoe UI', sans-serif">Prompt Engineering · Structured JSON Output</text>

  <!-- ============================== -->
  <!-- LAYER 5: MONGODB               -->
  <!-- ============================== -->
  <rect x="1120" y="430" width="240" height="320" rx="16" fill="url(#mongoGrad)" stroke="#4ade8030" stroke-width="1.5" filter="url(#softShadow)"/>
  <rect x="1120" y="430" width="240" height="4" rx="2" fill="#4ade80" opacity="0.8"/>

  <text x="1240" y="458" text-anchor="middle" font-size="10" font-weight="700" letter-spacing="3" fill="#4ade80cc" font-family="'Segoe UI', sans-serif">DATABASE · LAYER</text>
  <text x="1240" y="478" text-anchor="middle" font-size="17" font-weight="700" fill="#d8fde8" font-family="'Segoe UI', sans-serif">MongoDB Atlas</text>

  <!-- MongoDB leaf logo (real image) -->
  <image href="https://www.vectorlogo.zone/logos/mongodb/mongodb-icon.svg" x="1212" y="490" width="56" height="70" filter="url(#iconGlow)"/>

  <!-- Mongo feature cards -->
  <rect x="1140" y="565" width="200" height="60" rx="10" fill="#ffffff08" stroke="#4ade8025" stroke-width="1"/>
  <text x="1240" y="584" text-anchor="middle" font-size="11" font-weight="700" fill="#4ade8

<br/>

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Vite](https://img.shields.io/badge/Vite-Build%20Tool-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-22c55e?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-f97316?style=flat-square)](CONTRIBUTING.md)

<br/>

> A production-grade operations platform engineered for the speed of quick commerce.  
> Built to give dark store teams full visibility and control — from shelf to doorstep.

<br/>

### 🚀 [View Live Prototype →](https://pick-pulse-five.vercel.app)

[![Live Demo](https://img.shields.io/badge/Live%20Demo-pick--pulse--five.vercel.app-6366f1?style=for-the-badge&logo=vercel&logoColor=white)](https://pick-pulse-five.vercel.app)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Live Demo](#live-demo)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Deployment (Vercel)](#deployment-vercel)
- [Firebase Setup](#firebase-setup)
  - [Security Rules](#security-rules)
- [Role-Based Access](#role-based-access)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [Author](#author)

---

## Overview

PickPulse is a **mobile-first, real-time operations platform** built for dark stores and quick-commerce warehouses. It digitizes every layer of store operations — from live inventory tracking and picker coordination to compliance logging and AI-driven demand forecasting — into a single, unified interface optimized for speed and reliability.

Whether you're managing a team of pickers, auditing expiry dates, or trying to cut pick-path times, PickPulse gives you the tools to operate at 10-minute delivery speeds.

---

## Live Demo

> **Try it live — no setup required.**

| | |
|---|---|
| 🌐 **URL** | [https://pick-pulse-five.vercel.app](https://pick-pulse-five.vercel.app) |
| 🖥️ **Hosting** | Vercel (Edge Network) |
| 📱 **Optimized for** | Mobile & Desktop |
| 🔄 **Status** | ![Status](https://img.shields.io/website?url=https%3A%2F%2Fpick-pulse-five.vercel.app&style=flat-square&label=uptime&color=22c55e) |

> The prototype is connected to a live Firebase backend. Features like real-time inventory updates, picker management, and compliance logs are fully functional.  
> AI forecasting features require a valid API key and may be limited in the demo environment.

---

## Key Features

### 📦 Real-Time Inventory Tracking
Live stock levels, expiry date management, and shelf location mapping — all synchronized through Firebase Firestore. Every adjustment is reflected instantly across all connected devices.

### 🤖 AI-Powered Demand Forecasting
Integrated AI analysis evaluates local context signals to predict demand surges and suggests optimal shelf slotting to minimize pick-path distances and reduce fulfillment times.

### 🧑‍🏭 Order & Picker Management
Track active pickers in real time, assign warehouse zones, monitor per-picker fulfillment metrics, and manage order queues from a single dashboard.

### 📷 Barcode & QR Scanning
Built-in scanner integration enables instant stock adjustments and item verification — no manual entry required, no errors introduced.

### 🌡️ Compliance & Ticketing
Log temperature checks, cleaning records, and operational issues (tickets) with timestamps and ownership. Stay audit-ready at all times.

### 🔐 Role-Based Access Control
Granular permissions for three roles — **Admin**, **Manager**, and **Picker** — ensuring each team member sees only what they need.

### 📱 Mobile-First UI
Fully responsive Progressive Web App experience engineered for handheld devices used in warehouse environments. Built with Tailwind CSS and Framer Motion.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 19 |
| **Language** | TypeScript |
| **Build Tool** | Vite |
| **Styling** | Tailwind CSS |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **Authentication** | Firebase Auth |
| **Database** | Cloud Firestore (Realtime) |
| **AI / ML** | Google Gen AI SDK |
| **Deployment** | Vercel |

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                  PickPulse Client                   │
│           React 19 + TypeScript + Vite              │
└────────────────┬────────────────┬───────────────────┘
                 │                │
     ┌───────────▼──────┐  ┌──────▼────────────┐
     │  Firebase Suite  │  │   Google Gen AI   │
     │  ─────────────── │  │  ──────────────── │
     │  Authentication  │  │  Demand Forecast  │
     │  Firestore DB    │  │  Slotting Engine  │
     │  Real-time Sync  │  └───────────────────┘
     └──────────────────┘
```

Data flows in real-time — every inventory change, picker update, or compliance log is pushed to all connected clients via Firestore's live listeners, with no polling required.

---

## Getting Started

### Prerequisites

- **Node.js** `v18.x` or higher
- **npm** `v9.x` or higher
- A **Firebase** project (Firestore + Authentication enabled)
- A **Google AI** API key (for demand forecasting features)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/pickpulse.git
cd pickpulse

# 2. Install dependencies
npm install

# 3. Configure environment variables (see below)
cp .env.example .env.local

# 4. Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# AI Configuration
VITE_GEMINI_API_KEY=your_google_ai_api_key
```

> **Security Note:** Never commit `.env.local` to version control. Add it to `.gitignore` before your first commit.

---

## Deployment (Vercel)

PickPulse uses a flat file structure, making Vercel deployment straightforward — even from a mobile browser.

**Step 1:** Go to [vercel.com](https://vercel.com) and log in.

**Step 2:** Click **Add New → Project** and import your PickPulse GitHub repository.

**Step 3:** Before clicking Deploy, expand the **Environment Variables** panel and add each variable from your `.env.local` file. At minimum, you need:

| Variable | Description |
|---|---|
| `VITE_FIREBASE_API_KEY` | Firebase Web API Key |
| `VITE_FIREBASE_PROJECT_ID` | Your Firebase project ID |
| `VITE_GEMINI_API_KEY` | Google AI key for forecasting features |
| *(+ remaining Firebase vars)* | As listed in the section above |

**Step 4:** Click **Deploy**. Vercel will build and publish your app automatically.

> If `VITE_GEMINI_API_KEY` is not provided, the app will run normally but AI forecasting features will be silently disabled.

---

## Firebase Setup

### Enabling Services

In your [Firebase Console](https://console.firebase.google.com):

1. Enable **Authentication** → Sign-in method → Email/Password
2. Enable **Cloud Firestore** → Create database → Start in production mode
3. Apply the security rules below

### Security Rules

Navigate to **Firestore → Rules** in your Firebase Console and replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isAuthenticated() {
      return request.auth != null;
    }

    function isAdmin() {
      return isAuthenticated() && (
        (
          exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
          get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'Admin'
        ) || (
          request.auth.token.email == "adityadeshakar@gmail.com" &&
          request.auth.token.email_verified == true
        )
      );
    }

    match /users/{userId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin() || (isAuthenticated() && request.auth.uid == userId);
    }

    match /inventory/{itemId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();

      match /history/{historyId} {
        allow read, create: if isAuthenticated();
      }
    }

    match /{path=**} {
      allow read, write: if isAuthenticated();
    }
  }
}
```

---

## Role-Based Access

| Permission | Admin | Manager | Picker |
|---|:---:|:---:|:---:|
| View Inventory | ✅ | ✅ | ✅ |
| Adjust Stock | ✅ | ✅ | ❌ |
| Manage Users | ✅ | ❌ | ❌ |
| View Compliance Logs | ✅ | ✅ | ✅ |
| Create Tickets | ✅ | ✅ | ✅ |
| Resolve Tickets | ✅ | ✅ | ❌ |
| View AI Forecasts | ✅ | ✅ | ❌ |
| Manage Pickers | ✅ | ✅ | ❌ |

---

## Project Structure

```
pickpulse/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── inventory/      # Inventory management views
│   │   ├── pickers/        # Picker coordination UI
│   │   ├── compliance/     # Compliance & ticketing
│   │   └── shared/         # Common layout components
│   ├── hooks/              # Custom React hooks (Firebase, auth)
│   ├── lib/                # Firebase client, AI client, utilities
│   ├── pages/              # Top-level page components
│   ├── types/              # TypeScript interfaces & enums
│   └── main.tsx            # Application entry point
├── .env.example            # Environment variable template
├── index.html
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

---

## Contributing

Contributions, issues, and feature requests are welcome.

```bash
# Fork the repo, then:
git checkout -b feature/your-feature-name
git commit -m "feat: add your feature"
git push origin feature/your-feature-name
# Open a Pull Request
```

Please follow the existing code style and add tests where applicable.

---

## Author

<div align="center">

**Developed by Piyush Deshkar**

[![GitHub](https://img.shields.io/badge/GitHub-@PiyushDeshkar-181717?style=flat-square&logo=github)](https://github.com/PiyushDeshkar)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Piyush%20Deshkar-0A66C2?style=flat-square&logo=linkedin)](https://linkedin.com/in/piyushdeshkar)

<br/>

*If PickPulse has been useful to you, consider leaving a ⭐ on the repository.*

</div>

---

<div align="center">
<sub>MIT License · © 2026 Piyush Deshkar</sub>
</div>
