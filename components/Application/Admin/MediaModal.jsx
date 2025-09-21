import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query'
import axios from 'axios'
import Image from 'next/image'
import React, { useState } from 'react'
import Loading from '../Loading'
import ModalMediaBlock from './ModalMediaBlock'
import { showToast } from '@/lib/showToast'
import loading from '@/public/assets/images/loading.svg'
import ButtonLoading from '../ButtonLoading'

const MediaModal = ({ open, setopen, selectedMedia, setsetselectedMedia, isMultiple }) => {

    const [previouslySelected, setpreviouslySelected] = useState([])

    const fetchMedia = async (page) => {
        const { data: response } = await axios.get(`/api/media?page=${page}&&limit=18&&deleteType=SD`)
        return response
    }

    const { isPending, isError, error, data, isFetching, fetchNextPage, hasNextPage } = useInfiniteQuery({
        queryKey: ['MediaModal'],
        queryFn: async ({ pageParam }) => await fetchMedia(pageParam),
        placeholderData: keepPreviousData,
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            const nextPage = allPages.length
            return lastPage.hasMore ? nextPage : undefined
        }

    })

    const handleClear = () => {
        setsetselectedMedia([])
        setpreviouslySelected([])
        showToast('success', 'Cleared all selected media')
    }
    const handleClose = () => {
        setsetselectedMedia(previouslySelected)
        setopen(false)

    }
    const handleSelect = () => {
        if (selectedMedia.length <= 0) {
            return showToast('error', 'Please select at least one media')
        }
        setpreviouslySelected(selectedMedia)
        setopen(false)

    }
    return (
        <Dialog open={open} onOpenChange={() => setopen(!open)}>
            <DialogContent onInteractOutside={(e) => e.preventDefault()} className="sm:max-w-[80%] h-screen p-0 py-10 bg-transparent border-0 shadow-none">
                <DialogDescription className="hidden"></DialogDescription>
                <div className='h-[90vh] bg-white dark:bg-card p-3 rounded shadow'>

                    <DialogHeader className='h-8 border-b'>
                        <DialogTitle>Media Selection</DialogTitle>
                    </DialogHeader>

                    <div className='h-[calc(100%-80px)] overflow-auto py-2'>
                        {isPending ?
                            (<div className='size-full flex justify-center items-center'>
                                <Image src={loading.src} height={80} width={80} alt='loading' />
                            </div>)
                            :
                            isError ?
                                <div className='size-full flex justify-center items-center'>
                                    <span className='text-red-600'>{error.message}</span>
                                </div>
                                :
                                <>
                                    <div className='grid lg:grid-cols-6 grid-cols-3 gap-2'>
                                        {
                                            data?.pages?.map((page, index) => (
                                                <React.Fragment key={index}>
                                                    {
                                                        page?.mediaData?.map((media) => (
                                                            <ModalMediaBlock
                                                                key={media._id}
                                                                media={media}
                                                                selectedMedia={selectedMedia}
                                                                setSelectedMedia={setsetselectedMedia}
                                                                isMultiple={isMultiple}
                                                            />
                                                        ))
                                                    }

                                                </React.Fragment>
                                            ))
                                        }
                                    </div>
                                    {hasNextPage ?
                                        <div className='flex justify-center py-5'>
                                            <ButtonLoading type="button" onClick={() => fetchNextPage()} loading={isFetching} text="Load More" />
                                        </div>
                                        :
                                        <p className='text-center py-5'>Nothing more to load.</p>
                                    }
                                </>
                        }
                    </div>
                    <div className="h-10 pt-3 border-t flex justify-between ">
                        <div>
                            <Button type="button" variant='destructive' onClick={handleClear}>Clear all</Button>
                        </div>
                        <div className="flex gap-5" >
                            <Button type="button" variant="secondary" onClick={handleClose}>Close</Button>
                            <Button type="button" onClick={handleSelect}>Select</Button>

                        </div>
                    </div>

                </div>
            </DialogContent>
        </Dialog>
    )
}

export default MediaModal