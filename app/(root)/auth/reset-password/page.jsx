"use client"

import { Card, CardContent } from '@/components/ui/card'
import React, { useState } from 'react'
import Logo from '@/public/assets/images/logo-black.png'
import Image from 'next/image'
import { zodResolver } from "@hookform/resolvers/zod"
import { zodSchema } from "@/lib/zodSchema"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import ButtonLoading from '@/components/Application/ButtonLoading'
import { z } from "zod"
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa6";
import Link from 'next/link'
import { WEBSITE_LOGIN, WEBSITE_REGISTER, WEBSITE_RESET_PASSWORD } from '@/routes/WebsiteRoute'
import axios from 'axios'
import { showToast } from '@/lib/showToast'
import { set } from 'mongoose'
import OTPValidationForm from '@/components/Application/OTPValidationForm'
import { useDispatch } from 'react-redux'
import { login } from '@/store/reducer/authreducer'
import UpdatePassword from '@/components/Application/UpdatePassword'

const ResetPassword = () => {

    const [emailVerificationLoading, setemailVerificationLoading] = useState(false)
    const [otpVerificationLoading, setotpVerificationLoading] = useState(false)
    const [otpEmail, setotpEmail] = useState()
    const [isOtpVerified, setisOtpVerified] = useState(false)

    const formSchema = zodSchema.pick({
        email: true
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: ""
        }
    })

    const handleEmailVerificartion = async (value) => {
        try {
            setemailVerificationLoading(true)
            const { data: sendOtpResponse } = await axios.post('/api/auth/reset-password/send-otp', value)
            if (!sendOtpResponse.success) {
                throw new Error(sendOtpResponse.message)
            }

            setotpEmail(value.email)


            showToast('success', sendOtpResponse.message)
            
        } catch (error) {

            showToast('error', error.message)
        } finally {
            setemailVerificationLoading(false)
        }

    }



    const handleOtpVerificartion = async (value) => {
        try {
            setotpVerificationLoading(true)
            const { data: otpResponse } = await axios.post('/api/auth/reset-password/verify-otp', value)
            if (!otpResponse.success) {
                throw new Error(otpResponse.message)
            }

            showToast('success', otpResponse.message)
            setisOtpVerified(true)
        } catch (error) {

            showToast('error', error.message)
        } finally {
            setotpVerificationLoading(false)
        }
    }
    return (
        <Card className='w-[400px]'>
            <CardContent>
                <div className='flex justify-center'>
                    <Image src={Logo.src} width={Logo.width} height={Logo.height} alt='logo' className='max-w-[150]' />
                </div>
                {
                    !otpEmail ?
                        <><div className='text-center'>
                            <h1 className='text-3xl font-bold'>Reset Password</h1>
                            <p>Enter your Email</p>
                        </div>
                            <div className='mt-5'>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(handleEmailVerificartion)}>
                                        <div className="mb-5">
                                            <FormField
                                                control={form.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Email</FormLabel>
                                                        <FormControl>
                                                            <Input type="email" placeholder="example@gmail.com" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className='mb-3'>
                                            <ButtonLoading loading={emailVerificationLoading} type="submit" text="Send OTP" className={"w-full cursor-pointer"} />
                                        </div>

                                        <div className='text-center'>
                                            <div className='flex justify-center items-center gap-2'>
                                                <Link href={WEBSITE_LOGIN} className='text-primary underline'>Back to login</Link>
                                            </div>
                                        </div>
                                    </form>
                                </Form>
                            </div>
                        </>
                        :
                        <>
                            {!isOtpVerified 
                            ?
                                <OTPValidationForm email={otpEmail} onSubmit={handleOtpVerificartion} loading={otpVerificationLoading} />
                                :
                                <UpdatePassword email={otpEmail} />
                            }
                        </>

                }



            </CardContent>
        </Card>
    )
}

export default ResetPassword