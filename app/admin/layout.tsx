import React from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className='h-screen'>
            {children}
        </main>
    );
}
