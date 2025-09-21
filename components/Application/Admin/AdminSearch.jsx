import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import { IoIosSearch } from 'react-icons/io'
import SearchModel from './SearchModel'

const AdminSearch = () => {
    const [open, setopen] = useState(false)
  return (
    <div className='md:w-[350px]'>
        <div className='relative flex justify-between items-center '>
            <Input
            readOnly
            className='rounded-full cursor-pointer'
            placeholder='Search...'
            onClick={()=> setopen(true)}
            />
            <button type='button' className='absolute right-3 cursor-default'>
                <IoIosSearch/>
            </button>
        </div>
        <SearchModel open={open} setopen={setopen}/>

    </div>
  )
}

export default AdminSearch