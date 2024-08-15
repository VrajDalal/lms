'use client'

import * as React from "react";
import { useState,use } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"; //eye icon on password
import Loading from "@/components/loading"

export default function Admin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(true)
    const router = useRouter();

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 2000)
    }, [])

    // useAuth()
    const handleAdminLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!username || !password) {
                toast.info("Username and password are mandatory");
                return;
            }

            const adminLoginResponse = await fetch('/api/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password }),
                credentials: 'include'
            })

            const adminLoginResult = await adminLoginResponse.json()
            if (adminLoginResult.success) {
                router.push('/admin/dashboard');
            } else {
                toast.error("Invalid username or password");
            }
        } catch (error) {
            toast.error("Authentication failed");
        }
    };

    const handleContextMenu = (e: React.FormEvent) => {
        e.preventDefault();
    };

    const env = {
        theme: {
            extends: {
                screens: {
                    '4k': '2560px',
                }
            }
        }
    }

    return (
        <>
            <title>Book Issue Hub</title>
            {loading && (
                <div className="loader-overlay loader-container">
                    <Loading />
                </div>
            )}
            <div className={`main-content ${loading ? 'blur' : ''}`}>
                <div className="flex flex-col md:flex-row min-h-screen overflow-hidden">
                    <div className="flex justify-center items-center w-full md:w-1/2 h-full">
                        <Swiper
                            pagination={{ clickable: false }}
                            autoplay={{ delay: 2500, disableOnInteraction: false }}
                            navigation={false} // add navigation if needed
                            modules={[Pagination, Navigation, Autoplay]}
                            loop={true}
                            speed={2000}
                            className="w-full h-full">
                            <SwiperSlide>
                                <Image src="/login-corousal-1.jpg" alt="Image 1" width={1200} height={675} className="object-cover w-full h-screen" />
                            </SwiperSlide>
                            <SwiperSlide>
                                <Image src="/login-corousal-2.jpg" alt="Image 2" width={1200} height={675} className="object-cover w-full h-screen" />
                            </SwiperSlide>
                            <SwiperSlide>
                                <Image src="/login-corousal-3.jpg" alt="Image 3" width={1200} height={675} className="object-cover w-full h-screen" />
                            </SwiperSlide>
                        </Swiper>
                    </div>

                    {/* Login Form */}
                    <div className="flex justify-center items-center h-screen w-full md:w-1/2 bg-[#F8F4EF]">
                        <div className="flex flex-col items-center w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-3/4 4k:w-3/4 p-6">
                            <div>
                                <Image src="/logo.jpeg" alt="Logo" width={150} height={150} className="rounded-full" />
                            </div>
                            <h3 className="text-xl sm:text-1xl md:text-2xl lg:text-3xl 4k:text-4xl md:text-center font-serif mt-6 mb-5">Welcome to Book Issue Hub</h3>
                            <div className="w-full max-w-sm lg:max-w-md">
                                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl 4k:text-7xl text-center font-bold mb-6">Login</h1>
                                <form className="space-y-6" onSubmit={handleAdminLogin}>

                                    {/* Username Section */}
                                    <div className="mt-4">
                                        <label htmlFor="txtUsername" className="block text-sm sm:text-lg 4k:text-4xl md:text-xl font-medium text-black mb-2">Username</label>
                                        <Input type="text" name="username" autoFocus value={username} onChange={e => setUsername(e.target.value)} className="w-full p-2 sm:p-4 text-base sm:text-lg bg-transparent border-0 border-b-2 border-gray-300 text-gray-700" />
                                    </div>

                                    {/* Password Section */}
                                    <div className="mt-4 relative">
                                        <label htmlFor="txtPassword" className="block text-sm sm:text-lg md:text-xl 4k:text-4xl font-medium text-black mb-2">Password</label>
                                        <Input type={showPassword ? 'text' : 'password'} name="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-2 sm:p-4 text-base sm:text-lg bg-transparent border-0 border-b-2 border-gray-300 text-gray-700" />
                                        <button type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                                        >
                                            {showPassword ? <AiFillEyeInvisible className="hover:cursor-pointer mt-8" size={24} /> : <AiFillEye className="hover:cursor-pointer mt-8" size={24} />}
                                        </button>
                                    </div>

                                    {/* Login Button */}
                                    <div className="flex justify-center mb-4">
                                        <Button type="submit" className="bg-zinc-950 hover:bg-zinc-700 text-white font-bold py-2 sm:py-3 md:py-4 4k:py-8 px-8 sm:px-10 md:px-12 4k:px-16 text-base sm:text-lg md:text-xl 4k:text-4xl w-full rounded">Login</Button>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}