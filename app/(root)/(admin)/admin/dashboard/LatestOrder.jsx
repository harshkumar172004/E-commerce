'use client'
import React, { useEffect, useState } from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import useFetch from '@/hooks/useFetch'
import Image from 'next/image'
import notFound from '@/public/assets/images/not-found.png'
import { statusBadge } from '@/lib/helperFunction'



const LatestOrder = () => {
    const [latestOrder, setlatestOrder] = useState()
    const {data,loading}=useFetch('/api/dashboard/admin/latest-order')
    // const 

    useEffect(() => {
     if(data && data.success){
        setlatestOrder(data.data)
     }
    }, [data])

    if(loading) return <div className='h-full w-full flex justify-center items-center'>Loading...</div>

    if(!latestOrder || latestOrder.length === 0) return <div className='h-full w-full flex justify-center items-center'>
        <Image src={notFound.src} height={notFound.height} width={notFound.width} alt='not found' className='w-20'/>
    </div>
    


    return (
        <Table>            
            <TableHeader>
                <TableRow>
                    <TableHead>Order Id</TableHead>
                    <TableHead className='text-center'>Payment Id</TableHead>
                    <TableHead className='text-center'>Items</TableHead>
                    <TableHead className='text-center'>Status</TableHead>
                    <TableHead className='text-center'>Amount</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {latestOrder?.map((order)=>(
                <TableRow key={order._id}>
                    <TableCell>{order._id}</TableCell>
                    <TableCell className='text-center'>{order.payment_id}</TableCell>
                    <TableCell className='text-center'>{order.products.length}</TableCell>
                    <TableCell className='text-center'>{statusBadge(order.status)}</TableCell>
                    <TableCell className='text-center'>{order.totalAmount}</TableCell>
                </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default LatestOrder