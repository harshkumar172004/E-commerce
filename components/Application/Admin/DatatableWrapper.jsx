'use client'

import { ThemeProvider } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Datatable from './Datatable'
import { useTheme } from 'next-themes'
import { darkTheme, lightTheme } from '@/lib/materialTheme'

const DatatableWrapper = ({
  queryKey,
  fetchUrl,
  columnsConfig,
  intialPageSize = 10,
  exportEndpoint,
  deleteEndpoint,
  deleteType,
  trashView,
  createAction
}) => {

  const { resolvedTheme } = useTheme()
  const [mounted, setmounted] = useState(false)
  useEffect(() => {
    setmounted(true)
  }, [])

  if (!mounted) return null

  return (
    <ThemeProvider theme={resolvedTheme === 'dark' ? darkTheme : lightTheme}>
      <Datatable
        queryKey={queryKey}
        fetchUrl={fetchUrl}
        columnsConfig={columnsConfig}
        intialPageSize={intialPageSize}
        exportEndpoint={exportEndpoint}
        deleteEndpoint={deleteEndpoint}
        deleteType={deleteType}
        trashView={trashView}
        createAction={createAction}
      />
    </ThemeProvider>
  )
}

export default DatatableWrapper