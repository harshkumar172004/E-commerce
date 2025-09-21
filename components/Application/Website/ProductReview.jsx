'use client'
import React, { useEffect, useState } from 'react'
import { IoStar } from 'react-icons/io5'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import ButtonLoading from '../ButtonLoading'
import { Input } from '@/components/ui/input'
import { zodSchema } from '@/lib/zodSchema'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSelector } from 'react-redux'
import { Rating } from '@mui/material'
import { Textarea } from '@/components/ui/textarea'
import axios from 'axios'
import Link from 'next/link'
import { WEBSITE_LOGIN } from '@/routes/WebsiteRoute'
import { showToast } from '@/lib/showToast'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import relativeTime from 'dayjs/plugin/relativeTime'
import ReviewList from './ReviewList'
import dayjs from 'dayjs'
import useFetch from '@/hooks/useFetch'
dayjs.extend(relativeTime);

const ProductReview = ({ productId }) => {
    const queryClient = useQueryClient()
    const auth = useSelector(store => store.authStore.auth)
    const [loading, setLoading] = useState(false)
    const [currentUrl,setcurrentUrl]= useState('')
    const [isReview, setIsReview] = useState(false)
    const [reviewCount,setreviewCount]= useState()

    const {data:reviewDetails} = useFetch(`/api/review/details?productId=${productId}`)

    useEffect(()=>{
if(reviewDetails && reviewDetails.success){
    const reviewCountData = reviewDetails.data 
    setreviewCount(reviewCountData)   
}
    },[reviewDetails])

    useEffect(() => {
       if(typeof window !== 'undefiend') {
        setcurrentUrl(window.location.href)
       }
    },[])

    const formSchema = zodSchema.pick({
        product: true,
        userId: true,
        rating: true,
        title: true,
        review: true,
    })

    useEffect(()=>{
form.setValue('userId',auth?._id)

    },[auth])

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            product: productId,
            userId: auth?._id,
            rating: 0,
            title: "",
            review: "",
        },
    })

    const handleReviewSubmit = async(value) => {
        setLoading(true)
        try {
            const { data: response } = await axios.post('/api/review/create', value)
            if (!response.success) {
                throw new Error(response.message)
            }

            form.reset()
            showToast('success', response.message)
            queryClient.invalidateQueries(['product-review'])
        } catch (error) {
            showToast('error', error.message)
        } finally {
            setLoading(false)
        }
    }

    const fetchReview = async (pageParam)=>{
        const {data:getReviewData} = await axios.get(`/api/review/get?productId=${productId}&page=${pageParam}`)

        if(!getReviewData.success){
           return 
        }
        return getReviewData.data
    }

    const {error,data,isFetching,fetchNextPage,hasNextPage}= useInfiniteQuery({
        queryKey:['product-review'],
        queryFn:async ({pageParam})=> await fetchReview(pageParam),
        initialPageParam:0,
        getNextPageParam:(lastPage)=>{
            return lastPage.nextPage
        }

    })

    return (
        <div className="shadow rounded border mb-20">
            <div className='p-3 bg-gray-50 border-b'>
                <h2 className='font-semibold text-2xl'>Rating & Review</h2>
            </div>
            <div className="p-5">
                <div className="flex justify-between flex-wrap items-center border-b pb-10">
                    <div className="md:w-1/2 w-full md:flex md:gap-10 md:mb-0 mb-5">
                        <div className='md:w-[200px] w-full md:mb-0 mb-5'>
                            <h4 className="text-center font-semibold text-8xl">{reviewCount?.averageRating}</h4>
                            <div className="flex justify-center gap-2">
                                <IoStar />
                                <IoStar />
                                <IoStar />
                                <IoStar />
                                <IoStar />
                            </div>
                            <p className='text-center mt-3'>
                                ({reviewCount?.totalReview} Rating & Reviews)
                            </p>
                        </div>
                        <div className="md:w-[calc(100%-200px)] flex items-center">
                            <div className="w-full">
                                {[5, 4, 3, 2, 1].map(rating => (
                                    <div className="flex items-center gap-2 mb-2" key={rating}>
                                        <div className="flex items-center gap-1">
                                            <p className="w-3">{rating}</p>
                                            <IoStar />
                                        </div>
                                        <Progress value={reviewCount?.percentage[rating]} />
                                        <span className='text-sm'>{reviewCount?.rating[rating]}</span>
                                    </div>
                                ))}



                            </div>
                        </div>

                    </div>
                    <div className="md:w-1/2 w-full md:text-end text-center">
                        <Button onClick={()=> setIsReview(!isReview)} type="button" variant="outline" className="md:w-fit w-full py-6 px-10 bg-none" >Write Review</Button>
                    </div>

                </div>

                {isReview && 
                <div className='my-5'>
                    <h4 className='text-xl font-semibold mb-3'>Write A Review</h4>
                    {!auth 
                    ?
                    <>
                    <p className='mb-2'>Login To Submit Review</p>
                    <Button type="button" asChild>
                        <Link href={`${WEBSITE_LOGIN}?callback=${currentUrl}`}>Login</Link>
                    </Button>
                    </>
                    :
                    <>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleReviewSubmit)}>
                            <div className="mb-5">
                                <FormField
                                    control={form.control}
                                    name="rating"
                                    render={({ field }) => (
                                        <FormItem>

                                            <FormControl>
                                                <Rating
                                                    value={field.value}
                                                    size='large'
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="mb-5">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input type="text" placeholder="Enter title" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="mb-5">
                                <FormField
                                    control={form.control}
                                    name="review"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Review</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Write your comment..."{...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className='mb-3'>
                                <ButtonLoading loading={loading} type="submit" text="Submit Review" className={" cursor-pointer"} />
                            </div>


                        </form>
                    </Form>
                    </>
                    }

                    
                </div>
                }

                <div className='mt-10 border-t pt-5'>
                    <h5 className='text-xl font-semibold'>{data?.pages[0]?.totalReview || 0} Reviews</h5>
                    <div className="mt-10">
                        {data && data.pages.map(page=>(
                            page.reviews.map(review =>(
                                <div className="mb-5" key={review._id}>
                                    <ReviewList review={review}/>
                                </div>

                            ))
                        ))}

                        {hasNextPage &&
                        <ButtonLoading text='Load More' type='button' loading={isFetching} onClick={fetchNextPage}/>                        
                        }
                    </div>
                </div>
            </div>

        </div>
    )
}

export default ProductReview