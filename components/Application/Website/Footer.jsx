import Image from 'next/image'
import React from 'react'
import logo from '@/public/assets/images/logo-black.png'
import { USER_DASHBOARD, WEBSITE_ABOUT, WEBSITE_HOME, WEBSITE_LOGIN, WEBSITE_PRIVACY_POLICY, WEBSITE_REGISTER, WEBSITE_SHOP, WEBSITE_TRAMS_CONDITION } from '@/routes/WebsiteRoute'
import Link from 'next/link'
import { IoLocationOutline } from "react-icons/io5"
import { MdOutlineLocalPhone } from 'react-icons/md'
import { CiFacebook, CiInstagram, CiLinkedin, CiMail, CiTwitter } from "react-icons/ci";
import { FaInstagram, FaWhatsapp } from 'react-icons/fa'

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className='bg-gray-50 border-t'>
      <div className='grid lg:grid-cols-5 md:grid-cols-2 grid-cols-1 gap-10 py-10 lg:px-32 px-4'>
        <div className="lg:col-span-1 md:col-span-2 col-span-1">
          <Link href={WEBSITE_HOME}>
            <Image
              src={logo}
              width={383}
              height={146}
              alt='logo'
              className='w-36 mb-2'
            />

          </Link>
          <p className='text-gray-500 text-sm'>E-store is your trusted destination for quality and convenience. From fashion to essentials, we bring everything you need right to your doorstep. Shop smart, live better — only at E-store.</p>
        </div>

        <div>
          <h4 className='text-xl font-bold uppercase mb-5'>Categories</h4>
          <ul>
            <li className='mb-2 text-gray-500'>
              <Link href={`${WEBSITE_SHOP}?category=tshirts`}>T-Shirt</Link>
            </li>
            <li className='mb-2 text-gray-500'>
              <Link href={`${WEBSITE_SHOP}?category=hoodies`}>Hoodies</Link>
            </li>
            <li className='mb-2 text-gray-500'>
              <Link href={`${WEBSITE_SHOP}?category=oversized`}>Oversized</Link>
            </li>
            <li className='mb-2 text-gray-500'>
              <Link href={`${WEBSITE_SHOP}?category=full-sleeves`}>Full sleeves</Link>
            </li>
            <li className='mb-2 text-gray-500'>
              <Link href={`${WEBSITE_SHOP}?category=polo`}>Polo</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className='text-xl font-bold uppercase mb-5'>Userfull Links</h4>
          <ul>
            <li className='mb-2 text-gray-500'>
              <Link href={WEBSITE_HOME}>Home</Link>
            </li>
            <li className='mb-2 text-gray-500'>
              <Link href={WEBSITE_ABOUT}>About</Link>
            </li>
            <li className='mb-2 text-gray-500'>
              <Link href={WEBSITE_SHOP}>Shop</Link>
            </li>
            <li className='mb-2 text-gray-500'>
              <Link href={WEBSITE_REGISTER}>Register</Link>
            </li>
            <li className='mb-2 text-gray-500'>
              <Link href={WEBSITE_LOGIN}>Login</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className='text-xl font-bold uppercase mb-5'>Help Center</h4>
          <ul>
            <li className='mb-2 text-gray-500'>
              <Link href={WEBSITE_REGISTER}>Register</Link>
            </li>
            <li className='mb-2 text-gray-500'>
              <Link href={WEBSITE_LOGIN}>Login</Link>
            </li>
            <li className='mb-2 text-gray-500'>
              <Link href={USER_DASHBOARD}>My Account</Link>
            </li>
            <li className='mb-2 text-gray-500'>
              <Link href={WEBSITE_PRIVACY_POLICY}>Privacy Policy</Link>
            </li>
            <li className='mb-2 text-gray-500'>
              <Link href={WEBSITE_TRAMS_CONDITION}>Terms & Condition</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className='text-xl font-bold uppercase mb-3'>contect us</h4>
          <ul>

            <li className='mb-3 text-gray-500  flex gap-2'>
              <IoLocationOutline size={20} /><span className='text-sm'>E-store market UP, India 201102</span>
            </li>
            <li className='mb-3 text-gray-500 flex gap-2'>
              <MdOutlineLocalPhone size={20} /><Link href="tel:+91-8750160368"><span className='text-sm hover:text-primary'>+91-8750160368</span></Link>
            </li>
            <li className='mb-3 text-gray-500 flex gap-2'>
              <CiMail size={20} /><Link href="mailto:pal041752@gmail.com"><span className='text-sm hover:text-primary'>pal041752@gmail.com</span></Link>
            </li>
          </ul>
          <div className=' flex gap-5 mt-5'>
            <Link href="https://linkedin.com/in/harsh-kumar-426970306"><CiLinkedin className='text-primary' size={30} /></Link>
            <Link href="https://instagram.com/harshkumar_172004"><CiInstagram className='text-primary' size={30} /></Link>
            <Link href="+91-8750160368"><FaWhatsapp className='text-primary' size={30} /></Link>
            <Link href="https://www.facebook.com/kunal.pal.39948"><CiFacebook className='text-primary' size={30} /></Link>
          </div>
        </div>
      </div>
      <div className=" py-5 bg-gray-100">
      <p className='text-center'>© {currentYear} Get me a chai. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer