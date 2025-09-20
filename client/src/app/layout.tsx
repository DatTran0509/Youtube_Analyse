import { ClerkProvider } from '@clerk/nextjs';
import Footer from '@/components/Footer';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
      afterSignUpUrl="/analysis"
      afterSignInUrl="/analysis"
    >
      <html lang="en">
        <body className="flex flex-col min-h-screen">
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  )
}