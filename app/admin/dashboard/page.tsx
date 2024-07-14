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
        const checkTokenExpiration = async () => {
            try {
                const tokenResponse = await fetch('/api/admin/check-token', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                });
                console.log(tokenResponse);
                if (!tokenResponse.ok) {
                    toast.error('Session expired')
                }

                const tokenResult = await tokenResponse.json()
                console.log(tokenResult);
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

        // const interval = setInterval(() => {
        //     checkTokenExpiration()
        // }, 1000)

        // return () => clearInterval(interval)
    }, [adminToken])

    return (
        <>
            <title>Dashboard</title>
            {isAuthenticated ? (
                <div>Hello</div>
            ) : (
                <ShowExpiryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            )}
        </>
    )
}
