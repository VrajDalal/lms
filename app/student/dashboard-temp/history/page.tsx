"use client";
import React, { useState } from "react";
import CustomDialog from "@/components/ui/dialog";
import { BookOpenCheck, BookOpenText, BookPlus, Calendar, CalendarCheck, CalendarClock, CirclePlus, CircleUser, Info, Search } from "lucide-react";
// Define a type for the book
interface Book {
  id: number;
  bookNumber: number; // New property for book number
  name: string;
  issueDate: string;
  returnDate: string;

}

const History = () => {
  // Mock data for books
  const bookData: Book[] = 
  [
    {
      id: 1,
      bookNumber: 6767623,
      name: "Book 1",
      issueDate: "2024-01-01",
      returnDate: "2024-01-31"
    },
    {
      id: 2,
      bookNumber: 6767624,
      name: "Book 2",
      issueDate: "2024-01-02",
      returnDate: "2024-02-01"
    },
    {
      id: 3,
      bookNumber: 6767625,
      name: "Book 3",
      issueDate: "2024-01-03",
      returnDate: "2024-02-02"
    },
    {
      id: 4,
      bookNumber: 6767626,
      name: "Book 4",
      issueDate: "2024-01-04",
      returnDate: "2024-02-03"
    },
    {
      id: 5,
      bookNumber: 6767627,
      name: "Book 5",
      issueDate: "2024-01-05",
      returnDate: "2024-02-04"
    },
    {
      id: 6,
      bookNumber: 6767628,
      name: "Book 6",
      issueDate: "2024-01-06",
      returnDate: "2024-02-05"
    },
    {
      id: 7,
      bookNumber: 6767629,
      name: "Book 7",
      issueDate: "2024-01-07",
      returnDate: "2024-02-06"
    },
    {
      id: 8,
      bookNumber: 6767630,
      name: "Book 8",
      issueDate: "2024-01-08",
      returnDate: "2024-02-07"
    },
    {
      id: 9,
      bookNumber: 6767631,
      name: "Book 9",
      issueDate: "2024-01-09",
      returnDate: "2024-02-08"
    },
    {
      id: 10,
      bookNumber: 6767632,
      name: "Book 10",
      issueDate: "2024-01-10",
      returnDate: "2024-02-09"
    },
    {
      id: 11,
      bookNumber: 6767633,
      name: "Book 11",
      issueDate: "2024-01-11",
      returnDate: "2024-02-10"
    },
    {
      id: 12,
      bookNumber: 6767634,
      name: "Book 12",
      issueDate: "2024-01-12",
      returnDate: "2024-02-11"
    },
    {
      id: 13,
      bookNumber: 6767635,
      name: "Book 13",
      issueDate: "2024-01-13",
      returnDate: "2024-02-12"
    },
    {
      id: 14,
      bookNumber: 6767636,
      name: "Book 14",
      issueDate: "2024-01-14",
      returnDate: "2024-02-13"
    },
    {
      id: 15,
      bookNumber: 6767637,
      name: "Book 15",
      issueDate: "2024-01-15",
      returnDate: "2024-02-14"
    },
    {
      id: 16,
      bookNumber: 6767638,
      name: "Book 16",
      issueDate: "2024-01-16",
      returnDate: "2024-02-15"
    }
  ];

  // State to control number of items to show, loader, search query, and selected book
  const [visibleBooks, setVisibleBooks] = useState(8);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State to store search input
  const [selectedBook, setSelectedBook] = useState<Book | null>(null); // State for selected book

  // Function to load more books
  const loadMore = () => {
    setLoading(true); // Show loader
    setVisibleBooks((prevVisible) => prevVisible + 8);
    setLoading(false); // Hide loader once books are loaded
  };

  // Filter books based on search query
  const filteredBooks = bookData.filter(
    (book) =>
      book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.id.toString().includes(searchQuery) || // Search by ID
      book.issueDate.includes(searchQuery) // Search by Date
  );

  return (
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
          <img src="/No-Search-data.png" className="w-96 mx-auto " />
        </>
      ) : (
        <>
          {/* Book Grid with vertical scroll */}
          <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-6 md:overflow-y-auto md:h-[800px] lg:h-[520px]">
            {filteredBooks.slice(0, visibleBooks).map((book) => (
              <div
                key={book.id}
                className="bg-studentBg p-4 rounded-lg shadow-md h-72 w-auto hover:bg-zinc-700 transition-all duration-500"
                onClick={() => setSelectedBook(book)}
              >
                <div className="flex items-center justify-center border bg-gray-800   rounded-md p-4 mb-4">
                  <BookOpenCheck className="h-16 w-16" />
                </div>
                <div className="flex flex-col items-center">
                  <h2 className="text-lg font-semibold mb-2">{book.name}</h2>
                  <div className="flex items-center space-x-2 text-sm">
                    <Info />
                    <span>Number: {book.bookNumber}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm mt-3">
                    <CalendarCheck  className="text-green-500"/>
                    <span className="text-green-500">Issue Date: {book.issueDate}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm mt-3">
                    <CalendarClock  className="text-red-500"/>
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
  );
};

export default History;