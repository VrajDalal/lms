'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import DashBoard from '../dashboard/page';
import { toast } from 'sonner';
import { format, parseISO, isValid, parse } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

interface IBookIssue {
    bookNo: string;
    bookIssueDate: Date;
    bookName: string;
    returnDate: Date;
}

interface IStudentBookIssueHistory {
    sid: number;
    enrollmentNo: string;
    studentRollNo: number;
    studentName: string;
    studentEmail: string;
    studentMobileNo: number;
    studentCource: string;
    studentYear: string;
    studentDiv: string;
    IssueDetails: IBookIssue[]
}

export default function History() {
    const [studentBookIssueHistory, setStudentBookIssueHistory] = useState<IStudentBookIssueHistory[]>([]);

    useEffect(() => {
        handleToGetStudentIssueBooks();
    }, []);

    const handleToGetStudentIssueBooks = async () => {
        try {
            const studentBookIssueHistoryResponse = await fetch('/api/admin/issueBookHistory', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });

            const studentBookIssueHistoryResult = await studentBookIssueHistoryResponse.json();
            if (studentBookIssueHistoryResult.success) {
                const formattedData = studentBookIssueHistoryResult.datas.map((item: any) => ({
                    ...item,
                    IssueDetails: item.IssueDetails.map((issue: any) => ({
                        ...issue,
                        bookIssueDate: isValid(parse(issue.bookIssueDate, 'dd-MM-yyyy', new Date())) ? parse(issue.bookIssueDate, 'dd-MM-yyyy', new Date()) : null,
                        returnDate: isValid(parse(issue.returnDate, 'dd-MM-yyyy', new Date())) ? parse(issue.returnDate, 'dd-MM-yyyy', new Date()) : null,
                    }))
                }));
                setStudentBookIssueHistory(formattedData);
            } else {
                toast.error('No data found or an error occurred');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('An error occurred while fetching the student issue book data');
        }
    };

    return (
        <>  
            <title>History</title>
            <DashBoard />
            <div className='flex flex-col pl-20  md:pl-24 lg:pl-64 pr-4 lg:pr-16 bg-[#FCFAF5] min-h-screen'>
                <div className="text-5xl font-bold mt-4">
                    <h1>History</h1>
                </div>
                <br />
                <hr />
                <div className='mt-4'>
                    {studentBookIssueHistory && studentBookIssueHistory.length > 0 ? (
                        studentBookIssueHistory.map((history, historyIndex) => (
                            <Card key={historyIndex} className='bg-[#F8F4EF] border-2 border-gray-300 rounded-2xl shadow-2xl mb-6'>
                                <CardHeader>
                                    <CardTitle>Student ID: {history.sid}</CardTitle>
                                    <span className='text-xl'>{history.studentName} - {history.studentCource}</span>
                                </CardHeader>
                                <CardContent>
                                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-4 text-lg font-semibold'>
                                        <div className='flex flex-col'>
                                            <div className='flex items-center gap-2'>
                                                <span className='font-medium w-1/3'>Enrollment No:</span>
                                                <span>{history.enrollmentNo}</span>
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <span className='font-medium w-1/3'>EmailID:</span>
                                                <span>{history.studentEmail}</span>
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <span className='font-medium w-1/3'>Academic Year:</span>
                                                <span>{history.studentYear}</span>
                                            </div>
                                        </div>
                                        <div className='flex flex-col'>
                                            <div className='flex items-center gap-2'>
                                                <span className='font-medium w-1/3'>Student Roll No:</span>
                                                <span>{history.studentRollNo}</span>
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <span className='font-medium w-1/3'>Mobile No:</span>
                                                <span>{history.studentMobileNo}</span>
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <span className='font-medium w-1/3'>Division:</span>
                                                <span>{history.studentDiv}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {history.IssueDetails && history.IssueDetails.length > 0 && (
                                        <div className='mt-4'>
                                            <div className='bg-[#F8F4EF] border-2 border-gray-300 rounded-xl shadow-2xl'>
                                                <table className='w-full text-left'>
                                                    <thead className='bg-gray-200'>
                                                        <tr>
                                                            <th className='p-4 border-b'>Book No</th>
                                                            <th className='p-4 border-b'>Book Name</th>
                                                            <th className='p-4 border-b'>Issue Date</th>
                                                            <th className='p-4 border-b'>Return Date</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {history.IssueDetails.map((bookIssue, bookIssueIndex) => (
                                                            <>
                                                                <tr key={bookIssueIndex} className='border-b font font-semibold'>
                                                                    <td className='p-4'>{bookIssue.bookNo}</td>
                                                                    <td className='p-4'>{bookIssue.bookName}</td>
                                                                    <td className='p-4'>
                                                                        <Popover>
                                                                            <PopoverTrigger asChild>
                                                                                <span>
                                                                                    {bookIssue.bookIssueDate ? format(new Date(bookIssue.bookIssueDate), 'PPP') : 'Invalid Date'}
                                                                                </span>
                                                                            </PopoverTrigger>
                                                                            <PopoverContent className="w-auto p-0">
                                                                                <Calendar mode="single" selected={new Date(bookIssue.bookIssueDate)} disabled />
                                                                            </PopoverContent>
                                                                        </Popover>
                                                                    </td>
                                                                    <td className='p-4'>
                                                                        <Popover>
                                                                            <PopoverTrigger asChild>
                                                                                <span>
                                                                                {bookIssue.returnDate ? format(new Date(bookIssue.returnDate), 'PPP') : 'Invalid Date'}
                                                                                </span>
                                                                            </PopoverTrigger>
                                                                            <PopoverContent className="w-auto p-0">
                                                                                <Calendar mode="single" selected={new Date(bookIssue.returnDate)} disabled />
                                                                            </PopoverContent>
                                                                        </Popover>
                                                                    </td>
                                                                </tr>
                                                            </>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className='flex justify-center items-center'>
                            <div className='text-center'>
                                <Image src='/no-data.png' alt='No data' priority width={450} height={450} />
                                <p className="text-gray-600 text-2xl font-semibold -mt-12">No data.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}