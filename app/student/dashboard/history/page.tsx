/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import CustomDialog from "@/components/ui/dialog";
import { BookOpenCheck, BookOpenText, BookPlus, Calendar, CalendarCheck, CalendarClock, CirclePlus, CircleUser, Info, Search } from "lucide-react";
import nookies from 'nookies'
import jwt, { JwtPayload } from "jsonwebtoken"

// Define a type for the book

interface IBookIssuedHistory {
  bookNo: string;
  bookIssueDate: string;
  bookName: string;
  returnDate: string;
  createdAt: Date;
}

export default function History() {


  // State to control number of items to show, loader, search query, and selected book
  const [visibleBooks, setVisibleBooks] = useState(8);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State to store search input
  const [selectedBook, setSelectedBook] = useState<IBookIssuedHistory | null>(null); // State for selected book
  const [studentsIssuedBooksHistory, setStudentsIssuedBooksHistory] = useState<IBookIssuedHistory[]>([])

  const cookies = nookies.get()
  const studentToken = cookies.studentToken
  const verifyToken = jwt.decode(studentToken) as JwtPayload

  useEffect(() => {
    handleToRetriveStudentIssuedBookDetails()
  }, [])

  // Function to load more books
  const loadMore = () => {
    setLoading(true); // Show loader
    setVisibleBooks((prevVisible) => prevVisible + 8);
    setLoading(false); // Hide loader once books are loaded
  };

  // Filter books based on search query
  const filteredBooks = studentsIssuedBooksHistory.filter(
    (book) =>
      book.bookName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.bookNo.toString().includes(searchQuery) //||  Search by ID
    // book.bookIssueDate.includes(searchQuery) // Search by Date
  );

  const handleToRetriveStudentIssuedBookDetails = async () => {
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

  return (
    <>
      <title>History</title>
      <div className="text-white">
        <h1 className="text-2xl font-bold mb-4">History</h1>
        <p className="mb-6">Welcome to the student History!</p>

        {/* Search Bar */}
        <div className="mb-4 w-full flex items-center relative">
          <span className="absolute left-3 text-white">
            <Search />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a book..."
            className="w-96 p-2 pl-10 text-white rounded-lg bg-transparent border-2 border-studentBg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Conditional rendering for "No books found" */}
        {filteredBooks.length === 0 ? (
          <>
            <div className="text-center text-gray-400 text-lg">
              No books found.
            </div>
            <img src="/No-Search-data.png" className="w-96 mx-auto" alt="No-Search-data" />
          </>
        ) : (
          <>
            {/* Book Grid with vertical scroll */}
            <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-6 md:overflow-y-auto md:h-[800px] lg:h-[520px]">
              {filteredBooks
                .sort((a, b) => new Date(b.bookIssueDate).getTime() - new Date(a.bookIssueDate).getTime())
                .slice(0, visibleBooks)
                .map((book) => (
                  <div
                    key={book.bookNo}
                    className="bg-studentBg p-4 rounded-lg shadow-md h-72 w-auto hover:bg-zinc-700 transition-all duration-500"
                    onClick={() => setSelectedBook(book)}
                  >
                    <div className="flex items-center justify-center border bg-gray-800   rounded-md p-4 mb-4">
                      <BookOpenCheck className="h-16 w-16" />
                    </div>
                    <div className="flex flex-col items-center">
                      <h2 className="text-lg font-semibold mb-2">{book.bookName}</h2>
                      <div className="flex items-center space-x-2 text-sm">
                        <Info />
                        <span>Number: {book.bookNo}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm mt-3">
                        <CalendarCheck className="text-green-500" />
                        <span className="text-green-500">Issue Date: {book.bookIssueDate}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm mt-3">
                        <CalendarClock className="text-red-500" />
                        <span className="text-red-500">Return Date: {book.returnDate}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Load More Button */}
            {visibleBooks < filteredBooks.length && !loading && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={loadMore}
                  className="bg-white text-black font-bold py-2 px-4 rounded-lg hover:bg-zinc-700 hover:text-white transition-all duration-300"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}

        {/* Loader */}
        {loading && (
          <div className="flex justify-center mt-6">
            <div className="loader border-t-4 border-b-4 border-white h-8 w-8 rounded-full animate-spin"></div>
          </div>
        )}


      </div>
    </>
  );
};

