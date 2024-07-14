'use client'

import * as React from "react";
import { useState } from 'react';
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
import { Pagination, Navigation, Autoplay } from "swiper/modules";

export default function Admin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

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
            console.log(adminLoginResponse);

            const adminLoginResult = await adminLoginResponse.json()
            console.log(adminLoginResult);
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

    return (
        <>
            <title>Book Issue Hub Admin</title>
            <div className="flex flex-col md:flex-row h-full" onContextMenu={handleContextMenu}>
                {/* For Corousel Images*/}
                <div className="flex justify-center items-center w-full md:w-1/2">

                    <Swiper
                        pagination={{ clickable: false }}
                        autoplay={{ delay: 2500, disableOnInteraction: false }}
                        modules={[Pagination, Navigation, Autoplay]}
                        className="w-screen h-screen"
                    >
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

                {/*Login Form*/}
                <div className="flex justify-center items-center w-full md:-w-1/2 bg-[#F8F4EF]">
                    <div className="flex flex-col items-center">
                        <div className="mb-6">
                            <Image src="/logo.jpeg" alt="Logo" width={250} height={250} className="rounded-full" />
                        </div>
                        <div className=" rounded-lg w-full sm:max-w-xs md:max-w-sm lg:max-w-lg ">
                            <div className="flex justify-center items-center">
                                <h1 className="text-2xl sm:text-3xl md:text-2xl lg:text-5xl xl:text-6xl  font-bold">Login</h1>
                            </div>
                            <form className="mb-4" onSubmit={handleAdminLogin}>

                                {/* Username Section */}
                                <div className="mb-4">
                                    <label htmlFor="txtUsername" className="block text-sm sm:text-sm md:text-1xl lg:text-2xl xl:text-3xl text-black mb-2">Username</label>
                                    <Input type="text" name="username" value={username} onChange={e => setUsername(e.target.value)} className="w-full p-2 pl-10 text-lg text-gray-700" />
                                </div>

                                {/* Password Section */}
                                <div className="mb-4">
                                    <label htmlFor="txtPassword" className="block text-sm sm:text-sm md:text-1xl lg:text-2xl xl:text-3xl text-black mb-2">Password</label>
                                    <Input type="password" name="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-2 pl-10 text-lg text-gray-700" />
                                </div>

                                <div className="flex justify-center mb-4">
                                    <Button type="submit" className="bg-zinc-950 hover:bg-zinc-700 text-white font-bold py-2 px-4 w-full rounded">Login</Button>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
