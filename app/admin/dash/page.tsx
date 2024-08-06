'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Calendar } from "@/components/ui/calendar"
import { Calendar as CalendarIcon } from "lucide-react"
import { format, parseISO, isValid } from "date-fns";
import DashBoard from '../dashboard/page'
import { toast } from 'sonner';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from '@/components/ui/button';

export default function History() {

    const [studentBookIssueHistory, setStudentBookIssueHistory] = useState([])
    const handleToGetStudentIssueBooks = async () => {
        try {
            const getStudentIssueBooksResponse = await fetch('/api/admin/issueBookHistory', {
                method: 'GET',
                headers: {
                    'Content-Type': 'applicaition/json'
                },
                credentials: 'include'
            })
            console.log(getStudentIssueBooksResponse);
            const getStudentIssueBooksResult = await getStudentIssueBooksResponse.json()
            console.log(getStudentIssueBooksResult);
            if (getStudentIssueBooksResult.success) {
                setStudentBookIssueHistory(getStudentIssueBooksResult.datas)
                console.log(studentBookIssueHistory);
            }
        } catch (error) {
            console.log(error);
            toast.error('An error occurred while fetch the student issue book data')
        }
    }
    // handleToGetStudentIssueBooks()
    return (
        <>
            <title>History</title>
            <DashBoard />
            <div className='flex flex-col pl-20  md:pl-24 lg:pl-64 pr-4 lg:pr-16 min-h-screen bg-[#FCFAF5]'>
                <div className="text-5xl font-bold mt-4">
                    <h1>History</h1>
                </div>
                <br />
                <hr />
                <div className='border-4 border-gray-300 rounded-3xl min-h-auto  bg-[#F8F4EF]  p-6 m-4 md:m-8 shadow-2xl'>
                    <form className='m-2'>
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
                            {/* Column 1 */}
                            <div className="flex flex-col  gap-2 mr-5">
                                <div className="flex items-center gap-2">
                                    <label htmlFor="studentSID" className="text-left text-sm lg:text-lg font-medium w-1/3">Student ID:</label>
                                    <Input id="studentSID" type="text" placeholder='Enter StudentId' className="mt-1 bg-transparent border-0 border-b-2 border-gray-500 flex-1" disabled />
                                </div>
                                <div className="flex items-center gap-2">
                                    <label htmlFor="studentName" className="text-left text-sm lg:text-lg font-medium w-1/3">Student Name:</label>
                                    <Input id="studentName" type="text" placeholder='Enter Name' className="mt-1 bg-transparent border-0 border-b-2 border-gray-500 flex-1" disabled />
                                </div>
                                <div className="flex items-center gap-2">
                                    <label htmlFor="course" className="text-left text-sm lg:text-lg font-medium w-1/3">Student Course:</label>
                                    <Input id="course" type="text" placeholder='Enter Course' className="mt-1 bg-transparent border-0 border-b-2 border-gray-500 flex-1" disabled />
                                </div>
                                <div className="flex items-center gap-2">
                                    <label htmlFor="bookName" className="text-left text-sm lg:text-lg font-medium w-1/3">Book Name:</label>
                                    <Input id="bookName" type="text" placeholder='Book Name' className="mt-1 bg-transparent border-0 border-b-2 border-gray-500 flex-1" disabled />
                                </div>
                            </div>

                            {/* Column 2 */}
                            <div className="flex flex-col gap-2 mr-5">
                                <div className="flex items-center gap-2">
                                    <label htmlFor="studentEnrollmentNo" className="text-left text-sm lg:text-lg font-medium w-1/3">Enrollment No:</label>
                                    <Input id="studentEnrollmentNo" type="text" placeholder='Enter Enrollment No' className="mt-1 bg-transparent border-0 border-b-2 border-gray-500 flex-1" disabled />
                                </div>
                                <div className="flex items-center gap-2">
                                    <label htmlFor="studentEmail" className="text-left text-sm lg:text-lg font-medium w-1/3">EmailID:</label>
                                    <Input id="studentEmail" type="email" placeholder='Enter EmailID' className="mt-1 bg-transparent border-0 border-b-2 border-gray-500 flex-1" disabled />
                                </div>
                                <div className="flex items-center gap-2">
                                    <label htmlFor="year" className="text-left text-sm lg:text-lg font-medium w-1/3">Academic Year:</label>
                                    <Input id="year" type="text" placeholder='Enter Year' className="mt-1 bg-transparent border-0 border-b-2 border-gray-500 flex-1" disabled />
                                </div>
                                <div className="flex items-center gap-2">
                                    <label htmlFor="issueDate" className="text-left text-sm lg:text-lg font-medium w-1/3">Issue Date:</label>
                                    <Input id="issueDate" type="text" placeholder='Enter Issue Date' className="mt-1 bg-transparent border-0 border-b-2 border-gray-500 flex-1" disabled />
                                </div>
                            </div>

                            {/* Column 3 */}
                            <div className="flex flex-col gap-2 ">
                                <div className="flex items-center gap-2">
                                    <label htmlFor="studentRollNo" className="text-left text-sm lg:text-lg font-medium w-1/3">Student Roll No:</label>
                                    <Input id="studentRollNo" type="text" placeholder='Enter Roll No' className="mt-1 bg-transparent border-0 border-b-2 border-gray-500 flex-1" disabled />
                                </div>
                                <div className="flex items-center gap-2">
                                    <label htmlFor="studentMobileNo" className="text-left text-sm lg:text-lg font-medium w-1/3">Mobile No:</label>
                                    <Input id="studentMobileNo" type="tel" placeholder='Enter Mobile No' className="mt-1 bg-transparent border-0 border-b-2 border-gray-500 flex-1" disabled />
                                </div>
                                <div className="flex items-center gap-2">
                                    <label htmlFor="division" className="text-left text-sm lg:text-lg font-medium w-1/3">Division:</label>
                                    <Input id="division" type="text" placeholder='Enter Division' className="mt-1 bg-transparent border-0 border-b-2 border-gray-500 flex-1" disabled />
                                </div>
                                <div className="flex items-center gap-2">
                                    <label htmlFor="returnDate" className="text-left text-sm lg:text-lg font-medium w-1/3">Return Date:</label>
                                    <Input id="returnDate" type="text" placeholder='Enter Return Date' className="mt-1 bg-transparent border-0 border-b-2 border-gray-500 flex-1" disabled />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}