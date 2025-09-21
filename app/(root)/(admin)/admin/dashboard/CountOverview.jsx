'use client'
import useFetch from '@/hooks/useFetch'
import { ADMIN_CATEGORY_SHOW, ADMIN_CUSTOMARS_SHOW, ADMIN_ORDER_SHOW, ADMIN_PRODUCT_SHOW } from '@/routes/AdminPanelRoute'
import Link from 'next/link'
import React from 'react'
import { BiCategory } from 'react-icons/bi'
import { IoShirtOutline } from 'react-icons/io5'
import { LuUserRound } from 'react-icons/lu'
import { MdOutlineShoppingBag } from 'react-icons/md'

const CountOverview = () => {
const {data:countData}= useFetch('/api/dashboard/admin/count')

  return (
    <div className='grid lg:grid-cols-4 sm:grid-cols-2 sm:gap-10 gap-5'>
        <Link href={ADMIN_CATEGORY_SHOW}>
        <div className='flex items-center justify-between p-3 rounded-lg border shadow border-l-4 border-l-green-500 bg-white dark:bg-card dark:border-gray-800 dark:border-l-green-500'>
            <div>
                <h4 className='font-medium text-gray-500 dark:text-white'>Total Categories</h4>
                <span className='text-xl font-bold'>{countData?.data?.category || 0}</span>
            </div>
            <div>
                <span className='w-12 h-12 border flex justify-center items-center rounded-full bg-green-500 text-white'>
                    <BiCategory/>
                </span>
            </div>
        </div>
        </Link>
        <Link href={ADMIN_PRODUCT_SHOW}>
        <div className='flex items-center justify-between p-3 rounded-lg border shadow border-l-4 border-l-blue-500 bg-white dark:bg-card dark:border-gray-800 dark:border-l-blue-500'>
            <div>
                <h4 className='font-medium text-gray-500 dark:text-white'>Total Product</h4>
                <span className='text-xl font-bold'>{countData?.data?.product || 0}</span>
            </div>
            <div>
                <span className='w-12 h-12 border flex justify-center items-center rounded-full bg-blue-500 text-white'>
                    <IoShirtOutline/>
                </span>
            </div>
        </div>
        </Link>
        <Link href={ADMIN_CUSTOMARS_SHOW}>
        <div className='flex items-center justify-between p-3 rounded-lg border shadow border-l-4 border-l-yellow-500 bg-white dark:bg-card dark:border-gray-800 dark:border-l-yellow-500'>
            <div>
                <h4 className='font-medium text-gray-500 dark:text-white'>Total Customers</h4>
                <span className='text-xl font-bold'>{countData?.data?.customer || 0}</span>
            </div>
            <div>
                <span className='w-12 h-12 border flex justify-center items-center rounded-full bg-yellow-500 text-white'>
                    <LuUserRound/>
                </span>
            </div>
        </div>
        </Link>
        <Link href={ADMIN_ORDER_SHOW}>
        <div className='flex items-center justify-between p-3 rounded-lg border shadow border-l-4 border-l-cyan-500 bg-white dark:bg-card dark:border-gray-800 dark:border-l-cyan-500'>
            <div>
                <h4 className='font-medium text-gray-500 dark:text-white'>Total Orders</h4>
                <span className='text-xl font-bold'>{countData?.data?.order || 0}</span>
            </div>
            <div>
                <span className='w-12 h-12 border flex justify-center items-center rounded-full bg-cyan-500 text-white'>
                    <MdOutlineShoppingBag/>
                </span>
            </div>
        </div>
        </Link>
    </div>
  )
}

export default CountOverview