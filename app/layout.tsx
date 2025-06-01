import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'ShamsJSON - Advanced JSON Viewer & Editor',
    template: '%s | ShamsJSON'
  },
  description: 'ShamsJSON is a powerful, feature-rich JSON viewer and editor. Format, validate, search, transform, and visualize JSON data with an intuitive interface. Perfect for developers and data analysts.',
  keywords: [
    'JSON viewer',
    'JSON editor',
    'JSON formatter',
    'JSON validator',
    'JSON parser',
    'JSON transformer',
    'JSON visualizer',
    'data visualization',
    'developer tools',
    'web tools'
  ],
  authors: [{ name: 'shamscorner' }],
  creator: 'ShamsCorner LLC',
  publisher: 'ShamsCorner LLC',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'ShamsJSON - Advanced JSON Viewer & Editor',
    description: 'ShamsJSON is a powerful, feature-rich JSON viewer and editor. Format, validate, search, transform, and visualize JSON data with an intuitive interface.',
    siteName: 'ShamsJSON',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ShamsJSON - Advanced JSON Viewer & Editor',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ShamsJSON - Advanced JSON Viewer & Editor',
    description: 'ShamsJSON is a powerful, feature-rich JSON viewer and editor. Format, validate, search, transform, and visualize JSON data with an intuitive interface.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'ShamsJSON',
    description: 'ShamsJSON is a powerful, feature-rich JSON viewer and editor. Format, validate, search, transform, and visualize JSON data with an intuitive interface.',
    url: 'https://jsontool.shamscorner.com',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    creator: {
      '@type': 'Person',
      name: 'Shams Corner',
    },
    featureList: [
      'JSON Formatting and Validation',
      'JSON Visualization and Tree View',
      'JSON Search and Filtering',
      'JSON Transformation',
      'Syntax Highlighting',
      'File Import/Export',
    ],
  }

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
