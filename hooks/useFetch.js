// "use client"
import axios from "axios"
import { useEffect, useMemo, useState } from "react"



const useFetch = (url, method = "GET", options = {}) => {
    const [data, setdata] = useState(null)
    const [loading, setloading] = useState(false)
    const [error, seterror] = useState(null)
    const [refreshIndex, setrefreshIndex] = useState(0)

    const optionsString = JSON.stringify(options)
    const requestOptions = useMemo(() => {
        const opts = { ...options }
        if (method === 'POST' && !opts.data) {
            opts.data = {}
        }
        return opts
    }, [method, optionsString])

    useEffect(() => {
        const apiCall = async () => {
            setloading(true)
            seterror(null)
            try {
                const { data: response } = await axios({
                    url,
                    method,
                    ...(requestOptions)
                })

                if (!response.success) {
                    throw new Error(response.message)
                }
                setdata(response)

            } catch (error) {
                seterror(error.message)
            } finally {
                setloading(false)
            }
        }

        apiCall()

    }, [url, refreshIndex, requestOptions])

    const refetch = () => {
        setrefreshIndex(prev => prev + 1)
    }

    return { data, loading, error, refetch }

}

export default useFetch