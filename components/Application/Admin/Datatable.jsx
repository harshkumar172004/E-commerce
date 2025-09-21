import { IconButton, Tooltip } from '@mui/material'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { MaterialReactTable, MRT_ShowHideColumnsButton, MRT_ToggleDensePaddingButton, MRT_ToggleFiltersButton, MRT_ToggleFullScreenButton, MRT_ToggleGlobalFilterButton, useMaterialReactTable } from 'material-react-table'
import Link from 'next/link'
import React, { useState } from 'react'
import RecyclingIcon from '@mui/icons-material/Recycling';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import useDeleteMutation from '@/hooks/useDeleteMutation'
import ButtonLoading from '../ButtonLoading'
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import { showToast } from '@/lib/showToast'
import { download, generateCsv, mkConfig } from 'export-to-csv'
import axios from 'axios'

const Datatable = ({
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
    // filter , sorting and pagination states
    const [columnFilters, setcolumnFilters] = useState([])
    const [globalFilter, setglobalFilter] = useState('')
    const [sorting, setsorting] = useState([])
    const [pagination, setpagination] = useState({
        pageIndex: 0,
        pageSize: intialPageSize
    })

    // row selection state 
    const [rowSelection, setrowSelection] = useState({})
    // exportLoading state 
    const [exportLoading, setexportLoading] = useState(false)

    // handle delete method 
    const deletemutation = useDeleteMutation(queryKey, deleteEndpoint)

    const handleDelete = (ids, deleteType) => {
        let c = true
        if (deleteType === 'PD') {
            c = confirm('Are you sure you want to delete the data permanently')
        } else {
            c = confirm('Are you sure you want to move data into trash bin')
        }

        if (c) {
            deletemutation.mutate({ ids, deleteType })
            setrowSelection({})

        }


    }

    // export method 

    const handleExport = async (selectedRows) => {
        setexportLoading(true)
        try {
            const csvConfig = mkConfig({
                fieldSeparator: ',',
                decimalSeparator: '.',
                useKeysAsHeaders: true,
                filename: 'export-data',
            })

            let csv

            if (Object.keys(rowSelection).length > 0) {
                const rowData = selectedRows.map((row) => row.original)
                csv = generateCsv(csvConfig)(rowData)
            } else {
                // export all data 
                const { data: response } = await axios.get(exportEndpoint)
                if (!response.success) {
                    throw new Error(response.message)
                }

                const rowData = response.data
                csv = generateCsv(csvConfig)(rowData)
            }

            download(csvConfig)(csv)


        } catch (error) {
            // ge
            // console.log(error)
            showToast('error', error.message)

        } finally {
            setexportLoading(false)
        }
    }



    // Data fetching state

    const {
        data: { data = [], meta } = {},
        isError,
        isRefetching,
        isLoading
    } = useQuery({
        queryKey: [queryKey, { columnFilters, globalFilter, pagination, sorting }],
        queryFn: async () => {
            const url = new URL(fetchUrl, process.env.NEXT_PUBLIC_BASE_URL)
            url.searchParams.set('start', `${pagination.pageIndex * pagination.pageSize}`)
            url.searchParams.set('size', `${pagination.pageSize}`);
            url.searchParams.set('filters', JSON.stringify(columnFilters ?? []));
            url.searchParams.set('globalFilter', globalFilter ?? '');
            url.searchParams.set('sorting', JSON.stringify(sorting ?? []));
            url.searchParams.set('deleteType',deleteType);

            const { data: response } = await axios.get(url.href)
            return response
        },

        placeholderData: keepPreviousData,
    })


    // init table

    const table = useMaterialReactTable({
        columns: columnsConfig,
        data,
        enableRowSelection: true,
        columnFilterDisplayMode: 'popover',
        paginationDisplayMode: 'pages',
        enableColumnOrdering: true,
        enableStickyHeader: true,
        enableStickyFooter: true,
        initialState: { showColumnFilters: true },
        manualFiltering: true,
        manualPagination: true,
        manualSorting: true,
        muiToolbarAlertBannerProps: isError
            ? {
                color: 'error',
                children: 'Error loading data',
            }
            : undefined,
        onColumnFiltersChange: setcolumnFilters,
        onGlobalFilterChange: setglobalFilter,
        onPaginationChange: setpagination,
        onSortingChange: setsorting,
        rowCount:meta?.totalRowCount ?? 0,
        onRowSelectionChange: setrowSelection,
        state: {
            columnFilters,
            globalFilter,
            isLoading,
            pagination,
            showAlertBanner: isError,
            showProgressBars: isRefetching,
            sorting,
            rowSelection,
        },

        getRowId: (originalRow) => originalRow._id,

        renderToolbarInternalActions: ({ table }) => (
            <>
                {/* built in buttons */}
                
                <MRT_ToggleGlobalFilterButton table={table} />
                <MRT_ShowHideColumnsButton table={table} />
                <MRT_ToggleFullScreenButton table={table} />
                <MRT_ToggleDensePaddingButton table={table} />

                {deleteType !== 'PD'

                    &&

                    <Tooltip title='Recycle Bin'>
                        <Link href={trashView}>
                            <IconButton>
                                <RecyclingIcon />
                            </IconButton>
                        </Link>
                    </Tooltip>
                }

                {deleteType === 'SD'
                    &&
                    <Tooltip title='Delete All'>
                        <IconButton disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()} onClick={() => handleDelete(Object.keys(rowSelection), deleteType)}>
                            <DeleteIcon />
                        </IconButton>

                    </Tooltip>
                }
                {deleteType === 'PD'
                    &&
                    <>
                        <Tooltip title='Restore Data'>
                            <IconButton disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()} onClick={() => handleDelete(Object.keys(rowSelection), 'RSD')}>
                                <RestoreFromTrashIcon />
                            </IconButton>

                        </Tooltip>
                        <Tooltip title='permentaly Delete'>
                            <IconButton disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()} onClick={() => handleDelete(Object.keys(rowSelection), deleteType)}>
                                <DeleteForeverIcon />
                            </IconButton>

                        </Tooltip>

                    </>
                }
            </>
        ),

        enableRowActions: true,
        positionActionsColumn: 'last',
        renderRowActionMenuItems: ({ row }) => createAction(row, deleteType,handleDelete),

        renderTopToolbarCustomActions: ({ table }) => (
            <Tooltip>
                <ButtonLoading
                    type={"button"}
                    text={<> Export <SaveAltIcon /></>}
                    loading={exportLoading}
                    onClick={() => handleExport(table.getSelectedRowModel().rows)}
                />

            </Tooltip>
        )


    })
    return (
        <MaterialReactTable table={table} />
    )
}

export default Datatable