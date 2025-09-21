// import React from 'react'
'use client'
import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import DatatableWrapper from '@/components/Application/Admin/DatatableWrapper'
import DeleteAction from '@/components/Application/Admin/DeleteAction'
import EditAction from '@/components/Application/Admin/EditAction'
import ButtonLoading from '@/components/Application/ButtonLoading'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { DT_CATEGORY_COLUMNS, DT_COUPON_COLUMNS, DT_CUSTOMERS_COLUMNS, DT_ORDER_COLUMNS, DT_PRODUCT_COLUMNS, DT_PRODUCT_VARIANT_COLUMNS, DT_REVIEW_COLUMNS } from '@/lib/column'
import { columnConfig } from '@/lib/helperFunction'
import { showToast } from '@/lib/showToast'
import { zodSchema } from '@/lib/zodSchema'
import { ADMIN_CATEGORY_ADD, ADMIN_CATEGORY_EDIT, ADMIN_CATEGORY_SHOW, ADMIN_DASHBOARD, ADMIN_TRASH } from '@/routes/AdminPanelRoute'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { FiPlus } from 'react-icons/fi'
import slugify from 'slugify'
const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: 'Home' },
  { href: ADMIN_TRASH, label: 'Trash' },
  // { href: '', label: 'Add Category' },
]

const TRASH_CONFIG = {
  category:{
    title:'Category Trash',
    columns:DT_CATEGORY_COLUMNS,
    fetchUrl:'/api/category',
    exportUrl:'/api/category/export',
    deleteUrl:'/api/category/delete',
  },
  product:{
    title:'Product Trash',
    columns:DT_PRODUCT_COLUMNS,
    fetchUrl:'/api/product',
    exportUrl:'/api/product/export',
    deleteUrl:'/api/product/delete',
  },
  "product-variant":{
    title:'Product Variant Trash',
    columns:DT_PRODUCT_VARIANT_COLUMNS,
    fetchUrl:'/api/product-variant',
    exportUrl:'/api/product-variant/export',
    deleteUrl:'/api/product-variant/delete',
  },
  coupon:{
    title:'Coupon Trash',
    columns:DT_COUPON_COLUMNS,
    fetchUrl:'/api/coupon',
    exportUrl:'/api/coupon/export',
    deleteUrl:'/api/coupon/delete',
  },
  customers:{
    title:'Customers Trash',
    columns:DT_CUSTOMERS_COLUMNS,
    fetchUrl:'/api/customers',
    exportUrl:'/api/customers/export',
    deleteUrl:'/api/customers/delete',
  }
  ,
  review:{
    title:'Review Trash',
    columns:DT_REVIEW_COLUMNS,
    fetchUrl:'/api/review',
    exportUrl:'/api/review/export',
    deleteUrl:'/api/review/delete',
  },
  orders:{
    title:'Orders Trash',
    columns:DT_ORDER_COLUMNS,
    fetchUrl:'/api/orders',
    exportUrl:'/api/orders/export',
    deleteUrl:'/api/orders/delete',
  }
}

const Trash = () => {

  const searchParams = useSearchParams()
  const trashOf = searchParams.get('trashof')

  const config = TRASH_CONFIG[trashOf]


  const columns = useMemo (()=> {
    return columnConfig(config.columns ,false , false , true)
  }, [])

  const action = useCallback((row,deleteType,handleDelete)=>{
    return [<DeleteAction key="delete" handleDelete={handleDelete} row={row} deleteType={deleteType}/>]
  },[])

  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />

      <Card className='py-0 rounded shadow-sm gap-0'>
        <CardHeader className="pt-3 px-3 border-b [.border-b]:pb-2">
          <div className='flex items-center justify-between'>
            <h4 className='font-semibold text-xl'>{config.title}</h4>
           
          </div>

        </CardHeader>
        <CardContent className="pb-5 px-0">
          <DatatableWrapper
            queryKey={`${trashOf}-data-deleted`}
            fetchUrl={config.fetchUrl}
            initialPageSize={10}
            columnsConfig={columns}
            exportEndpoint={config.exportUrl}
            deleteEndpoint={config.deleteUrl}
            deleteType="PD"
            createAction={action}
          />


        </CardContent>
      </Card>
    </div>
  )
}

export default Trash