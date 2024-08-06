import React from 'react'
import Image from 'next/image'

export default function ShowSuccessGif() {
    return (
        <>
            <div className="fixed inset-0 text-xl flex justify-center items-center p-4">
                <Image src="/successfull.gif" alt="Success" unoptimized width={200} height={200} />
            </div>
        </>
    )
}
