'use client'

import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { format, parseISO, isValid } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover"
import Dashboard from "@/app/admin/dashboard/page"

interface IStudentDetails {
    sid: number;
    enrollmentNo: string;
    studentRollNo: number;
    studentName: string;
    studentEmail: string;
    studentMobileNo: number;
    studentCource: string;
    studentYear: string;
    studentDiv: string;
}

interface IBookIssue {
    issueDate: Date;
    bookName: string;
    returnDate: Date;
}

export default function IssueBook() {

    const [searchStudentId, setSearchStudentId] = useState('')
    const [studentIdFound, setStudentIdFound] = useState(false)
    const [showStudentDetails, setShowStudentDetails] = useState(false)
    const [studentDetails, setStudentDetails] = useState<IStudentDetails | null>(null)
    const [issueDate, setIssueDate] = React.useState<Date | undefined>(new Date())
    const [bookName, setBookName] = useState('')
    const [returnDate, setReturnDate] = React.useState<Date | undefined>(new Date())
    const [bookIssues, setBookIssues] = useState<IBookIssue[]>([{ issueDate: new Date(), bookName: '', returnDate: new Date() }])

    const handleSeachStudentId = async (e: React.FormEvent) => {
        e.preventDefault()

        const searchId = searchStudentId

        const searchIdPatten = /^[0-9]{10}$/
        if (!searchIdPatten.test(searchId)) {
            toast.info('Enter 10 digits student id only..')
        }
        try {
            console.log(searchId);
            const searchIdResponse = await fetch('/api/admin/getStudentId', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ sid: searchId }),
                credentials: 'include'
            })
            console.log(searchIdResponse);
            const searchIdResult = await searchIdResponse.json()
            console.log(searchIdResult);
            if (searchIdResult.success) {
                setStudentIdFound(true)
                setShowStudentDetails(true)
                setStudentDetails(searchIdResult.isPresentStudentId)
            } else {
                setStudentIdFound(true)
                setShowStudentDetails(false)
                setStudentDetails(null)
            }
        } catch (error) {
            console.log(error);
            toast.error('Student ID not valid ')
        }
    }

    const handleBookIssue = async (e: React.FormEvent) => {
        e.preventDefault()

        // if (!issueDate || !bookName || !returnDate) {
        //     toast.info('Enter required details')
        // }

        if (!studentDetails) {
            toast.error('No student details found')
            return
        }

        try {

            const issueDetails = bookIssues.map(bookIssue => ({
                issueDate: bookIssue.issueDate ? format(bookIssue.issueDate, "yyyy-MM-dd") : "",
                bookName: bookIssue.bookName,
                returnDate: bookIssue.returnDate ? format(bookIssue.returnDate, "yyyy-MM-dd") : ""
            }));

            // Validate dates before sending
            for (let detail of issueDetails) {
                if (!isValid(parseISO(detail.issueDate)) || (detail.returnDate && !isValid(parseISO(detail.returnDate)))) {
                    throw new Error('Invalid date format');
                }
            }

            const studentIssueBooksResponse = await fetch('/api/admin/issueBooks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    sid: studentDetails.sid,
                    enrollmentNo: studentDetails.enrollmentNo,
                    studentRollNo: studentDetails.studentRollNo,
                    studentName: studentDetails.studentName,
                    studentEmail: studentDetails.studentEmail,
                    studentMobileNo: studentDetails.studentMobileNo,
                    studentCource: studentDetails.studentCource,
                    studentYear: studentDetails.studentYear,
                    studentDiv: studentDetails.studentDiv,
                    IssueDetails: issueDetails
                }),
                credentials: 'include'
            })
            console.log(studentIssueBooksResponse);
            const studentIssueBooksResult = await studentIssueBooksResponse.json()
            console.log(studentIssueBooksResult);
            if (studentIssueBooksResult.success) {
                toast.success('Book issued successfully')
                setBookName('')
                setReturnDate(undefined)
                setBookIssues([{ issueDate: new Date(), bookName: '', returnDate: new Date() }])
            } else {
                toast.error('Failed to issue book')
            }
        } catch (error) {
            console.log(error)
            toast.error('An error occurred while issuing the book')
        }
    }

    const addNewBookIssue = () => {
        setBookIssues([...bookIssues, { issueDate: new Date(), bookName: '', returnDate: new Date() }])
    }

    const updateBookIssueDetails = (index: number, key: keyof IBookIssue, value: any) => {
        const updatedBookIssueDetails = [...bookIssues]
        updatedBookIssueDetails[index][key] = value
        setBookIssues(updatedBookIssueDetails)
    }

    return (
        <>
            <title>Issue Book</title>
            <Dashboard />
            <div className='flex flex-col ml-64 p-4 h-screen'>
                <div className="text-5xl font-bold mt-4">
                    <h1>Issue Book</h1>
                </div>
                <br />
                <hr />

                <form className='m-10'>
                    <div className='text-xl mt-4'>
                        <label htmlFor="txtSearchBox" className='mr-2'>Search</label>
                        <Input type='text' id='txtSearchBox' value={searchStudentId} onChange={e => setSearchStudentId(e.target.value)} placeholder='Enter student id..' className='w-2/4 mr-2 text-xl display inline-block' />
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none" className='display inline-block' onClick={handleSeachStudentId}>
                            <path d="M17.5 17.5L22 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M20 11C20 6.02944 15.9706 2 11 2C6.02944 2 2 6.02944 2 11C2 15.9706 6.02944 20 11 20C15.9706 20 20 15.9706 20 11Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                        </svg>
                    </div>
                    {studentIdFound && showStudentDetails && studentDetails ? (
                        <>
                            {/* create students details of that student id found and retrive data from searchIdResult */}
                            <div className="mt-4 font-bold">
                                <h3>Student Details</h3>
                                <label htmlFor="txtSID">SID</label>
                                <Input value={studentDetails.sid} className='w-32' disabled />
                                <label htmlFor="txtenrollmentNo">enrollmentNo</label>
                                <Input value={studentDetails.enrollmentNo} disabled />
                                <label htmlFor="txtstudentRollNo">studentRollNo</label>
                                <Input value={studentDetails.studentRollNo} disabled />
                                <label htmlFor="txtstudentName">studentName</label>
                                <Input value={studentDetails.studentName} disabled />
                                <label htmlFor="txtstudentEmail">studentEmail</label>
                                <Input value={studentDetails.studentEmail} disabled />
                                <label htmlFor="txtstudentMobileNo">studentMobileNo</label>
                                <Input value={studentDetails.studentMobileNo} disabled />
                                <label htmlFor="txtstudentCource">studentCource</label>
                                <Input value={studentDetails.studentCource} disabled />
                                <label htmlFor="txtstudentYear">studentYear</label>
                                <Input value={studentDetails.studentYear} disabled />
                                <label htmlFor="txtstudentDiv">studentDiv</label>
                                <Input value={studentDetails.studentDiv} disabled />
                                <div>

                                    {bookIssues.map((bookIssue, index) => (
                                        <div key='index'>
                                            <p>Issue Date:
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-[280px] justify-start text-left font-normal",
                                                                !bookIssue.issueDate && "text-muted-foreground"
                                                            )}
                                                        >
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            {bookIssue.issueDate ? format(bookIssue.issueDate, "PPP") : <span>Pick a date</span>}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0">
                                                        <Calendar
                                                            mode="single"
                                                            selected={bookIssue.issueDate}
                                                            onSelect={(date) => updateBookIssueDetails(index, 'issueDate', date)}
                                                            initialFocus
                                                            disabled
                                                            disableNavigation
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            </p>
                                            <p>Book Name: <strong><Input type='text' className='text-xl w-2/4 display inline-block ' value={bookIssue.bookName} onChange={e => updateBookIssueDetails(index, 'bookName', e.target.value)} /></strong></p>
                                            <p>Return Date:
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-[280px] justify-start text-left font-normal",
                                                                !bookIssue.returnDate && "text-muted-foreground"
                                                            )}
                                                        >
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            {bookIssue.returnDate ? format(bookIssue.returnDate, "PPP") : <span>Pick a date</span>}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0">
                                                        <Calendar
                                                            mode="single"
                                                            selected={bookIssue.returnDate}
                                                            onSelect={(date) => updateBookIssueDetails(index, 'returnDate', date)}
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            </p>
                                        </div>
                                    ))}
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none" className='mb-2 cursor-pointer' onClick={addNewBookIssue}>
                                        <path d="M12 8V16M16 12L8 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z" stroke="currentColor" strokeWidth="1.5" />
                                    </svg>
                                </div>
                                <Button type='submit' onClick={handleBookIssue}>Issue</Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="mt-4">
                                <h3 className='justify-center items-center font-bold'>Student details not found</h3>
                            </div>
                        </>
                    )}
                </form>
            </div>
        </>
    )
}
