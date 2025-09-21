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
import { USER_DASHBOARD, WEBSITE_REGISTER, WEBSITE_RESET_PASSWORD } from '@/routes/WebsiteRoute'
import axios from 'axios'
import { showToast } from '@/lib/showToast'
import { set } from 'mongoose'
import OTPValidationForm from '@/components/Application/OTPValidationForm'
import { useDispatch } from 'react-redux'
import { login } from '@/store/reducer/authreducer'
import { useRouter, useSearchParams } from 'next/navigation'
import { ADMIN_DASHBOARD } from '@/routes/AdminPanelRoute'

const LoginPage = () => {
  const dispatch = useDispatch()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [otpVerificationLoading, setotpVerificationLoading] = useState(false)
  const [IsTypePassword, setIsTypePassword] = useState(true)
  const [otpEmail, setotpEmail] = useState()

  const formSchema = zodSchema.pick({
    email: true
  }).extend({
    password: z.string().min(6, "Password must be at least 6 characters long")
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const handleLoginSubmit = async (value) => {
    try {
      setLoading(true)
      const { data: loginResponse } = await axios.post('/api/auth/login', value)
      if (!loginResponse.success) {
        throw new Error(loginResponse.message)
      }

      setotpEmail(value.email)

      form.reset()
      showToast('success', loginResponse.message)
    } catch (error) {

      showToast('error', error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleOtpVerification = async (value) => {
    try {
      setotpVerificationLoading(true)
      const { data: otpResponse } = await axios.post('/api/auth/verify-otp', value)
      if (!otpResponse.success) {
        throw new Error(otpResponse.message)
      }

      setotpEmail()


      showToast('success', otpResponse.message)

      dispatch(login(otpResponse.data))

      if (searchParams.has('callback')) {
        router.push(searchParams.get('callback'))
      } else {
        otpResponse.data.role === 'admin' ? router.push(ADMIN_DASHBOARD) : router.push(USER_DASHBOARD)
      }

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
              <h1 className='text-3xl font-bold'>Login Into Account</h1>
              <p>Login into your account by filling out the form below</p>
            </div>
              <div className='mt-5'>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleLoginSubmit)}>
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
                    <div className="mb-3">
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem className='relative'>
                            <FormLabel>password</FormLabel>
                            <FormControl>
                              <Input type={IsTypePassword ? 'password' : 'text'} placeholder="password" {...field} />
                            </FormControl>
                            <button className='absolute  top-1/2 right-2 cursor-pointer' type='button' onClick={() => setIsTypePassword(!IsTypePassword)}>
                              {IsTypePassword ?
                                <FaRegEyeSlash /> :
                                <FaRegEye />
                              }
                            </button>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className='mb-3'>
                      <ButtonLoading loading={loading} type="submit" text="Login" className={"w-full cursor-pointer"} />
                    </div>

                    <div className='text-center'>
                      <div className='flex justify-center items-center gap-2'>
                        <p>Don't have an account</p>
                        <Link href={WEBSITE_REGISTER} className='text-primary underline'>Create Account</Link>
                      </div>
                      <div className='mt-3'>

                        <Link href={WEBSITE_RESET_PASSWORD} className='text-primary underline'>Forget password</Link>
                      </div>
                    </div>
                  </form>
                </Form>
              </div></>
            :
            <OTPValidationForm email={otpEmail} onSubmit={handleOtpVerification} loading={otpVerificationLoading} />

        }



      </CardContent>
    </Card>
  )
}

export default LoginPage