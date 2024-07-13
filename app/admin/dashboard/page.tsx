/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import React, { useState, useEffect } from 'react'
import ShowExpiryModal from '@/app/component/showExpiryModal/page'
import { useRouter } from 'next/navigation'
import nookies from "nookies"
import jwt, { JwtPayload } from "jsonwebtoken"
import { toast } from 'sonner'

export default function DashBoard() {
    const router = useRouter()
    const cookies = nookies.get()
    const adminToken = cookies.adminToken

    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const getAdminToken = jwt.decode(adminToken) as JwtPayload | null

    useEffect(() => {
        // const checkAuthentication = async () => {
        //     if (!adminToken) {
        //         setIsModalOpen(true)
        //         return
        //     }
            const checkTokenExpiration = async () => {
                try {
                    const tokenResponse = await fetch('/api/admin/check-token', { credentials: 'include' });
                    if (!tokenResponse.ok) {
                        toast.error('Network response was not ok')
                    }

                    const tokenResult = await tokenResponse.json()
                    if (tokenResult.tokenExpired) {
                        setIsModalOpen(true)
                    } else {
                        setIsAuthenticated(true)
                    }
                } catch (err) {
                    setIsModalOpen(true)
                }
            }

                if (adminToken) {
                    checkTokenExpiration()
                } else {
                    setIsModalOpen(true)
                }
        //     };

        //     checkTokenExpiration();
        // }
        // checkAuthentication()
    }, [])

    // useEffect(() => {
    //     const checkTokenExpiration = async () => {
    //         const response = await fetch('/admin/dashboard');
    //         if (response.headers.get('token-expired') === 'true') {
    //             setIsModalOpen(true);
    //         }
    //     };

    //     checkTokenExpiration();
    // }, []);

    return (
        <>
            <title>Dashboard</title>
            {isAuthenticated ? (
                <div>Hello</div>
            ) : (
                <ShowExpiryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            )}
        </>
        // <Image src='/bookIssueHubIcon1.svg' alt='icon' width="200" height="200" />
    )
}
