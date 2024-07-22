/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import React, { useState, useEffect, MouseEventHandler } from 'react'
import ShowExpiryModal from '@/app/component/showExpiryModal/page'
import { useRouter } from 'next/navigation'
import nookies from "nookies";
import Link from 'next/link';
import Image from 'next/image';
import { Icon } from 'lucide-react';
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


    // useEffect(() => {
    //     const handleScroll = () => {
    //         if (window.scrollY > 0) {
    //             setIsScrolled(true)
    //         } else {
    //             setIsScrolled(false)
    //         }
    //     }
    //     window.addEventListener('scroll', handleScroll)

    //     return () => {
    //         window.removeEventListener('scroll', handleScroll)
    //     }
    // }, [])

    // const getAdminToken = jwt.decode(adminToken) as JwtPayload | null

    // useEffect(() => {
    //     const checkTokenExpiration = async () => {
    //         try {
    //             const tokenResponse = await fetch('/api/admin/check-token', {
    //                 method: 'GET',
    //                 headers: {
    //                     'Content-Type': 'application/json'
    //                 },
    //                 credentials: 'include'
    //             });

    //             if (!tokenResponse.ok) {
    //                 setIsModalOpen(true)
    //                 toast.error('Session expired')
    //             }

    //             const tokenResult = await tokenResponse.json()
    //             if (tokenResult.tokenExpired) {
    //                 setIsModalOpen(true)
    //                 clearInterval(interval)
    //             } else {
    //                 setIsAuthenticated(true)
    //             }
    //         } catch (err) {
    //             setIsModalOpen(true)
    //             clearInterval(interval)
    //         }
    //     }

    //     if (adminToken) {
    //         checkTokenExpiration()
    //     } else {
    //         setIsModalOpen(true)
    //     }

    //     const interval = setInterval(() => {
    //         checkTokenExpiration()
    //     }, 10000)

    //     return () => clearInterval(interval)
    // }, [adminToken])

    const handleLogout = () => {
        nookies.destroy(null, 'adminToken', { path: '/' })
        router.push('/admin/login')
    }

    const handleViewChange = (view: any) => {
        setCurrentView(view)
    }
    const [isNameColumnVisible, setIsNameColumnVisible] = useState(false);
    const [nameColumnLeft, setNameColumnLeft] = useState('-230px');
    const [navWidth, setNavWidth] = useState('64px');

    const handleToggleNameColumn = () => {
        if (isNameColumnVisible) {
            setNavWidth('64px');
        } else {
            setNavWidth('220px');
        }
        setIsNameColumnVisible(!isNameColumnVisible);
    };


    return (
        <>
            <title>Dashboard</title>

            {/* Horizontal Navigation Bar */}

            <div style={{ flexDirection: 'column' }} className='h-screen'>
                <nav className={`sticky top-0 z-50 px-1 py-1 pt-5 pb-5 bg-[#F8F4EF] transition ${isScrolled ? 'backdrop-blur-md' : 'backdrop-blur-none'}`}>
                    <header className="bg-[#F8F4EF] py-0 text-center">
                        <div className="py-0 px-2 flex items-center justify-between">

                            {/* Toggle Button to open Vertical Menu */}

                            <button onClick={handleToggleNameColumn} className='bg-[#F8F4EF] p-2 sm:p-3 lg:p-4 focus:outline-none'>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
                                    <path d="M4 5L20 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M4 12L20 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M4 19L20 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                </svg></button>

                            {/* Center: Title */}
                            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-center flex-grow px-2 md:px-4 lg:px-6">Book Issue Hub</h1>

                            {/* Right: Notification Icon */}
                            <div className="flex items-center mr-4 sm:mr-6 lg:mr-10">
                                <button onClick={() => console.log("Notification icon clicked")} className="focus:outline-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none">
                                        <path
                                            d="M2.52992 14.7696C2.31727 16.1636 3.268 17.1312 4.43205 17.6134C8.89481 19.4622 15.1052 19.4622 19.5679 17.6134C20.732 17.1312 21.6827 16.1636 21.4701 14.7696C21.3394 13.9129 20.6932 13.1995 20.2144 12.5029C19.5873 11.5793 19.525 10.5718 19.5249 9.5C19.5249 5.35786 16.1559 2 12 2C7.84413 2 4.47513 5.35786 4.47513 9.5C4.47503 10.5718 4.41272 11.5793 3.78561 12.5029C3.30684 13.1995 2.66061 13.9129 2.52992 14.7696Z"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M8 19C8.45849 20.7252 10.0755 22 12 22C13.9245 22 15.5415 20.7252 16 19"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </header>
                </nav>
            </div >

            {/* Vertical Navigation Bar */}

            < div >
                <nav className="fixed top-0 left-0 h-screen bg-[#F8F4EF] shadow-md transition-width duration-1000 ease-in-out" style={{ width: navWidth }}>

                    {/* Left: Logo */}
                    <div className='name-column flex justify-center items-center mt-20 transition-left duration-1000 ease-in-out' style={{
                        position: 'relative',
                        left: isNameColumnVisible ? '0' : '-230px',
                    }}>
                        <Image src="/logo.jpeg" width={150} height={150} alt="Logo" />
                    </div>

                    {/* Menu Of Dashboard */}

                    <ul className='list-none p-4'>
                        <li className='mb-3'>
                            <Link href="/admin/dashboard">
                                <div className='flex items-center pt-10'>
                                    <div className='icon-column'>
                                        <svg className='mr-4' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
                                            <path d="M8.9995 22L8.74887 18.4911C8.61412 16.6046 10.1082 15 11.9995 15C13.8908 15 15.3849 16.6046 15.2501 18.4911L14.9995 22" stroke="currentColor" stroke-width="1.5" />
                                            <path d="M2.35157 13.2135C1.99855 10.9162 1.82204 9.76763 2.25635 8.74938C2.69065 7.73112 3.65421 7.03443 5.58132 5.64106L7.02117 4.6C9.41847 2.86667 10.6171 2 12.0002 2C13.3832 2 14.5819 2.86667 16.9792 4.6L18.419 5.64106C20.3462 7.03443 21.3097 7.73112 21.744 8.74938C22.1783 9.76763 22.0018 10.9162 21.6488 13.2135L21.3478 15.1724C20.8473 18.4289 20.5971 20.0572 19.4292 21.0286C18.2613 22 16.5538 22 13.139 22H10.8614C7.44652 22 5.73909 22 4.57118 21.0286C3.40327 20.0572 3.15305 18.4289 2.65261 15.1724L2.35157 13.2135Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                                        </svg>
                                    </div>
                                    <div className='name-column transition-left duration-1000 ease-in-out' style={{
                                        position: 'relative',
                                        left: isNameColumnVisible ? '0' : '-230px',
                                    }}>
                                        <span> Home </span>
                                    </div>
                                </div>

                            </Link>
                        </li>
                        <li className='mb-3'>
                            <Link href="/admin/dashboard">
                                <div className='flex items-center pt-10'>
                                    <div className='icon-column'>
                                        <svg className='mr-4' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
                                            <path d="M19 5L12 2L5 5L8.5 6.5V8.5C8.5 8.5 9.66667 8 12 8C14.3333 8 15.5 8.5 15.5 8.5V6.5L19 5ZM19 5V9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M15.5 8.5V9.5C15.5 11.433 13.933 13 12 13C10.067 13 8.5 11.433 8.5 9.5V8.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M7.78256 16.7033C6.68218 17.3878 3.79706 18.7854 5.55429 20.5342C6.41269 21.3885 7.36872 21.9995 8.57068 21.9995H15.4293C16.6313 21.9995 17.5873 21.3885 18.4457 20.5342C20.2029 18.7854 17.3178 17.3878 16.2174 16.7033C13.6371 15.0982 10.3629 15.0982 7.78256 16.7033Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </div>
                                    <div className='name-column transition-left duration-1000 ease-in-out' style={{
                                        position: 'relative',
                                        left: isNameColumnVisible ? '0' : '-230px',
                                    }}>
                                        <span> Student Corner </span>
                                    </div>
                                </div>
                            </Link>
                        </li>
                        <li className='mb-3'>
                            <Link href="/admin/dashboard">
                                <div className='flex items-center pt-10'>
                                    <div className='icon-column'>
                                        <svg className='mr-4' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
                                            <path d="M20.5 16.9286V10C20.5 6.22876 20.5 4.34315 19.3284 3.17157C18.1569 2 16.2712 2 12.5 2H11.5C7.72876 2 5.84315 2 4.67157 3.17157C3.5 4.34315 3.5 6.22876 3.5 10V19.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                                            <path d="M20.5 17H6C4.61929 17 3.5 18.1193 3.5 19.5C3.5 20.8807 4.61929 22 6 22H20.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                                            <path d="M20.5 22C19.1193 22 18 20.8807 18 19.5C18 18.1193 19.1193 17 20.5 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                                            <path d="M15 7L9 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M12 11L9 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </div>
                                    <div className='name-columntransition-left duration-1000 ease-in-out' style={{
                                        position: 'relative',
                                        left: isNameColumnVisible ? '0' : '-230px',
                                    }}>
                                        <span> Book Issue </span>
                                    </div>
                                </div>
                            </Link>
                        </li >
                        <li className='mb-3'>
                            <Link href="/admin/dashboard">
                                <div className='flex items-center pt-10'>
                                    <div className='icon-column'>
                                        <svg className='mr-4' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
                                            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C7.52232 2 3.77426 4.94289 2.5 9H5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M12 8V12L14 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M2 12C2 12.3373 2.0152 12.6709 2.04494 13M9 22C8.6584 21.8876 8.32471 21.7564 8 21.6078M3.20939 17C3.01655 16.6284 2.84453 16.2433 2.69497 15.8462M4.83122 19.3065C5.1369 19.6358 5.46306 19.9441 5.80755 20.2292" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </div>
                                    <div className='name-column transition-left duration-1000 ease-in-out' style={{
                                        position: 'relative',
                                        left: isNameColumnVisible ? '0' : '-230px',
                                    }}>
                                        <span> History </span>
                                    </div>
                                </div>
                            </Link>
                        </li>
                        <li className='mb-20'>
                            <Link href="/admin/dashboard">
                                <div className='flex items-center pt-10'>
                                    <div className='icon-column'>
                                        <svg className='mr-4' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
                                            <path d="M3 16H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M2 22L22 22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M3 9H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M3 22V8C3 5.17157 3 3.75736 3.93037 2.87868C4.86073 2 6.35814 2 9.35294 2H14.6471C17.6419 2 19.1393 2 20.0696 2.87868C21 3.75736 21 5.17157 21 8V22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M11 19H13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M10 9L9 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M6.5 9V5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M14 16V12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M12 9V5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M16 16L17 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M19 16V12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </div>
                                    <div className='name-column transition-left duration-1000 ease-in-out' style={{
                                        position: 'relative',
                                        left: isNameColumnVisible ? '0' : '-230px',
                                    }}>
                                        <span> Library </span>
                                    </div>
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link href="/admin/login">
                                <div className='flex items-center'>
                                    <div className='icon-column'>
                                        <svg className='mr-4' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
                                            <path d="M15 17.625C14.9264 19.4769 13.3831 21.0494 11.3156 20.9988C10.8346 20.987 10.2401 20.8194 9.05112 20.484C6.18961 19.6768 3.70555 18.3203 3.10956 15.2815C3 14.723 3 14.0944 3 12.8373L3 11.1627C3 9.90561 3 9.27705 3.10956 8.71846C3.70555 5.67965 6.18961 4.32316 9.05112 3.51603C10.2401 3.18064 10.8346 3.01295 11.3156 3.00119C13.3831 2.95061 14.9264 4.52307 15 6.37501" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                                            <path d="M21 12H10M21 12C21 11.2998 19.0057 9.99153 18.5 9.5M21 12C21 12.7002 19.0057 14.0085 18.5 14.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </div>
                                    <div className='name-column transition-left duration-1000 ease-in-out' style={{
                                        position: 'relative',
                                        left: isNameColumnVisible ? '0' : '-230px',
                                    }}>
                                        <span> LogOut </span>
                                    </div>
                                </div>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div >
        </>
    )
}