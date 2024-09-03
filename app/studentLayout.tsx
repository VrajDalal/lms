"use client";

import React from "react";
import { Toaster } from "sonner";
import { usePathname } from "next/navigation";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const isAdminPage = pathname.startsWith('/admin')

    return (
        <>
            <Toaster position="bottom-center" richColors closeButton />
            {isAdminPage ? (
                <>
                    <div className="hidden md:block">{children}</div>
                    <div className="block md:hidden text-center text-xl p-5">
                        This website is not available on small devices. Please use a tablet or large device.
                    </div>
                </>
            ) : (
                <div className="block">{children}</div>
            )}
        </>
    );
}
