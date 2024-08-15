import React from 'react';
import Image from 'next/image';

export default function Loading() {
    return (
        <div className='fixed inset-0 flex items-center justify-center bg-transparent'>
            <Image alt='book loader' src='/book_loader_animation.gif' width={200} height={200} unoptimized/>
        </div>
    );
}
