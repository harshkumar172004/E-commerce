'use client'
import WebsiteBreadcrumb from '@/components/Application/Website/WebsiteBreadcrumb'
import { Button } from '@/components/ui/button'
import useFetch from '@/hooks/useFetch'
import { WEBSITE_CHECKOUT, WEBSITE_ORDER_DETAILS, WEBSITE_PRODUCT_DETAILS, WEBSITE_SHOP } from '@/routes/WebsiteRoute'
import { addIntoCart, clearCart } from '@/store/reducer/cartReducer'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import imgPlacceholder from '@/public/assets/images/img-placeholder.webp'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { zodSchema } from '@/lib/zodSchema'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import ButtonLoading from '@/components/Application/ButtonLoading'
import { showToast } from '@/lib/showToast'
import axios from 'axios'
import { IoCloseCircleSharp } from 'react-icons/io5'
import { z } from 'zod'
import { FaShippingFast } from 'react-icons/fa'
import { Textarea } from '@/components/ui/textarea'
import { catchError } from '@/lib/helperFunction'
import Script from 'next/script'
import { useRouter } from 'next/navigation'
import Loading from '@/components/Application/Loading'
import loading from '@/public/assets/images/loading.svg'
const breadcrumb = {
  title: 'Checkout',
  links: [
    { label: 'Checkout', href: WEBSITE_CHECKOUT }
  ]
}

const Ckeckout = () => {
  const router = useRouter()
  const cart = useSelector(store => store.cartStore)
  const authStore = useSelector(store => store.authStore)
  const [verifiedCartData, setverifiedCartData] = useState([])
  const [isCouponApplied, setisCouponApplied] = useState(false)
  const [Subtotal, setSubtotal] = useState(0)
  const [discount, setdiscount] = useState(0)
  const [couponLoading, setcouponLoading] = useState(false)
  const [couponDiscountAmount, setcouponDiscountAmount] = useState(0)
  const [totalAmount, settotalAmount] = useState(0)
  const [couponCode, setcouponCode] = useState('')
  const [placingOrder, setplacingOrder] = useState(false)
  const [savingOrder, setsavingOrder] = useState(false)
  const dispatch = useDispatch()
  const { data: getVerifiedCartData } = useFetch(`/api/cart-verification`, 'POST', { data: cart.products })
  useEffect(() => {
    if (getVerifiedCartData && getVerifiedCartData.success) {
      const cartData = getVerifiedCartData.data
      setverifiedCartData(cartData)
      dispatch(clearCart())

      cartData.forEach(cartItem => {
        dispatch(addIntoCart(cartItem))
      });
    }
  }, [getVerifiedCartData])

  useEffect(() => {
    const cartProducts = cart.products
    const subTotalAmount = cartProducts.reduce((sum, product) => (
      sum + (product.sellingPrice * product.qty)
    ), 0)
    const discount = cartProducts.reduce((sum, product) => (
      sum + ((product.mrp - product.sellingPrice) * product.qty)
    ), 0)

    setSubtotal(subTotalAmount)
    setdiscount(discount)
    settotalAmount(subTotalAmount)

    couponForm.setValue('minShoppingAmount', subTotalAmount)



  }, [cart])

  //Coupon form 

  const couponFormSchema = zodSchema.pick({
    code: true,
    minShoppingAmount: true,
  })

  const couponForm = useForm({
    resolver: zodResolver(couponFormSchema),
    defaultValues: {
      code: "",
      minShoppingAmount: Subtotal,
    }
  })

  const applyCoupon = async (value) => {
    setcouponLoading(true)
    try {
      const { data: response } = await axios.post('/api/coupon/apply', value)
      if (!response.success) {
        throw new Error(response.message)
      }
      const discountPercentage = response.data.discountPercentage
      setcouponDiscountAmount((Subtotal * discountPercentage) / 100)
      settotalAmount(Subtotal - ((Subtotal * discountPercentage) / 100))

      showToast('success', response.message)
      setcouponCode(couponForm.getValues('code'))
      setisCouponApplied(true)
      couponForm.resetField('code', '')
    } catch (error) {
      showToast('error', error.message)
    } finally {
      setcouponLoading(false)
    }
  }

  const removeCoupon = () => {
    setisCouponApplied(false)
    setcouponCode('')
    setcouponDiscountAmount(0)
    settotalAmount(Subtotal)
  }

  // palce oreder 

  const orderFormSchema = zodSchema.pick({
    name: true,
    email: true,
    phone: true,
    country: true,
    state: true,
    city: true,
    pincode: true,
    landmark: true,
    ordernote: true,
  }).extend({
    userId: z.string().optional()
  })

  const orderForm = useForm({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      country: '',
      state: '',
      city: '',
      pincode: '',
      landmark: '',
      ordernote: '',
      userId: authStore?.auth?._id,
    }
  })

  useEffect(()=>{
    if(authStore){

      orderForm.setValue('userId',authStore?.auth?._id)
    }
  },[authStore])

  const getOrderId = async (amount) => {
    try {
      const { data: orderIdData } = await axios.post('/api/payment/get-order-id', { amount })
      if (!orderIdData.success) {
        throw new Error(orderIdData.message)
      }
      return { success: true, order_id: orderIdData.data }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  const placeOrder = async (formData) => {
    const generateOrderId = await getOrderId(totalAmount)
    setplacingOrder(true)
    try {
      if (!generateOrderId.success) {
        throw new Error(generateOrderId.message)
      }
      const order_id = generateOrderId.order_id

      const razOption = {
        "key": process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        "amount": totalAmount * 100,
        "currency": "INR",
        "name": "E-store",
        "description": "Payment of order",
        "image": "https://res.cloudinary.com/dg7efdu9o/image/upload/v1758265397/logo-black_mttqfd.webp",
        "order_id": order_id,
        "handler": async function (response) {
          setsavingOrder(true)
          const products = verifiedCartData.map((cartItem) => (
            {
              productId: cartItem.productId,
              variantId: cartItem.variantId,
              name: cartItem.name,
              qty: cartItem.qty,
              mrp: cartItem.mrp,
              sellingPrice: cartItem.sellingPrice,
            }
          ))

          const { data: paymentResponseData } = await axios.post('/api/payment/save-order', {
            ...formData,
            ...response,
            products: products,
            subtotal: Subtotal,
            discount: discount,
            couponDiscountAmount: couponDiscountAmount,
            totalAmount: totalAmount,
          })

          if (paymentResponseData.success) {
            showToast('success', paymentResponseData.message)
            dispatch(clearCart())
            orderForm.reset()
            router.push(WEBSITE_ORDER_DETAILS(response.razorpay_order_id))
            setsavingOrder(false)
          } else {
            showToast('error', paymentResponseData.message)
            setsavingOrder(false)
          }

        },
        "prefill": {
          "name": formData.name,
          "email": formData.email,
          "contact": formData.phone
        },

        "theme": {
          "color": "#7c9aed"
        }
      }

      const rzp = new Razorpay(razOption)
      rzp.on('payment.failed', function (response) {
        showToast('error', response.error.description)
      });

      rzp.open()

    } catch (error) {
      showToast('error', error.message)
    } finally {
      setplacingOrder(false)
    }
  }


  return (
    <div>
      {savingOrder &&
        <div className='h-screen w-screen fixed top-0 left-0 z-50 bg-black/20'>
          <div className='h-screen flex items-center justify-center '>
          <Image src={loading.src} height={80} width={80} alt='loading'/>
          <h4 className='font-semibold'>Order Confirming...</h4>

          </div>
        </div>}
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
          <div className='lg:w[40%] w-full'>
            <div className='flex font-semibold gap-2 items-center'>
              <FaShippingFast size={25} /> Shipping Address:
            </div>
            <div className='mt-5'>
              <Form {...orderForm}>
                <form className='grid grid-cols-2 gap-5' onSubmit={orderForm.handleSubmit(placeOrder)}>
                  <div className='mb-3'>
                    <FormField
                      control={orderForm.control}
                      name='name'
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Name*"  {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    >

                    </FormField>
                  </div>
                  <div className='mb-3'>
                    <FormField
                      control={orderForm.control}
                      name='email'
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type='email' placeholder="E-mail*"  {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    >

                    </FormField>
                  </div>
                  <div className='mb-3'>
                    <FormField
                      control={orderForm.control}
                      name='phone'
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Phone*"  {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    >

                    </FormField>
                  </div>
                  <div className='mb-3'>
                    <FormField
                      control={orderForm.control}
                      name='country'
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Country*"  {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    >

                    </FormField>
                  </div>
                  <div className='mb-3'>
                    <FormField
                      control={orderForm.control}
                      name='state'
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="State*"  {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    >

                    </FormField>
                  </div>
                  <div className='mb-3'>
                    <FormField
                      control={orderForm.control}
                      name='city'
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="City*"  {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    >

                    </FormField>
                  </div>
                  <div className='mb-3'>
                    <FormField
                      control={orderForm.control}
                      name='pincode'
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Pincode*"  {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    >

                    </FormField>
                  </div>
                  <div className='mb-3'>
                    <FormField
                      control={orderForm.control}
                      name='landmark'
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Landmark*"  {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    >

                    </FormField>
                  </div>
                  <div className='mb-3 col-span-2'>
                    <FormField
                      control={orderForm.control}
                      name='ordernote'
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea placeholder="Enter order note (optional)" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    >

                    </FormField>
                  </div>

                  <div className='mb-3'>
                    <ButtonLoading type="submit" text="Place Order" loading={placingOrder} className='bg-black rounded-full p-5 cursor-pointer' />
                  </div>
                </form>
              </Form>
            </div>
          </div>
          <div className='lg:w-[60%] w-full'>
            <div className="rounded bg-gray-50 p-5 sticky top-5">
              <h4 className='text-lg font-semibold mb-5'>Order Summery</h4>
              <div>
                <div className='h-40 overflow-auto border'>
                  <table className='w-full '>
                    <tbody className=''>
                      {verifiedCartData && verifiedCartData?.map(product => (
                        <tr key={product.variantId}>
                          <td className="p-3">
                            <div className="flex items-center gap-5">
                              <Image src={product.media} height={60} width={60} alt={product.name} className='rounded' />
                              <div>
                                <h4 className='font-medium line-clamp-1'>
                                  <Link href={WEBSITE_PRODUCT_DETAILS(product.url)}>{product.name}</Link>
                                </h4>
                                <p className='sm:text-sm text-[12px]'>Color:{product.color}</p>
                                <p className='sm:text-sm text-[12px]'>Size:{product.size}</p>
                              </div>
                            </div>
                          </td>
                          <td className='p-3 text-center'>
                            <p className="text-nowrap sm:text-sm text-[12px]">
                              {product.qty} X {product.sellingPrice.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                            </p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <table className="w-full">
                  <tbody>
                    <tr>
                      <td className='font-medium py-2'>Subtotal</td>
                      <td className='text-end py-2'>
                        {Subtotal.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                      </td>
                    </tr>
                    <tr>
                      <td className='font-medium py-2'>Discount</td>
                      <td className='text-end py-2'>
                        -{discount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                      </td>
                    </tr>
                    <tr>
                      <td className='font-medium py-2'>Coupon Discount</td>
                      <td className='text-end py-2'>
                        -{couponDiscountAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                      </td>
                    </tr>
                    <tr>
                      <td className='font-medium py-2 text-xl'>Total</td>
                      <td className='text-end py-2'>
                        {totalAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div className='mt-2 mb-5'>
                  {!isCouponApplied
                    ?
                    <Form {...couponForm}>
                      <form className='flex justify-between gap-5' onSubmit={couponForm.handleSubmit(applyCoupon)}>
                        <div className='w-[calc(100%-100px)]'>
                          <FormField
                            control={couponForm.control}
                            name='code'
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input placeholder="Enter coupon code"  {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          >

                          </FormField>
                        </div>
                        <div className='w-[100px]'>
                          <ButtonLoading type='submit' text="Apply" className="w-full cursor-pointer" loading={couponLoading} />
                        </div>
                      </form>
                    </Form>
                    :
                    <div className='flex justify-between py-1 px-5 rounded-lg bg-gray-200'>
                      <div>
                        <span className='text-xs'>Coupon:</span>
                        <p className='text-sm font-semibold'>{couponCode}</p>
                      </div>
                      <button type='button' className='text-red-500 cursor-pointer' onClick={removeCoupon}>
                        <IoCloseCircleSharp size={25} />
                      </button>

                    </div>
                  }

                </div>
              </div>
            </div>
          </div>
        </div>

      }

      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
    </div>
  )
}

export default Ckeckout