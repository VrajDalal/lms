'use client'

import React, { useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import DashBoard from '../dashboard/page'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Loading from "@/components/loading"

interface IAvailableBooks {
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
    const [tableData, setTableData] = useState<IAvailableBooks[]>([])
    const [isSingleBookAddModalOpen, setIsSingleBookAddModalOpen] = useState(false)
    const [bookDetails, setbookDetails] = useState({
        bookNo: '',
        bookName: '',
        bookAuthorName: '',
        bookPublisherName: '',
        bookQty: '',
    })
    const [searchBookDetails, setSearchBookDetails] = useState('')
    const [filteredBooks, setFilteredBooks] = useState<IAvailableBooks[]>([]);
    const [isUpdateBookModalOpen, setIsUpdateBookModalOpen] = useState(false)
    const [selectedBook, setSelectedBook] = useState<IAvailableBooks | null>(null);


    const router = useRouter()
    const addSingleBookRef = useRef<HTMLDialogElement>(null);
    const updateBookDetailsRef = useRef<HTMLDialogElement>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null)

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 2000)

        handleToRetriveBookDatas()
    }, [loading])


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
                    setLoading(false)
                    setSelectedFile(null)
                    if (fileInputRef.current?.value) {
                        fileInputRef.current.value = ''
                    }
                    setIsDataVisible(true)
                    handleToRetriveBookDatas()
                } else {
                    setLoading(false)
                    toast.error(`Error: ${booksExcelFileUploadResult.error}`)
                }
            } catch (error) {
                setLoading(false)
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        setbookDetails(prevDetails => ({
            ...prevDetails,
            [id]: value
        }))
    }

    const handleReset = () => {
        setbookDetails({
            bookNo: '',
            bookName: '',
            bookAuthorName: '',
            bookPublisherName: '',
            bookQty: '',
        })
    }

    const openAddSingleBookModal = () => {
        setIsSingleBookAddModalOpen(true);
    };

    const closeAddSingleBookModal = () => {
        setIsSingleBookAddModalOpen(false);
        setbookDetails({
            bookNo: '',
            bookName: '',
            bookAuthorName: '',
            bookPublisherName: '',
            bookQty: '',
        })
    };

    const searchBook = async (e: React.FormEvent) => {
        e.preventDefault()

        try {

            if (searchBookDetails.trim() === '') {
                setFilteredBooks([]); // Clear filtered books if search is empty
                return;
            }

            const filtered = tableData.filter((book) =>
                book.bookName.toLowerCase().includes(searchBookDetails.toLowerCase()) ||
                book.bookNo.toString().includes(searchBookDetails) ||
                (book.bookAuthorName && book.bookAuthorName.toLowerCase().includes(searchBookDetails.toLowerCase()))
            );
            setFilteredBooks(filtered);
            console.log(filtered);
        } catch (error) {
            console.error('Error fetching books details:', error);
        }
    }

    const addSingleBook = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!bookDetails.bookNo || !bookDetails.bookName || !bookDetails.bookAuthorName || !bookDetails.bookPublisherName || !bookDetails.bookQty) {
            toast.info('All field are required')
            return
        }

        try {
            setLoading(true)
            const singleBookAddResponse = await fetch('/api/student/addSingleBookDetails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ bookNo: bookDetails.bookNo, bookName: bookDetails.bookName, bookAuthorName: bookDetails.bookAuthorName, bookPublisherName: bookDetails.bookPublisherName, bookQty: bookDetails.bookQty }),
                credentials: 'include'
            })
            console.log(singleBookAddResponse);
            const singleBookAddResult = await singleBookAddResponse.json()
            console.log(singleBookAddResult);

            if (singleBookAddResult.success) {
                setLoading(false)
                setIsDataVisible(true)
                closeAddSingleBookModal()
                toast.success(`${bookDetails.bookName} book added successfully`)
            } else {
                setLoading(false)
                setIsDataVisible(false)
                toast.error('Book not added successfully')
            }
        } catch (error) {
            setLoading(false)
            setIsDataVisible(false)
            console.error(error, 'Error while add single new book')
        } finally {
            setLoading(false)
        }
    }

    const deleteLibraryBook = async (bookNo: string) => {
        try {
            setLoading(true)
            // router.push(`/admin/library?bookNo=${encodeURIComponent(bookNo)}`)
            const deleteLibraryBookResponse = await fetch(`/api/student/deleteLibraryBook/${bookNo}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            })
            console.log(deleteLibraryBookResponse);
            const deleteBookIssuedDetailResult = await deleteLibraryBookResponse.json()
            console.log(deleteBookIssuedDetailResult);

            if (deleteBookIssuedDetailResult.success) {
                setLoading(false)
                setIsDataVisible(true)
                const bookName = deleteBookIssuedDetailResult.isPresentBook.bookName
                toast.success(`${bookName} book deleted successfully`)
            } else {
                setLoading(false)
                setIsDataVisible(false)
                toast.error('Book not deleted')
            }
        } catch (error) {
            setLoading(false)
            console.error(error, 'Error when deleting the book');
        } finally {
            setLoading(false)
        }
    }

    const handleLibraryBookModalOpen = (bookDetails: any) => {
        setSelectedBook(bookDetails);
        setIsUpdateBookModalOpen(true);
    };

    const handleLibraryBookModalClose = () => {
        setIsUpdateBookModalOpen(false);
        setSelectedBook(null);
    };

    const handleLibrayBookUpdateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setSelectedBook((prev: any) => ({
            ...prev,
            [id]: value
        }));
    };

    const updateLibraryBookDetails = async (bookNo: string) => {
        console.log("Book details before update:", bookDetails);

        if (!bookDetails || !bookDetails.bookNo) {
            throw new Error("Invalid book details");
        }

        try {
            setLoading(true)
            const updateLibraryBookDetailsResponse = await fetch(`/api/student/updateLibraryBook/${bookNo}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bookDetails),
                credentials: 'include'
            })
            console.log(updateLibraryBookDetailsResponse);
            const updateLibraryBookDetailsResult = await updateLibraryBookDetailsResponse.json()
            console.log(updateLibraryBookDetailsResult);
            if (updateLibraryBookDetailsResult.success) {
                setLoading(false)
                setIsDataVisible(true)
                setIsUpdateBookModalOpen(false)
                toast.success('Book details updated successfully')
            } else {
                setLoading(false)
                setIsDataVisible(false)
                toast.error('Book details not updated')
            }
        } catch (error) {
            setLoading(false)
            console.error(error, 'Error when updating the book details')
        } finally {
            setLoading(false)
        }
    }

    //in library section add manually books and save into table also (CRUD operation ,edit quantity,delete books)
    //if not book data than show drag option else show buttons : done
    //in search book no,name,author on keyup event : done
    //on click of bookno can do PATCH or update the book details in which all fields want to update
    //in row end put delete for remove the book : Done
    //if student issue a book than also update the qty

    const displayBooks = searchBookDetails ? filteredBooks : tableData;

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
                <div className="flex flex-col pl-20 pt-20 md:pl-24 min-h-screen lg:pl-24 pr-4 lg:pr-16 bg-[#FCFAF5]">
                    <div className="text-5xl font-bold mt-4">
                        <h1>Library</h1>
                    </div>
                    <br />
                    <hr />

                    {isDataVisible ? (
                        <>
                            {/* seach */}
                            <div className='text-xl mt-4 flex flex-col md:flex-row md:items-center md:space-x-4'>
                                <label htmlFor="txtSearchBox" className='mr-2'>Search</label>
                                <Input
                                    type='text'
                                    id='txtSearchBox'
                                    placeholder='Enter Book Id / Book Name / Author '
                                    className='w-full md:w-2/4 text-xl mb-2 md:mb-0'
                                    value={searchBookDetails}
                                    onChange={e => setSearchBookDetails(e.target.value)}
                                    onKeyUp={searchBook}
                                />
                            </div>

                            <div className='mt-6 space-x-4'>
                                {/* upload excel file */}
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
                                    <Button variant="secondary" className='text-lg' onClick={openAddSingleBookModal}>
                                        <label htmlFor="addManualyBook" className="cursor-pointer flex items-center p-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 mr-2" viewBox="0 0 24 24" color="#000000" fill="none">
                                                <path d="M12 8V16M16 12L8 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z" stroke="currentColor" strokeWidth="1.5" />
                                            </svg>
                                            <span>Add a single book</span>
                                        </label>
                                    </Button>
                                )}

                                {/* Single Book Add Modal */}
                                {isSingleBookAddModalOpen && (
                                    <dialog ref={addSingleBookRef} className="modal" open>
                                        <div className="modal-box bg-[#FCFAF5] md:p-6 lg:p-6 xl:p-10 justify-center items-center rounded-2xl shadow-2xl border-4 w-full max-w-sm sm:max-w-sm md:max-w-md lg:max-w-5xl xl:max-w-sxl relative">
                                            {/* Cancel Button  bg-[#FCFAF5]*/}
                                            <button
                                                className="absolute top-4 right-4 text-gray-600 md:text-2xl lg:text-5xl hover:text-gray-800"
                                                onClick={closeAddSingleBookModal}
                                            >
                                                &times;
                                            </button>
                                            <h2 className="text-lg md:text-xl lg:text-2xl xl:text-3xl lg:mb-4 font-bold mb-4">Enter Book Details:-</h2>
                                            <hr className='bg-gray-300 mb-4 lg:mb-8' />
                                            <form>
                                                <div className="mb-4 lg:mb-12">
                                                    <div className="flex flex-col md:flex-row lg:flex-row gap-4">
                                                        {/* Book No Field */}
                                                        <div className="flex-1">
                                                            <label htmlFor="bookNo" className="block text-left text-sm lg:text-lg font-medium">Book No</label>
                                                            <Input id="bookNo" type="text" autoFocus placeholder='Enter Book No' className="mt-1 block w-full" value={bookDetails.bookNo} onChange={handleInputChange} required />
                                                            {/* Pattern Error Message */}
                                                            {bookDetails.bookNo && !/^[0-9]+$/.test(bookDetails.bookNo) && (
                                                                <p className='mt-1 text-red-500 text-xs'>Please Enter Numbers Only</p>
                                                            )}
                                                        </div>

                                                        {/* Book Name Field */}
                                                        <div className="flex-1">
                                                            <label htmlFor="bookName" className="block text-left text-sm lg:text-lg font-medium">Book Name</label>
                                                            <Input id="bookName" type="text" placeholder='Enter Book Name' className="mt-1 block w-full" value={bookDetails.bookName} onChange={handleInputChange} required />
                                                            {/* Pattern Error Message */}
                                                            {bookDetails.bookName && !/^[A-Za-z\s]{2,}$/.test(bookDetails.bookName) && (
                                                                <p className="mt-1 text-red-500 text-xs">Please enter only letters.</p>
                                                            )}
                                                        </div>

                                                        {/* Author Name Field */}
                                                        <div className="flex-1">
                                                            <label htmlFor="bookAuthorName" className="block text-left text-sm lg:text-lg font-medium">Author Name</label>
                                                            <Input id="bookAuthorName" type="text" placeholder='Enter Author Name' className="mt-1 block w-full" value={bookDetails.bookAuthorName} onChange={handleInputChange} required />
                                                            {/* Pattern Error Message */}
                                                            {bookDetails.bookAuthorName && !/^[A-Za-z\s]{2,}$/.test(bookDetails.bookAuthorName) && (
                                                                <p className="mt-1 text-red-500 text-xs">Please enter only letters.</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mb-4 lg:mb-12">
                                                    <div className="flex flex-col md:flex-row lg:flex-row gap-4 justify-center lg:justify-center">
                                                        {/* Publisher Name Field */}
                                                        <div className="flex-1 lg:flex-none lg:w-1/4">
                                                            <label htmlFor="bookPublisherName" className="block text-left text-sm lg:text-lg font-medium">Publisher Name</label>
                                                            <Input id="bookPublisherName" type="text" placeholder='Enter Publisher Name' className="mt-1 block w-full" value={bookDetails.bookPublisherName} onChange={handleInputChange} required />
                                                            {/* Pattern Error Message */}
                                                            {bookDetails.bookPublisherName && !/^[A-Za-z\s]{2,}$/.test(bookDetails.bookPublisherName) && (
                                                                <p className="mt-1 text-red-500 text-xs">Please enter only letters.</p>
                                                            )}
                                                        </div>

                                                        {/* Quantity Field */}
                                                        <div className="flex-1 lg:flex-none lg:w-1/4">
                                                            <label htmlFor="bookQty" className="block text-left text-sm lg:text-lg font-medium">Quantity</label>
                                                            <Input id="bookQty" type="text" placeholder='Enter Quantity' className="mt-1 block w-full" value={bookDetails.bookQty} onChange={handleInputChange} required />
                                                            {/* Pattern Error Message */}
                                                            {bookDetails.bookQty && !/^[0-9]+$/.test(bookDetails.bookQty) && (
                                                                <p className="mt-1 text-red-500 text-xs">Please enter only numbers.</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col md:flex-row justify-center w-full gap-6 mt-6">
                                                    <Button type="button" className="w-40 md:w-auto lg:w-52" onClick={addSingleBook}>Add Book</Button>
                                                    <Button type="button" className="w-40 md:w-28 lg:w-52" onClick={handleReset}>Reset</Button>
                                                </div>
                                            </form>
                                        </div>
                                        <form method="dialog" className="modal-backdrop">
                                            <button onClick={closeAddSingleBookModal}></button>
                                        </form>
                                    </dialog>
                                )}

                                {/* Update Book Modal */}
                                {isUpdateBookModalOpen && selectedBook && (
                                    <dialog ref={updateBookDetailsRef} className="modal" open>
                                        <div className="modal-box bg-[#FCFAF5] md:p-6 lg:p-6 xl:p-10 justify-center items-center rounded-2xl shadow-2xl border-4 w-full max-w-sm sm:max-w-sm md:max-w-md lg:max-w-5xl xl:max-w-sxl relative">
                                            {/* Cancel Button  bg-[#FCFAF5]*/}
                                            <button
                                                className="absolute top-4 right-4 text-gray-600 md:text-2xl lg:text-5xl hover:text-gray-800"
                                                onClick={handleLibraryBookModalClose}
                                            >
                                                &times;
                                            </button>
                                            <h2 className="text-lg md:text-xl lg:text-2xl xl:text-3xl lg:mb-4 font-bold mb-4">Edit Book Details:-</h2>
                                            <hr className='bg-gray-300 mb-4 lg:mb-8' />
                                            <form>
                                                <div className="mb-4 lg:mb-12">
                                                    <div className="flex flex-col md:flex-row lg:flex-row gap-4">
                                                        {/* Book No Field */}
                                                        <div className="flex-1">
                                                            <label htmlFor="bookNo" className="block text-left text-sm lg:text-lg font-medium">Book No</label>
                                                            <Input id="bookNo" type="text" autoFocus placeholder='Enter Book No' className="mt-1 block w-full" value={selectedBook.bookNo} onChange={handleLibrayBookUpdateInputChange} required />
                                                            {/* Pattern Error Message */}
                                                            {bookDetails.bookNo && !/^[0-9]+$/.test(bookDetails.bookNo) && (
                                                                <p className='mt-1 text-red-500 text-xs'>Please Enter Numbers Only</p>
                                                            )}
                                                        </div>

                                                        {/* Book Name Field */}
                                                        <div className="flex-1">
                                                            <label htmlFor="bookName" className="block text-left text-sm lg:text-lg font-medium">Book Name</label>
                                                            <Input id="bookName" type="text" placeholder='Enter Book Name' className="mt-1 block w-full" value={selectedBook.bookName} onChange={handleLibrayBookUpdateInputChange} required />
                                                            {/* Pattern Error Message */}
                                                            {bookDetails.bookName && !/^[A-Za-z\s]{2,}$/.test(bookDetails.bookName) && (
                                                                <p className="mt-1 text-red-500 text-xs">Please enter only letters.</p>
                                                            )}
                                                        </div>

                                                        {/* Author Name Field */}
                                                        <div className="flex-1">
                                                            <label htmlFor="bookAuthorName" className="block text-left text-sm lg:text-lg font-medium">Author Name</label>
                                                            <Input id="bookAuthorName" type="text" placeholder='Enter Author Name' className="mt-1 block w-full" value={selectedBook.bookAuthorName} onChange={handleLibrayBookUpdateInputChange} required />
                                                            {/* Pattern Error Message */}
                                                            {bookDetails.bookAuthorName && !/^[A-Za-z\s]{2,}$/.test(bookDetails.bookAuthorName) && (
                                                                <p className="mt-1 text-red-500 text-xs">Please enter only letters.</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mb-4 lg:mb-12">
                                                    <div className="flex flex-col md:flex-row lg:flex-row gap-4 justify-center lg:justify-center">
                                                        {/* Publisher Name Field */}
                                                        <div className="flex-1 lg:flex-none lg:w-1/4">
                                                            <label htmlFor="bookPublisherName" className="block text-left text-sm lg:text-lg font-medium">Publisher Name</label>
                                                            <Input id="bookPublisherName" type="text" placeholder='Enter Publisher Name' className="mt-1 block w-full" value={selectedBook.bookPublisherName} onChange={handleLibrayBookUpdateInputChange} required />
                                                            {/* Pattern Error Message */}
                                                            {bookDetails.bookPublisherName && !/^[A-Za-z\s]{2,}$/.test(bookDetails.bookPublisherName) && (
                                                                <p className="mt-1 text-red-500 text-xs">Please enter only letters.</p>
                                                            )}
                                                        </div>

                                                        {/* Quantity Field */}
                                                        <div className="flex-1 lg:flex-none lg:w-1/4">
                                                            <label htmlFor="bookQty" className="block text-left text-sm lg:text-lg font-medium">Quantity</label>
                                                            <Input id="bookQty" type="text" placeholder='Enter Quantity' className="mt-1 block w-full" value={selectedBook.bookQty} onChange={handleLibrayBookUpdateInputChange} required />
                                                            {/* Pattern Error Message */}
                                                            {bookDetails.bookQty && !/^[0-9]+$/.test(bookDetails.bookQty) && (
                                                                <p className="mt-1 text-red-500 text-xs">Please enter only numbers.</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col md:flex-row justify-center w-full gap-6 mt-6">
                                                    <Button type="button" className="w-40 md:w-auto lg:w-52" onClick={() => updateLibraryBookDetails(selectedBook.bookNo)}>Save</Button>
                                                    <Button type="button" className="w-40 md:w-28 lg:w-52" onClick={handleLibraryBookModalClose}>Cancel</Button>
                                                </div>
                                            </form>
                                        </div>
                                        <form method="dialog" className="modal-backdrop">
                                            <button onClick={handleLibraryBookModalClose}></button>
                                        </form>
                                    </dialog>
                                )}
                            </div>

                            {displayBooks.length > 0 ? (
                                <div className="mt-6 pb-8">
                                    <div className="bg-[#F8F4EF] border-2 border-gray-300 rounded-xl shadow-2xl">
                                        <table className="w-full text-left table-auto">
                                            <thead className="bg-gray-200">
                                                <tr>
                                                    <th className="p-4 border-b-4 border-gray-300 cursor-default">Book No</th>
                                                    <th className="p-4 border-b-4 border-gray-300 cursor-default">Book Name</th>
                                                    <th className="p-4 border-b-4 border-gray-300 cursor-default">Author Name</th>
                                                    <th className="p-4 border-b-4 border-gray-300 cursor-default">Publisher Name</th>
                                                    <th className="p-4 border-b-4 border-gray-300 cursor-default">Quantity</th>
                                                    <th className="p-4 border-b-4 border-gray-300 cursor-default">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-300">
                                                {displayBooks.map((bookDetails) => (
                                                    <tr key={bookDetails.bookNo} className="hover:bg-gray-300">
                                                        <td className="p-4 cursor-pointer" onClick={() => handleLibraryBookModalOpen(bookDetails)}>{bookDetails.bookNo}</td>
                                                        <td className="p-4 cursor-default">{bookDetails.bookName}</td>
                                                        <td className="p-4 cursor-default">{bookDetails.bookAuthorName}</td>
                                                        <td className="p-4 cursor-default">{bookDetails.bookPublisherName}</td>
                                                        <td className="p-4 cursor-default text-center">{bookDetails.bookQty}</td>
                                                        <td className='p-4 text-center'>
                                                            <button type='button' title='Remove book' className='mt-2' onClick={() => deleteLibraryBook(bookDetails.bookNo)}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
                                                                    <path d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                                    <path d="M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                                    <path d="M9.5 16.5L9.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                                    <path d="M14.5 16.5L14.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                                </svg>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex justify-center items-center h-64 mt-8">
                                    <div className="text-center">
                                        <Image src="/no-data.png" alt="No data found" priority width={300} height={300} className="mx-auto mb-4" />
                                        <p className="text-gray-600 text-xl font-semibold -mt-12 mb-4">Book not found.</p>
                                    </div>
                                </div>
                            )}
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
                                        <Button type='button' variant="outline" className='text-lg' onClick={openAddSingleBookModal}>
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
            </div >
        </>
        // 89790899 Managing Oneself Managing Oneself Harvard Business Review 3
    )
}
