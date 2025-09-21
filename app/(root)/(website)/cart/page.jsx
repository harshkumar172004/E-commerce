'use client'
import WebsiteBreadcrumb from '@/components/Application/Website/WebsiteBreadcrumb'
import { Button } from '@/components/ui/button'
import { WEBSITE_CART, WEBSITE_CHECKOUT, WEBSITE_PRODUCT_DETAILS, WEBSITE_SHOP } from '@/routes/WebsiteRoute'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import imgPlacceholder from '@/public/assets/images/img-placeholder.webp'
import { useDispatch, useSelector } from 'react-redux'
import { HiMinus, HiPlus } from 'react-icons/hi2'
import { IoCloseCircleOutline } from 'react-icons/io5'
import { decreaseQuantity, increaseQuantity, removeFromCart } from '@/store/reducer/cartReducer'
const breadcrumb = {
  title: 'Cart',
  links: [
    { label: 'Cart', href: WEBSITE_CART }
  ]
}

const CartPage = () => {

  const cart = useSelector(store => store.cartStore)
  
  const dispatch = useDispatch()
  const [discount, setdiscount] = useState(0)
    const [Subtotal, setSubtotal] = useState(0)
 
   useEffect(() => {
      const cartProducts = cart.products
      const totalAmount = cartProducts.reduce((sum,product)=>(
        sum + (product.sellingPrice * product.qty)
      ),0)
      const discount = cartProducts.reduce((sum,product)=>(
        sum + ((product.mrp - product.sellingPrice) * product.qty)
      ),0)
  
      setSubtotal(totalAmount)
      setdiscount(discount)  
    }, [cart])
  return (
    <div>
      <WebsiteBreadcrumb props={breadcrumb} />
      {cart.count === 0
        ?
        <div className='w-screen h-[400px] flex justify-center items-center py-32'>
          <div className='text-center'>
            <h4 className='text-4xl font-semibold mb-5'>Your cart is empty!</h4>
            <Button type='button' asChild><Link href={WEBSITE_SHOP}>Continue Shopping</Link></Button>
          </div>

        </div>
        :
        <div className='flex lg:flex-nowrap flex-wrap gap-10 my-20 lg:px-32 px-4'>
          <div className='lg:w-[70%] w-full'>
            <table className='w-full border'>
              <thead className='border-b bg-gray-50 md:table-header-group hidden'>
                <tr>
                  <th className='text-start p-3'>Product</th>
                  <th className='text-center p-3'>Price</th>
                  <th className='text-center p-3'>Quantity</th>
                  <th className='text-center p-3'>Total</th>
                  <th className='text-center p-3'>Action</th>
                </tr>
              </thead>
              <tbody>
                {cart.products.map(product => (
                  <tr key={product.variantId} className='md:table-row block border-b'>
                    <td className='p-3'>
                      <div className='flex items-center gap-5'>
                        <Image src={product.media || imgPlacceholder.src} height={60} width={60} alt={product.name} />
                        <div>
                          <h4 className='text-lg font-medium line-clamp-1'><Link href={WEBSITE_PRODUCT_DETAILS(product.url)}>{product.name}</Link></h4>
                          <p className='text-sm'>Color:{product.color}</p>
                          <p className='text-sm'>Size:{product.size}</p>
                        </div>
                      </div>
                    </td>
                    <td className='md:table-cell flex justify-between items-center md:p-3 px-3 pb-2 text-center'>
                      <span className='md:hidden font-medium'>Price</span>
                      <span>
                      {product.sellingPrice.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}

                      </span>
                      </td>
                    <td className='md:table-cell flex justify-between md:p-3 px-3 pb-2'>
                      <span className='md:hidden font-medium'>Quantity</span>
                      <div className='flex justify-center items-center'>
                        <div className='flex justify-center items-center md:h-10 h-7 border w-fit rounded-full'>
                          <button type="button" className='h-full w-10 flex justify-center items-center cursor-pointer' onClick={() => dispatch(decreaseQuantity({ productId: product.productId, variantId: product.variantId }))}>
                            <HiMinus />
                          </button>
                          <input type="text" value={product.qty} className='md:w-14 w-8 text-center border-none outline-offset-0' readOnly />
                          <button type="button" className='h-full w-10 flex justify-center items-center cursor-pointer' onClick={() => dispatch(increaseQuantity({ productId: product.productId, variantId: product.variantId }))}>
                            <HiPlus />
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className='md:table-cell flex justify-between md:p-3 px-3 pb-2 text-center'>
                      <span className='md:hidden font-medium'>Total</span>
                      {(product.sellingPrice*product.qty).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}

                    </td>
                    
                    <td className='md:table-cell flex justify-between md:p-3 px-3 pb-2 text-center'>
                      <span className='md:hidden font-medium'>Remove</span>
                      <button type='button' onClick={() => dispatch(removeFromCart({ productId: product.productId, variantId: product.variantId }))}>
                        <IoCloseCircleOutline className='text-red-500'/>
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className='lg:w-[30%] w-full'>
            <div className="rounded bg-gray-50 p-5 sticky top-5">
              <h4 className='text-lg font-semibold mb-5'>Order Summery</h4>
              <div>
                <table className="w-full">
                  <tbody>
                    <tr>
                      <td className='font-medium py-2'>Subtotal</td>
                      <td className='text-end py-2'>{Subtotal?.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
                    </tr>
                    <tr>
                      <td className='font-medium py-2'>Discount</td>
                      <td className='text-end py-2'>-{discount?.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
                    </tr>
                    <tr>
                      <td className='font-medium py-2'>Total</td>
                      <td className='text-end py-2'>{Subtotal?.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
                    </tr>
                  </tbody>
                </table>

                <Button type='button' asChild className='w-full bg-black mt-5 mb-3 rounded-full'>
                  <Link href={WEBSITE_CHECKOUT}>Proceed To Checkout</Link>
                </Button>
                <p className='text-center'>
                  <Link href={WEBSITE_SHOP} className='hover:underline'>Continue Shopping</Link>
                </p>
              </div>
            </div>
          </div>
        </div>

      }
    </div>
  )
}

export default CartPage