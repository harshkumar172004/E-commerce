export const ADMIN_DASHBOARD = '/admin/dashboard'


export const ADMIN_MEDIA_SHOW = '/admin/media'
export const ADMIN_MEDIA_EDIT = (id) => id ? `/admin/media/edit/${id}` : ''


export const ADMIN_CATEGORY_ADD = '/admin/category/add'
export const ADMIN_CATEGORY_SHOW = '/admin/category'
export const ADMIN_CATEGORY_EDIT = (id) => id ? `/admin/category/edit/${id}` : ''


export const ADMIN_PRODUCT_ADD = '/admin/product/add'
export const ADMIN_PRODUCT_SHOW = '/admin/product'
export const ADMIN_PRODUCT_EDIT = (id) => id ? `/admin/product/edit/${id}` : ''


export const ADMIN_PRODUCT_VARIANT_ADD = '/admin/product-variant/add'
export const ADMIN_PRODUCT_VARIANT_SHOW = '/admin/product-variant'
export const ADMIN_PRODUCT_VARIANT_EDIT = (id) => id ? `/admin/product-variant/edit/${id}` : ''


export const ADMIN_COUPON_ADD = '/admin/coupon/add'
export const ADMIN_COUPON_SHOW = '/admin/coupon'
export const ADMIN_COUPON_EDIT = (id) => id ? `/admin/coupon/edit/${id}` : ''

export const ADMIN_CUSTOMARS_SHOW = '/admin/customers'


export const ADMIN_REVIEW_SHOW = '/admin/review'

export const ADMIN_ORDER_SHOW = '/admin/orders'
export const ADMIN_ORDER_DETAILS = (order_id) => order_id ? `/admin/orders/details/${order_id}` : ''


export const ADMIN_TRASH = '/admin/trash'