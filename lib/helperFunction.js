
import { NextResponse } from "next/server"

export const response = (success, statusCode, message, data = {}) => {
    return NextResponse.json({
        success,
        statusCode,
        message,
        data
    }

    )
}

export const catchError = (error, customMessage) => {
    // hendling duplicate error

    if (error.code === 11000) {
        const keys = Object.keys(error.keyPattern).join(', ');
        error.message = `Duplicate key error: ${keys} already exists.`;
    }

    let errorObj = {}

    if (process.env.NODE_ENV === 'development') {
        errorObj = {
            message: error.message,
            error
        }
    } else {
        errorObj = {
            message: customMessage || 'An error occurred. Please try again later.',

        }
    }


    // console.error('Error:', error);
    return NextResponse.json({
        success: false,
        statusCode: error.code,
        ...errorObj,
    })

}

export const generateOTP = () => {
    const otp = "123456" // Generate a 6-digit OTP
    // const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
    return otp;
}



export const columnConfig = (column, isCreatedAt = false, isUpdatedAt = false, isdeletedAt = false) => {
    const newColumn = [...column];

    if (isCreatedAt) {
        newColumn.push({
            accessorKey: 'createdAt',
            header: 'Created At',
            Cell: ({ renderedCellValue }) => (new Date(renderedCellValue)).toLocaleString()
        });
    }
    if (isUpdatedAt) {
        newColumn.push({
            accessorKey: 'updatedAt',
            header: 'Updated At',
            Cell: ({ renderedCellValue }) => (new Date(renderedCellValue)).toLocaleString()
        });
    }
    if (isdeletedAt) {
        newColumn.push({
            accessorKey: 'deletedAt',
            header: 'Deleted At',
            Cell: ({ renderedCellValue }) => (new Date(renderedCellValue)).toLocaleString()
        });
    }

    return newColumn;
}

export const statusBadge = (status) =>{
    const statusColorCongfig = {
        pending:'bg-blue-500',
        processing:'bg-yellow-500',
        shipped:'bg-cyan-500',
        delivered:'bg-green-500',
        cancelled:'bg-red-500',
        unverified:'bg-orange-500',
    }
    return <span className={`${statusColorCongfig[status]} capitalize px-3 py-1 rounded-full text-xs`}>{status}</span>
}