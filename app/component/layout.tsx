import React from 'react';

export default function ComponentLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className='h-screen'>
            {children}
        </main>
    );
}
