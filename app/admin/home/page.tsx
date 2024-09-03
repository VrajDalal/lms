'use client'

import React, { useState, useEffect } from 'react'
import DashBoard from '../dashboard/page';
import Loading from "@/components/loading"
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import Image from 'next/image'


export default function Home() {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }, []);

    return (
        <>
            <DashBoard />
            <title>Home</title>
            {loading && (
                <div className="loader-overlay loader-container">
                    <Loading />
                </div>
            )}
            <div className={`main-content ${loading ? 'blur' : ''} `}>
                <div className='flex flex-col pl-18 pt-20 md:pl-24 lg:pl-16 pr-4 lg:pr-0 bg-[#FCFAF5] min-h-[98vh]'>
                    <div className="flex justify-center items-center w-full h-auto">
                        <Swiper
                            pagination={{ clickable: false }}
                            autoplay={{ delay: 2500, disableOnInteraction: false }}
                            navigation={false} // add navigation if needed
                            modules={[Pagination, Navigation, Autoplay]}
                            loop={true}
                            speed={2000}
                            className="w-full h-[60vh]">
                            <SwiperSlide>
                                <div className="relative w-full h-full">
                                    <Image src="/dashboard-corousal-1.jpg" alt="Image 1" layout="fill" objectFit="cover" priority />
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className="relative w-full h-full">
                                    <Image src="/dashboard-corousal-2.jpg" alt="Image 2" layout="fill" objectFit="cover" priority />
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className="relative w-full h-full">
                                    <Image src="/dashboard-corousal-3.jpg" alt="Image 3" layout="fill" objectFit="cover" priority />
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className="relative w-full h-full">
                                    <Image src="/dashboard-corousal-4.jpg" alt="Image 4" layout="fill" objectFit="cover" priority />
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className="relative w-full h-[92vh]">
                                    <Image src="/dashboard-corousal-5.jpg" alt="Image 5" layout="fill" objectFit="cover" priority />
                                </div>
                            </SwiperSlide>
                        </Swiper>
                    </div>
                    <div className="flex justify-center items-center py-16">
                        <p className="text-center text-2xl md:text-4xl lg:text-4xl font-bold text-gray-800 p-4 rounded">
                            "I have always imagined that <br></br>
                            Paradise will be a kind of a <br></br>
                            library."
                        </p>
                    </div>
                </div>
            </div>

        </>
    )
}
