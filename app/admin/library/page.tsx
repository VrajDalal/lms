'use client'

import React, { useRef, useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import DashBoard from '../dashboard/page'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Loading from "@/components/loading"

interface IAddBooksList {
    bookNo: string,
    bookName: string,
    bookAuthorName: string,
    bookPublisherName: string,
    bookQty: number,
    createdAt: Date
}

export default function Library() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(true)
    const [dragging, setDragging] = useState(false)
    const [isDataVisible, setIsDataVisible] = useState(false)
    const [tableData, setTableData] = useState<IAddBooksList[]>([])

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 2000)

        handleToRetriveBookDatas()
    }, [loading])

    const fileInputRef = useRef<HTMLInputElement | null>(null)

    const handleBooksFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log("File input changed"); // Debugging statement
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0]
            setSelectedFile(file)

            const formData = new FormData()
            formData.append('file', file)

            setLoading(true)
            try {
                console.log("Attempting to upload file:", file.name); // Debugging statement
                const booksExcelFileUploadResponce = await fetch('/api/admin/addBooksList', {
                    method: 'POST',
                    body: formData,
                })
                console.log(booksExcelFileUploadResponce);
                const booksExcelFileUploadResult = await booksExcelFileUploadResponce.json()
                console.log(booksExcelFileUploadResult);
                console.log("Upload response:", booksExcelFileUploadResult); // Debugging statement

                if (booksExcelFileUploadResult.success) {
                    toast.success('File uploaded successfully')
                    setSelectedFile(null)
                    if (fileInputRef.current?.value) {
                        fileInputRef.current.value = ''
                    }
                    setIsDataVisible(true)
                    handleToRetriveBookDatas()
                } else {
                    toast.error(`Error: ${booksExcelFileUploadResult.error}`)
                }
            } catch (error) {
                console.log('Error uploading file', error)
                toast.error('Error uploading file')
            } finally {
                setLoading(false)
                setSelectedFile(null)
                if (fileInputRef.current?.value) {
                    fileInputRef.current.value = ''
                }
            }
        }
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setDragging(true)
    }

    const handleDragLeave = () => {
        setDragging(false)
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setDragging(false)
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            setLoading(true)
            const file = e.dataTransfer.files[0]
            setSelectedFile(file)
            if (fileInputRef.current) {
                fileInputRef.current.files = e.dataTransfer.files
            }
            handleBooksFileChange({ target: { files: e.dataTransfer.files } } as React.ChangeEvent<HTMLInputElement>)
        }
    }

    const handleToRetriveBookDatas = async () => {
        try {
            const allBooksDetailsListResponse = await fetch('/api/admin/allBooksList', {
                method: 'GET',
                headers: {
                    'Content-Type': 'aplication/json'
                },
                credentials: 'include'
            })

            const allBooksDetailsListResult = await allBooksDetailsListResponse.json()
            if (allBooksDetailsListResult.success) {
                setTableData(allBooksDetailsListResult.datas)
                if (allBooksDetailsListResult.datas && allBooksDetailsListResult.datas.length > 0) {
                    setIsDataVisible(true)
                } else {
                    setIsDataVisible(false)
                }
            } else {
                console.error('Failed to fetch book data:', allBooksDetailsListResult.error)
                setIsDataVisible(false)
            }
        } catch (error) {
            console.error('Error fetching table data:', error)
            setIsDataVisible(false)
        }
    }

    //in library section add manually books and save into table also (CRUD operation ,edit quantity,delete books)
    //if not book data than show drag option else show buttons : done
    //in search book no,name,author on keyup event
    //on click of bookno can do PATCH or update the book details in which only Qty update
    //in row end put delete for remove the book
    return (
        <>
            <title>Library</title>
            {loading && (
                <div className="loader-overlay loader-container">
                    <Loading />
                </div>
            )}
            <div className={`main-content ${loading ? 'blur' : ''}`}>
                <DashBoard />
                <div className="flex flex-col pl-20 md:pl-24 pt-10 min-h-screen lg:pl-24 pr-4 lg:pr-16 bg-[#FCFAF5]">
                    <div className="text-5xl font-bold">
                        <h1>Library</h1>
                    </div>
                    <br />
                    <hr />
                    <div className='text-xl mt-4 flex flex-col md:flex-row md:items-center md:space-x-4'>
                        <label htmlFor="txtSearchBox" className='mr-2'>Search</label>
                        <Input
                            type='text'
                            id='txtSearchBox'
                            placeholder='Enter Book Id / Book Name / Author '
                            className='w-full md:w-2/4 text-xl mb-2 md:mb-0'
                        />
                        <button className='display inline-block'>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                width="24"
                                height="24"
                                fill="none"
                                className='inline-block'
                            >
                                <path d="M17.5 17.5L22 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M20 11C20 6.02944 15.9706 2 11 2C6.02944 2 2 6.02944 2 11C2 15.9706 6.02944 20 11 20C15.9706 20 20 15.9706 20 11Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>

                    {isDataVisible ? (
                        <>
                            <div className='mt-6 space-x-4'>
                                <Button variant="secondary" className='text-lg'>
                                    <label htmlFor="booksExcelFileUpload" className="cursor-pointer flex items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            className="w-6 mr-2"
                                            color="#7ed321"
                                            fill="none"
                                        >
                                            <path d="M15 2.5V4C15 5.41421 15 6.12132 15.4393 6.56066C15.8787 7 16.5858 7 18 7H19.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M4 16V8C4 5.17157 4 3.75736 4.87868 2.87868C5.75736 2 7.17157 2 10 2H14.1716C14.5803 2 14.7847 2 14.9685 2.07612C15.1522 2.15224 15.2968 2.29676 15.5858 2.58579L19.4142 6.41421C19.7032 6.70324 19.8478 6.84776 19.9239 7.03153C20 7.2153 20 7.41968 20 7.82843V16C20 18.8284 20 20.2426 19.1213 21.1213C18.2426 22 16.8284 22 14 22H10C7.17157 22 5.75736 22 4.87868 21.1213C4 20.2426 4 18.8284 4 16Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M12 11V14M12 14V17M12 14H7.5M12 14H16.5M9.5 17H14.5C15.4428 17 15.9142 17 16.2071 16.7071C16.5 16.4142 16.5 15.9428 16.5 15V13C16.5 12.0572 16.5 11.5858 16.2071 11.2929C15.9142 11 15.4428 11 14.5 11H9.5C8.55719 11 8.08579 11 7.79289 11.2929C7.5 11.5858 7.5 12.0572 7.5 13V15C7.5 15.9428 7.5 16.4142 7.79289 16.7071C8.08579 17 8.55719 17 9.5 17Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <span>{selectedFile ? selectedFile.name : 'Upload excel file'}</span>
                                        <Input id="booksExcelFileUpload" type="file" accept='.xls,.xlsx' className='hidden' onChange={handleBooksFileChange} ref={fileInputRef} />
                                    </label>
                                </Button>
                                {!selectedFile && (
                                    <Button variant="secondary" className='text-lg'>
                                        <label htmlFor="addManualyBook" className="cursor-pointer flex items-center p-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 mr-2" viewBox="0 0 24 24" color="#000000" fill="none">
                                                <path d="M12 8V16M16 12L8 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z" stroke="currentColor" strokeWidth="1.5" />
                                            </svg>
                                            <span>Add a single book</span>
                                        </label>
                                    </Button>
                                )}
                            </div>

                            <div className='mt-6 pb-8'>
                                <div className='bg-[#F8F4EF] border-2 border-gray-300 rounded-xl shadow-2xl'>
                                    <table className='w-full text-left table-auto'>
                                        <thead className='bg-gray-200'>
                                            <tr>
                                                <th className='p-4 border-b-4 border-gray-300'>Book No</th>
                                                <th className='p-4 border-b-4 border-gray-300'>Book Name</th>
                                                <th className='p-4 border-b-4 border-gray-300'>Book Author Name</th>
                                                <th className='p-4 border-b-4 border-gray-300'>Book Publisher Name</th>
                                                <th className='p-4 border-b-4 border-gray-300'>Book Quantity</th>
                                            </tr>
                                        </thead>
                                        <tbody className='divide-y divide-gray-300'>
                                            {tableData.map((bookDetails, index) => (
                                                <tr key={index} className='hover:bg-gray-300 cursor-pointer'>
                                                    <td className='p-4'>{bookDetails.bookNo}</td>
                                                    <td className='p-4'>{bookDetails.bookName}</td>
                                                    <td className='p-4'>{bookDetails.bookAuthorName}</td>
                                                    <td className='p-4'>{bookDetails.bookPublisherName}</td>
                                                    <td className='p-4 text-center'>{bookDetails.bookQty}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div
                                className={`mt-10 p-8 border-4 h-80 border-dashed rounded-xl ${dragging ? 'border-blue-300' : 'border-gray-300'} flex flex-col items-center justify-center`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                <input
                                    type="file"
                                    id="BooksExcelFileUpload"
                                    accept=".xls,.xlsx"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleBooksFileChange}
                                />
                                <p className="text-xl font-semibold text-gray-700">
                                    {selectedFile ? selectedFile.name : 'Drag and drop a file here or click to select'}
                                </p>
                                <div className='mt-6 space-x-4'>
                                    <Button type='button' variant="outline" className='text-lg'>
                                        <label htmlFor="booksExcelFileUpload" className="cursor-pointer flex items-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                className="w-6 mr-2"
                                                color="#7ed321"
                                                fill="none"
                                            >
                                                <path d="M15 2.5V4C15 5.41421 15 6.12132 15.4393 6.56066C15.8787 7 16.5858 7 18 7H19.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M4 16V8C4 5.17157 4 3.75736 4.87868 2.87868C5.75736 2 7.17157 2 10 2H14.1716C14.5803 2 14.7847 2 14.9685 2.07612C15.1522 2.15224 15.2968 2.29676 15.5858 2.58579L19.4142 6.41421C19.7032 6.70324 19.8478 6.84776 19.9239 7.03153C20 7.2153 20 7.41968 20 7.82843V16C20 18.8284 20 20.2426 19.1213 21.1213C18.2426 22 16.8284 22 14 22H10C7.17157 22 5.75736 22 4.87868 21.1213C4 20.2426 4 18.8284 4 16Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M12 11V14M12 14V17M12 14H7.5M12 14H16.5M9.5 17H14.5C15.4428 17 15.9142 17 16.2071 16.7071C16.5 16.4142 16.5 15.9428 16.5 15V13C16.5 12.0572 16.5 11.5858 16.2071 11.2929C15.9142 11 15.4428 11 14.5 11H9.5C8.55719 11 8.08579 11 7.79289 11.2929C7.5 11.5858 7.5 12.0572 7.5 13V15C7.5 15.9428 7.5 16.4142 7.79289 16.7071C8.08579 17 8.55719 17 9.5 17Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <span>{selectedFile ? selectedFile.name : 'Select excel file'}</span>
                                            <Input id="booksExcelFileUpload" type="file" accept='.xls,.xlsx' className='hidden' onChange={handleBooksFileChange} ref={fileInputRef} />
                                        </label>
                                    </Button>
                                    {!selectedFile && (
                                        <Button type='button' variant="outline" className='text-lg'>
                                            <label htmlFor="addManualyBook" className="cursor-pointer flex items-center p-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 mr-2" viewBox="0 0 24 24" color="#000000" fill="none">
                                                    <path d="M12 8V16M16 12L8 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z" stroke="currentColor" strokeWidth="1.5" />
                                                </svg>
                                                <span>Add a single book</span>
                                            </label>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    )
}
