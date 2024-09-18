/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Clock, Phone, Mail, MapPin } from "lucide-react";
import jwt, { JwtPayload } from "jsonwebtoken"
import nookies from 'nookies'
import { toast } from "sonner";


interface IStudentDetails {
  sid: number,
  enrollmentNo: string,
  studentRollNo: number,
  studentName: string,
  studentEmail: string,
  studentMobileNo: number,
  studentCource: string,
  studentYear: string,
  studentDiv: string,
}

export default function ContactUs() {

  const [studentDetails, setStudentDetails] = useState<IStudentDetails | null>(null)
  const [studentMessage, setStudentMessage] = useState('')

  const cookies = nookies.get()
  const studentToken = cookies.studentToken

  const verifyToken = jwt.decode(studentToken) as JwtPayload

  useEffect(() => {
    getStudentDetials()
  }, [])

  const getStudentDetials = async () => {
    try {
      const studentDetailsResponse = await fetch(`/api/student/studentProfile/${verifyToken?.sid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })
      const studentDetailsResult = await studentDetailsResponse.json()

      if (studentDetailsResult.success) {
        setStudentDetails(studentDetailsResult.datas)
      } else {
        setStudentDetails(null)
      }
    } catch (error) {
      console.error(error, 'Falied to find Student detials')
    }
  }

  const handleContactUs = async () => {
    if (!studentDetails?.studentName || !studentDetails.studentEmail || !studentMessage) {
      toast.info("Enter required info before send")
      return
    }

    try {
      const sendEmailToLibrarianResponse = await fetch("/api/student/contact-us-send-email", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({sid:studentDetails.sid,studentName: studentDetails?.studentName, studentEmail: studentDetails?.studentEmail, studentMessage: studentMessage }),
        credentials: 'include'
      })
      const sendEmailToLibrarianResult = await sendEmailToLibrarianResponse.json()
      if (sendEmailToLibrarianResult.success) {
        toast.success("Your message send to librarian")
        setStudentMessage('')
        console.log(studentDetails?.studentName)
        console.log(studentDetails?.studentEmail)
        console.log(studentMessage)

      } else {
        toast.success("Your message not send to librarian")
      }
    } catch (error) {
      console.log("Failed to send mail", error)
    }
  }
  return (
    <>
      <title>Contact us</title>
      <div className="text-white">
        <h1 className="text-2xl font-bold">Contact us</h1>
        <p>Welcome to {studentDetails?.studentName}!</p>
      </div>
      <div className="md:w-full mt-10 lg:grid lg:min-h-auto lg:grid-cols-2 border-4 border-studentBg rounded-lg p-2">
        <div className="flex items-center justify-center">
          <div className="mx-auto grid md:w-[450px]  gap-6">
            <div className="grid gap-2 text-center">
              <h1 className="text-3xl font-bold text-white">
                Library Information
              </h1>
              <p className="flex text-muted-foreground text-sm md:text-auto">
                <MapPin className="h-5 w-10" />: 4PJ9+R64, Near Malvan Mandir
                Via Magdalla Port, Dumas Rd, Surat, Gujarat 395007
              </p>
              <div className="md:flex flex-col gap-2 items-center justify-center text-sm text-white mt-2">
                <p className="flex justify-center items-center gap-1">
                  <Phone className="h-5 w-5" />: (+91) 123-456-7890
                </p>
                <p className="flex justify-center items-center gap-1">
                  <Mail className="h-5 w-5" />: ckpcmc@example.com
                </p>
              </div>
              <p className="md:flex flex-col gap-5 items-center justify-center text-sm text-green-600 mt-1">
                Operating Hours: Mon-Sat, 9 AM - 5 PM
              </p>
            </div>
            <div className="grid gap-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label htmlFor="name" className="text-white">
                    Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your Name"
                    required
                    readOnly
                    value={studentDetails?.studentName}
                    className="cursor-not-allowed"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="email" className="text-white">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    readOnly
                    value={studentDetails?.studentEmail}
                    className="cursor-not-allowed"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <label htmlFor="message" className="text-white">
                  Message
                </label>
                <textarea
                  id="message"
                  placeholder="Your message"
                  className="tflex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 max-h-24 min-h-24  "
                  required
                  value={studentMessage}
                  onChange={e => setStudentMessage(e.target.value)}
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-white text-studentBg hover:bg-studentBg hover:text-white"
                onClick={handleContactUs}>
                Send
              </Button>
            </div>
          </div>
        </div>
        <div className="hidden bg-studentBg rounded-md backdrop:blur-lg lg:block">
          <Image
            src="/contact-us-2.png"
            alt="Image"
            width={400}
            height={400}
            className="h-full w-full dark:brightness-[0.2] dark:grayscale"
          />
        </div>
      </div>
    </>
  );
};

