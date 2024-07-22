import React from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Dashboard from "@/app/admin/dashboard/page"

interface ShowExpiryModalProps {
  isOpen: boolean,
  onClose: () => void
}

const ShowExpiryModal: React.FC<ShowExpiryModalProps> = ({ isOpen }) => {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/admin/login');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* <Dashboard /> */}
      <div className="fixed inset-0 text-xl bg-black bg-opacity-50 flex justify-center items-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-2xl shadow-slate-950">
          <h2 className="text-xl font-bold mb-4">Session Expired</h2>
          <p className="mb-4">Your session has expired. Please log in again.</p>
          <div className="flex justify-end">
            <Button onClick={handleLogin} className="text-xl">Login</Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ShowExpiryModal