# 🎨 SPK Kajek - Dashboard Documentation

## Overview

Dashboard SPK Kajek adalah antarmuka pengguna modern untuk Sistem Pendukung Keputusan pemilihan Server Cloud VPS menggunakan metode TOPSIS.

## 🖥️ Technology Stack

| Layer | Technology |
|-------|------------|
| **UI Framework** | React 18 + TypeScript |
| **Build Tool** | Vite 5 |
| **Styling** | Tailwind CSS 3.3 |
| **Animations** | Framer Motion |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **3D Graphics** | Three.js |
| **HTTP Client** | Axios |

## 🎨 Design System

### Color Palette

```css
/* Background Colors */
--dark-900: #0a0a0f;    /* Darkest background */
--dark-800: #12121a;    /* Card backgrounds */
--dark-700: #1a1a24;    /* Elevated surfaces */
--dark-600: #22222e;    /* Borders & dividers */

/* Text Colors */
--text-primary: #ffffff;
--text-secondary: #94a3b8;  /* slate-400 */
--text-muted: #64748b;      /* slate-500 */

/* Accent Colors */
--blue-500: #3b82f6;    /* Primary actions */
--green-500: #22c55e;   /* Success states */
--yellow-500: #eab308;  /* Warnings */
--red-500: #ef4444;     /* Errors/Danger */
--purple-500: #a855f7;  /* Highlights */

/* Glassmorphism */
--glass-bg: rgba(255, 255, 255, 0.05);
--glass-border: rgba(255, 255, 255, 0.1);
--glass-blur: 10px;
```

### Typography

```css
/* Font Family */
font-family: 'Inter', system-ui, -apple-system, sans-serif;

/* Headings */
.h1 { font-size: 2.25rem; font-weight: 700; }
.h2 { font-size: 1.875rem; font-weight: 700; }
.h3 { font-size: 1.5rem; font-weight: 600; }
.h4 { font-size: 1.25rem; font-weight: 600; }

/* Body */
.body-lg { font-size: 1.125rem; }
.body { font-size: 1rem; }
.body-sm { font-size: 0.875rem; }
.caption { font-size: 0.75rem; }
```

### Spacing System

```css
/* Based on Tailwind's default spacing */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-12: 3rem;     /* 48px */
```

### Border Radius

```css
--radius-sm: 0.375rem;  /* 6px */
--radius-md: 0.5rem;    /* 8px */
--radius-lg: 0.75rem;   /* 12px */
--radius-xl: 1rem;      /* 16px */
--radius-2xl: 1.5rem;   /* 24px */
--radius-full: 9999px;
```

## 📱 Components

### Layout Components

#### `Layout.tsx`
Main application layout dengan sidebar navigation dan content area.

```tsx
<Layout>
  <Sidebar />
  <main className="flex-1 overflow-auto">
    {children}
  </main>
</Layout>
```

#### `Sidebar.tsx`
Navigation menu dengan:
- Logo & branding
- Navigation links dengan icons
- Active state indicators
- User profile section
- Logout button

### Page Components

#### `DashboardView.tsx`
Home page featuring:
- Statistics cards (Total Vendors, Top Recommendation, etc.)
- Recent data table preview
- Interactive hero section
- Scrollytelling guide

#### `AnalysisView.tsx`
TOPSIS analysis page:
- Weight configuration sliders
- Real-time validation (total = 100%)
- Run analysis button
- Results display (top 10)
- Bar chart visualization
- Radar chart comparison

#### `CalculationView.tsx`
Step-by-step calculation display:
- Decision Matrix (X)
- Normalized Matrix (R)
- Weighted Matrix (Y)
- Ideal Solutions (A+ & A-)
- Distance calculations (D+ & D-)
- Final scores & ranking

#### `DataView.tsx`
Data management:
- Full data table
- Add new vendor form
- Edit existing vendors
- Delete confirmation
- Export to CSV

#### `HistoryView.tsx`
Calculation history:
- List of past calculations
- Date & timestamp
- Weights used
- Top results
- Trend chart

#### `SettingsView.tsx`
User settings:
- Profile information
- Change password
- Preferences

#### `LoginView.tsx`
Authentication:
- Username/password form
- JWT token handling
- Error messages
- Remember me option

### UI Components

#### `ParticleBackground.tsx`
Animated particle effect background using canvas.

#### `InteractiveHero.tsx`
Hero section dengan:
- Animated title
- Subtitle
- Call-to-action buttons
- Scroll indicator

#### `ScrollytellingSection.tsx`
Scroll-triggered content sections explaining the TOPSIS process.

#### `LiquidLoader.tsx`
Custom loading animation.

#### `AnimatedText.tsx`
Text animation component untuk headings.

#### `Chart3D.tsx`
Three.js based 3D visualization.

#### `MorphingChart.tsx`
Animated chart transitions.

#### `HistoryTrendChart.tsx`
Line chart untuk history trends.

## 🔄 State Management

### Context API
- `ThemeContext.tsx` - Theme preferences

### Component State
- `useState` for local component state
- `useEffect` for side effects & data fetching

### API Integration
- Axios-based API service (`services/api.ts`)
- JWT token storage in localStorage
- Automatic token injection in requests

## 📊 Charts

### Recharts Components Used
- `BarChart` - Ranking visualization
- `RadarChart` - Multi-criteria comparison
- `LineChart` - History trends
- `PieChart` - Weight distribution

### Chart Configuration
```tsx
// Example Bar Chart
<BarChart data={data} layout="vertical">
  <XAxis type="number" />
  <YAxis dataKey="name" type="category" />
  <Bar dataKey="score" fill="#3b82f6" />
  <Tooltip />
</BarChart>
```

## 🎭 Animations

### Framer Motion
```tsx
import { motion } from 'framer-motion';

// Fade in animation
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>

// Hover effects
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Click me
</motion.button>
```

### CSS Animations (Tailwind)
```css
/* Custom animations in index.css */
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-up {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.animate-fade-in { animation: fade-in 0.5s ease-out; }
.animate-slide-up { animation: slide-up 0.5s ease-out; }
```

## 🔐 Authentication Flow

```
1. User enters credentials on LoginView
2. POST /api/login with username/password
3. Server validates & returns JWT token
4. Token stored in localStorage
5. Axios interceptor adds token to all requests
6. Protected routes check for valid token
7. Logout clears token & redirects to login
```

## 📱 Responsive Design

### Breakpoints (Tailwind)
```css
sm: 640px   /* Small devices */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large screens */
```

### Responsive Patterns
```tsx
// Grid responsive
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

// Sidebar hide on mobile
<aside className="hidden lg:block w-64">

// Stack on mobile, row on desktop
<div className="flex flex-col md:flex-row">
```

## 🚀 Performance

### Optimizations
- Vite for fast HMR & builds
- Code splitting by route
- Lazy loading components
- Memoization with `useMemo` & `useCallback`
- Optimized re-renders

### Bundle Size
- Tree-shaking enabled
- Production builds minified
- CSS purging via Tailwind

## 📁 File Organization

```
src/
├── components/          # React components
│   ├── Layout.tsx       # Main layout
│   ├── Sidebar.tsx      # Navigation
│   ├── DashboardView.tsx
│   ├── AnalysisView.tsx
│   └── ...
├── services/
│   └── api.ts           # API client
├── context/
│   └── ThemeContext.tsx # Theme state
├── App.tsx              # Root component
├── main.tsx             # Entry point
└── index.css            # Global styles
```

---

**Version**: 2.0
**Framework**: React 18 + TypeScript
**Last Updated**: January 2026
