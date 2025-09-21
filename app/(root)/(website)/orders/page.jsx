'use client'
import Loading from '@/components/Application/Loading'
import UserPanalLayout from '@/components/Application/Website/UserPanalLayout'
import WebsiteBreadcrumb from '@/components/Application/Website/WebsiteBreadcrumb'
import useFetch from '@/hooks/useFetch'
import { USER_ORDERS, WEBSITE_ORDER_DETAILS } from '@/routes/WebsiteRoute'
import Link from 'next/link'
import React from 'react'
const breadcrumb = {
  title: 'Order',
  links: [
    { label: 'Order', href: USER_ORDERS }
  ]
}

const Orders = () => {
  const { data: orderData,loading } = useFetch('/api/user-order')
   
  return (
    <div>
      <WebsiteBreadcrumb props={breadcrumb} />
      <UserPanalLayout>
        <div className="shadow rounded">
          <div className="p-5 text-xl font-semibold border">
            Orders
          </div>
          <div className="p-5 border-b">
            {loading ? 
            <div className='text-center py-5'><Loading/></div>
          :
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
                {orderData && orderData?.data?.map((order, i) => (
                  <tr key={order._id}>
                    <td className='text-start text-sm text-gray-500 p-2 font-semibold'>{i + 1}</td>
                    <td className='text-start text-sm text-gray-500 p-2 underline hover:text-blue-500 underline-offset-2'><Link href={WEBSITE_ORDER_DETAILS(order.order_id)}>{order.order_id}</Link></td>
                    <td className='text-start text-sm text-gray-500 p-2 '>{order.products.length}</td>
                    <td className='text-start text-sm text-gray-500 p-2 '>{order.totalAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          }            
          </div>
        </div>
      </UserPanalLayout>
    </div>
  )
}

export default Orders