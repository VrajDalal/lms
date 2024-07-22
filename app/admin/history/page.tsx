'use client'

import React, { useState } from 'react'
import DashBoard from '../dashboard/page'
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export default function History() {

    const [studentBookIssueHistory, setStudentBookIssueHistory] = useState([])
    const handleToGetStudentIssueBooks = async () => {
        try {
            const getStudentIssueBooksResponse = await fetch('/api/admin/issueBookHistory', {
                method: 'GET',
                headers: {
                    'Content-Type': 'applicaition/json'
                },
                credentials: 'include'
            })
            console.log(getStudentIssueBooksResponse);
            const getStudentIssueBooksResult = await getStudentIssueBooksResponse.json()
            console.log(getStudentIssueBooksResult);
            if (getStudentIssueBooksResult.success) {
                setStudentBookIssueHistory(getStudentIssueBooksResult.datas)
                console.log(studentBookIssueHistory);
            }
        } catch (error) {
            console.log(error);
            toast.error('An error occurred while fetch the student issue book data')
        }
    }
    // handleToGetStudentIssueBooks()
    return (
        <>
            <title>History</title>
            <DashBoard />
            <div className='flex flex-col ml-64 p-4 h-screen'>
                <div className="text-5xl font-bold mt-4">
                    <h1>History</h1>
                </div>
                <br />
                <hr />
                <form className='m-10'>

                </form>
            </div>
        </>
    )
}
