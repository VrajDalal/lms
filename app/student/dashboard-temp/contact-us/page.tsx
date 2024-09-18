import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Clock, Phone, Mail, MapPin } from "lucide-react";

const ContactUs = () => {
  return (
    <>
      <div className="text-white">
        <h1 className="text-2xl font-bold">Contact us</h1>
        <p>Welcome to the student dashboard!</p>
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
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-white text-studentBg hover:bg-studentBg hover:text-white"
              >
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

export default ContactUs;
