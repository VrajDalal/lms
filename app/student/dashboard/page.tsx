/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import jwt, { JwtPayload } from "jsonwebtoken"
import { useRouter } from 'next/navigation'
import nookies from 'nookies'
import ShowExpiryModal from '@/app/component/showStudentExpiryModal'
import { toast } from 'sonner'

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
  createdAt: Date;
}

export default function StudentDashboardPage() {

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [tokenExpired, setTokenExpired] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [studentDetails, setStudentDetails] = useState<IStudentDetails | null>(null)
  const [tableData, setTableData] = useState<IAvailableBooks[]>([]);
  const [isDataVisible, setIsDataVisible] = useState(false);
  const [studentsIssuedBooksHistory, setStudentsIssuedBooksHistory] = useState<IBookIssuedHistory[]>([])
  const [searchBookDetails, setSearchBookDetails] = useState('')
  const [filteredBooks, setFilteredBooks] = useState<IAvailableBooks[]>([]);
  const [searchStudentIssuedBook, setSearchStudentIssuedBook] = useState('')
  const [filteredStudentIssuedBook, setFilteredStudentIssuedBook] = useState<IBookIssuedHistory[]>([]);

  const router = useRouter()
  const cookies = nookies.get()
  const studentToken = cookies.studentToken

  const verifyToken = jwt.decode(studentToken) as JwtPayload

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
    handleToRetriveBookDatas()
    handleToRetriveStudentIssuedBookDetails()
    getStudentDetials()
  }, []);

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
    try {
      const studentIssuedBookDetailsResponse = await fetch(`/api/student/student-issue-book-history/${verifyToken?.sid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })
      const studentIssuedBookDetailsResult = await studentIssuedBookDetailsResponse.json()

      if (studentIssuedBookDetailsResult.success) {
        const studentIssuedBookData = studentIssuedBookDetailsResult.datas.IssueDetails.map((item: any) => ({
          ...item,
          bookIssueDate: item.bookIssueDate,
          returnDate: item.returnDate

        }));

        setStudentsIssuedBooksHistory(studentIssuedBookData)
      } else {
        console.error('Failed to retrieve student issued book details');
      }
    } catch (error) {
      console.error('Error fetching issued book details:', error);
    }
  }

  const displayBooks = searchBookDetails ? filteredBooks : tableData;
  const displayStudentIssuedBooks = searchStudentIssuedBook ? filteredStudentIssuedBook : studentsIssuedBooksHistory;

  return (
    <>
      <title>Dashboard</title>
      {isAuthenticated && !tokenExpired ? (
        <>
          <div className="text-white mb-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <span> Welcome! {verifyToken?.studentName} </span>
          </div>

          <div className="grid gap-4 lg:grid-cols-1 lg:grid-rows-2 lg:grid-flow-col mt-4 justify-center">
            {/* First Card - Full Width */}
            {studentDetails && (
              <>
                <div className="flex flex-col bg-studentBg border-2 border-studentBg p-6 rounded-lg shadow-lg w-full">
                  {/* Card content */}
                  <div className="flex flex-col  rounded-lg text-white justify-center w-full text-sm p-1 ">
                    <div className="flex flex-col items-center mb-2">
                      <div className="w-28 h-28 rounded-md mb-2">
                        {/* Placeholder for profile picture */}
                        <Image
                          src="/user-profile.jpeg"
                          alt="Profile"
                          width={100}
                          height={100}
                          className="rounded-md w-28 h-28 object-cover"
                          priority
                        />
                      </div>
                      <h2 className="text-xl font-semibold">{studentDetails.studentName}</h2>
                    </div>

                    {/* Grid container for ID details */}
                    <div className="flex flex-col bg-studentBg rounded-lg text-white">
                      {/* Grid container for ID details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-2 border-t border-gray-500">
                        {/* Row 1 */}
                        <div className="flex justify-center items-center gap-2">
                          <span className="font-medium text-gray-400">Name:</span>
                          <span className="font-medium">{studentDetails.studentName}</span>
                        </div>
                        <div className="flex justify-center items-center gap-2">
                          <span className="font-medium text-gray-400">Email:</span>
                          <span className="font-medium">{studentDetails.studentEmail}</span>
                        </div>
                        <div className="flex justify-center items-center gap-2">
                          <span className="font-medium text-gray-400">Phone:</span>
                          <span className="font-medium">{studentDetails.studentMobileNo}</span>
                        </div>

                        {/* Row 2 */}
                        <div className="flex justify-center items-center gap-2">
                          <span className="font-medium text-gray-400">SID:</span>
                          <span className="font-medium">{studentDetails.sid}</span>
                        </div>
                        <div className="flex justify-center items-center gap-2">
                          <span className="font-medium text-gray-400">EnrollmentNo:</span>
                          <span className="font-medium">{studentDetails.enrollmentNo}</span>
                        </div>
                        <div className="flex justify-center items-center gap-2">
                          <span className="font-medium text-gray-400">
                            Roll no:
                          </span>
                          <span className="font-medium">{studentDetails.studentRollNo}</span>
                        </div>

                        {/* Row 3 */}
                        <div className="flex justify-center items-center gap-2">
                          <span className="font-medium text-gray-400">Cource:</span>
                          <span className="font-medium">{studentDetails.studentCource}</span>
                        </div>
                        <div className="flex justify-center items-center gap-2">
                          <span className="font-medium text-gray-400">Div:</span>
                          <span className="font-medium">{studentDetails.studentDiv}</span>
                        </div>
                        <div className="flex justify-center items-center gap-2">
                          <span className="font-medium text-gray-400">Year:</span>
                          <span className="font-medium">{studentDetails.studentYear}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Last Two Cards - Same Row */}
            <div className="grid lg:grid lg:grid-cols-2 gap-4">
              <div className="bg-studentBg p-6 rounded-lg shadow-lg h-auto text-white hover:bg-zinc-700 transition-all duration-500">
                <Link href="/student/dashboard/history">
                  <div className="flex justify-between">
                    {/* Left Side: History Books */}
                    <div className="w-full">
                      <h3 className="text-lg font-semibold mb-2">History </h3>
                      {isDataVisible && displayStudentIssuedBooks.length > 0 ? (
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-500">
                              <th className="py-2 text-left">Book Name</th>
                              <th className="py-2 text-left">Issue Date</th>
                              <th className="py-2 text-left">Return Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {displayStudentIssuedBooks
                              .sort((a, b) => new Date(b.bookIssueDate).getTime() - new Date(a.bookIssueDate).getTime())
                              .slice(0, 3)
                              .map((bookDetails) => (
                                <tr key={bookDetails.bookNo} className="border-b border-gray-600">
                                  <td className="py-5">{bookDetails.bookName}</td>
                                  <td className="py-5">{bookDetails.bookIssueDate}</td>
                                  <td className="py-5">{bookDetails.returnDate}</td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      ) : (
                        <div className="flex justify-center items-center h-64 mt-8">
                          <div className="text-center">
                            <Image src="/no-data.png" alt="No data found" priority width={300} height={300} className="mx-auto mb-4" />
                            <p className="text-xl font-semibold -mt-12 mb-4">Book not Issued Yet.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </div>

              <div className="bg-studentBg p-6 rounded-lg shadow-lg h-auto text-white hover:bg-zinc-700 transition-all duration-500">
                <Link href="/student/dashboard/library">
                  <div className="flex justify-between">
                    {/* Left Side: Recent Books */}
                    <div className="w-full">
                      <h3 className="text-lg font-semibold mb-2">Recent Books</h3>
                      {isDataVisible && displayBooks.length > 0 ? (
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-500">
                              <th className="py-2 text-left">Book Name</th>
                              <th className="py-2 text-left">Book Author Name</th>
                              <th className="py-2 text-left">Quantity</th>
                            </tr>
                          </thead>
                          <tbody>
                            {displayBooks
                              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                              .slice(0, 3)
                              .map((bookDetails) => (
                                <tr key={bookDetails.bookNo} className="border-b border-gray-600">
                                  <td className="py-5">{bookDetails.bookName}</td>
                                  <td className="py-5">{bookDetails.bookAuthorName}</td>
                                  <td className="py-5 text-center">{bookDetails.bookQty}</td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      ) : (
                        <div className="flex justify-center items-center h-64 mt-8">
                          <div className="text-center">
                            <Image src="/no-data.png" alt="No data found" priority width={300} height={300} className="mx-auto mb-4" />
                            <p className="text-xl font-semibold -mt-12 mb-4">Books not found.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </>
      ) : (
        <ShowExpiryModal isOpen={isModalOpen} />
      )}
    </>
  );
};
