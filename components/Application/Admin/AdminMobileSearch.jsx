import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import { IoIosSearch } from 'react-icons/io'
import SearchModel from './SearchModel'


const AdminMobileSearch = () => {
  const [open, setopen] = useState(false)
  return (
    <>
      <Button type='button' size="icon" onClick={() => setopen(true)} className="md:hidden" variant="ghost">
        <IoIosSearch />
      </Button>
      <SearchModel open={open} setopen={setopen} />
    </>
  )
}

export default AdminMobileSearch