'use client'

import React, { useRef, useState } from 'react'
import { Input } from '@/components/ui/input'
import DashBoard from '../dashboard/page'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function Library() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [selectedAction, setSelectedAction] = useState<string>('importBooks')
    const [isPopoverOpen, setIsPopOverOpen] = useState(false)
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
            return
        }

        const formData = new FormData()
        formData.append('file', selectedFile)

        try {
            const excelFileUploadResponce = await fetch('/api/admin/addStudentsList', {
                method: 'POST',
                body: formData,
            })
            console.log(excelFileUploadResponce)
            const excelFileUploadResult = await excelFileUploadResponce.json()
            console.log(excelFileUploadResult)

            if (excelFileUploadResult.success) {
                toast.success('File uploaded successfully')
                setSelectedFile(null)
                if (fileInputRef.current?.value) {
                    fileInputRef.current.value = ''
                }
            } else {
                toast.error(`Error: ${excelFileUploadResult.error}`)
            }
        } catch (error) {
            console.log('Error uploading file', error)
            toast.error('Error uploading file')
        }
    }

    return (
        <>
            <title>Library</title>
            <DashBoard />
            <div className="flex flex-col pl-20 md:pl-24 pt-10 min-h-screen lg:pl-64 pr-4 lg:pr-16 bg-[#FCFAF5]">
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
                    <button>
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
                    <div className="ml-auto flex justify-end">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="flex items-center">
                                    Import Excel File
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="">
                                <DropdownMenuItem>
                                    <div className="cursor-pointer flex items-center">
                                        <label htmlFor="fileupload" className="cursor-pointer flex items-center p-2">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                className="w-8 mr-2"
                                                color="#7ed321"
                                                fill="none"
                                            >
                                                <path d="M15 2.5V4C15 5.41421 15 6.12132 15.4393 6.56066C15.8787 7 16.5858 7 18 7H19.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M4 16V8C4 5.17157 4 3.75736 4.87868 2.87868C5.75736 2 7.17157 2 10 2H14.1716C14.5803 2 14.7847 2 14.9685 2.07612C15.1522 2.15224 15.2968 2.29676 15.5858 2.58579L19.4142 6.41421C19.7032 6.70324 19.8478 6.84776 19.9239 7.03153C20 7.2153 20 7.41968 20 7.82843V16C20 18.8284 20 20.2426 19.1213 21.1213C18.2426 22 16.8284 22 14 22H10C7.17157 22 5.75736 22 4.87868 21.1213C4 20.2426 4 18.8284 4 16Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M12 11V14M12 14V17M12 14H7.5M12 14H16.5M9.5 17H14.5C15.4428 17 15.9142 17 16.2071 16.7071C16.5 16.4142 16.5 15.9428 16.5 15V13C16.5 12.0572 16.5 11.5858 16.2071 11.2929C15.9142 11 15.4428 11 14.5 11H9.5C8.55719 11 8.08579 11 7.79289 11.2929C7.5 11.5858 7.5 12.0572 7.5 13V15C7.5 15.9428 7.5 16.4142 7.79289 16.7071C8.08579 17 8.55719 17 9.5 17Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <span>Upload Excel File</span>
                                        </label>
                                        <Input
                                            type="file"
                                            id="fileupload"
                                            accept=".xlsx, .xls"
                                            onChange={handleFileChange}
                                            ref={fileInputRef}
                                            className="hidden"
                                        />
                                    </div>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </>
    )
}
