'use client'

import React, { useRef } from 'react'
import { useState } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader } from 'lucide-react';


export default function StudentLogin() {

    const [studentSID, setStudentSID] = useState('')
    const [isStudentSIDValid, setIsStudentSIDValid] = useState(false)
    const [studentSIDOtp, setStudentSIDOtp] = useState<string[]>(new Array(6).fill(''))
    const [studentSIDEmailSendOtp, setStudentSIDEmailSendOtp] = useState(false)
    const [showOtpButton, setShowOtpButton] = useState(false);
    const [isStudentSIDEmailOtpValid, setIsStudentSIDEmailOtpValid] = useState<boolean | null>(null)
    const [isSendOtpLoader, setIsSendOtpLoader] = useState(false)
    const router = useRouter();

    const REGEXP_ONLY_DIGITS = '^[0-9]*$';
    const inputRef = useRef<(HTMLInputElement | null)[]>([])

    const handleStudentID = async (e: React.FocusEvent) => {
        e.preventDefault()

        const studentIdPatten = /^[0-9]{10}$/
        if (!studentIdPatten.test(studentSID)) {
            toast.info("Enter 10 digits student id only...")
            // setIsStudentSIDValid(false)
            // setIsSendOtpLoader(false)
            // setStudentSIDOtp(['', '', '', '', '', ''])
            resetOtpState()
            return
        }
        setIsStudentSIDValid(true)
    }

    const handleStudentIDChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setStudentSID(e.target.value)
        resetOtpState()
    }

    const handleOtp = async (value: string, index: number) => {
        if (new RegExp(REGEXP_ONLY_DIGITS).test(value)) {
            const newOtp = [...studentSIDOtp]
            newOtp[index] = value
            setStudentSIDOtp(newOtp)

            if (index < inputRef.current.length - 1) {
                inputRef.current[index + 1]?.focus()
            } else {
                inputRef.current[index]?.focus()
                const fullOtp = newOtp.join('').trim()
                handleOtpValidation(fullOtp)
            }
        }
    }

    const handleSendOtpButton = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSendOtpLoader(true)
        setStudentSIDOtp(['', '', '', '', '', ''])

        try {
            if (!studentSID) {
                toast.info('Enter 10 digits student id only...')
                return
            }
            if (!studentSIDOtp) {
                toast.info('Enter OTP')
                return
            }

            const getStudentSIDResponse = await fetch(`/api/student/get-sid/${studentSID}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            })
            const getStudentSIDResult = await getStudentSIDResponse.json()

            const studentEmail = getStudentSIDResult.studentEmail;

            if (getStudentSIDResult.success) {
                const sendOtpOnEmailResponse = await fetch(`/api/student/send-otp/${studentSID}/${studentEmail}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                })

                const sendOtpOnEmailResult = await sendOtpOnEmailResponse.json()
                if (sendOtpOnEmailResult.success) {
                    toast.info("OTP send on your registed email address")
                    setShowOtpButton(true)
                    setStudentSIDEmailSendOtp(true)
                }
            } else {
                toast.error("Invalid student id")
                resetOtpState()
            }
        } catch (error) {
            toast.error("Internal serveside issue")
            resetOtpState()
        } finally {
            setIsSendOtpLoader(false)
        }
    }

    const handleBackspaceRemoveEle = (e: React.KeyboardEvent, index: number) => {
        if (e.key === "Backspace" && index > 0 && !studentSIDOtp[index]) {
            const newOtp = [...studentSIDOtp]
            newOtp[index - 1] = ""
            inputRef.current[index - 1]?.focus()
            setStudentSIDOtp(newOtp)
        }
    }

    const handleOtpValidation = async (otp: string) => {
        try {
            const validateOtpResponse = await fetch('/api/student/validate-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ otp })
            })

            const validateOtpResult = await validateOtpResponse.json()
            if (validateOtpResult.success) {
                setIsStudentSIDEmailOtpValid(true)
                toast.success('OTP validated successfully');
            } else {
                setIsStudentSIDEmailOtpValid(false)
                toast.error('Invalid OTP');
            }
        } catch (error) {
            setIsStudentSIDEmailOtpValid(false)
            toast.error('Error validating OTP');
        }
    }

    const resetOtpState = () => {
        setIsStudentSIDValid(false)
        setIsSendOtpLoader(false)
        setStudentSIDOtp(['', '', '', '', '', ''])
        setShowOtpButton(false)
        setIsStudentSIDEmailOtpValid(null)
        setStudentSIDEmailSendOtp(false)
    }

    const handleRedirection = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const otpString = studentSIDOtp.join('');

            const getStudentSIDAndOtpValidateResponse = await fetch('/api/student/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ sid: studentSID, studentSIDOtp: otpString })
            })
            const getStudentSIDAndOtpValidateResult = await getStudentSIDAndOtpValidateResponse.json()
            if (getStudentSIDAndOtpValidateResult.success) {
                router.push(`/student/dashboard?studentId=${encodeURIComponent(studentSID)}`)
            } else {
                toast.error('user not found or valid')
            }
        } catch (error) {
            toast.error('Internal server error. Please try again later.')
        }
    }


    //add student Id into url when student login successfully: Done
    return (
        <>
            <title>Student Login</title>
            <div className="min-h-screen flex items-center justify-center bg-gray-300 p-4 overflow-hidden">
                <div className="flex flex-col md:flex-row rounded-xl shadow-2xl h-full w-full max-w-4xl overflow-hidden">

                    {/* Left Section (Mobile Top, Desktop Left) */}
                    <div className="flex flex-col justify-center items-center p-4 w-full md:w-1/2 bg-gray-600">
                        <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-48 md:h-48 lg:w-56 lg:h-56">
                            <Image
                                src="/student_logo.png"
                                alt="Logo"
                                className="rounded-full w-full h-auto"
                                width={400}
                                height={150}
                            />
                        </div>

                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-200">Sign in</h1>

                        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-200 font-semibold text-center mt-4">
                            `A library is a place where books and sources of information are stored.`
                        </p>

                        {/* Login Form */}
                        <form className="mt-6 w-full">
                            <div>
                                <label htmlFor="txtStudentSid" className="font-semibold text-slate-200 block text-base sm:text-lg md:text-xl">
                                    Enter Student ID
                                </label>
                                <Input
                                    type="text"
                                    inputMode="numeric"
                                    placeholder="Your Student ID"
                                    value={studentSID}
                                    onChange={handleStudentIDChange}
                                    onBlur={handleStudentID}
                                    className="mt-2 w-full p-3 bg-gray-200 rounded-md text-base"
                                />
                            </div>

                            {/* Continue Button */}
                            {(!isStudentSIDValid || !showOtpButton) && (
                                <Button className="mt-4 w-full bg-blue-700 text-white py-2 rounded-md" onClick={handleSendOtpButton}>
                                    {isSendOtpLoader && isStudentSIDValid ? (
                                        <Loader className="animate-spin" />
                                    ) : (
                                        "Continue"
                                    )}
                                </Button>
                            )}

                            {/* OTP Section */}
                            {isStudentSIDValid && showOtpButton && (
                                <div className='mt-4'>
                                    <label htmlFor="txtStudentSidEmailSendOtp" className='font-semibold text-slate-200 block text-base sm:text-lg md:text-xl'>One time password</label> <br />
                                    {studentSIDOtp.map((val, index) => (
                                        <Input type='text' key={index} maxLength={1} autoFocus={index === 0} value={val} onChange={(e) => handleOtp(e.target.value, index)} ref={(ele) => { inputRef.current[index] = ele }} onKeyDown={(eles) => handleBackspaceRemoveEle(eles, index)} inputMode='numeric' className='w-10 h-10 text-center mx-1 display inline-block text-md' />
                                    ))}
                                </div>
                            )}

                            {/* Login Button */}
                            {isStudentSIDValid && isStudentSIDEmailOtpValid && showOtpButton && (
                                <div className="mt-6">
                                    <Button type="button" onClick={handleRedirection} className="w-full bg-green-700 text-white py-2 rounded-md">
                                        Login
                                    </Button>
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Right Section (Hidden on Mobile) */}
                    <div className="hidden md:flex w-full md:w-1/2 bg-black justify-center items-center h-auto">
                        <Image
                            src="/student_login.png"
                            alt="student with book"
                            className="h-full w-full object-cover rounded-tr-xl rounded-br-xl"
                            width={1200}
                            height={1000}
                        />
                    </div>
                </div>
            </div>
        </>
    )

}
