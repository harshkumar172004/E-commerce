import { zodSchema } from '@/lib/zodSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormLabel, FormMessage,FormItem } from '../ui/form'
import ButtonLoading from './ButtonLoading'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp'
import { showToast } from '@/lib/showToast'
import axios from 'axios'

const OTPValidationForm = ({ email, onSubmit, loading }) => {

  const [isResendOtp, setisResendOtp] = useState(false)

  const formSchema = zodSchema.pick({
    otp: true, email: true
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: '',
      email: email
    }
  })

  const handleOtpVerification = (value) => {
    onSubmit(value)

  }

  const resendOtp = async ()=>{
    try {
      setisResendOtp(true)
      const {data: resendOtpResponse}=await axios.post('/api/auth/resend-otp',{email})
      if(!resendOtpResponse.success){
        throw new Error(resendOtpResponse.message)
      }     
      showToast('success',resendOtpResponse.message)
    } catch (error) {
      
      showToast('error',error.message)
    }finally{
      setisResendOtp(false)
    }

  }
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleOtpVerification)}>
          <div className='text-center'>
            <h1 className='text-2xl font-bold mb-2'>Please Complete Your Verification</h1>
            <p className='text-md'>We have sent an One-Time-password (OTP) sent on your register email. OTP velid for 10 min only</p>
          </div>
          <div className="mb-5 mt-5 flex justify-center">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-extrabold text-xl'>One-Time-password (OTP)</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot className='text-xl size-10' index={0} />
                        <InputOTPSlot className='text-xl size-10' index={1} />
                        <InputOTPSlot className='text-xl size-10' index={2} />
                        <InputOTPSlot className='text-xl size-10' index={3} />
                        <InputOTPSlot className='text-xl size-10' index={4} />
                        <InputOTPSlot className='text-xl size-10' index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className='mb-3'>
            <ButtonLoading loading={loading} type="submit" text="Verify" className={"w-full cursor-pointer"} />
            <div className="text-center mt-5">
              {
                !isResendOtp ?
                <button type='button' onClick={resendOtp} className='text-blue-500 cursor-pointer hover:underline'>Resend OTP</button>
                :
                <span className='text-md'>Resending...</span>
              }
            </div>
          </div>


        </form>
      </Form>
    </div>
  )
}

export default OTPValidationForm