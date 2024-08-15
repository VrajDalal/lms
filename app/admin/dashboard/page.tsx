/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import React, { useState, useEffect } from 'react'
import ShowExpiryModal from '@/app/component/showExpiryModal/page'
import { useRouter } from 'next/navigation'
import nookies from "nookies"
import jwt, { JwtPayload } from "jsonwebtoken"
import { toast } from 'sonner'
import Link from 'next/link'
import Image from 'next/image'
import Loading from '@/app/loading'

export default function DashBoard() {
    const router = useRouter()
    const cookies = nookies.get()
    const adminToken = cookies.adminToken

    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [loading, setLoading] = useState(false)
    const [tokenExpired, setTokenExpired] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const [isNameColumnVisible, setIsNameColumnVisible] = useState(true);
    const [nameColumnLeft, setNameColumnLeft] = useState('0px');
    const [isNavOpen, setIsNavOpen] = useState(false);

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
            <title>Dashboard</title>
            {loading && <Loading />}
            {isAuthenticated && !tokenExpired ? (
                <>
                    <nav className={`sticky top-0 z-50 px-1 py-1 pt-5 pb-5 ml-auto border-2 bg-[#F8F4EF] bg-opacity-85 transition ${isScrolled ? 'backdrop-blur-md' : 'backdrop-blur-none'}`}>
                        <div className="py-0 px-2 flex items-center justify-between">
                            {/* Toggle Button to open Vertical Menu */}
                            <button onClick={handleToggleNav} className='bg-[#F8F4EF] pl-1'>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
                                    <path d="M4 5L20 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M4 12L20 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M4 19L20 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>

                            {/* Center: Title */}
                            <h1 className="text-2xl font-bold text-center flex-grow">Book Issue Hub</h1>

                            {/* Right: Notification Icon */}
                            <div className="flex items-center mr-10">
                                <button onClick={() => console.log("Notification icon clicked")} className="focus:outline-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none">
                                        <path d="M2.52992 14.7696C2.31727 16.1636 3.268 17.1312 4.43205 17.6134C8.89481 19.4622 15.1052 19.4622 19.5679 17.6134C20.732 17.1312 21.6827 16.1636 21.4701 14.7696C21.3394 13.9129 20.6932 13.1995 20.2144 12.5029C19.5873 11.5793 19.525 10.5718 19.5249 9.5C19.5249 5.35786 16.1559 2 12 2C7.84413 2 4.47513 5.35786 4.47513 9.5C4.47503 10.5718 4.41272 11.5793 3.78561 12.5029C3.30684 13.1995 2.66061 13.9129 2.52992 14.7696Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M8 19C8.45849 20.7252 10.0755 22 12 22C13.9245 22 15.5415 20.7252 16 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </nav>

                    {/* Vertical Navigation Bar */}

                    <div>
                        <nav className={`fixed top-0 left-0 h-screen bg-[#F8F4EF] shadow-md transition-all duration-300 ${isNavOpen ? 'w-56' : 'w-16'}`}>
                            <div className={`flex justify-center mt-20 transition-opacity duration-200 ${isNavOpen ? 'opacity-100' : 'opacity-0'}`}>
                                <Image src="/logo.jpeg" width={100} height={100} alt="Logo" loading='lazy' />
                            </div>

                            <ul className='list-none p-4'>
                                <li className='mt-8'>
                                    <Link href="/admin/dashboard">
                                        <div className='flex items-center'>
                                            <div className='icon-column' title='Dashboard'>
                                                <svg className='mr-4' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
                                                    <path d="M8.9995 22L8.74887 18.4911C8.61412 16.6046 10.1082 15 11.9995 15C13.8908 15 15.3849 16.6046 15.2501 18.4911L14.9995 22" stroke="currentColor" strokeWidth="1.5" />
                                                    <path d="M2.35157 13.2135C1.99855 10.9162 1.82204 9.76763 2.25635 8.74938C2.69065 7.73112 3.65421 7.03443 5.58132 5.64106L7.02117 4.6C9.41847 2.86667 10.6171 2 12.0002 2C13.3832 2 14.5819 2.86667 16.9792 4.6L18.419 5.64106C20.3462 7.03443 21.3097 7.73112 21.744 8.74938C22.1783 9.76763 22.0018 10.9162 21.6488 13.2135L21.3478 15.1724C20.8473 18.4289 20.5971 20.0572 19.4292 21.0286C18.2613 22 16.5538 22 13.139 22H10.8614C7.44652 22 5.73909 22 4.57118 21.0286C3.40327 20.0572 3.15305 18.4289 2.6526 15.1724L2.35157 13.2135Z" stroke="currentColor" strokeWidth="1.5" />
                                                </svg>
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
                                            <div className='icon-column' title='Students Corner'>
                                                <svg className='mr-4' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
                                                    <path d="M19 5L12 2L5 5L8.5 6.5V8.5C8.5 8.5 9.66667 8 12 8C14.3333 8 15.5 8.5 15.5 8.5V6.5L19 5ZM19 5V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M15.5 8.5V9.5C15.5 11.433 13.933 13 12 13C10.067 13 8.5 11.433 8.5 9.5V8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M7.78256 16.7033C6.68218 17.3878 3.79706 18.7854 5.55429 20.5342C6.41269 21.3885 7.36872 21.9995 8.57068 21.9995H15.4293C16.6313 21.9995 17.5873 21.3885 18.4457 20.5342C20.2029 18.7854 17.3178 17.3878 16.2174 16.7033C13.6371 15.0982 10.3629 15.0982 7.78256 16.7033Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
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
                                            <div className='icon-column' title='Issue Book'>
                                                <svg className='mr-4' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
                                                    <path d="M20.5 16.9286V10C20.5 6.22876 20.5 4.34315 19.3284 3.17157C18.1569 2 16.2712 2 12.5 2H11.5C7.72876 2 5.84315 2 4.67157 3.17157C3.5 4.34315 3.5 6.22876 3.5 10V19.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                    <path d="M20.5 17H6C4.61929 17 3.5 18.1193 3.5 19.5C3.5 20.8807 4.61929 22 6 22H20.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                    <path d="M20.5 22C19.1193 22 18 20.8807 18 19.5C18 18.1193 19.1193 17 20.5 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                    <path d="M15 7L9 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M12 11L9 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
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
                                            <div className='icon-column' title='History'>
                                                <svg className='mr-4' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
                                                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C7.52232 2 3.77426 4.94289 2.5 9H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M12 8V12L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M2 12C2 12.3373 2.0152 12.6709 2.04494 13M9 22C8.6584 21.8876 8.32471 21.7564 8 21.6078M3.20939 17C3.01655 16.6284 2.84453 16.2433 2.69497 15.8462M4.83122 19.3065C5.1369 19.6358 5.46306 19.9441 5.80755 20.2292" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
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
                                            <div className='icon-column' title='Library'>
                                                <svg className='mr-4' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
                                                    <path d="M3 16H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M2 22L22 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M3 9H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M3 22V8C3 5.17157 3 3.75736 3.93037 2.87868C4.86073 2 6.35814 2 9.35294 2H14.6471C17.6419 2 19.1393 2 20.0696 2.87868C21 3.75736 21 5.17157 21 8V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M11 19H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M10 9L9 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M6.5 9V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M14 16V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M12 9V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M16 16L17 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M19 16V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                            <div className={`text-column transition-opacity duration-200 ${isNavOpen ? 'opacity-100' : 'opacity-0'}`}>
                                                Library
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                                <li className='mt-16'>
                                    <button onClick={handleLogout} className='w-full text-left flex items-center'>
                                        <div className='icon-column' title='Logout'>
                                            <svg className='mr-4' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
                                                <path d="M15.75 8.75V6.2C15.75 4.86934 14.6318 3.75 13.3 3.75H7.45C6.1183 3.75 5 4.86934 5 6.2V17.8C5 19.1307 6.1183 20.25 7.45 20.25H13.3C14.6318 20.25 15.75 19.1307 15.75 17.8V15.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M8.75 12H20.25M20.25 12L17.25 9M20.25 12L17.25 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
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
        </>
    )
}