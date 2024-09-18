"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { LayoutDashboard, History, LibraryBig, X, Menu, LogOut, Headset } from "lucide-react";
import { useRouter, usePathname } from 'next/navigation';
import nookies from 'nookies';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false); // For mobile toggle

  const router = useRouter();
  const pathname = usePathname();
  const cookies = nookies.get();
  const studentToken = cookies.studentToken;

  const navItems = [
    { name: "Dashboard", href: "/student/dashboard/", key: "dashboard", icon: <LayoutDashboard /> },
    { name: "Library", href: "/student/dashboard/library", key: "library", icon: <LibraryBig /> },
    { name: "History", href: "/student/dashboard/history", key: "history", icon: <History /> },
    { name: "Contact Us", href: "/student/dashboard/contact-us", key: "contact-us", icon: <Headset /> },
  ];

  const activeKey = navItems.find((item) => pathname === item.href)?.key || "dashboard";

  const handleLogout = () => {
    nookies.destroy(null, 'studentToken', { path: '/' });
    router.push('/student/login');
  };

  return (
    <>
      <div className="md:hidden p-4 bg-zinc-900 text-white flex justify-between items-center">
        <div className="font-bold border-b border-studentBg">Student Dashboard</div>
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className={`h-screen md:h-auto w-64 border-2 border-studentBg rounded-md bg-zinc-900 text-white fixed top-0 left-0 z-30 transform ${isOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 md:relative md:translate-x-0 md:top-auto overflow-y-auto`}>
        <div className="p-4 text-center font-bold border-b border-studentBg">Student Dashboard</div>
        <nav className="flex-grow p-2">
          <ul>
            {navItems.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  className={`flex animation-all duration-500 items-center p-4 mt-2 gap-2 hover:bg-studentBg rounded-lg ${activeKey === item.key && "bg-studentBg"}`}
                  onClick={() => setIsOpen(false)} // Close sidebar on mobile after clicking
                >
                  <span className="text-xl">{item.icon}</span>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-0 w-full border-t border-studentBg">
          <div className="flex items-center p-4 px-6 gap-2 cursor-pointer hover:bg-studentBg text-red-500" onClick={handleLogout}>
            <span className="text-xl">
              <LogOut />
            </span>
            Logout
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black opacity-50 z-20 md:hidden" onClick={() => setIsOpen(false)} />
      )}
    </>
  );
}
