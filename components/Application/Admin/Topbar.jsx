'use client'
import React from 'react'
import TheameSwitch from './TheameSwitch'
import UserDropDown from './UserDropDown'
import { Button } from '@/components/ui/button'
import { RiMenu4Fill } from "react-icons/ri";
import { useSidebar } from '@/components/ui/sidebar';
import AdminSearch from './AdminSearch'
import Image from 'next/image'
import logoBlack from '@/public/assets/images/logo-black.png'
import logoWhite from '@/public/assets/images/logo-white.png'
import AdminMobileSearch from './AdminMobileSearch'

const Topbar = () => {
  const { toggleSidebar } = useSidebar()
  return (
    <div className='fixed border h-14 w-full top-0 left-0 z-30 md:pl-72 md:pr-10 flex justify-between items-center  px-5 bg-white dark:bg-card'>

      <div className='flex items-center md:hidden'>
        <Image src={logoBlack.src} height={50} width={logoBlack.width} className=' block dark:hidden h-[50px] w-auto' alt='logo black' />
        <Image src={logoWhite.src} height={50} width={logoWhite.width} className='hidden dark:block h-[50px] w-auto' alt='logo white' />
      </div>
      <div className='md:block hidden'>
        <AdminSearch />
      </div>
      <div className='flex items-center gap-2'>
        <AdminMobileSearch/>
        <TheameSwitch />
        <UserDropDown />
        <Button onClick={toggleSidebar} type="button" size="icon" className="ms-2 md:hidden">
          <RiMenu4Fill />
        </Button>
      </div>
    </div>
  )
}

export default Topbar