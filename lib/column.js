import { Chip } from "@mui/material"
import dayjs from "dayjs"
import userIcon from "@/public/assets/images/user.png"
import { Avatar, AvatarImage } from "@/components/ui/avatar"

export const DT_CATEGORY_COLUMNS = [
    {
        accessorKey: 'name',
        header: 'Category Name',
    },
    {
        accessorKey: 'slug',
        header: 'Slug',
    },
]
export const DT_PRODUCT_COLUMNS = [
    {
        accessorKey: 'name',
        header: 'Product Name',
    },
    {
        accessorKey: 'slug',
        header: 'Slug',
    },
    {
        accessorKey: 'category',
        header: 'Category',
    },
    {
        accessorKey: 'mrp',
        header: 'MRP',
    },
    {
        accessorKey: 'sellingPrice',
        header: 'Selling price',
    },
    {
        accessorKey: 'discountPercentage',
        header: 'discount Percentage',
    },

]

export const DT_PRODUCT_VARIANT_COLUMNS = [
    {
        accessorKey: 'product',
        header: 'Product Name',
    },
    {
        accessorKey: 'color',
        header: 'Color',
    },
    {
        accessorKey: 'size',
        header: 'Size',
    },
    {
        accessorKey: 'sku',
        header: 'SKU',
    },
    {
        accessorKey: 'mrp',
        header: 'MRP',
    },
    {
        accessorKey: 'sellingPrice',
        header: 'Selling price',
    },
    {
        accessorKey: 'discountPercentage',
        header: 'discount Percentage',
    },

]
export const DT_COUPON_COLUMNS = [
    {
        accessorKey: 'code',
        header: 'Code',
    },
    {
        accessorKey: 'discountPercentage',
        header: 'discount Percentage',
    },
    {
        accessorKey: 'minShoppingAmount',
        header: 'Min-Shopping Amount',
    },
    {
        accessorKey: 'validity',
        header: 'Validity',
        Cell: ({ renderedCellValue }) => (
            new Date() > new Date(renderedCellValue) ? <Chip color="error" label={dayjs(renderedCellValue).format('DD/MM/YYYY')} /> : <Chip color="success" label={dayjs(renderedCellValue).format('DD/MM/YYYY')} />
        )
    },


]
export const DT_CUSTOMERS_COLUMNS = [
    {
        accessorKey: 'avater',
        header: 'Avater',
        Cell: ({ renderedCellValue }) => (
            <Avatar>
                <AvatarImage src={renderedCellValue?.url || userIcon.src} />
            </Avatar>
        )
    },
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'email',
        header: 'Email',
    },
    {
        accessorKey: 'phone',
        header: 'Phone',
    },
    {
        accessorKey: 'address',
        header: 'Address',
    },
    {
        accessorKey: 'isEmailVarified',
        header: 'Is Verified',
        Cell: ({ renderedCellValue }) => (
            renderedCellValue ? <Chip color="success" label="Verified" /> : <Chip color="error" label="not Verified" />
        )
    },


]
export const DT_REVIEW_COLUMNS = [
    
    {
        accessorKey: 'product',
        header: 'Product',
    },
    {
        accessorKey: 'user',
        header: 'User',
    },
    {
        accessorKey: 'title',
        header: 'Title',
    },
    {
        accessorKey: 'rating',
        header: 'Rating',
    },
    {
        accessorKey: 'review',
        header: 'Review',
    },
]
export const DT_ORDER_COLUMNS = [
    
    {
        accessorKey: 'order_id',
        header: 'Order ID',
    },
    {
        accessorKey: 'payment_id',
        header: 'Payment ID',
    },
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'email',
        header: 'Email',
    },
    {
        accessorKey: 'phone',
        header: 'Phone',
    },
    {
        accessorKey: 'country',
        header: 'Country',
    },
    {
        accessorKey: 'state',
        header: 'State',
    },
    {
        accessorKey: 'city',
        header: 'City',
    },
    {
        accessorKey: 'pincode',
        header: 'Pincode',
    },
    {
        accessorKey: 'totalItem',
        header: 'Total Item',
        Cell:({renderedCellValue,row})=> (<span>{row?.original?.products?.length|| 0}</span>)
    },
    {
        accessorKey: 'subtotal',
        header: 'Subtotal',
    },
    {
        accessorKey: 'discount',
        header: 'Discount',
        Cell:({renderedCellValue})=> (<span>{Math.round(renderedCellValue)}</span>)
    },
    {
        accessorKey: 'couponDiscountAmount',
        header: 'Coupon Discount',
    },
    {
        accessorKey: 'totalAmount',
        header: 'Total Amount',
    },
    {
        accessorKey: 'status',
        header: 'Status',
    },
]