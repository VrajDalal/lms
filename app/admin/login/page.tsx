'use client'

import * as React from "react";
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function Admin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    // useAuth()
    const handleAdminLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!username || !password) {
                toast.info("Username and password are mandatory");
                return;
            }

            const adminLoginResponse = await fetch('/api/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password }),
                credentials: 'include'
            })
            console.log(adminLoginResponse);

            const adminLoginResult = await adminLoginResponse.json()
            console.log(adminLoginResult);
            if (adminLoginResult.success) {
                router.push('/admin/dashboard');
            } else {
                toast.error("Invalid username or password");
            }
        } catch (error) {
            toast.error("Authentication failed");
        }
    };

    const handleContextMenu = (e: React.FormEvent) => {
        e.preventDefault();
    };

    return (
        <>
            <title>Book Issue Hub Admin</title>
            <div className="mt-40 inset-0 flex justify-center items-center" onContextMenu={handleContextMenu}>
                <div className='p-6 rounded-lg w-full max-w-md mx-6 border-4 shadow-2xl shadow-slate-950'>
                    <div className='flex justify-center items-center'>
                        <h1 className='text-5xl font-bold'>Login</h1>
                    </div>
                    <form className='mt-5' onSubmit={handleAdminLogin}>
                        <div>
                            <label htmlFor="txtUsername" className='font-semibold text-xl'>Username</label>
                            <Input type='text' name="username" value={username} onChange={e => setUsername(e.target.value)} className='mt-2 text-lg' />
                        </div>

                        <div className='mt-4' >
                            <label htmlFor="txtPassword" className='font-semibold text-xl'>Password</label>
                            <Input type='password' name="password" value={password} onChange={e => setPassword(e.target.value)} className='mt-2 text-lg' />
                        </div>

                        <div className="mt-4 justify-center items-center flex">
                            <Button type="submit" className='text-lg w-full h-full'>Login</Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
