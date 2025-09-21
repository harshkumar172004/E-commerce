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
import { useRouter } from 'next/navigation'

const UpdatePassword = ({email}) => {
    const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [IsTypePassword, setIsTypePassword] = useState(true)

  const formSchema = zodSchema.pick({
     email:true,password: true
  }).extend({
    confirmPassword: z.string()
      }).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords does not match",
        path: ["confirmPassword"],
      })
  

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
        email:email,
      password: "",
      confirmPassword: "",
    },
  })

  const handlePasswordUpdate = async (value) => {
    try {
      setLoading(true)
      const {data: passwordUpdate}=await axios.put('/api/auth/reset-password/update-password',value)
      if(!passwordUpdate.success){
        throw new Error(passwordUpdate.message)
      }

      form.reset()
      showToast('success', passwordUpdate.message)
      router.push(WEBSITE_LOGIN)
    } catch (error) {
      
      showToast('error', error.message)
      // alert(error.message)
    }finally{
      setLoading(false)
    }

  }


  return (
    
      <div>
        <div className='text-center'>
          <h1 className='text-3xl font-bold'>Update Password</h1>
          <p>Create new Password</p>
        </div>
        <div className='mt-5'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handlePasswordUpdate)}>
              
              
              <div className="mb-3">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className='relative'>
                      <FormLabel>New password</FormLabel>
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
                <ButtonLoading loading={loading} type="submit" text="Update Password" className={"w-full cursor-pointer"} />
              </div>
            </form>
          </Form>
        </div>
      </div>
    
  )
}

export default UpdatePassword
