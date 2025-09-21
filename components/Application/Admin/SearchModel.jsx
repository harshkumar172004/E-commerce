import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import Fuse from 'fuse.js'
import searchData from '@/lib/search'

const options = {
  keys: ['labels', 'description', 'keywords'],
  threshold: 0.3,
}

const SearchModel = ({ open, setopen }) => {
  const [query, setquery] = useState('')
  const [results, setresults] = useState([])
  const fuse = new Fuse(searchData, options)

  useEffect(() => {
    if (query.trim() === "") {
      setresults([])
    }

    const res = fuse.search(query)
    setresults(res.map((r)=> r.item))
  }, [query])

  return (
    <Dialog open={open} onOpenChange={() => setopen(!open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Quick Search</DialogTitle>
          <DialogDescription>
            Find and navigate to any admin section instantly. Type a keyword to get started.
          </DialogDescription>
        </DialogHeader>

        <Input
          placeholder='Search...'
          value={query}
          onChange={(e) => setquery(e.target.value)}
          autoFocus
        />
        <ul className='mt-4 max-h-60 overflow-y-auto'>

        {results.map((item,index)=>(

        
          <li key={index}>
            <Link href={item.url} className='block py-2 px-3 rounded hover:bg-muted' onClick={()=>setopen(false)}>
              <h4 className='font-medium'>
                {item.label}
              </h4>
              <p className='text-sm text-muted-foreground'>{item.description}</p>
            </Link>
          </li>
        

        ))}

        {query && results.length === 0 && 
        <div className='text-sm text-center text-red-500'>
          No Results Found</div>}
        </ul>
      </DialogContent>
    </Dialog>

  )
}

export default SearchModel