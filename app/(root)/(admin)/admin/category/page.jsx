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
import { DT_CATEGORY_COLUMNS } from '@/lib/column'
import { columnConfig } from '@/lib/helperFunction'
import { showToast } from '@/lib/showToast'
import { zodSchema } from '@/lib/zodSchema'
import { ADMIN_CATEGORY_ADD, ADMIN_CATEGORY_EDIT, ADMIN_CATEGORY_SHOW, ADMIN_DASHBOARD, ADMIN_TRASH } from '@/routes/AdminPanelRoute'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import Link from 'next/link'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { FiPlus } from 'react-icons/fi'
import slugify from 'slugify'
const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: 'Home' },
  { href: ADMIN_CATEGORY_SHOW, label: 'Category' },
  // { href: '', label: 'Add Category' },
]

const ShowCategory = () => {

  const columns = useMemo (()=>{
    return columnConfig(DT_CATEGORY_COLUMNS)
  },[])

  const action = useCallback((row,deleteType,handleDelete)=>{
    let actionMenu = []
    actionMenu.push(<EditAction key="edit" href={ADMIN_CATEGORY_EDIT(row.original._id)}/>)
    actionMenu.push(<DeleteAction key="delete" handleDelete={handleDelete} row={row} deleteType={deleteType}/>)
    return actionMenu
  },[])

  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />

      <Card className='py-0 rounded shadow-sm gap-0'>
        <CardHeader className="pt-3 px-3 border-b [.border-b]:pb-2">
          <div className='flex items-center justify-between'>
            <h4 className='font-semibold text-xl'>Show Category</h4>
            <Button>
              <FiPlus />
              <Link href={ADMIN_CATEGORY_ADD}>New Category</Link>
            </Button>
          </div>

        </CardHeader>
        <CardContent className="pb-5 px-0">
          <DatatableWrapper
            queryKey="category-data"
            fetchUrl="/api/category"
            initialPageSize={10}
            columnsConfig={columns}
            exportEndpoint="/api/category/export"
            deleteEndpoint="/api/category/delete"
            deleteType="SD"
            trashView={`${ADMIN_TRASH}?trashof=category`}
            createAction={action}
          />


        </CardContent>
      </Card>
    </div>
  )
}

export default ShowCategory