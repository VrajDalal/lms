/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import React, { useState, useEffect } from 'react'
import ShowExpiryModal from '@/app/component/showExpiryModal/page'
import { useRouter } from 'next/navigation'
import nookies from "nookies"
import jwt, { JwtPayload } from "jsonwebtoken"
import { toast } from 'sonner'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Loader, LogOut } from "lucide-react"

export default function DashBoard() {
    const router = useRouter()
    const cookies = nookies.get()
    const adminToken = cookies.adminToken

    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [currentView, setCurrentView] = useState('dashboard')
    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setIsScrolled(true)
            } else {
                setIsScrolled(false)
            }
        }
        window.addEventListener('scroll', handleScroll)

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

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

                if (!tokenResponse.ok) {
                    setIsModalOpen(true)
                    toast.error('Session expired')
                }

                const tokenResult = await tokenResponse.json()
                if (tokenResult.tokenExpired) {
                    setIsModalOpen(true)
                    clearInterval(interval)
                } else {
                    setIsAuthenticated(true)
                }
            } catch (err) {
                setIsModalOpen(true)
                clearInterval(interval)
            }
        }

        if (adminToken) {
            checkTokenExpiration()
        } else {
            setIsModalOpen(true)
        }

        const interval = setInterval(() => {
            checkTokenExpiration()
        }, 10000)

        return () => clearInterval(interval)
    }, [adminToken])

    const handleLogout = () => {
        nookies.destroy(null, 'adminToken', { path: '/' })
        router.push('/admin/login')
    }

    const handleViewChange = (view: any) => {
        setCurrentView(view)
    }

    return (
        <>
            <title>Dashboard</title>
            {isAuthenticated ? (
                <nav className={`sticky top-0 z-50 px-1 py-2 border-2 flex items-center justify-between bg-white bg-opacity-70 transition ${isScrolled ? 'backdrop-blur-md' : 'backdrop-blur-none'}`}>
                    <div className="p-2">
                        <h1 onClick={() => handleViewChange('dashboard')} className="text-2xl font-bold cursor-pointer">Book Issue Hub</h1>
                    </div>
                    <div className="flex items-center">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Avatar className='cursor-pointer'>
                                    <AvatarImage src='/user-stroke-rounded.svg' className='border-4 border-white' />
                                    {/* <AvatarFallback>CN</AvatarFallback> */}
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuItem className='cursor-pointer' onClick={handleLogout}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </nav>
            ) : (
                <ShowExpiryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            )}
        </>
    )
}