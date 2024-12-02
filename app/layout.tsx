import { Nunito } from 'next/font/google'

import LoginModal from '@/app/components/modals/LoginModal';
import RegisterModal from '@/app/components/modals/RegisterModal';
import SearchModal from '@/app/components/modals/SearchModal';
import RentModal from '@/app/components/modals/RentModal';

import ToasterProvider from '@/app/providers/ToasterProvider';

import './globals.css'
import ClientOnly from './components/ClientOnly';
import getCurrentUser from './actions/getCurrentUser';
import Footer from '@/app/components/footer/footer';

import SearchWrapper from './components/SearchWrapper'; // Import the new SearchWrapper

export const metadata = {
  title: 'Rent360',
  description: 'Rent your stuff',
}

const font = Nunito({ 
  subsets: ['latin'], 
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const currentUser = await getCurrentUser();

  return (
    <html lang="en" className='bg-white'>
      <body className={font.className}>
        <ClientOnly>
          <ToasterProvider />
          <LoginModal />
          <RegisterModal />
          <SearchModal />
          <RentModal />
          <SearchWrapper currentUser={currentUser} /> {/* Use the SearchWrapper component */}
        </ClientOnly>
        <div className="" style={{ marginBottom:'60px' }}>
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
