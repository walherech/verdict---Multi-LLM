# Chorus - 4 AI Minds in Perfect Harmony

A Next.js 14 application that leverages multiple AI models to solve complex problems through collaborative intelligence.

## Features

- **Multi-LLM Collaboration**: Perplexity, Claude, GPT-4, and Grok work together
- **Beautiful UI**: Modern design with purple-to-blue gradients and smooth animations
- **Real-time Progress**: Visual progress tracking during problem solving
- **Responsive Design**: Works perfectly on all devices
- **TypeScript**: Full type safety throughout the application

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Backend**: n8n webhook integration

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
app/
├── page.tsx              # Landing page
├── solve/
│   └── page.tsx          # Problem solver interface
├── api/
│   └── solve/
│       └── route.ts      # API endpoint for n8n webhook
└── layout.tsx            # Root layout

components/
├── hero.tsx              # Landing page hero section
├── features.tsx          # Features showcase
├── pricing.tsx           # Pricing plans
├── problem-solver.tsx    # Problem input and progress
├── results-display.tsx   # Results presentation
└── ui/                   # shadcn/ui components
```

## API Integration

The application integrates with an n8n webhook at:
```
https://irs-disruptor.app.n8n.cloud/webhook/solve-problem
```

The webhook receives a JSON payload with the problem description and returns the collaborative AI solution.

## Design System

- **Colors**: Purple (#7c3aed) to Blue (#2563eb) gradients
- **Typography**: Inter font family
- **Animations**: Smooth transitions and micro-interactions
- **Accessibility**: WCAG AA compliant

## Deployment

The application is ready for deployment on Vercel, Netlify, or any other Next.js-compatible platform.

## License

MIT License

