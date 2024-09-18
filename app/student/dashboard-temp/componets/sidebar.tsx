"use client";
import Link from "next/link";
import { useState } from "react";
import {
  LayoutDashboard,
  History,
  LibraryBig,
  X,
  Menu,
  LogOut,
  Headset,
} from "lucide-react";

export default function Sidebar() {
  const [active, setActive] = useState("dashboard");
  const [isOpen, setIsOpen] = useState(false); // For mobile toggle

  // Navigation items with icons
  const navItems = [
    {
      name: "Dashboard",
      href: "/student/dashboard-temp/",
      key: "dashboard",
      icon: <LayoutDashboard />,
    },
    {
      name: "Library",
      href: "/student/dashboard-temp/library",
      key: "library",
      icon: <LibraryBig />,
    },
    {
      name: "History",
      href: "/student/dashboard-temp/history",
      key: "history",
      icon: <History />,
    },
    {
      name: "Contact Us",
      href: "/student/dashboard-temp/contact-us",
      key: "contact-us",
      icon: <Headset />,
    },
  ];

  return (
    <>
      {/* Mobile toggle button (visible on small devices only) */}
      <div className="md:hidden p-4 bg-zinc-900 text-white flex justify-between items-center">
        <div className="font-bold border-b border-studentBg">
          Student Dashboard
        </div>
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar container with conditional styles */}
      <div
        className={`h-screen md:h-auto w-64 border-2 border-studentBg rounded-md bg-zinc-900 text-white fixed top-0 left-0 z-30 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 md:relative md:translate-x-0 md:top-auto`}
      >
        <div className="p-4 text-center font-bold border-b border-studentBg">
          Student Dashboard
        </div>
        <nav className="flex-grow p-2 ">
          <ul>
            {navItems.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  className={`flex animation-all duration-500 items-center p-4 mt-2 gap-2 hover:bg-studentBg rounded-lg ${
                    active === item.key && "bg-studentBg"
                  }`}
                  onClick={() => {
                    setActive(item.key);
                    setIsOpen(false); // Close sidebar on mobile after clicking
                  }}
                >
                  <span className="text-xl">{item.icon}</span>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout button */}
        <div className="absolute bottom-0 w-full border-t border-studentBg">
          <Link
            href="/logout" // Update this URL to your actual logout route
            className="flex items-center p-4 px-6 gap-2 hover:bg-studentBg text-red-500"
          >
            <span className="text-xl">
              {/* Use an appropriate icon for logout */}
              <LogOut />
            </span>
            Logout
          </Link>
        </div>
      </div>

      {/* Overlay to cover main content on mobile when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
