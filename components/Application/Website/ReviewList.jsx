import Image from 'next/image'
import React from 'react'
import usericon from '@/public/assets/images/user.png'
import dayjs from 'dayjs'
import { IoStar } from 'react-icons/io5'

const ReviewList = ({ review }) => {
    return (
        <div className='gap-5 flex'>
            <div className='w-[60px]'>
                <Image src={review?.avatar?.url || usericon.src}
                    height={55}
                    width={55}
                    alt='user icon'
                    className='rounded-lg'
                />
            </div>
            <div className="w-[calc(100%-100px)]">
                <div className="text-xl font-semibold">{review?.title}</div>
                <p className='flex gap-2 items-center'>
                    <span className='font-medium'>{review?.reviewedBy}</span>
                    -
                    <span className='text-gray-500'>{dayjs(review?.createdAt).fromNow()}</span>
                    <span className='flex items-center justify-center text-xs gap-1'>( {review.rating} <IoStar className='text-yellow-500 mb-1'/>)</span>

                </p>
                <p className='text-gray-600 mt-3'>{review?.review}</p>
            </div>
        </div>
    )
}

export default ReviewList