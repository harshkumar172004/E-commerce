'use client'
import React from 'react'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import slider1 from '@/public/assets/images/slider-1.png'
import slider2 from '@/public/assets/images/slider-2.png'
import slider3 from '@/public/assets/images/slider-3.png'
import slider4 from '@/public/assets/images/slider-4.png'
import Image from 'next/image';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';

const ArrowNext=(props)=>{
const {onClick} = props
return(
    <button onClick={onClick} type='button' className='cursor-pointer w-14 h-14 flex justify-center items-center rounded-full absolute z-10 top-1/2 -translate-1/2 bg-white right-10'>
        <LuChevronRight size={25} className='text-black'/>
    </button>
)
}
const ArrowPrev=(props)=>{
const {onClick} = props
return(
    <button onClick={onClick} type='button' className='cursor-pointer w-14 h-14 flex justify-center items-center rounded-full absolute z-10 top-1/2 -translate-1/2 bg-white left-10'>
        <LuChevronLeft size={25} className='text-black'/>
    </button>
)
}

const MainSlider = () => {
    const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    autoplay:true,
    slidesToScroll: 1,
    nextArrow:<ArrowNext/>,
    prevArrow:<ArrowPrev/>,
    responsive:[
        {
            breakpoint:480,
            settings:{
                dots:false,
                arrow:false,
                nextArrow:'',
                prevArrow:'',
            }
        }
    ]
  };
  return (
    <div>
        <Slider {...settings}>
            <div>
            <Image src={slider1.src} height={slider1.height} width={slider1.width} alt='slider1' className=' w-full object-cover'/>
            </div>
            <div>
            <Image src={slider2.src} height={slider2.height} width={slider2.width} alt=' slider2' className=' w-full object-cover'/>
            </div>
            <div>
            <Image src={slider3.src} height={slider3.height} width={slider3.width} alt='  slider3' className=' w-full object-cover'/>
            </div>
            <div>
            <Image src={slider4.src} height={slider4.height} width={slider4.width} alt='\ slider4' className=' w-full object-cover'/>
            </div>
        </Slider>
    </div>
  )
}

export default MainSlider