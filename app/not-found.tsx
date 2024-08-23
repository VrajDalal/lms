import React from 'react'
import Image from 'next/image'

export default function NotFound() {
    return (
        <>
            <div className='fixed inset-0 flex items-center justify-center bg-transparent'>
                <Image alt='book loader' src='/notfound.svg' width={800} height={800} priority />
            </div>
        </>
    )
}
