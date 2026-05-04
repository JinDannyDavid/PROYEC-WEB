// src/layouts/PublicLayout.tsx

import WaterBackground from '@/shared/ui/WaterBackground';
import Head from 'next/head';
import React, { ReactNode } from 'react';

interface PublicLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ 
  children, 
  title = 'JASS Palian - Gestión de Agua', 
  description = 'Junta Administradora de Servicios de Saneamiento de Palian - Huancayo' 
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <WaterBackground>
        <div className="min-h-screen">
          {children}
        </div>
      </WaterBackground>
    </>
  );
};

export default PublicLayout;