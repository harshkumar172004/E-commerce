'use client'
import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import Editor from '@/components/Application/Admin/Editor'
import MediaModal from '@/components/Application/Admin/MediaModal'
import ButtonLoading from '@/components/Application/ButtonLoading'
import Select from '@/components/Application/Select'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import useFetch from '@/hooks/useFetch'
import { showToast } from '@/lib/showToast'
import { zodSchema } from '@/lib/zodSchema'
import { ADMIN_CATEGORY_SHOW, ADMIN_COUPON_SHOW, ADMIN_DASHBOARD, ADMIN_PRODUCT_SHOW } from '@/routes/AdminPanelRoute'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import slugify from 'slugify'
const breadcrumbData = [
    { href: ADMIN_DASHBOARD, label: 'Home' },
    { href: ADMIN_COUPON_SHOW, label: 'Coupon' },
    { href: '', label: 'Add Coupon' },
]

const AddCoupon = () => {

    const [loading, setLoading] = useState(false)



    const formSchema = zodSchema.pick({
        code: true,
        discountPercentage: true,
        minShoppingAmount: true,
        validity: true,
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            code: "",
            discountPercentage: "",
            minShoppingAmount: "",
            validity: 0,
        },
    })


    const onSubmit = async (value) => {
        setLoading(true)
        try {

            const { data: response } = await axios.post('/api/coupon/create', value)
            if (!response.success) {
                throw new Error(response.message)
            }
            form.reset()
            showToast('success', response.message)
        } catch (error) {
            showToast('error', error.message)
        } finally {
            setLoading(false)
        }

    }


    return (
        <div>
            <BreadCrumb breadcrumbData={breadcrumbData} />

            <Card className='py-0 rounded shadow-sm'>
                <CardHeader className="pt-3 px-3 border-b [.border-b]:pb-2">
                    <h4 className='font-semibold text-xl'>Add Coupon</h4>

                </CardHeader>
                <CardContent className="pb-5">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className=''>
                            <div className='grid md:grid-cols-2 grid-cols-1 gap-5'>
                                <div className="">
                                    <FormField
                                        control={form.control}
                                        name="code"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Code<span className='text-red-600'>*</span></FormLabel>
                                                <FormControl>
                                                    <Input type="text" placeholder="Enter Code" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="">
                                    <FormField
                                        control={form.control}
                                        name="discountPercentage"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Discount Percentage<span className='text-red-600'>*</span></FormLabel>
                                                <FormControl>
                                                    <Input type="number" placeholder="Enter Discount Percentage" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="">
                                    <FormField
                                        control={form.control}
                                        name="minShoppingAmount"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Min-Shopping Amount<span className='text-red-600'>*</span></FormLabel>
                                                <FormControl>
                                                    <Input type="number" placeholder="Enter Min-Shopping Amount" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="">
                                    <FormField
                                        control={form.control}
                                        name="validity"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Discount Validity<span className='text-red-600'>*</span></FormLabel>
                                                <FormControl>
                                                    <Input type="date"  {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>


                            </div>



                            <div className='mb-3 mt-5'>
                                <ButtonLoading loading={loading} type="submit" text="Add Coupon" className={" cursor-pointer"} />
                            </div>


                        </form>
                    </Form>


                </CardContent>
            </Card>
        </div>
    )
}

export default AddCoupon