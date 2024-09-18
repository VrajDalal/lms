/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { format, parseISO, isValid, parse } from "date-fns"
import { Calendar as CalendarIcon, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import Dashboard from "@/app/admin/dashboard/page"
import ShowSuccessGif from '@/app/component/showSuccessGif/page'
import Loading from "@/components/loading"
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import { useRouter, useSearchParams } from 'next/navigation'

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
    bookNo: string
    bookIssueDate: Date;
    bookName: string;
    returnDate: Date;
}

interface ISelectedBook {
    bookNo: string
    bookName: string;
}

export default function IssueBook() {

    const [searchStudentId, setSearchStudentId] = useState('')
    const [studentIdFound, setStudentIdFound] = useState(false)
    const [showStudentDetails, setShowStudentDetails] = useState(false)
    const [studentDetails, setStudentDetails] = useState<IStudentDetails | null>(null)
    const [bookIssues, setBookIssues] = useState<IBookIssue[]>([{ bookNo: '', bookIssueDate: new Date(), bookName: '', returnDate: new Date(new Date().setDate(new Date().getDate() + 7)) }])
    const [selectedBook, setSelectedBook] = useState<ISelectedBook>({ bookNo: '', bookName: '' })
    const [searchedBook, setSearchedBook] = useState([])
    const [isAddNewBook, setIsAddNewBook] = useState(false)
    const [inputFilled, setInputFilled] = useState(false)
    const [showContent, setShowContent] = useState(false);
    const [showSuccessGif, setShowSuccessGif] = useState(false);
    const [addNewBookIssueBtn, setAddNewBookIssueBtn] = useState(false)
    const [isBookAdded, setIsBookAdded] = useState(false);
    const [newIssueBookIndex, setNewIssueBookIndex] = useState<number | null>(null)
    const [isRenewalBookDetailsIndex, setIsRenewalBookDetailsIndex] = useState<number | null>(null)
    const [bookIssuedDone, setBookIssuedDone] = useState(false)
    const [loading, setLoading] = useState(true)
    const [showCancelSvg, setShowCancelSvg] = useState(false)

    const router = useRouter()
    const searchParams = useSearchParams();
    const studentId = searchParams.get('studentId');

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 2000)
    }, [])

    useEffect(() => {
        if (studentId) {
            handleSearchStudentId(studentId);
        }
    }, [studentId]);

    useEffect(() => {
        const getBookData = async () => {
            try {
                const allBooksDetailsListResponse = await fetch('/api/admin/allBooksList', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'aplication/json'
                    },
                    credentials: 'include'
                })

                const allBooksDetailsListResult = await allBooksDetailsListResponse.json()
                if (allBooksDetailsListResult.success) {
                    if (allBooksDetailsListResult.datas && allBooksDetailsListResult.datas.length > 0) {
                        setSearchedBook(allBooksDetailsListResult.datas)
                    } else {
                        console.error('Failed to fetch', allBooksDetailsListResult.error)
                    }
                } else {
                    console.error('Failed to fetch book data:', allBooksDetailsListResult.error)
                }
            } catch (error) {
                console.error('Error fetching table data:', error)

            }
        }
        getBookData()
    }, [])

    const handleSearchStudentId = async (studentId: string) => {

        const searchIdPattern = /^[0-9]{10}$/
        if (!searchIdPattern.test(studentId)) {
            toast.info('Enter 10 digits student id only...')
            return
        }
        try {
            setLoading(true)
            const searchIdResponse = await fetch(`/api/admin/getStudentId/${studentId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            })
            const searchIdResult = await searchIdResponse.json()

            if (searchIdResult.success) {
                setLoading(false)
                setStudentIdFound(true)
                setShowStudentDetails(true)
                setStudentDetails(searchIdResult.isPresentStudentId)

                const formattedData = searchIdResult.bookIssueDetails && searchIdResult.bookIssueDetails.length > 0
                    ? searchIdResult.bookIssueDetails.map((item: any) => ({
                        ...item,
                        bookIssueDate: isValid(parse(item.bookIssueDate, 'yyyy-MM-dd', new Date())) ? parse(item.bookIssueDate, 'yyyy-MM-dd', new Date()) : new Date(),
                        returnDate: isValid(parse(item.returnDate, 'yyyy-MM-dd', new Date())) ? parse(item.returnDate, 'yyyy-MM-dd', new Date()) : new Date(),
                    })) : []
                setBookIssues(formattedData)

                router.push(`/admin/issuebook?studentId=${encodeURIComponent(studentId)}`)
            } else {
                toast.error('Student ID not found')
                setLoading(false)
                setStudentIdFound(false)
                setShowStudentDetails(false)
                setStudentDetails(null)
                setBookIssues([])
                router.push(`/admin/issuebook?studentId=null`)
            }
        } catch (error) {
            setLoading(false)
            toast.error('Student ID not valid')
        } finally {
            setLoading(false)
        }
    }

    const handleBookIssue = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isBookAdded) {
            toast.info("Please add a new book before issuing.");
            return;
        }

        if (bookIssues.length === 0) {
            toast.info("Please add a new book before issuing.");
            return;
        }

        for (let issue of bookIssues) {
            if (!issue.bookNo || !issue.bookIssueDate || !issue.bookName || !issue.returnDate) {
                toast.info('Please fill book issue details');
                return;
            }
        }

        if (!studentDetails) {
            toast.error('No student details found');
            return;
        }

        const issueDetails = bookIssues.map(bookIssue => ({
            bookNo: bookIssue.bookNo,
            bookIssueDate: format(bookIssue.bookIssueDate, "yyyy-MM-dd"),
            bookName: bookIssue.bookName,
            returnDate: format(bookIssue.returnDate, "yyyy-MM-dd")
        }));

        // Validate dates
        for (let detail of issueDetails) {
            if (!isValid(parseISO(detail.bookIssueDate)) || (detail.returnDate && !isValid(parseISO(detail.returnDate)))) {
                toast.error('Invalid date format');
                return;
            }
        }

        try {
            setLoading(true)
            const issueBookResponse = await fetch('/api/admin/issueBooks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...studentDetails, IssueDetails: issueDetails }),
                credentials: 'include'
            });
            const issueBookResult = await issueBookResponse.json();

            if (issueBookResult.success) {
                const studentBookIssueDetails = issueDetails.map(detail => `
                    Book Acc No: <b>${detail.bookNo}</b><br>
                    Book Name: <b>${detail.bookName}</b><br>
                    Issue Date: <b>${detail.bookIssueDate}</b><br>
                    Return Date: <b>${detail.returnDate}</b><br>
                `).join('<br>');

                const studentIssueBookMailResponse = await fetch('/api/admin/issueBook-send-mail', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        studentEmail: studentDetails.studentEmail,
                        studentName: studentDetails.studentName,
                        bookDetails: studentBookIssueDetails
                    }),
                    credentials: 'include'
                });

                const studentIssueBookMailResult = await studentIssueBookMailResponse.json();
                if (studentIssueBookMailResult.success) {
                    setLoading(false)
                    toast.success('Book issued successfully');
                    setShowSuccessGif(true);
                    setBookIssues([{ bookNo: '', bookIssueDate: new Date(), bookName: '', returnDate: new Date(new Date().setDate(new Date().getDate() + 7)) }]);
                    setInputFilled(false); // Reset input filled state
                    setTimeout(() => setShowSuccessGif(false), 3000);
                    await handleSearchStudentId(searchStudentId);
                    setAddNewBookIssueBtn(false);
                    setShowContent(true);
                    setBookIssuedDone(true);
                    setNewIssueBookIndex(null);
                    setIsBookAdded(false);
                    setShowCancelSvg(false)
                } else {
                    setLoading(false)
                    toast.error('Failed to send email');
                }
            } else {
                setLoading(false)
                if (issueBookResult.message.includes("out of stock")) {
                    toast.error(issueBookResult.message);
                } else {
                    toast.error('Failed to issue book');
                }
            }
        } catch (error) {
            setLoading(false)
            toast.error('An error occurred while issuing the book');
        } finally {
            setLoading(false)
        }
    }

    const addNewBookIssue = () => {
        setIsBookAdded(true)
        setAddNewBookIssueBtn(true)

        for (let issue of bookIssues) {
            if (!issue.bookNo || !issue.bookIssueDate || !issue.bookName || !issue.returnDate) {
                toast.info('Please fill the book issue details');
                return;
            }
        }

        setBookIssues(prevIssues => {
            const newIndex = prevIssues.length
            setNewIssueBookIndex(newIndex);
            const bookIssueCurrentDate = new Date()
            const bookReturnDate = new Date(bookIssueCurrentDate)
            bookReturnDate.setDate(bookIssueCurrentDate.getDate() + 7)

            const newIssueBook = { bookNo: '', bookIssueDate: bookIssueCurrentDate, bookName: '', returnDate: bookReturnDate }

            return prevIssues.length === 0 ? [newIssueBook] : [...prevIssues, newIssueBook]
        })
        setIsAddNewBook(true);
        setSelectedBook({ bookNo: '', bookName: '' }); // Reset selected book
        setShowCancelSvg(true)
    }

    const handleRemoveBookIssueIndex = (index: number) => {
        setBookIssues(prevIssues => prevIssues.filter((_, i) => i !== index));
        setIsBookAdded(false);
        setShowCancelSvg(false)
    }

    const updateBookIssueDetails = (index: number, key: keyof IBookIssue, value: any) => {
        setBookIssues(prevIssues => {
            const updatedBookIssues = [...prevIssues]
            updatedBookIssues[index][key] = value
            return updatedBookIssues
        })
        setInputFilled(true)
    }

    const handleRenewalClick = async (index: number, sid: number) => {
        setIsRenewalBookDetailsIndex(index);
        setBookIssues(prevIssues => {
            const updatedIssue = [...prevIssues];
            const bookIssueCurrentDate = new Date();
            const newReturnDate = new Date(bookIssueCurrentDate);
            newReturnDate.setDate(bookIssueCurrentDate.getDate() + 7);

            updatedIssue[index] = {
                ...updatedIssue[index],
                bookIssueDate: bookIssueCurrentDate,
                returnDate: newReturnDate
            };
            return updatedIssue;
        });
        await handleRenewalSaveClick(index, sid);
    }

    const handleInputChange = (index: number, field: any, value: string) => {
        const updateBookIssues = bookIssues.map((issue, i) =>
            i === index ? { ...issue, [field]: value } : issue
        )
        setBookIssues(updateBookIssues)
    }

    const isReturnDateToday = (returnDate: Date) => {
        const today = new Date()
        return returnDate.toDateString() === today.toDateString()
    }

    const handleRenewalSaveClick = async (index: any, sid: number) => {
        setIsRenewalBookDetailsIndex(index);
        const updatedBookIssueDetails = bookIssues[index];
        console.log(updatedBookIssueDetails)
        try {
            setLoading(true)
            const updateBookIssueDetailsResponse = await fetch(`/api/admin/renewalBookIssueDetails/${sid}/${updatedBookIssueDetails.bookNo}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    sid: studentDetails?.sid,
                    bookNo: updatedBookIssueDetails.bookNo,
                    bookIssueDate: format(updatedBookIssueDetails.bookIssueDate, "yyyy-MM-dd"),
                    returnDate: format(updatedBookIssueDetails.returnDate, "yyyy-MM-dd")
                }),
                credentials: 'include'
            });
            console.log(updateBookIssueDetailsResponse)
            const updateBookIssueDetailsResult = await updateBookIssueDetailsResponse.json();
            console.log(updateBookIssueDetailsResult)
            if (updateBookIssueDetailsResult.success) {
                router.push(`/admin/issuebook?studentId=${encodeURIComponent(sid)}&bookNo=${encodeURIComponent(updatedBookIssueDetails.bookNo)}`)
                const { bookIssueDate, returnDate } = updateBookIssueDetailsResult.data
                const renewedBookDetails = `
            Book Acc No: <b>${updatedBookIssueDetails.bookNo}</b><br>
            Book Name: <b>${updatedBookIssueDetails.bookName}</b><br>
            Issue Date: <b>${bookIssueDate}</b><br>
            Return Date: <b>${returnDate}</b><br>
            `;
                console.log(renewedBookDetails)
                const renewedBookIssueDetailsResponse = await fetch('/api/admin/renewalBook-send-mail', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        studentEmail: studentDetails?.studentEmail,
                        studentName: studentDetails?.studentName,
                        bookDetails: renewedBookDetails
                    }),
                    credentials: 'include'
                });

                const renewedBookIssueDetailsResult = await renewedBookIssueDetailsResponse.json();
                if (renewedBookIssueDetailsResult.success) {
                    setLoading(false)
                    toast.success('Renewal done successfully');
                    await handleSearchStudentId(searchStudentId);
                    setBookIssuedDone(true);
                    setNewIssueBookIndex(null);
                } else {
                    setLoading(false)
                    toast.success('Renewal done successfully but mail not sent');
                }
            } else {
                setLoading(false)
                toast.error('Error at the renewal time');
            }
        } catch (error) {
            setLoading(false)
            console.error('Error in book issue renewal:', error);
            toast.error("Error in book issue renewal");
        } finally {
            setIsRenewalBookDetailsIndex(null);
            setLoading(false)
        }
    }

    const deleteStudentBookIssueDetails = async (sid: number, bookNo: string) => {
        try {
            setLoading(true)
            router.push(`/admin/issuebook?studentId=${encodeURIComponent(sid)}&bookNo=${encodeURIComponent(bookNo)}`)
            const deleteStudentBookIssueResponse = await fetch(`/api/admin/deleteIssueBook/${sid}/${bookNo}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            })
            const deleteStudentBookIssueResult = await deleteStudentBookIssueResponse.json()
            if (deleteStudentBookIssueResult.success) {
                const deletedIssedBook = deleteStudentBookIssueResult.deletedBookDetails

                const deletedBookDetails = `
                Book Acc No:   <b>${deletedIssedBook.bookNo}</b><br>
                Book Name:     <b>${deletedIssedBook.bookName}</b><br>
                Issue Date:    <b>${deletedIssedBook.bookIssueDate}</b><br>
                Return Date:   <b>${deletedIssedBook.returnDate}</b><br>
                `
                const deleteBookIssuedDetailResponse = await fetch('/api/admin/deleteIssuedBook-send-mail', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        studentEmail: studentDetails?.studentEmail,
                        studentName: studentDetails?.studentName,
                        bookDetails: deletedBookDetails
                    }),
                    credentials: 'include'
                })

                const deleteBookIssuedDetailResult = await deleteBookIssuedDetailResponse.json()
                if (deleteBookIssuedDetailResult.success) {
                    setLoading(false)
                    toast.success(`"${deletedIssedBook?.bookName}" book details deleted`)
                    setBookIssues(prevIssues => prevIssues.filter(issue => issue.bookNo !== bookNo))
                } else {
                    setLoading(false)
                    toast.success('Issued book deleted but mail not send')
                }
            } else {
                setLoading(false)
                toast.error("Not deleting issued book")
            }
        } catch (error) {
            setLoading(false)
            console.error('Error deleting book issue:', error);
            toast.error("Error in deleting issued book")
        }
    }

    const handleSelectBook = (items: any) => {
        setSelectedBook({ bookNo: items.bookNo, bookName: items.bookName })
        setShowCancelSvg(true)
        setBookIssues(prevIssues => {
            const newIssues = [...prevIssues];
            if (newIssueBookIndex !== null && newIssueBookIndex >= 0) {
                newIssues[newIssueBookIndex] = {
                    ...newIssues[newIssueBookIndex],
                    bookNo: items.bookNo,
                    bookName: items.bookName
                };
            }
            return newIssues;
        });
    }

    const items = searchedBook.map((book: any) => ({
        id: book.bookNo, // for unique
        name: book.bookName, // for book name suggestion
        bookNo: book.bookNo,
        bookName: book.bookName
    }));

    //update function pending : Done
    //on click of renewal svg renewthe data according to there id show cancel button also texbox not disable use something diffrent : Done
    //patch method pending to create : Done
    //mail integration pending : Done
    //when i click on renewal svg then swap the date of both table : Done
    //data store in issuebook table but not inserted in history table : Done
    //on renewal ,renewal button show and then renew the book : Done
    //upload book detials excel  : Done
    //write book name and automatically it insert the bookNo : Done
    //in library section add manually books and save into table also (CRUD operation ,edit quantity,delete books)
    return (
        <>
            <title>Issue Book</title>
            {loading && (
                <div className="loader-overlay loader-container">
                    <Loading />
                </div>
            )}
            <div className={`main-content ${loading ? 'blur' : ''}`}>
                <Dashboard />
                <div className='flex flex-col pl-20 pt-20 md:pl-24 lg:pl-24 pr-4 lg:pr-16 bg-[#FCFAF5] min-h-screen'>
                    <div className="text-5xl font-bold mt-4">
                        <h1>Issue Book</h1>
                    </div>
                    <br />
                    <hr />
                    <div className='border-4 border-gray-300 min-h-auto rounded-3xl bg-white p-2 m-4 md:m-4 shadow-2xl'>
                        <>
                            <form className='m-4'>
                                <div className='text-xl mt-4 flex flex-col md:flex-row md:items-center md:space-x-4'>
                                    <label htmlFor="txtSearchBox" className='mr-2'>Search</label>
                                    <Input
                                        type='text'
                                        id='txtSearchBox'
                                        value={searchStudentId}
                                        onChange={e => setSearchStudentId(e.target.value)}
                                        onKeyDown={e => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault()
                                                handleSearchStudentId(searchStudentId);
                                            }
                                        }}
                                        placeholder='Enter student id..'
                                        className='w-full md:w-2/4 text-xl mb-2 md:mb-0 rounded-lg'
                                    />
                                    <button onClick={() => handleSearchStudentId(searchStudentId)} type='button'>
                                        <Search className='text-xl' />
                                    </button>
                                </div>
                                {showSuccessGif ? (
                                    <ShowSuccessGif />
                                ) : (
                                    !showSuccessGif && studentIdFound && showStudentDetails && studentDetails ? (
                                        <div className="mt-4 font-bold p-2">
                                            <h3 className='text-2xl md:text-3xl lg:text-4xl font-bold mt-4 mb-8'>Student Details</h3>
                                            <div className='border-2 border-gray-300 rounded-2xl shadow-2xl p-6'>
                                                <div className="mb-4">
                                                    <div className="flex flex-col md:flex-row gap-6">
                                                        <div className="flex-1">
                                                            <label htmlFor="txtSID" className='block text-center md:text-left text-sm md:text-sm lg:text-lg font-medium mb-2'>SID</label>
                                                            <p className="text-center md:text-left w-full">
                                                                <b>{studentDetails.sid}</b>
                                                            </p>
                                                        </div>
                                                        <div className="flex-1">
                                                            <label htmlFor="txtenrollmentNo" className='block text-center md:text-left text-sm md:text-sm lg:text-lg font-medium mb-2'>EnrollmentNo</label>
                                                            <p className="text-center md:text-left w-full">
                                                                <b>{studentDetails.enrollmentNo}</b>
                                                            </p>
                                                        </div>
                                                        <div className="flex-1">
                                                            <label htmlFor="txtstudentRollNo" className='block text-center md:text-left text-sm md:text-sm lg:text-lg font-medium mb-2'>StudentRollNo</label>
                                                            <p className="text-center md:text-left w-full">
                                                                <b>{studentDetails.studentRollNo}</b>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mb-4">
                                                    <div className="flex flex-col md:flex-row gap-6">
                                                        <div className="flex-1">
                                                            <label htmlFor="txtstudentName" className='block text-center md:text-left text-sm md:text-sm lg:text-lg font-medium mb-2'>StudentName</label>
                                                            <p className="text-center md:text-left w-full">
                                                                <b>{studentDetails.studentName}</b>
                                                            </p>
                                                        </div>
                                                        <div className="flex-1">
                                                            <label htmlFor="txtstudentEmail" className='block text-center md:text-left text-sm md:text-sm lg:text-lg font-medium mb-2'>StudentEmail</label>
                                                            <p className="text-center md:text-left w-full">
                                                                <b>{studentDetails.studentEmail}</b>
                                                            </p>
                                                        </div>
                                                        <div className="flex-1">
                                                            <label htmlFor="txtstudentMobileNo" className='block text-center md:text-left text-sm md:text-sm lg:text-lg font-medium mb-2'>MobileNo</label>
                                                            <p className="text-center md:text-left w-full">
                                                                <b>{studentDetails.studentMobileNo}</b>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mb-4">
                                                    <div className="flex flex-col md:flex-row gap-4">
                                                        <div className="flex-1">
                                                            <label htmlFor="txtstudentCource" className='block text-center md:text-left text-md md:text-sm lg:text-lg font-medium mb-2'>StudentCource</label>
                                                            <p className="text-center md:text-left w-full">
                                                                <b>{studentDetails.studentCource}</b>
                                                            </p>
                                                        </div>
                                                        <div className="flex-1">
                                                            <label htmlFor="txtstudentYear" className='block text-center md:text-left text-sm md:text-sm lg:text-lg font-medium mb-2'>AcademicYear</label>
                                                            <p className="text-center md:text-left w-full">
                                                                <b>{studentDetails.studentYear}</b>
                                                            </p>
                                                        </div>
                                                        <div className="flex-1">
                                                            <label htmlFor="txtstudentDiv" className='block text-center md:text-left text-sm md:text-sm lg:text-lg font-medium mb-2'>StudentDiv</label>
                                                            <p className="text-center md:text-left w-full">
                                                                <b>{studentDetails.studentDiv}</b>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col space-y-4">
                                                <h2 className='text-lg md:text-xl lg:text-2xl font-bold mt-6'>Issue Book Details</h2>
                                                {bookIssues.map((bookIssue, index) => (
                                                    <div key={index} className="flex items-center space-x-4 border-2 border-gray-300 rounded-2xl p-4 shadow-2xl">
                                                        {isAddNewBook && index === bookIssues.length - 1 && showCancelSvg && !bookIssuedDone && (
                                                            <button type='button' title='Cancel' className='mt-6' onClick={() => { handleRemoveBookIssueIndex(index); setIsAddNewBook(false); }}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" color="#000000" fill="none">
                                                                    <path d="M19.0005 4.99988L5.00049 18.9999M5.00049 4.99988L19.0005 18.9999" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                </svg>
                                                            </button>
                                                        )}
                                                        <div className="flex-1">
                                                            <p className='block text-center md:text-left text-sm md:text-sm font-medium mb-2'>Book No:</p>
                                                            <Input
                                                                type='text'
                                                                className="text-center md:text-left w-full"
                                                                value={bookIssue.bookNo}
                                                                onChange={e => handleInputChange(index, 'bookNo', e.target.value)}
                                                                readOnly
                                                                title={bookIssue.bookNo}
                                                            />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className='block text-center md:text-left text-sm md:text-sm font-medium mb-2'>Book Name:</p>
                                                            {newIssueBookIndex === index && isAddNewBook ? (
                                                                <ReactSearchAutocomplete
                                                                    items={items}
                                                                    onSelect={handleSelectBook}
                                                                    fuseOptions={{ keys: ["name"] }}
                                                                    resultStringKeyName="name"
                                                                    placeholder="Search for a book"
                                                                // styling={{ height: '40px', borderRadius: '4px', border: '1px solid #ccc' }}
                                                                />
                                                            ) : (
                                                                <Input
                                                                    type='text'
                                                                    className="text-center md:text-left w-full"
                                                                    value={bookIssue.bookName}
                                                                    onChange={e => handleInputChange(index, 'bookName', e.target.value)}
                                                                    readOnly={newIssueBookIndex !== index}
                                                                />
                                                            )}
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className='block text-center md:text-left text-sm md:text-sm font-medium mb-2'>Issue Date:</p>
                                                            <Popover>
                                                                <PopoverTrigger asChild>
                                                                    <Button
                                                                        variant={"outline"}
                                                                        className={cn(
                                                                            "text-center md:text-left w-full",
                                                                            !bookIssue.bookIssueDate && "text-muted-foreground"
                                                                        )}
                                                                    >
                                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                                        <span className='text-sm md:text-sm lg:text-lg'>
                                                                            {bookIssue.bookIssueDate ? format(bookIssue.bookIssueDate, "PPP") : <span>Pick a date</span>}
                                                                        </span>
                                                                    </Button>
                                                                </PopoverTrigger>
                                                                <PopoverContent className="w-full md:w-auto p-0">
                                                                    <Calendar
                                                                        mode="single"
                                                                        selected={bookIssue.bookIssueDate}
                                                                        onSelect={(date) => updateBookIssueDetails(index, 'bookIssueDate', date)}
                                                                        initialFocus
                                                                        disabled
                                                                        className="w-full"
                                                                    />
                                                                </PopoverContent>
                                                            </Popover>
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className='block text-center md:text-left text-sm md:text-sm font-medium mb-2'>Return Date:</p>
                                                            <Popover>
                                                                <PopoverTrigger asChild>
                                                                    <Button
                                                                        variant={"outline"}
                                                                        className={cn(
                                                                            "text-center md:text-left w-full",
                                                                            !bookIssue.returnDate && "text-muted-foreground"
                                                                        )}
                                                                    >
                                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                                        <span className='text-sm md:text-sm lg:text-lg'>
                                                                            {bookIssue.returnDate ? format(bookIssue.returnDate, "PPP") : <span>Pick a date</span>}
                                                                        </span>
                                                                    </Button>
                                                                </PopoverTrigger>
                                                                <PopoverContent className="w-auto p-0">
                                                                    <Calendar
                                                                        mode="single"
                                                                        selected={bookIssue.returnDate}
                                                                        onSelect={(date) => updateBookIssueDetails(index, 'returnDate', date)}
                                                                        initialFocus
                                                                        disabled
                                                                        className="w-full"
                                                                    />
                                                                </PopoverContent>
                                                            </Popover>
                                                        </div>
                                                        {/*!addNewBookIssueBtn && bookIssue.returnDate === new Date() &&*/}
                                                        {isReturnDateToday(bookIssue.returnDate) && (
                                                            <>
                                                                <button type='button' title='Renew Book' onClick={() => handleRenewalClick(index, studentDetails.sid)} className='mt-6'>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
                                                                        <path d="M11.0215 6.78662V19.7866" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                                        <path d="M11 19.5C10.7777 19.5 10.3235 19.2579 9.41526 18.7738C8.4921 18.2818 7.2167 17.7922 5.5825 17.4849C3.74929 17.1401 2.83268 16.9678 2.41634 16.4588C2 15.9499 2 15.1347 2 13.5044V7.09655C2 5.31353 2 4.42202 2.6487 3.87302C3.29741 3.32401 4.05911 3.46725 5.5825 3.75372C8.58958 4.3192 10.3818 5.50205 11 6.18114C11.6182 5.50205 13.4104 4.3192 16.4175 3.75372C17.9409 3.46725 18.7026 3.32401 19.3513 3.87302C20 4.42202 20 5.31353 20 7.09655V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                        <path d="M20.8638 12.9393L21.5589 13.6317C22.147 14.2174 22.147 15.1672 21.5589 15.7529L17.9171 19.4485C17.6306 19.7338 17.2642 19.9262 16.8659 20.0003L14.6088 20.4883C14.2524 20.5653 13.9351 20.2502 14.0114 19.895L14.4919 17.6598C14.5663 17.2631 14.7594 16.8981 15.0459 16.6128L18.734 12.9393C19.3222 12.3536 20.2757 12.3536 20.8638 12.9393Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                    </svg>
                                                                </button>


                                                                <button type='button' title='Retrun Book' className='mt-6' onClick={() => deleteStudentBookIssueDetails(studentDetails.sid, bookIssue.bookNo)}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
                                                                        <path d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                                        <path d="M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                                        <path d="M9.5 16.5L9.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                                        <path d="M14.5 16.5L14.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                                    </svg>
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                ))}

                                                <button type='button' title='Add New Book' onClick={addNewBookIssue} className='w-8'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" color="#000000" fill="none" className='mb-2 cursor-pointer'>
                                                        <path d="M12 8V16M16 12L8 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z" stroke="currentColor" strokeWidth="1.5" />
                                                    </svg>
                                                </button>
                                            </div>

                                            <div className="mt-4">
                                                <Button onClick={handleBookIssue}>Issue Books</Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex justify-center items-center h-64 mt-8">
                                            <div className="text-center">
                                                <Image src="/no-data.png" alt="No data found" priority width={300} height={300} className="mx-auto mb-4" />
                                                <p className="text-gray-600 text-xl font-semibold -mt-6 mb-4">Student details not found.</p>
                                            </div>
                                        </div>
                                    ))}
                            </form>
                        </>
                    </div>
                </div>
            </div>
        </>
    )
}
