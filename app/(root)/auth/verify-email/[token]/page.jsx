'use client'

import React, { useState, useEffect } from 'react'
import { use } from 'react'
import axios from 'axios'
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { set } from 'mongoose';
import { Card, CardContent } from '@/components/ui/card';
import verifiedImg from '@/public/assets/images/verified.gif';
import verificationFailedImg from '@/public/assets/images/verification-failed.gif';
import { WEBSITE_HOME, WEBSITE_LOGIN, WEBSITE_REGISTER } from '@/routes/WebsiteRoute';


const EmailVerification = ({ params }) => {
  const { token } = use(params);
  const [isVerified, setisVerified] = useState(false)
  useEffect(() => {
    const verify = async () => {
      const { data: verificationResponse } = await axios.post(' /api/auth/verify-email ', { token });
      if (verificationResponse.success) {
        // throw new Error(verificationResponse.message);
        setisVerified(true);
      }
    }

    verify()

  }, [token]);

  return (
    <Card className="w-[400px] ">
      <CardContent>
        {isVerified ?
          <div >
            <div className='flex justify-center items-center'>
              <Image src={verifiedImg.src} height={verifiedImg.height} width={verifiedImg.width} alt='verified' className='h-[100px] w-auto'/>
            </div>
              <div className='text-center'>
              <h1 className='text-2xl font-bold my-5 text-green-500'>Email verification success!</h1>
              <Button asChild>
                <Link href={WEBSITE_LOGIN}>Continue Shopping</Link>
              </Button>

              </div>
          </div>
          :
          <div >
            <div className='flex justify-center items-center'>
              <Image src={verificationFailedImg.src} height={verificationFailedImg.height} width={verificationFailedImg.width} alt='verifiedFailed'className='h-[100px] w-auto'/>
            </div>
              <div className='text-center'>
              <h1 className='text-2xl font-bold my-5 text-red-600'>Email verification Failed!</h1>
              <Button asChild>
                <Link href={WEBSITE_REGISTER}> Try Again</Link>
              </Button>

              </div>
          </div>
        }
      </CardContent>

    </Card>
  )
}

export default EmailVerification
