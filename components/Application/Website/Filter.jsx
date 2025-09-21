'use client'

import useFetch from '@/hooks/useFetch'
import React, { useEffect, useState } from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import ButtonLoading from '../ButtonLoading'
import { useRouter, useSearchParams } from 'next/navigation'
import { WEBSITE_SHOP } from '@/routes/WebsiteRoute'
import { Button } from '@/components/ui/button'
import Link from 'next/link'


const Filter = () => {
    const searchParams = useSearchParams()
    const [priceFilter, setpriceFilter] = useState({ minPrice: 0, maxPrice: 3000 })
    const [selectedCategory, setselectedCategory] = useState([])
    const [selectedColor, setselectedColor] = useState([])
    const [selectedSize, setselectedSize] = useState([])
    const { data: categoryData } = useFetch('/api/category/get-category')
    const { data: colorData } = useFetch('/api/product-variant/colors')
    const { data: sizeData } = useFetch('/api/product-variant/size')
    const urlSearchParams = new URLSearchParams(searchParams.toString())
    const router = useRouter()

    const handlePriceChange = (value) => {
        setpriceFilter({ minPrice: value[0], maxPrice: value[1] })
    }

    useEffect(() => {
        searchParams.get('category')
            ? setselectedCategory(searchParams.get('category').split(','))
            : setselectedCategory([])

        searchParams.get('color')
            ? setselectedColor(searchParams.get('color').split(','))
            : setselectedColor([])

        searchParams.get('size')
            ? setselectedSize(searchParams.get('size').split(','))
            : setselectedSize([])
    }, [searchParams])

    const handleCategoryFilter = (categorySlug) => {
        let newSelectedCategory = [...selectedCategory]
        if (newSelectedCategory.includes(categorySlug)) {
            newSelectedCategory = newSelectedCategory.filter(cat => cat !== categorySlug)
        } else {
            newSelectedCategory.push(categorySlug)
        }
        setselectedCategory(newSelectedCategory)
        newSelectedCategory.length > 0
            ? urlSearchParams.set('category', newSelectedCategory.join(','))
            : urlSearchParams.delete('category')
        router.push(`${WEBSITE_SHOP}?${urlSearchParams}`)
    }
    const handleColorFilter = (color) => {
        let newSelectedColor = [...selectedColor]
        if (newSelectedColor.includes(color)) {
            newSelectedColor = newSelectedColor.filter(cat => cat !== color)
        } else {
            newSelectedColor.push(color)
        }
        setselectedColor(newSelectedColor)
        newSelectedColor.length > 0
            ? urlSearchParams.set('color', newSelectedColor.join(','))
            : urlSearchParams.delete('color')
        router.push(`${WEBSITE_SHOP}?${urlSearchParams}`)
    }
    const handleSizeFilter = (size) => {
        let newSelectedSize = [...selectedSize]
        if (newSelectedSize.includes(size)) {
            newSelectedSize = newSelectedSize.filter(cat => cat !== size)
        } else {
            newSelectedSize.push(size)
        }
        setselectedSize(newSelectedSize)
        newSelectedSize.length > 0
            ? urlSearchParams.set('size', newSelectedSize.join(','))
            : urlSearchParams.delete('size')
        router.push(`${WEBSITE_SHOP}?${urlSearchParams}`)
    }

    const handlePriceFilter = () => {
        urlSearchParams.set('minPrice', priceFilter.minPrice)
        urlSearchParams.set('maxPrice', priceFilter.maxPrice)
        router.push(`${WEBSITE_SHOP}?${urlSearchParams}`)
    }
    return (
        <div>
            {searchParams.size > 0 &&
                <Button type="button" variant="destructive" className="w-full" asChild>
                    <Link href={WEBSITE_SHOP}>
                        Clear Filter
                    </Link>
                </Button>
            }
            <Accordion type="multiple" defaultValue={['1', '2', '3', '4']}>
                <AccordionItem value="1">
                    <AccordionTrigger className='font-semibold uppercase hover:no-underline cursor-pointer'>Category</AccordionTrigger>
                    <AccordionContent>
                        <div className='max-h-48 overflow-auto'>
                            <ul>
                                {categoryData && categoryData.success && categoryData.data.map((category) => (
                                    <li key={category._id} className='mb-3'>
                                        <label className='flex items-center space-x-3 cursor-pointer'>
                                            <Checkbox onCheckedChange={() => handleCategoryFilter(category.slug)}
                                                checked={selectedCategory.includes(category.slug)}
                                            />
                                            <span>{category.name}</span>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="2">
                    <AccordionTrigger className='font-semibold uppercase hover:no-underline cursor-pointer'>Color</AccordionTrigger>
                    <AccordionContent>
                        <div className='max-h-48 overflow-auto'>
                            <ul>
                                {colorData && colorData.success && colorData.data.map((color) => (
                                    <li key={color} className='mb-3'>
                                        <label className='flex items-center space-x-3 cursor-pointer'>
                                            <Checkbox onCheckedChange={() => handleColorFilter(color)}
                                                checked={selectedColor.includes(color)}
                                            />
                                            <span>{color.name}</span>
                                            <span>{color}</span>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="3">
                    <AccordionTrigger className='font-semibold uppercase hover:no-underline cursor-pointer'>Sizes</AccordionTrigger>
                    <AccordionContent>
                        <div className='max-h-48 overflow-auto'>
                            <ul>
                                {sizeData && sizeData.success && sizeData.data.map((size) => (
                                    <li key={size} className='mb-3'>
                                        <label className='flex items-center space-x-3 cursor-pointer'>
                                            <Checkbox onCheckedChange={() => handleSizeFilter(size)}
                                                checked={selectedSize.includes(size)}
                                            />
                                            <span>{size}</span>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="4">
                    <AccordionTrigger className='font-semibold uppercase hover:no-underline cursor-pointer'>price</AccordionTrigger>
                    <AccordionContent>
                        <Slider defaultValue={[0, 3000]} max={3000} step={1} onValueChange={handlePriceChange} className='mt-2' />
                        <div className='flex justify-between items-center pt-2'>
                            <span>{priceFilter.minPrice.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
                            <span>{priceFilter.maxPrice.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
                        </div>
                        <div className="mt-4">
                            <ButtonLoading onClick={handlePriceFilter} type="button" text="Filter Price" className="rounded-full cursor-pointer" />
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>


        </div>
    )
}

export default Filter