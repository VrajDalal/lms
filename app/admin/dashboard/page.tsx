/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import React, { useState, useEffect } from 'react'
import ShowExpiryModal from '@/app/component/showAdminExpiryModal'
import { useRouter } from 'next/navigation'
import nookies from "nookies"
import { AlignJustify, History, UserPlus, Bell, LibraryBig, House, LogOut, NotebookTabs } from "lucide-react";
import { toast } from 'sonner'
import Link from 'next/link'
import Image from 'next/image'
import Loading from "@/components/loading"

export default function DashBoard() {
    const router = useRouter()
    const cookies = nookies.get()
    const adminToken = cookies.adminToken

    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [loading, setLoading] = useState(false)
    const [tokenExpired, setTokenExpired] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const [isNavOpen, setIsNavOpen] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 2000)
    }, [])

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

    // const getAdminToken = jwt.decode(adminToken) as JwtPayload | null

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
                    setTokenExpired(true)
                    setIsModalOpen(true)
                    toast.error('Session expired')
                }

                const tokenResult = await tokenResponse.json()
                if (tokenResult.tokenExpired) {
                    setTokenExpired(true)
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

    const handleToggleNav = () => {
        setIsNavOpen(!isNavOpen);
    };

    return (
        <>
            {/* <title>Dashboard</title> */}
            {loading && (
                <div className="loader-overlay loader-container">
                    <Loading />
                </div>
            )}
            <div className={`main-content ${loading ? 'blur' : ''}`}>
                {isAuthenticated && !tokenExpired ? (
                    <>
                        <nav className={`fixed left-0 right-0 top-0 z-50 px-1 py-1 pt-5 pb-5 ml-auto border-2 bg-[#F8F4EF] bg-opacity-85 transition ${isScrolled ? 'backdrop-blur-md' : 'backdrop-blur-none'}`}>
                            <div className="py-0 px-2 flex items-center justify-between">
                                {/* Toggle Button to open Vertical Menu */}
                                <button onClick={handleToggleNav} className='bg-[#F8F4EF] pl-1'>
                                    <AlignJustify />
                                </button>

                                {/* Center: Title */}
                                <h1 className="text-2xl font-bold text-center flex-grow">Book Issue Hub</h1>

                                {/* Right: Notification Icon */}
                                {/* <div className="flex items-center mr-10">
                                    <button onClick={() => console.log("Notification icon clicked")} className="focus:outline-none">
                                        <Bell />
                                    </button>
                                </div> */}
                            </div>
                        </nav>

                        {/* Vertical Navigation Bar */}

                        <div>
                            <nav className={`fixed top-0 left-0 h-screen z-30 border-4 bg-[#F8F4EF] shadow-md transition-all duration-300 ${isNavOpen ? 'w-56' : 'w-16'}`}>
                                <div className={`flex justify-center mt-20 transition-opacity duration-200 ${isNavOpen ? 'opacity-100' : 'opacity-0'}`}>
                                    <Image src="/logo.jpeg" width={100} height={100} alt="Logo" loading='lazy' />
                                </div>

                                <ul className='list-none p-4'>
                                    <li className='mt-8'>
                                        <Link href="/admin/home">
                                            <div className='flex items-center'>
                                                <div className='icon-column mr-4' title='Dashboard'>
                                                    <House />
                                                </div>
                                                <div className={`text-column transition-opacity duration-200 ${isNavOpen ? 'opacity-100' : 'opacity-0'}`}>
                                                    Dashboard
                                                </div>
                                            </div>
                                        </Link>
                                    </li>
                                    <li className='mt-8'>
                                        <Link href="/admin/addstudents">
                                            <div className='flex items-center'>
                                                <div className='icon-column mr-4' title='Students Corner'>
                                                    <UserPlus />
                                                </div>
                                                <div className={`text-column transition-opacity duration-200 ${isNavOpen ? 'opacity-100' : 'opacity-0'}`}>
                                                    Students Corner
                                                </div>
                                            </div>
                                        </Link>
                                    </li>
                                    <li className='mt-8'>
                                        <Link href="/admin/issuebook">
                                            <div className='flex items-center'>
                                                <div className='icon-column mr-4' title='Issue Book'>
                                                    <NotebookTabs />
                                                </div>
                                                <div className={`text-column transition-opacity duration-200 ${isNavOpen ? 'opacity-100' : 'opacity-0'}`}>
                                                    Issue Book
                                                </div>
                                            </div>
                                        </Link>
                                    </li>
                                    <li className='mt-8'>
                                        <Link href="/admin/history">
                                            <div className='flex items-center'>
                                                <div className='icon-column mr-4' title='History'>
                                                    <History />
                                                </div>
                                                <div className={`text-column transition-opacity duration-200 ${isNavOpen ? 'opacity-100' : 'opacity-0'}`}>
                                                    History
                                                </div>
                                            </div>
                                        </Link>
                                    </li>
                                    <li className='mt-8'>
                                        <Link href="/admin/library">
                                            <div className='flex items-center'>
                                                <div className='icon-column mr-4' title='Library'>
                                                    <LibraryBig />
                                                </div>
                                                <div className={`text-column transition-opacity duration-200 ${isNavOpen ? 'opacity-100' : 'opacity-0'}`}>
                                                    Library
                                                </div>
                                            </div>
                                        </Link>
                                    </li>
                                    <li className='mt-16'>
                                        <button onClick={handleLogout} className='w-full bottom-auto text-left flex items-center'>
                                            <div className='icon-column mr-4' title='Logout'>
                                                <span className="text-xl">
                                                    <LogOut />
                                                </span>
                                            </div>
                                            <div className={`text-column transition-opacity duration-200 ${isNavOpen ? 'opacity-100' : 'opacity-0'}`}>
                                                Logout
                                            </div>
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        </div >
                    </>
                ) : (
                    <ShowExpiryModal isOpen={isModalOpen} />
                )}
            </div>
        </>
    )
}