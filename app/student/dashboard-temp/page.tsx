import Image from "next/image";
import Link from "next/link";
import React from "react";

const Dashboard = () => {
  const books = [
    { name: "Book A", author: "Joan", quantity: 10 },
    { name: "Book B", author: "Joan", quantity: 8 },
    { name: "Book C", author: "Joan", quantity: 12 },
    { name: "Book D", author: "John", quantity: 5 }, // Additional items to demonstrate slicing
    { name: "Book E", author: "Doe", quantity: 7 },
  ];
  return (
    <>
      <div className="text-white mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p>Welcome to the student dashboard!</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-1 lg:grid-rows-2 lg:grid-flow-col mt-4 justify-center">
        {/* First Card - Full Width */}
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
                />
              </div>
              <h2 className="text-xl font-semibold">John Doe</h2>
            </div>

            {/* Grid container for ID details */}
            <div className="flex flex-col bg-studentBg rounded-lg text-white">
              {/* Grid container for ID details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-2 border-t border-gray-500">
                {/* Row 1 */}
                <div className="flex justify-center items-center gap-2">
                  <span className="font-medium text-gray-400">Name:</span>
                  <span className="font-medium">John Doe</span>
                </div>
                <div className="flex justify-center items-center gap-2">
                  <span className="font-medium text-gray-400">Email:</span>
                  <span className="font-medium">johndoe@example.com</span>
                </div>
                <div className="flex justify-center items-center gap-2">
                  <span className="font-medium text-gray-400">Phone:</span>
                  <span className="font-medium">+1 234 567 890</span>
                </div>

                {/* Row 2 */}
                <div className="flex justify-center items-center gap-2">
                  <span className="font-medium text-gray-400">City:</span>
                  <span className="font-medium">New York</span>
                </div>
                <div className="flex justify-center items-center gap-2">
                  <span className="font-medium text-gray-400">Country:</span>
                  <span className="font-medium">USA</span>
                </div>
                <div className="flex justify-center items-center gap-2">
                  <span className="font-medium text-gray-400">
                    Postal Code:
                  </span>
                  <span className="font-medium">10001</span>
                </div>

                {/* Row 3 */}
                <div className="flex justify-center items-center gap-2">
                  <span className="font-medium text-gray-400">Position:</span>
                  <span className="font-medium">Developer</span>
                </div>
                <div className="flex justify-center items-center gap-2">
                  <span className="font-medium text-gray-400">Company:</span>
                  <span className="font-medium">ABC Corp</span>
                </div>
                <div className="flex justify-center items-center gap-2">
                  <span className="font-medium text-gray-400">Joined:</span>
                  <span className="font-medium">2020</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Last Two Cards - Same Row */}
        <div className="grid lg:grid lg:grid-cols-2 gap-4">
          <div className="bg-studentBg p-6 rounded-lg shadow-lg h-auto text-white hover:bg-zinc-700 transition-all duration-500">
            <Link href="/student/dashboard/history">
              <div className="flex justify-between">
                {/* Left Side: History Books */}
                <div className="w-full">
                  <h3 className="text-lg font-semibold mb-2">History </h3>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-500">
                        <th className="py-2 text-left">Book Name</th>
                        <th className="py-2 text-left">Book Author Name</th>
                        <th className="py-2 text-left">Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {books.slice(0, 3).map((book, index) => (
                        <tr key={index} className="border-b border-gray-600">
                          <td className="py-5">{book.name}</td>
                          <td className="py-5">{book.author}</td>
                          <td className="py-5">{book.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-500">
                        <th className="py-2 text-left">Book Name</th>
                        <th className="py-2 text-left">Book Author Name</th>
                        <th className="py-2 text-left">Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {books.slice(0, 3).map((book, index) => (
                        <tr key={index} className="border-b border-gray-600">
                          <td className="py-5">{book.name}</td>
                          <td className="py-5">{book.author}</td>
                          <td className="py-5">{book.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
