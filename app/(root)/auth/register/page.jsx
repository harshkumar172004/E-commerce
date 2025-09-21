'use client'

import { Card, CardContent } from '@/components/ui/card'
import React, { useState } from 'react'
import Logo from '@/public/assets/images/logo-black.png'
import Image from 'next/image'
import { zodResolver } from "@hookform/resolvers/zod"
import { zodSchema } from "@/lib/zodSchema"
import { Button } from "@/components/ui/button"
import axios from 'axios'
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
import { WEBSITE_LOGIN, WEBSITE_REGISTER } from '@/routes/WebsiteRoute'
import { showToast } from '@/lib/showToast'

const RegisterPage = () => {
  const [loading, setLoading] = useState(false)
  const [IsTypePassword, setIsTypePassword] = useState(true)

  const formSchema = zodSchema.pick({
    name: true, email: true, password: true
  }).extend({
    confirmPassword: z.string()
      }).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords does not match",
        path: ["confirmPassword"],
      })
  

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const handleRagisterSubmit = async (value) => {
    try {
      setLoading(true)
      const {data: registerResponse}=await axios.post('/api/auth/register',value)
      if(!registerResponse.success){
        throw new Error(registerResponse.message)
      }

      form.reset()
      showToast('success', registerResponse.message)
    } catch (error) {
      
      showToast('error', error.message)
      // alert(error.message)
    }finally{
      setLoading(false)
    }

  }


  return (
    <Card className='w-[400px]'>
      <CardContent>
        <div className='flex justify-center'>
          <Image src={Logo.src} width={Logo.width} height={Logo.height} alt='logo' className='max-w-[150]' />
        </div>
        <div className='text-center'>
          <h1 className='text-3xl font-bold'>Create Account</h1>
          <p>Create new account by filling this form</p>
        </div>
        <div className='mt-5'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleRagisterSubmit)}>
              <div className="mb-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
                        <Input type="password" placeholder="password" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="mb-3">
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className='relative'>
                      <FormLabel>Confirm Password</FormLabel>
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
                <ButtonLoading loading={loading} type="submit" text="Ragister" className={"w-full cursor-pointer"} />
              </div>

              <div className='text-center'>
                <div className='flex justify-center items-center gap-2'>
                  <p>Already have an account</p>
                  <Link href={WEBSITE_LOGIN} className='text-primary underline'>Login Account</Link>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  )
}

export default RegisterPage
