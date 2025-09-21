'use client'
import UserPanalLayout from '@/components/Application/Website/UserPanalLayout'
import WebsiteBreadcrumb from '@/components/Application/Website/WebsiteBreadcrumb'
import useFetch from '@/hooks/useFetch'
import { USER_DASHBOARD, WEBSITE_ORDER_DETAILS, WEBSITE_PRODUCT_DETAILS } from '@/routes/WebsiteRoute'
import Link from 'next/link'
import React from 'react'
import { HiOutlineShoppingBag, HiOutlineShoppingCart } from 'react-icons/hi2'
import { IoCartOutline } from 'react-icons/io5'
import { useSelector } from 'react-redux'
const breadcrumb = {
  title: 'Dashboard',
  links: [
    { label: 'Dashboard', href: USER_DASHBOARD }
  ]
}

const MyAccount = () => {
  const {data:dashboardData} = useFetch('/api/dashboard/user')
  const cartStore = useSelector(store=> store.cartStore)
  // console.log(deshboardData)
  return (
    <div>
      <WebsiteBreadcrumb props={breadcrumb} />
      <UserPanalLayout>
        <div className="p-5 text-xl font-semibold border">
          Dashboard
        </div>
        <div className="p-5 border">
          <div className='grid lg:grid-cols-2 grid-cols-1 gap-10'>
            <div className="flex items-center justify-between gap-5 border rounded p-3">
              <div>
                <h4 className='font-semibold text-lg mb-1'>Total Orders</h4>
                <span className='font-semibold text-gray-500'>{dashboardData?.data?.totalOrder}</span>
              </div>
              <div className='w-16 h-16 bg-primary rounded-full flex justify-center items-center'>
                <HiOutlineShoppingBag size={25} className='text-white' />
              </div>
            </div>
            <div className="flex items-center justify-between gap-5 border rounded p-3">
              <div>
                <h4 className='font-semibold text-lg mb-1'>Items In Cart</h4>
                <span className='font-semibold text-gray-500'>{cartStore?.count}</span>
              </div>
              <div className='w-16 h-16 bg-primary rounded-full flex justify-center items-center'>
                <IoCartOutline size={25} className='text-white' />
              </div>
            </div>
          </div>
          <div className="mt-5">
            <h4 className="text-lg font-semibold mb-3">Recent Orders</h4>
            <div className='overflow-auto'>
            <table className='w-full'>
              <thead>
                <tr>
                  <th className="text-start p-2 text-sm border-b text-nowrap text-gray-500">
                    Sr.No.
                  </th>
                  <th className="text-start p-2 text-sm border-b text-nowrap text-gray-500">
                    Order Id
                  </th>
                  <th className="text-start p-2 text-sm border-b text-nowrap text-gray-500">
                    Total Item
                  </th>
                  <th className="text-start p-2 text-sm border-b text-nowrap text-gray-500">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {dashboardData && dashboardData?.data?.recentOrders?.map((order,i)=>(
                  <tr key={order._id}>
                    <td className='text-start text-sm text-gray-500 p-2 font-semibold'>{i+1}</td>
                    <td className='text-start text-sm text-gray-500 p-2 underline hover:text-blue-500 underline-offset-2'><Link href={WEBSITE_ORDER_DETAILS(order.order_id)}>{order.order_id}</Link></td>
                    <td className='text-start text-sm text-gray-500 p-2 '>{order.products.length}</td>
                    <td className='text-start text-sm text-gray-500 p-2 '>{order.totalAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
                    
                  </tr>
                ))}                
              </tbody>
            </table>
            </div>
          </div>
        </div>
      </UserPanalLayout>
    </div>
  )
}

export default MyAccount