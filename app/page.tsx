// app/page.tsx
import type { Metadata } from 'next'
import VisiBlendSimple from './components/VisiBlendEnhanced'

export const metadata: Metadata = {
  title: 'VisiBlend - AI Visual Blend Generator',
  description: 'Create unique visual blends using AI technology',
}

export default function Home() {
  return (
    <main className="min-h-screen">
      <VisiBlendSimple />
    </main>
  )
}