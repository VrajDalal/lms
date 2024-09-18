/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import CustomDialog from "@/components/ui/dialog";
import { BookOpenText, BookPlus, Calendar, CirclePlus, CircleUser, Info, Search } from "lucide-react";
// Define a type for the book
interface IAvailableBooks {
  bookNo: string;
  bookName: string;
  bookAuthorName: string;
  bookPublisherName: string;
  bookQty: number;
  createdAt: Date;
}

export default function Library() {


  // State to control number of items to show, loader, search query, and selected book
  const [visibleBooks, setVisibleBooks] = useState(8);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State to store search input
  const [tableData, setTableData] = useState<IAvailableBooks[]>([]);
  const [selectedBook, setSelectedBook] = useState<IAvailableBooks | null>(null); // State for selected book
  const [isDataVisible, setIsDataVisible] = useState(false);

  console.log(tableData);

  useEffect(() => {
    handleToRetriveBookDatas()
  }, [])
  // Function to load more books
  const loadMore = () => {
    setLoading(true); // Show loader
    setVisibleBooks((prevVisible) => prevVisible + 8);
    setLoading(false); // Hide loader once books are loaded
  };

  // Filter books based on search query
  const filteredBooks = tableData.filter(
    (book) =>
      book.bookName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.bookNo.toString().includes(searchQuery) || // Search by ID
      book.bookAuthorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  return (
    <>
      <title>Library</title>
      <div className="text-white">
        <h1 className="text-2xl font-bold mb-4">Library</h1>
        <p className="mb-6">Welcome to the student Library!</p>

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
            <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-4 gap-6 md:overflow-y-auto md:h-[800px] lg:h-[520px]">
              {filteredBooks
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, visibleBooks).map((book) => (
                  <div
                    key={book.bookNo}
                    className="bg-studentBg p-4 rounded-lg shadow-md h-60 w-auto hover:bg-zinc-700 transition-all duration-500"
                    onClick={() => setSelectedBook(book)}
                  >
                    <div className="flex items-center justify-center border bg-zinc-600 rounded-md p-4 mb-4">
                      <BookOpenText className="h-16 w-16" />
                    </div>
                    <div className="flex flex-col items-center">
                      <h2 className="text-lg font-semibold mb-2">{book.bookName}</h2>
                      <div className="flex items-center space-x-2 text-sm">
                        <Info />
                        <span>Quantity : {book.bookQty}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm mt-1">
                        <Calendar />
                        <span>Book no : {book.bookNo}</span>
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

        {/* Custom Dialog for selected book */}
        <CustomDialog
          isOpen={!!selectedBook}
          onClose={() => setSelectedBook(null)}
          title="Book Details"
        >
          <div className="p-4 bg-zinc-600 rounded-lg">
            <h2 className="text-lg font-semibold mb-4 border-b text-center truncate">
              {selectedBook?.bookName}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base ">
              <div className="flex items-center space-x-2">
                <Info className="text-gray-400 flex-shrink-0" />
                <span className="truncate">
                  Book Number : {selectedBook?.bookNo}
                </span>
              </div>
              {/* <div className="flex items-center space-x-2">
              <Calendar className="text-gray-400 flex-shrink-0" />
              <span className="truncate">Date: {selectedBook?.createdAt}</span>
            </div> */}
              <div className="flex items-center space-x-2">
                <CircleUser className="text-gray-400 flex-shrink-0" />
                <span className="truncate">Author : {selectedBook?.bookAuthorName}</span>
              </div>
              <div className="flex items-center space-x-2">
                <BookPlus className="text-gray-400 flex-shrink-0" />
                <span className="truncate">
                  Publisher : {selectedBook?.bookPublisherName}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CirclePlus className="text-gray-400 flex-shrink-0" />
                <span className="truncate">
                  Quantity : {selectedBook?.bookQty}
                </span>
              </div>
            </div>
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => setSelectedBook(null)}
                className="bg-white text-black font-bold py-2 px-4 rounded-lg hover:bg-zinc-700 hover:text-white transition-all duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </CustomDialog>
      </div>
    </>
  );
};


