"use client";
import React, { useState } from "react";
import CustomDialog from "@/components/ui/dialog";
import { BookOpenText, BookPlus, Calendar, CirclePlus, CircleUser, Info, Search } from "lucide-react";
// Define a type for the book
interface Book {
  id: number;
  name: string;
  date: string;
  author: string; // New property for author name
  publisher: string; // New property for publisher name
  quantity: number; // New property for quantity
  bookNumber: number; // New property for book number
}

const Library = () => {
  // Mock data for books
  const bookData: Book[] = [
    {
      id: 1,
      name: "Book 1",
      date: "2024-01-01",
      author: "Author A Author AAuthor AAuthor AAuthor AAuthor A",
      publisher: "Publisher X",
      quantity: 10,
      bookNumber: 6767623,
    },
    {
      id: 2,
      name: "Book 2",
      date: "2024-01-02",
      author: "Author B",
      publisher: "Publisher Y",
      quantity: 5,
      bookNumber: 6767624,
    },
    {
      id: 3,
      name: "Book 3",
      date: "2024-01-03",
      author: "Author C",
      publisher: "Publisher Z",
      quantity: 7,
      bookNumber: 6767625,
    },
    {
      id: 4,
      name: "Book 4",
      date: "2024-01-04",
      author: "Author D",
      publisher: "Publisher X",
      quantity: 12,
      bookNumber: 6767626,
    },
    {
      id: 5,
      name: "Book 5",
      date: "2024-01-05",
      author: "Author E",
      publisher: "Publisher Y",
      quantity: 3,
      bookNumber: 6767627,
    },
    {
      id: 6,
      name: "Book 6",
      date: "2024-01-06",
      author: "Author F",
      publisher: "Publisher Z",
      quantity: 8,
      bookNumber: 6767628,
    },
    {
      id: 7,
      name: "Book 7",
      date: "2024-01-07",
      author: "Author G",
      publisher: "Publisher X",
      quantity: 6,
      bookNumber: 6767629,
    },
    {
      id: 8,
      name: "Book 8",
      date: "2024-01-08",
      author: "Author H",
      publisher: "Publisher Y",
      quantity: 9,
      bookNumber: 6767630,
    },
    {
      id: 9,
      name: "Book 9",
      date: "2024-01-09",
      author: "Author I",
      publisher: "Publisher Z",
      quantity: 4,
      bookNumber: 6767631,
    },
    {
      id: 10,
      name: "Book 10",
      date: "2024-01-10",
      author: "Author J",
      publisher: "Publisher X",
      quantity: 11,
      bookNumber: 6767632,
    },
    {
      id: 11,
      name: "Book 11",
      date: "2024-01-11",
      author: "Author K",
      publisher: "Publisher Y",
      quantity: 2,
      bookNumber: 6767633,
    },
    {
      id: 12,
      name: "Book 12",
      date: "2024-01-12",
      author: "Author L",
      publisher: "Publisher Z",
      quantity: 13,
      bookNumber: 6767634,
    },
    {
      id: 13,
      name: "Book 13",
      date: "2024-01-13",
      author: "Author M",
      publisher: "Publisher X",
      quantity: 15,
      bookNumber: 6767635,
    },
    {
      id: 14,
      name: "Book 14",
      date: "2024-01-14",
      author: "Author N",
      publisher: "Publisher Y",
      quantity: 6,
      bookNumber: 6767636,
    },
    {
      id: 15,
      name: "Book 15",
      date: "2024-01-15",
      author: "Author O",
      publisher: "Publisher Z",
      quantity: 7,
      bookNumber: 6767637,
    },
    {
      id: 16,
      name: "Book 16",
      date: "2024-01-16",
      author: "Author P",
      publisher: "Publisher X",
      quantity: 9,
      bookNumber: 6767638,
    },
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
      book.date.includes(searchQuery) // Search by Date
  );

  return (
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
          <img src="/No-Search-data.png" className="w-96 mx-auto " />
        </>
      ) : (
        <>
          {/* Book Grid with vertical scroll */}
          <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-4 gap-6 md:overflow-y-auto md:h-[800px] lg:h-[520px]">
            {filteredBooks.slice(0, visibleBooks).map((book) => (
              <div
                key={book.id}
                className="bg-studentBg p-4 rounded-lg shadow-md h-60 w-auto hover:bg-zinc-700 transition-all duration-500"
                onClick={() => setSelectedBook(book)}
              >
                <div className="flex items-center justify-center border bg-zinc-600 rounded-md p-4 mb-4">
                  <BookOpenText className="h-16 w-16" />
                </div>
                <div className="flex flex-col items-center">
                  <h2 className="text-lg font-semibold mb-2">{book.name}</h2>
                  <div className="flex items-center space-x-2 text-sm">
                    <Info />
                    <span>Number: {book.bookNumber}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm mt-1">
                    <Calendar />
                    <span>Date: {book.date}</span>
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
            {selectedBook?.name}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base ">
            <div className="flex items-center space-x-2">
              <Info className="text-gray-400 flex-shrink-0" />
              <span className="truncate">
                Book Number: {selectedBook?.bookNumber}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="text-gray-400 flex-shrink-0" />
              <span className="truncate">Date: {selectedBook?.date}</span>
            </div>
            <div className="flex items-center space-x-2">
              <CircleUser className="text-gray-400 flex-shrink-0" />
              <span className="truncate">Author: {selectedBook?.author}</span>
            </div>
            <div className="flex items-center space-x-2">
              <BookPlus className="text-gray-400 flex-shrink-0" />
              <span className="truncate">
                Publisher: {selectedBook?.publisher}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <CirclePlus className="text-gray-400 flex-shrink-0" />
              <span className="truncate">
                Quantity: {selectedBook?.quantity}
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
  );
};

export default Library;
