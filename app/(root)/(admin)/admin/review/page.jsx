'use client'
import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import DatatableWrapper from '@/components/Application/Admin/DatatableWrapper'
import DeleteAction from '@/components/Application/Admin/DeleteAction'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {  DT_review_COLUMNS, DT_REVIEW_COLUMNS} from '@/lib/column'
import { columnConfig } from '@/lib/helperFunction'
import {  ADMIN_DASHBOARD, ADMIN_TRASH } from '@/routes/AdminPanelRoute'
import React, { useCallback,useMemo} from 'react'
const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: 'Home' },
  { href: '', label: 'Review' },
]

const ShowReview = () => {

  const columns = useMemo (()=>{
    return columnConfig(DT_REVIEW_COLUMNS)
  },[])

  const action = useCallback((row,deleteType,handleDelete)=>{
    let actionMenu = []
    actionMenu.push(<DeleteAction key="delete" handleDelete={handleDelete} row={row} deleteType={deleteType}/>)
    return actionMenu
  },[])

  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />

      <Card className='py-0 rounded shadow-sm gap-0'>
        <CardHeader className="pt-3 px-3 border-b [.border-b]:pb-2">
          <div className='flex items-center justify-between'>
            <h4 className='font-semibold text-xl'>review</h4>
          </div>

        </CardHeader>
        <CardContent className="pb-5 px-0">
          <DatatableWrapper
            queryKey="review-data"
            fetchUrl="/api/review"
            initialPageSize={10}
            columnsConfig={columns}
            exportEndpoint="/api/review/export"
            deleteEndpoint="/api/review/delete"
            deleteType="SD"
            trashView={`${ADMIN_TRASH}?trashof=review`}
            createAction={action}
          />


        </CardContent>
      </Card>
    </div>
  )
}

export default ShowReview