'use client'
import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { IoMoonOutline, IoSunnyOutline } from 'react-icons/io5'
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'

const TheameSwitch = () => {
     const { setTheme } = useTheme()
    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button type="button" variant="ghost" className="cursor-pointer">
                    <IoSunnyOutline className="dark:hidden"/>
                    <IoMoonOutline className='hidden dark:block'/>
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel className="font-semibold">Themes</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={()=> setTheme('dark')}>Dark</DropdownMenuItem>
                    <DropdownMenuItem onClick={()=> setTheme('light')}>Light</DropdownMenuItem>
                    <DropdownMenuItem onClick={()=> setTheme('system')}>System</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default TheameSwitch