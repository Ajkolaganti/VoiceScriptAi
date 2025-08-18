import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'VoiceScript AI - Advanced Audio Transcription | Convert Speech to Text',
  description: 'Transform your audio files into accurate text with our AI-powered transcription service. Fast, secure, and precise audio-to-text conversion using advanced speech recognition technology.',
  keywords: 'audio transcription, speech to text, voice recognition, AI transcription, audio conversion, transcript generator',
  authors: [{ name: 'VoiceScript AI' }],
  creator: 'VoiceScript AI',
  publisher: 'VoiceScript AI',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://voicescript-ai.com',
    title: 'VoiceScript AI - Advanced Audio Transcription',
    description: 'Transform your audio files into accurate text with our AI-powered transcription service.',
    siteName: 'VoiceScript AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VoiceScript AI - Advanced Audio Transcription',
    description: 'Transform your audio files into accurate text with our AI-powered transcription service.',
    creator: '@voicescriptai',
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#0891b2',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://voicescript-ai.com" />
        <meta name="google-site-verification" content="your-verification-code" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "VoiceScript AI",
              "description": "Advanced AI-powered audio transcription service",
              "url": "https://voicescript-ai.com",
              "applicationCategory": "UtilityApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            })
          }}
        />
      </head>
      <body className={`${inter.className} bg-slate-950 text-white`}>
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-cyan-950/20">
          {children}
        </div>
      </body>
    </html>
  );
}