'use client'

import React, { useRef } from 'react'
import { useState } from 'react';
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
            <div className='min-h-screen flex inset-0 justify-center items-center bg-cover bg-center bg-no-repeat'
                style={{ backgroundImage: "url('/student_login_bg.jpg')" }}>
                <div className=" pt-20 inset-0 flex justify-center items-center">
                    <div className='p-8 rounded-xl w-full max-w-md mx-6 border-4 border-slate-400 shadow-2xl shadow-slate-600 min-h-[400px] bg-gradient-to-b from-sky-200 to-gray-200'>
                        <div className='flex pb-2 justify-center items-center'>
                            <h1 className='text-5xl font-bold'>Sign in</h1>
                        </div><br />
                        <div className='flex justify-center text-center items-center'>
                            <p className='text-[16px] font-bold'>`A library is a place where books and
                                sources of information are stored.`</p>
                        </div><br />
                        <form className='mt-5'>
                            <div>
                                <label htmlFor="txtStudentSid" className='font-semibold text-xl'>Enter Student ID</label><br />
                                <Input type='text' inputMode='numeric' value={studentSID} onChange={handleStudentIDChange} onBlur={handleStudentID} className='mt-2 text-lg display inline-block' />

                                {(!isStudentSIDValid || !showOtpButton) && (
                                    <>
                                        {isSendOtpLoader && isStudentSIDValid && (
                                            <Loader className='animate-spin display inline-block' />
                                        )}
                                        <Button className='text-lg mt-4 w-full' onClick={handleSendOtpButton}>Continue</Button>
                                    </>
                                )}

                            </div>

                            {isStudentSIDValid && showOtpButton && (
                                <div className='mt-4'>
                                    <label htmlFor="txtStudentSidEmailSendOtp" className='font-semibold text-xl display inline-block'>One time password</label> <br />
                                    {studentSIDOtp.map((val, index) => (
                                        <Input type='text' key={index} maxLength={1} autoFocus={index === 0} value={val} onChange={(e) => handleOtp(e.target.value, index)} ref={(ele) => { inputRef.current[index] = ele }} onKeyDown={(eles) => handleBackspaceRemoveEle(eles, index)} inputMode='numeric' className='w-10 h-10 mt-2 mx-1 text-center display inline-block text-md' />
                                    ))}
                                </div>
                            )}

                            {isStudentSIDValid && isStudentSIDEmailOtpValid && showOtpButton && (
                                <div className="mt-4 justify-center items-center flex">
                                    <Button type="button" className='text-lg w-full' onClick={handleRedirection}>Login</Button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
