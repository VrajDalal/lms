/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import React, { useState, useEffect, useRef } from 'react'
import ShowExpiryModal from '@/app/component/showStudentExpiryModal'
import { useRouter } from 'next/navigation'
import nookies from 'nookies'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import jwt, { JwtPayload } from "jsonwebtoken"
import Loading from "@/components/loading"

interface IAvailableBooks {
    bookNo: string;
    bookName: string;
    bookAuthorName: string;
    bookPublisherName: string;
    bookQty: number;
    createdAt: Date;
}

interface IBookIssuedHistory {
    bookNo: string;
    bookIssueDate: string;
    bookName: string;
    returnDate: string;
}

interface IStudentDetails {
    sid: number,
    enrollmentNo: string,
    studentRollNo: number,
    studentName: string,
    studentEmail: string,
    studentMobileNo: number,
    studentCource: string,
    studentYear: string,
    studentDiv: string,
}

export default function StudentDashboardPage() {
    const router = useRouter()
    const cookies = nookies.get()
    const studentToken = cookies.studentToken

    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [loading, setLoading] = useState(false)
    const [tokenExpired, setTokenExpired] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isDataVisible, setIsDataVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [isScrolled, setIsScrolled] = useState(false)
    const [isVisible, setIsVisible] = useState(false);
    const [tableData, setTableData] = useState<IAvailableBooks[]>([]);
    const [studentsIssuedBooksHistory, setStudentsIssuedBooksHistory] = useState<IBookIssuedHistory[]>([])
    const [currentHistoryPage, setCurrentHistoryPage] = useState(1);
    const [studentDetails, setStudentDetails] = useState<IStudentDetails | null>(null)
    const [studentName, setStudentName] = useState('');
    const [studentEmail, setEmail] = useState('');
    const [searchBookDetails, setSearchBookDetails] = useState('')
    const [filteredBooks, setFilteredBooks] = useState<IAvailableBooks[]>([]);
    const [searchStudentIssuedBook, setSearchStudentIssuedBook] = useState('')
    const [filteredStudentIssuedBook, setFilteredStudentIssuedBook] = useState<IBookIssuedHistory[]>([]);


    const itemsPerPage = 5;
    const profileModalRef = useRef<HTMLDialogElement>(null);

    const verifyToken = jwt.decode(studentToken) as JwtPayload

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 2000)
    }, [])

    useEffect(() => {
        const checkTokenExpiration = async () => {
            try {
                const tokenResponse = await fetch('/api/student/check-token', {
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

        if (studentToken) {
            checkTokenExpiration()
        } else {
            setIsModalOpen(true)
        }

        const interval = setInterval(() => {
            checkTokenExpiration()
        }, 10000)

        return () => clearInterval(interval)
    }, [studentToken])

    useEffect(() => {
        // Lock body scroll when menu is open
        document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isMenuOpen]);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };
        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    //    Reterive Book Data,history,studentDetails
    useEffect(() => {
        handleToRetriveBookDatas()
        handleToRetriveStudentIssuedBookDetails()
        getStudentDetials()
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = () => {
        nookies.destroy(null, 'studentToken', { path: '/' })
        router.push('/student/login')
    }

    const handleToRetriveBookDatas = async () => {
        try {
            const allBooksDetailsListResponse = await fetch('/api/admin/allBooksList', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            const allBooksDetailsListResult = await allBooksDetailsListResponse.json();
            console.log('API Result:', allBooksDetailsListResult); // Log the response

            if (allBooksDetailsListResult.success) {
                setTableData(allBooksDetailsListResult.datas);
                setIsDataVisible(allBooksDetailsListResult.datas.length > 0);
            } else {
                console.error('Failed to fetch book data:', allBooksDetailsListResult.error);
                setIsDataVisible(false);
            }
        } catch (error) {
            console.error('Error fetching table data:', error);
            setIsDataVisible(false);
        }
    };

    const handleToRetriveStudentIssuedBookDetails = async () => {
        console.log(verifyToken?.sid)
        try {
            const studentIssuedBookDetailsResponse = await fetch(`/api/student/student-issue-book-history/${verifyToken?.sid}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            })
            console.log(studentIssuedBookDetailsResponse);
            const studentIssuedBookDetailsResult = await studentIssuedBookDetailsResponse.json()
            console.log(studentIssuedBookDetailsResult);

            if (studentIssuedBookDetailsResult.success) {
                const studentIssuedBookData = studentIssuedBookDetailsResult.datas.IssueDetails.map((item: any) => ({
                    ...item,
                    bookIssueDate: item.bookIssueDate,
                    returnDate: item.returnDate

                }));
                console.log(studentIssuedBookData);

                setStudentsIssuedBooksHistory(studentIssuedBookData)
            } else {
                console.error('Failed to retrieve student issued book details');
            }
        } catch (error) {
            console.error('Error fetching issued book details:', error);
        }
    }

    // Pattern For contact us form

    const namepattern = /^[A-Za-z]+$/;
    const emailpattern = /^[a-z0-9]+[a-z0-9_%#$]+@[a-z]+\.[a-z]{3}$/;

    // pagination for Library Table
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = tableData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(tableData.length / itemsPerPage);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNext = () => {
        const totalPages = Math.ceil(tableData.length / itemsPerPage);
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    // pagination for History Table
    const historyItemsPerPage = 5
    const lastItemIndex = currentHistoryPage * historyItemsPerPage;
    const firstItemIndex = lastItemIndex - historyItemsPerPage;
    const itemsOnCurrentPage = tableData.slice(firstItemIndex, lastItemIndex);
    const numberOfPages = Math.ceil(tableData.length / historyItemsPerPage);

    const goToPage = (pageNumber: number) => {
        setCurrentHistoryPage(pageNumber);
    };

    const goToPreviousPage = () => {
        if (currentHistoryPage > 1) {
            setCurrentHistoryPage(currentHistoryPage - 1);
        }
    };

    const goToNextPage = () => {
        if (currentHistoryPage < totalPages) {
            setCurrentHistoryPage(currentHistoryPage + 1);
        }
    };

    const openProfileModal = () => {
        profileModalRef.current?.showModal();
    };

    const closeProfileModal = () => {
        profileModalRef.current?.close();
    };

    const getStudentDetials = async () => {
        try {
            const studentDetailsResponse = await fetch(`/api/student/studentProfile/${verifyToken?.sid}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            })
            const studentDetailsResult = await studentDetailsResponse.json()

            if (studentDetailsResult.success) {
                setStudentDetails(studentDetailsResult.datas)
            } else {
                setStudentDetails(null)
            }
        } catch (error) {
            console.error(error, 'Falied to find Student detials')
        }
    }

    const displayBooks = searchBookDetails ? filteredBooks : tableData;
    const searchBook = async (e: React.FormEvent) => {
        e.preventDefault()

        try {

            if (searchBookDetails.trim() === '') {
                setFilteredBooks([]); // Clear filtered books if search is empty
                return;
            }

            const filtered = tableData.filter((book) =>
                book.bookName.toLowerCase().includes(searchBookDetails.toLowerCase()) ||
                book.bookNo.toString().includes(searchBookDetails) ||
                (book.bookAuthorName && book.bookAuthorName.toLowerCase().includes(searchBookDetails.toLowerCase()))
            );
            setFilteredBooks(filtered);
            console.log(filtered);
        } catch (error) {
            console.error('Error fetching books details:', error);
        }
    }

    const displayStudentIssuedBooks = searchStudentIssuedBook ? filteredStudentIssuedBook : studentsIssuedBooksHistory;
    const searchStudentIssuedBookDetails = async (e: React.FormEvent) => {
        e.preventDefault()

        try {

            if (searchStudentIssuedBook.trim() === '') {
                setFilteredStudentIssuedBook([]); // Clear filtered books if search is empty
                return;
            }

            const filtered = studentsIssuedBooksHistory.filter((book) =>
                book.bookName.toLowerCase().includes(searchStudentIssuedBook.toLowerCase()) ||
                book.bookNo.toString().includes(searchStudentIssuedBook)
            );
            setFilteredStudentIssuedBook(filtered);
            console.log(filtered);
        } catch (error) {
            console.error('Error fetching books details:', error);
        }
    }


    return (
        <>
            <title>Student Dashboard</title>
            {loading && (
                <div className="loader-overlay loader-container">
                    <Loading />
                </div>
            )}

            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className="scroll-to-top-button"
                    aria-label="Scroll to top"
                >
                    ↑
                </button>
            )}

            <div className={`main-content ${loading ? 'blur' : ''}`}>
                {isAuthenticated && !tokenExpired ? (
                    <>
                        {/* Navigation Bar */}
                        < nav className={`bg-sky-400 left-0 right-0 p-4 Z-50 top-0 fixed ml-auto bg-opacity-75 transition ${isScrolled ? 'backdrop-blur-md' : 'backdrop-blur-none'}`}>
                            <div className="px-4 mx-auto flex items-center justify-between">
                                {/* Left Section */}
                                <div className="flex items-center w-full lg:w-auto lg:justify-start lg:relative lg:left-0">
                                    <div className="text-gray-200 text-lg lg:text-3xl font-bold lg:mx-0 lg:flex-grow">
                                        Book Issue Hub
                                    </div>

                                    {/* Span on the right side for mobile and tablet */}
                                    <span className="text-gray-200 px-4 lg:hidden text-xs md:text-base ml-10 md:ml-80">
                                        Hello! {verifyToken?.studentName}
                                    </span>

                                    {/* Hamburger Menu for Mobile */}
                                    <button
                                        onClick={toggleMenu}
                                        className="lg:hidden text-white focus:outline-none z-10 ml-auto"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none">
                                            <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                </div>
                                {/* Center Menu Items */}
                                <div className={`lg:flex ${isMenuOpen ? 'hidden' : 'flex'} right-0  lg:text-xl hidden lg:justify-center flex-grow`}>
                                    <ul className="lg:flex hidden lg:text-2xl lg:flex-row flex-col lg:space-x-8 space-y-4 lg:space-y-0 text-white">
                                        <li>
                                            <a href="#library" className="hover:text-gray-300">Library</a>
                                        </li>
                                        <li>
                                            <a href="#history" className="hover:text-gray-300">History</a>
                                        </li>
                                        <li>
                                            <a href="#contactus" className="hover:text-gray-300">Contact Us</a>
                                        </li>
                                    </ul>
                                </div>

                                {/* Right Section */}
                                <div className="relative lg:text-2xl lg:flex items-center hidden space-x-4">

                                    {/* Student Name */}
                                    <span className="text-gray-200 px-4">Hello! {verifyToken?.studentName}</span>

                                    <div className="relative inline-block group">
                                        <button onClick={openProfileModal} title='My Profile' className="p-2 bg-transparent border-none">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30" fill="none" className='text-gray-200'>
                                                <path d="M5.08069 15.2964C3.86241 16.0335 0.668175 17.5386 2.61368 19.422C3.56404 20.342 4.62251 21 5.95325 21H13.5468C14.8775 21 15.936 20.342 16.8863 19.422C18.8318 17.5386 15.6376 16.0335 14.4193 15.2964C11.5625 13.5679 7.93752 13.5679 5.08069 15.2964Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M13.5 7C13.5 9.20914 11.7091 11 9.5 11C7.29086 11 5.5 9.20914 5.5 7C5.5 4.79086 7.29086 3 9.5 3C11.7091 3 13.5 4.79086 13.5 7Z" stroke="currentColor" strokeWidth="1.5" />
                                                <path d="M17 5L22 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M17 8L22 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M20 11L22 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                        <dialog ref={profileModalRef} className="modal">
                                            <div className="modal-box">
                                                <h3 className="font-bold text-lg">Hello!</h3><br />
                                                {studentDetails && (
                                                    <>

                                                        <div className='text-center space-x-4 items-center flex'>
                                                            <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#434343"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h168q14-36 44-58t68-22q38 0 68 22t44 58h168q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm280-670q13 0 21.5-8.5T510-820q0-13-8.5-21.5T480-850q-13 0-21.5 8.5T450-820q0 13 8.5 21.5T480-790ZM200-246q54-53 125.5-83.5T480-360q83 0 154.5 30.5T760-246v-514H200v514Zm280-194q58 0 99-41t41-99q0-58-41-99t-99-41q-58 0-99 41t-41 99q0 58 41 99t99 41ZM280-200h400v-10q-42-35-93-52.5T480-280q-56 0-107 17.5T280-210v10Zm200-320q-25 0-42.5-17.5T420-580q0-25 17.5-42.5T480-640q25 0 42.5 17.5T540-580q0 25-17.5 42.5T480-520Zm0 17Z" /></svg>
                                                            {/* <span>spid:</span> */}
                                                            <p className="py-4 px-4 text-xl">{studentDetails.sid}</p>
                                                        </div>
                                                        <div className='text-center space-x-4 items-center flex'>
                                                            <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#434343"><path d="M702-480 560-622l57-56 85 85 170-170 56 57-226 226Zm-342 0q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm80-80h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0 260Zm0-340Z" /></svg>
                                                            {/* <span>enroll_no:</span> */}
                                                            <p className="py-4 px-4 text-xl">{studentDetails.enrollmentNo}</p>
                                                        </div>
                                                        <div className='text-center space-x-4 items-center flex'>
                                                            <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#434343"><path d="M560-440h200v-80H560v80Zm0-120h200v-80H560v80ZM200-320h320v-22q0-45-44-71.5T360-440q-72 0-116 26.5T200-342v22Zm160-160q33 0 56.5-23.5T440-560q0-33-23.5-56.5T360-640q-33 0-56.5 23.5T280-560q0 33 23.5 56.5T360-480ZM160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm0-80h640v-480H160v480Zm0 0v-480 480Z" /></svg>
                                                            {/* <span>roll_no:</span> */}
                                                            <p className="py-4 px-4 text-xl">{studentDetails.studentRollNo}</p>
                                                        </div>
                                                        <div className='text-center space-x-4 items-center flex'>
                                                            <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#434343"><path d="M360-390q-21 0-35.5-14.5T310-440q0-21 14.5-35.5T360-490q21 0 35.5 14.5T410-440q0 21-14.5 35.5T360-390Zm240 0q-21 0-35.5-14.5T550-440q0-21 14.5-35.5T600-490q21 0 35.5 14.5T650-440q0 21-14.5 35.5T600-390ZM480-160q134 0 227-93t93-227q0-24-3-46.5T786-570q-21 5-42 7.5t-44 2.5q-91 0-172-39T390-708q-32 78-91.5 135.5T160-486v6q0 134 93 227t227 93Zm0 80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm-54-715q42 70 114 112.5T700-640q14 0 27-1.5t27-3.5q-42-70-114-112.5T480-800q-14 0-27 1.5t-27 3.5ZM177-581q51-29 89-75t57-103q-51 29-89 75t-57 103Zm249-214Zm-103 36Z" /></svg>
                                                            {/* <span>name:</span> */}
                                                            <p className="py-4 px-4 text-xl">{studentDetails.studentName}</p>
                                                        </div>
                                                        <div className='text-center space-x-4 items-center flex'>
                                                            <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#434343"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z" /></svg>
                                                            {/* <span>email:</span> */}
                                                            <p className="py-4 px-4 text-xl">{studentDetails.studentEmail}</p>
                                                        </div>
                                                        <div className='text-center space-x-4 items-center flex'>
                                                            <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#5f6368"><path d="M798-120q-125 0-247-54.5T329-329Q229-429 174.5-551T120-798q0-18 12-30t30-12h162q14 0 25 9.5t13 22.5l26 140q2 16-1 27t-11 19l-97 98q20 37 47.5 71.5T387-386q31 31 65 57.5t72 48.5l94-94q9-9 23.5-13.5T670-390l138 28q14 4 23 14.5t9 23.5v162q0 18-12 30t-30 12ZM241-600l66-66-17-94h-89q5 41 14 81t26 79Zm358 358q39 17 79.5 27t81.5 13v-88l-94-19-67 67ZM241-600Zm358 358Z" /></svg>
                                                            {/* <span>mobile:</span> */}
                                                            <p className="py-4 px-4 text-xl">{studentDetails.studentMobileNo}</p>
                                                        </div>
                                                        <div className='text-center space-x-4 items-center flex'>
                                                            <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#434343"><path d="M320-160q-33 0-56.5-23.5T240-240v-120h120v-90q-35-2-66.5-15.5T236-506v-44h-46L60-680q36-46 89-65t107-19q27 0 52.5 4t51.5 15v-55h480v520q0 50-35 85t-85 35H320Zm120-200h240v80q0 17 11.5 28.5T720-240q17 0 28.5-11.5T760-280v-440H440v24l240 240v56h-56L510-514l-8 8q-14 14-29.5 25T440-464v104ZM224-630h92v86q12 8 25 11t27 3q23 0 41.5-7t36.5-25l8-8-56-56q-29-29-65-43.5T256-684q-20 0-38 3t-36 9l42 42Zm376 350H320v40h286q-3-9-4.5-19t-1.5-21Zm-280 40v-40 40Z" /></svg>
                                                            {/* <span>course:</span> */}
                                                            <p className="py-4 px-4 text-xl">{studentDetails.studentCource}</p>
                                                        </div>
                                                        <div className='text-center space-x-4 items-center flex'>
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" color="#000000" fill="none">
                                                                <path d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z" stroke="currentColor" strokeWidth="1.5" />
                                                                <path d="M11 7L17 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                                <path d="M7 7L8 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                                <path d="M7 12L8 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                                <path d="M7 17L8 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                                <path d="M11 12L17 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                                <path d="M11 17L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                            </svg>
                                                            {/* <span>div:</span> */}
                                                            <p className="py-4 px-4 text-xl">{studentDetails.studentDiv}</p>
                                                        </div>
                                                        <div className='text-center space-x-4 items-center flex'>
                                                            <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#434343"><path d="M480-120 200-272v-240L40-600l440-240 440 240v320h-80v-276l-80 44v240L480-120Zm0-332 274-148-274-148-274 148 274 148Zm0 241 200-108v-151L480-360 280-470v151l200 108Zm0-241Zm0 90Zm0 0Z" /></svg>
                                                            {/* <span>academic:</span> */}
                                                            <p className="py-4 px-4 text-xl">{studentDetails.studentYear}</p>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                            <form method="dialog" className="modal-backdrop">
                                                <button onClick={closeProfileModal}></button>
                                            </form>
                                        </dialog>
                                    </div>

                                    <div title='Logout' className='relative inline-block group'>
                                        <button onClick={handleLogout} className="p-2 bg-transparent border-none">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30" fill="none" className='text-gray-200'>
                                                <path d="M11 3L10.3374 3.23384C7.75867 4.144 6.46928 4.59908 5.73464 5.63742C5 6.67576 5 8.0431 5 10.7778V13.2222C5 15.9569 5 17.3242 5.73464 18.3626C6.46928 19.4009 7.75867 19.856 10.3374 20.7662L11 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                <path d="M21 12L11 12M21 12C21 11.2998 19.0057 9.99153 18.5 9.5M21 12C21 12.7002 19.0057 14.0085 18.5 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Mobile Menu */}
                            <div className={`lg:hidden absolute top-10 right-0 h-screen w-64 bg-sky-400 bg-opacity-75 text-white z-10 transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                                <ul className="flex flex-col items-center space-y-4 py-4 mt-16">
                                    <li>
                                        <a href="#library" className="hover:text-gray-300">Library</a>
                                    </li>
                                    <li>
                                        <a href="#history" className="hover:text-gray-300">History</a>
                                    </li>
                                    <li>
                                        <a href="#contactus" className="hover:text-gray-300">ContactUs</a>
                                    </li>
                                    <li>
                                        {/* <button onClick={openProfileModal}>profile</button> */}
                                        <a onClick={openProfileModal} className="hover:text-gray-300">My Profile</a>
                                    </li>
                                    <li>
                                        <button className="hover:text-gray-300" onClick={handleLogout}>Logout</button>
                                        {/* <a href="" className="hover:text-gray-300">Logout</a> */}
                                    </li>
                                </ul>
                            </div>
                        </nav >

                        {/* Content Start From Here */}
                        <div className='lg:mt-[79px] bg-sky-100 w-full min:h-screen '>

                            {/* Library Section */}
                            <section id='library' className=' sm:py-7 md:py-8 lg:py-10 px-4 md:px-8 lg:px-16'>
                                <div className='pt-30 text-center text-xl md:text-3xl lg:text-5xl text-gray-800'>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30" color="#000000" fill="none" className='text-center inline-block text-gray-800 h-6 w-6 md:h-10 md:w-10 lg:h-12 lg:w-12'>
                                        <path d="M3 11H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M3 14V8C3 5.17157 3 3.75736 3.93037 2.87868C4.86073 2 6.35814 2 9.35294 2H14.6471C17.6419 2 19.1393 2 20.0696 2.87868C21 3.75736 21 5.17157 21 8V14C21 16.8284 21 18.2426 20.0696 19.1213C19.1393 20 17.6419 20 14.6471 20H9.35294C6.35814 20 4.86073 20 3.93037 19.1213C3 18.2426 3 16.8284 3 14Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M11.5 11L9.5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M18 11L17 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M7 11V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M14 11V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M11 16L13 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M5 20V22M19 20V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span>Library</span>
                                </div>
                                <div className=' mt-6 md:mt-10 lg:mt-12 text-center'>
                                    <div className="flex justify-center items-center space-x-2 sm:space-x-4 w-full">
                                        <label htmlFor="txtsearch" className="text-gray-800 text-base md:text-xl lg:text-2xl">
                                            Search:
                                        </label>
                                        <Input
                                            className="flex-grow sm:flex-grow-0 sm:w-1/3 md:w-4/6 lg:w-1/1 text-xs md:text-base lg:text-lg"
                                            placeholder="Enter Book No/Book Name/Author/Publisher"
                                            value={searchBookDetails}
                                            onChange={e => setSearchBookDetails(e.target.value)}
                                            onKeyUp={searchBook}
                                        />
                                    </div>

                                    <div className='mt-6 w-full'>
                                        {isDataVisible && displayBooks.length > 0 ? (
                                            <div className='bg-[#F8F4EF] overflow-x-auto border-2 border-gray-300 rounded-xl shadow-2xl'>
                                                <table className='w-full text-left table-auto'>
                                                    <thead className='bg-gray-200 text-[12px] md:text-base lg:text-xl'>
                                                        <tr className='text-center'>
                                                            <th className='p-4 border-b-4 border-gray-300'>Book No</th>
                                                            <th className='p-4 border-b-4 border-gray-300'>Book Name</th>
                                                            <th className='p-4 border-b-4 border-gray-300'>Book Author Name</th>
                                                            <th className='p-4 border-b-4 border-gray-300'>Book Publisher Name</th>
                                                            <th className='p-4 border-b-4 border-gray-300'>Book Quantity</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className='divide-y text-[11px] md:text-base lg:text-lg   divide-gray-300'>
                                                        {displayBooks.map((bookDetails) => (
                                                            <tr key={bookDetails.bookNo} className='hover:bg-gray-300 text-center cursor-pointer'>
                                                                <td className='p-4'>{bookDetails.bookNo}</td>
                                                                <td className='p-4'>{bookDetails.bookName}</td>
                                                                <td className='p-4'>{bookDetails.bookAuthorName}</td>
                                                                <td className='p-4'>{bookDetails.bookPublisherName}</td>
                                                                <td className='p-4 text-center'>{bookDetails.bookQty}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                                <div className='flex justify-center mt-4 items-center'>
                                                    {/* Previous Button */}
                                                    <button
                                                        onClick={handlePrevious}
                                                        disabled={currentPage === 1}
                                                        className='px-3 py-1 mx-1 rounded bg-gray-300 disabled:opacity-50 text-xs md:text-sm lg:text-base mb-2'
                                                    >
                                                        Previous
                                                    </button>
                                                    {/* Page Number Button */}
                                                    {Array.from({ length: totalPages }, (_, i) => (
                                                        <button
                                                            key={i + 1}
                                                            onClick={() => handlePageChange(i + 1)}
                                                            className={`px-3 py-1 mx-1 rounded text-xs md:text-sm lg:text-base mb-2 ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`
                                                            }
                                                            disabled
                                                        >
                                                            {i + 1}
                                                        </button>
                                                    ))}
                                                    {/* Next Button */}
                                                    <button
                                                        onClick={handleNext}
                                                        disabled={currentPage === totalPages}
                                                        className='px-3 py-1 mx-1 rounded bg-gray-300 disabled:opacity-50 text-xs md:text-sm lg:text-base mb-2'
                                                    >
                                                        Next
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex justify-center items-center h-64 mt-8">
                                                <div className="text-center">
                                                    <Image src="/no-data.png" alt="No data found" priority width={300} height={300} className="mx-auto mb-4" />
                                                    <p className="text-gray-600 text-xl font-semibold -mt-12 mb-4">Book not found.</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </section>

                            {/* History Section */}
                            <section id='history' className='sm:py-7 md:py-8 lg:py-10 px-4 md:px-8 lg:px-16'>
                                <div className='pt-20 text-center md:text-3xl lg:text-5xl text-gray-800'>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30" color="#000000" fill="none" className='inline-block text-center text-gray-800 h-6 w-6 md:h-10 md:w-10 lg:h-12 lg:w-12'>
                                        <path d="M19 2V5C19 8.86599 15.866 12 12 12M5 2V5C5 8.86599 8.13401 12 12 12M12 12C15.866 12 19 15.134 19 19V22M12 12C8.13401 12 5 15.134 5 19V22" stroke="currentColor" strokeWidth="1.5" />
                                        <path d="M4 2H20M20 22H4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                    <span>History</span>
                                </div>
                                <div className='mt-6 md:mt-10 lg:mt-12 text-center'>
                                    <div className="flex justify-center items-center space-x-2 sm:space-x-6 w-full">
                                        <label htmlFor="txtsearch" className="text-gray-800 text-base md:text-xl lg:text-2xl">
                                            Search:
                                        </label>
                                        <Input
                                            className="flex-grow sm:flex-grow-0 sm:w-1/3 md:w-4/6 lg:w-1/1 text-xs md:text-base lg:text-lg"
                                            placeholder="Enter Book No/Book Name/Author/Publisher"
                                            value={searchStudentIssuedBook}
                                            onChange={e => setSearchStudentIssuedBook(e.target.value)}
                                            onKeyUp={searchStudentIssuedBookDetails}
                                        />
                                    </div>
                                </div>


                                <div className='mt-6'>
                                    {isDataVisible && displayStudentIssuedBooks.length > 0 ? (
                                        <div className='bg-[#F8F4EF] overflow-x-auto border-2 border-gray-300 rounded-xl shadow-2xl'>
                                            <table className='w-full text-left table-auto'>
                                                <thead className='bg-gray-200 text-[12px] md:text-base lg:text-xl'>
                                                    <tr className='text-center'>
                                                        <th className='p-4 border-b-4 border-gray-300'>Book No</th>
                                                        <th className='p-4 border-b-4 border-gray-300'>Book Name</th>
                                                        <th className='p-4 border-b-4 border-gray-300'>Issue Date</th>
                                                        <th className='p-4 border-b-4 border-gray-300'>Return Date</th>
                                                    </tr>
                                                </thead>
                                                <tbody className='divide-y text-[11px] md:text-base lg:text-lg divide-gray-300'>
                                                    {displayStudentIssuedBooks.map((bookDetails) => (
                                                        <tr key={bookDetails.bookNo} className='hover:bg-gray-300 text-center cursor-pointer'>
                                                            <td className='p-4'>{bookDetails.bookNo}</td>
                                                            <td className='p-4'>{bookDetails.bookName}</td>
                                                            <td className='p-4'>{bookDetails.bookIssueDate}</td>
                                                            <td className='p-4'>{bookDetails.returnDate}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            <div className='flex justify-center mt-4 items-center'>
                                                {/* Previous Button */}
                                                <button
                                                    onClick={goToPreviousPage}
                                                    disabled={currentHistoryPage === 1}
                                                    className='px-3 py-1 mx-1 rounded bg-gray-300 disabled:opacity-50 text-xs md:text-sm lg:text-base mb-2'
                                                >
                                                    Previous
                                                </button>
                                                {/* Page Number Buttons */}
                                                {Array.from({ length: numberOfPages }, (_, i) => (
                                                    <button
                                                        key={i + 1}
                                                        onClick={() => goToPage(i + 1)}
                                                        className={`px-3 py-1 mx-1 rounded text-xs md:text-sm lg:text-base mb-2 ${currentHistoryPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                                                    >
                                                        {i + 1}
                                                    </button>
                                                ))}
                                                {/* Next Button */}
                                                <button
                                                    onClick={goToNextPage}
                                                    disabled={currentHistoryPage === numberOfPages}
                                                    className='px-3 py-1 mx-1 rounded bg-gray-300 disabled:opacity-50 text-xs md:text-sm lg:text-base mb-2'
                                                >
                                                    Next
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex justify-center items-center h-64 mt-8">
                                            <div className="text-center">
                                                <Image src="/no-data.png" alt="No data found" priority width={300} height={300} className="mx-auto mb-4" />
                                                <p className="text-gray-600 text-xl font-semibold -mt-12 mb-4">Book not found.</p>
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </section>

                            {/* Contact Us */}
                            <section id='contactus' className='sm:py-7 md:py-8 lg:py-10 px-4 md:px-8 lg:px-16'>
                                <div className='rounded-xl shadow-2xl'>
                                    <div className='pt-20 text-center md:text-3xl lg:text-5xl text-gray-800'>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30" color="#000000" fill="none" className='text-center inline-block text-gray-800 h-6 w-6 md:h-10 md:w-10 lg:h-12 lg:w-12'>
                                            <path d="M17 10.8045C17 10.4588 17 10.286 17.052 10.132C17.2032 9.68444 17.6018 9.51076 18.0011 9.32888C18.45 9.12442 18.6744 9.02219 18.8968 9.0042C19.1493 8.98378 19.4022 9.03818 19.618 9.15929C19.9041 9.31984 20.1036 9.62493 20.3079 9.87302C21.2513 11.0188 21.7229 11.5918 21.8955 12.2236C22.0348 12.7334 22.0348 13.2666 21.8955 13.7764C21.6438 14.6979 20.8485 15.4704 20.2598 16.1854C19.9587 16.5511 19.8081 16.734 19.618 16.8407C19.4022 16.9618 19.1493 17.0162 18.8968 16.9958C18.6744 16.9778 18.45 16.8756 18.0011 16.6711C17.6018 16.4892 17.2032 16.3156 17.052 15.868C17 15.714 17 15.5412 17 15.1955V10.8045Z" stroke="currentColor" strokeWidth="1.5" />
                                            <path d="M7 10.8046C7 10.3694 6.98778 9.97821 6.63591 9.6722C6.50793 9.5609 6.33825 9.48361 5.99891 9.32905C5.55001 9.12458 5.32556 9.02235 5.10316 9.00436C4.43591 8.9504 4.07692 9.40581 3.69213 9.87318C2.74875 11.019 2.27706 11.5919 2.10446 12.2237C1.96518 12.7336 1.96518 13.2668 2.10446 13.7766C2.3562 14.6981 3.15152 15.4705 3.74021 16.1856C4.11129 16.6363 4.46577 17.0475 5.10316 16.996C5.32556 16.978 5.55001 16.8757 5.99891 16.6713C6.33825 16.5167 6.50793 16.4394 6.63591 16.3281C6.98778 16.0221 7 15.631 7 15.1957V10.8046Z" stroke="currentColor" strokeWidth="1.5" />
                                            <path d="M5 9C5 5.68629 8.13401 3 12 3C15.866 3 19 5.68629 19 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="round" />
                                            <path d="M19 17V17.8C19 19.5673 17.2091 21 15 21H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <span>Contact Us</span>
                                    </div>
                                    <div className="flex">

                                        {/* Image Carousel */}
                                        <div className="hidden lg:flex justify-center mt-8 pl-5 items-center w-full md:w-1/2 h-full rounded-md">
                                            <Swiper
                                                pagination={{ clickable: false }}
                                                autoplay={{ delay: 2500, disableOnInteraction: false }}
                                                navigation={false} // add navigation if needed
                                                modules={[Pagination, Navigation, Autoplay]}
                                                loop={true}
                                                speed={2000}
                                                className="w-full rounded-2xl h-full">
                                                <SwiperSlide>
                                                    <Image src="/student_contact1.jpg" alt="Image 1" width={1200} height={968} className="object-cover w-full h-screen" priority />
                                                </SwiperSlide>
                                                <SwiperSlide>
                                                    <Image src="/student_contact2.jpg" alt="Image 3" width={1200} height={968} className="object-cover w-full h-screen" priority />
                                                </SwiperSlide>
                                            </Swiper>
                                        </div>

                                        {/* Contact Information */}
                                        <div className="flex-1 p-4 mt-8 max-w-4xl mx-auto ">
                                            <div className="mt-2 mb-8">
                                                <h2 className="text-base md:text-xl lg:text-3xl font-semibold mb-4">Library Information</h2>
                                                <p className="mb-4 text-xs md:text-base lg:text-xl">Address: 4PJ9+R64, Near Malvan Mandir Via Magdalla Port, Dumas Rd, Surat, Gujarat 395007</p>
                                                <p className="mb-4 text-xs md:text-base lg:text-xl">Phone: (+91) 123-456-7890</p>
                                                <p className="mb-4 text-xs md:text-base lg:text-xl">Email: <a href="mailto:library@example.com" className="text-blue-500">ckpcmc@example.com</a></p>
                                                <p className="text-xs md:text-base lg:text-lg">Operating Hours: Mon-sat, 9 AM - 5 PM</p>
                                            </div>

                                            <div className="mb-8">
                                                <h2 className="text-base md:text-xl lg:text-3xl  font-semibold mb-4">Send Us a Message</h2>
                                                <form action="/submit-contact" method="POST" className="space-y-4">
                                                    <div>
                                                        <label htmlFor="studentName" className="block text-sm md:text-base lg:text-xl font-medium mb-2">Name:</label>
                                                        <Input id="studentName" onChange={(e) => setStudentName(e.target.value)} placeholder='Enter Full Name' pattern='/^[A-Za-z]+$/' className="p-2 border mb-2 border-gray-300 rounded w-full" required />
                                                        {studentName && !namepattern.test(studentName) && (
                                                            < p className="mt-1 text-red-500 text-base">Please enter only Characters.</p>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <label htmlFor="studentEmail" className="block text-sm md:text-base lg:text-xl font-medium mb-2">Email Address:</label>
                                                        <Input id="studentEmail" onChange={(e) => setEmail(e.target.value)} placeholder='Enter Full Name' className="p-2 border mb-2 border-gray-300 rounded w-full" required />
                                                        {studentEmail && !emailpattern.test(studentEmail) && (
                                                            < p className="mt-1 text-red-500 text-base">Please enter proper Email.</p>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <label htmlFor="message" className="block text-sm md:text-base lg:text-xl font-medium mb-2">Message:</label>
                                                        <textarea id="message" name="message" placeholder='Enter Message...' className="p-2 border mb-2 border-gray-300 rounded w-full h-40" required></textarea>
                                                    </div>
                                                    <button type="submit" className=" px-3 py-1 mx-1 rounded disabled:opacity-50 text-xs md:text-sm lg:text-base mb-2  bg-blue-500 text-white">Send</button>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div >
                            </section >



                            <div className='pb-8 lg:py-10 text-center'>
                                <h2 className="text-base md:text-xl lg:text-3xl font-semibold mb-2">Follow Us</h2>
                                <p className='text-sm md:text-lg lg:text-lg'>Connect with us on our social media channels:</p>
                                <div className="flex justify-center items-center space-x-4 mt-2 ">
                                    <a href="https://facebook.com" className="text-blue-600"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none" >
                                        <path fillRule="evenodd" clipRule="evenodd" d="M6.18182 10.3333C5.20406 10.3333 5 10.5252 5 11.4444V13.1111C5 14.0304 5.20406 14.2222 6.18182 14.2222H8.54545V20.8889C8.54545 21.8081 8.74951 22 9.72727 22H12.0909C13.0687 22 13.2727 21.8081 13.2727 20.8889V14.2222H15.9267C16.6683 14.2222 16.8594 14.0867 17.0631 13.4164L17.5696 11.7497C17.9185 10.6014 17.7035 10.3333 16.4332 10.3333H13.2727V7.55556C13.2727 6.94191 13.8018 6.44444 14.4545 6.44444H17.8182C18.7959 6.44444 19 6.25259 19 5.33333V3.11111C19 2.19185 18.7959 2 17.8182 2H14.4545C11.191 2 8.54545 4.48731 8.54545 7.55556V10.3333H6.18182Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                                    </svg></a>
                                    <a href="https://twitter.com" className="text-blue-400"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none" >
                                        <path d="M2 18.5C3.76504 19.521 5.81428 20 8 20C14.4808 20 19.7617 14.8625 19.9922 8.43797L22 4.5L18.6458 5C17.9407 4.37764 17.0144 4 16 4C13.4276 4 11.5007 6.51734 12.1209 8.98003C8.56784 9.20927 5.34867 7.0213 3.48693 4.10523C2.25147 8.30185 3.39629 13.3561 6.5 16.4705C6.5 17.647 3.5 18.3488 2 18.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                                    </svg></a>
                                    <a href="https://instagram.com" className="text-pink-600"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none" >
                                        <path d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                                        <path d="M16.5 12C16.5 14.4853 14.4853 16.5 12 16.5C9.51472 16.5 7.5 14.4853 7.5 12C7.5 9.51472 9.51472 7.5 12 7.5C14.4853 7.5 16.5 9.51472 16.5 12Z" stroke="currentColor" strokeWidth="1.5" />
                                        <path d="M17.5078 6.5L17.4988 6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg></a>
                                </div>
                            </div>
                        </div >
                    </>
                ) : (
                    <ShowExpiryModal isOpen={isModalOpen} />
                )}
            </div >
        </>
    )
}
