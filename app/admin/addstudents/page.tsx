'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from "sonner"

export default function AddStudents() {

    const [selectedFile, setSelectedFile] = useState<File | null>(null)


    const fileInputRef = useRef<HTMLInputElement | null>(null)


    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0])
        }
    }

    const handleExcelFileUpload = async (e: any) => {
        e.preventDefault()

        if (!selectedFile) {
            toast.info('Please select a file')
            return;
        }

        const formData = new FormData()
        formData.append('file', selectedFile)

        try {
            const excelFileUploadResponce = await fetch('/api/admin/addStudentsList', {
                method: 'POST',
                body: formData
            })
            console.log(excelFileUploadResponce);
            const excelFileUploadResult = await excelFileUploadResponce.json()
            console.log(excelFileUploadResult);

            if (excelFileUploadResult.success) {
                toast.success('File uploaded successfully')
                setSelectedFile(null)
                if (fileInputRef.current?.value) {
                    fileInputRef.current.value = '';
                }
            } else {
                toast.error(`Error: ${excelFileUploadResult.error}`)
            }
        } catch (error) {
            console.log('Error uploading file', error);
            toast.error('Error uploading file')
        }
    }

    return (
        <>
            <title>Add Students</title>
            <div className="text-5xl font-bold mt-4">
                <h1>Enter Students Details</h1>
            </div>
            <br />
            <hr />

            <form className="m-10">
                <div className="text-xl mt-4">
                    <label htmlFor="fileImportExcel" className='block mb-2'>Import Excel File :</label>
                    <div className='p-4'>
                        <label htmlFor="fileImportExcel" className="flex flex-col items-center p-12 border border-gray-300 rounded-lg cursor-pointer w-1/3 text-lg mt-4">

                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="64" height="64" color="#7ed321" fill="none">
                                <path d="M15 2.5V4C15 5.41421 15 6.12132 15.4393 6.56066C15.8787 7 16.5858 7 18 7H19.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M4 16V8C4 5.17157 4 3.75736 4.87868 2.87868C5.75736 2 7.17157 2 10 2H14.1716C14.5803 2 14.7847 2 14.9685 2.07612C15.1522 2.15224 15.2968 2.29676 15.5858 2.58579L19.4142 6.41421C19.7032 6.70324 19.8478 6.84776 19.9239 7.03153C20 7.2153 20 7.41968 20 7.82843V16C20 18.8284 20 20.2426 19.1213 21.1213C18.2426 22 16.8284 22 14 22H10C7.17157 22 5.75736 22 4.87868 21.1213C4 20.2426 4 18.8284 4 16Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M12 11V14M12 14V17M12 14H7.5M12 14H16.5M9.5 17H14.5C15.4428 17 15.9142 17 16.2071 16.7071C16.5 16.4142 16.5 15.9428 16.5 15V13C16.5 12.0572 16.5 11.5858 16.2071 11.2929C15.9142 11 15.4428 11 14.5 11H9.5C8.55719 11 8.08579 11 7.79289 11.2929C7.5 11.5858 7.5 12.0572 7.5 13V15C7.5 15.9428 7.5 16.4142 7.79289 16.7071C8.08579 17 8.55719 17 9.5 17Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span className="text-gray-500">{selectedFile ? selectedFile.name : 'Select excel file'}</span>
                            <Input id="fileImportExcel" type="file" accept='.xls,.xlsx' className='hidden' onChange={handleFileChange} ref={fileInputRef} />
                        </label>
                        <Button type='submit' className='flex justify-center items-center text-lg mt-4 w-1/3' onClick={handleExcelFileUpload}>Add</Button>
                    </div>
                </div>

                <div className="text-xl mt-4">
                    <label htmlFor="manualyAddStudent">Add Student Manualy</label>
                    <div className="p-4">
                        <label htmlFor="manualyAddStudent" className="flex flex-col items-center p-12 border border-gray-300 rounded-lg cursor-pointer w-1/3 text-lg mt-4">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="64" height="64" color="#000000" fill="none">
                                <path d="M12 8V16M16 12L8 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z" stroke="currentColor" strokeWidth="1.5" />
                            </svg>
                        </label>
                    </div>
                </div>
            </form>
        </>
    )
}

