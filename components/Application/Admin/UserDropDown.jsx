import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import adminlogo from '@/public/assets/images/favicon.ico'
import { useSelector } from 'react-redux'
import Link from 'next/link'
import { IoShirtOutline } from "react-icons/io5";
import { MdOutlineShoppingBag } from "react-icons/md";
import LogoutButton from './LogoutButton'
import { ADMIN_PRODUCT_ADD } from '@/routes/AdminPanelRoute'



const UserDropDown = () => {
  const auth = useSelector((store)=>store.authStore.auth)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild >
        <Avatar className="cursor-pointer">
          <AvatarImage src={adminlogo.src} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="me-5 w-44">
        <DropdownMenuLabel className="font-semibold">{auth?.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={ADMIN_PRODUCT_ADD} className='cursor-pointer'>
          <IoShirtOutline/>
          New Product
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="" className='cursor-pointer'>
          <MdOutlineShoppingBag/>
          Orders
          </Link>
        </DropdownMenuItem>

        <LogoutButton/>
        
        
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserDropDown