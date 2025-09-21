'use client'
import React from 'react'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Image from 'next/image';
import { IoStar } from 'react-icons/io5';
import { BsChatQuote } from 'react-icons/bs';

const Testimonial = () => {

    const testimonials = [
        {
            name: "Alice Johnson",
            review: "This product exceeded my expectations in every way. The build quality is fantastic and it feels very durable. Customer support was also very responsive and helpful  my experience.",
            rating: 5
        },
        {
            name: "Brian Smith",
            review: "I was a bit skeptical at first, but after using it for a week, I am impressed. The features are exactly as described and very easy to use. I would recommend this to my friends.",
            rating: 4
        },
        {
            name: "Catherine Lee",
            review: "The delivery was quick and the packaging was secure. I appreciate the attention to detail in both the product and the service. Will be purchasing again in the future.",
            rating: 5
        },
        {
            name: "David Kim",
            review: "Setup was straightforward and the instructions were clear. I had a minor issue, but it was resolved quickly by the support team. Overall, a very positive experience.",
            rating: 4
        },
        {
            name: "Emily Davis",
            review: "I love how intuitive the interface is. It made my daily tasks much easier and more enjoyable. The design is sleek and modern, which is a big plus for me.",
            rating: 5
        },
        {
            name: "Frank Miller",
            review: "Great value for the price. I compared several options and this one stood out for its features and reliability. I am very satisfied with my purchase.",
            rating: 4
        },
        {
            name: "Grace Wilson",
            review: "The customer service team went above and beyond to assist me. The product itself works flawlessly and I have had no issues so far. Highly recommended.",
            rating: 5
        },
        {
            name: "Henry Brown",
            review: "I have been using this for a month now and it has made a noticeable difference. The quality is top-notch and it performs exactly as advertised.",
            rating: 4
        },
        {
            name: "Isabella Martinez",
            review: "From ordering to delivery, the process was smooth and hassle-free. The product arrived in perfect condition and works great. Thank you for a wonderful experience.",
            rating: 5
        },
        {
            name: "Jack Thompson",
            review: "I appreciate the regular updates and communication from the company. The product is reliable and meets all my needs. I would not hesitate to buy again.",
            rating: 5
        }
    ];
    const settings = {
        dots: true,
        infinite: true,
        speed: 800,
        autoplay: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    dots: true,
                    infinite: true,
                    slidesToShow: 3,
                    slidesToScroll: 1,
                },
                breakpoint: 768,
                settings: {
                    dots: false,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            }
        ]
    };
    return (
        <div className='lg:px-32 px-4 sm:pt-20 pt-5 pb-10'>
            <h2 className='text-center sm:text-4xl text-2xl mb-5 font-semibold'>Customer Review</h2>
            <Slider {...settings}>
                {testimonials.map((item, index) => (

                    <div key={index} className='p-5'>
                        <div className='border rounded-lg p-5'>
                            <BsChatQuote size={30} className='mb-3'/>
                            <p className='mb-5'>{item.review}</p>
                            <h4 className='font-semibold'>{item.name}</h4>
                            <div className='flex mt-1'>
                                {Array.from({ length: item.rating }).map((_, i) => (
                                    <IoStar key={`star${i}`} size={20} className='text-yellow-400' />
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    )
}

export default Testimonial