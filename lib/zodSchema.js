import { z } from "zod";

export const zodSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(32, { message: "Password must not exceed 32 characters" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^a-zA-Z0-9]/, { message: "Password must contain at least one special character" }),


  name: z
    .string()
    .min(1, { message: "Name is required" })
    .regex(/^[A-Za-z\s]+$/, { message: "Name can only contain letters and spaces" }),

  otp: z.string().regex(/^\d{6}$/, {
    message: "OTP must be exactly 6 digits",
  }),
  _id: z.string().min(3, '_id is required'),
  alt: z.string().min(3, 'alt is required'),
  title: z.string().min(3, 'title is required'),
  slug: z.string().min(3, 'slug is required'),
  category: z.string().min(3, 'category is required'),
  mrp: z.union([
    z.number().positive('mrp must be a positive number'),
    z.string().transform((val) => Number(val)).refine((val) => !isNaN(val) && val > 0, { message: 'mrp must be a positive number' })
  ]),
  sellingPrice: z.union([
    z.number().positive('mrp must be a positive number'),
    z.string().transform((val) => Number(val)).refine((val) => !isNaN(val) && val > 0, { message: 'mrp must be a positive number' })
  ]),
  discountPercentage: z.union([
    z.number().positive('mrp must be a positive number'),
    z.string().transform((val) => Number(val)).refine((val) => !isNaN(val) && val > 0, { message: 'mrp must be a positive number' })
  ]),
  description: z.string().min(3, 'description is required'),
  media: z.array(z.string()).min(1, { message: "At least one media item is required" }),
  product: z.string().min(3, "Product name is required"),
  sku: z.string().min(1, "SKU is required"),
  color: z.string().min(1, "Color is required"),
  size: z.string().min(1, "Size is required"),
  code: z.string().min(1, "Code is required"),
  minShoppingAmount: z.union([
    z.number().positive('mrp must be a positive number'),
    z.string().transform((val) => Number(val)).refine((val) => !isNaN(val) && val > 0, { message: 'mrp must be a positive number' })
  ]),
  amount: z.union([
    z.number().positive('mrp must be a positive number'),
    z.string().transform((val) => Number(val)).refine((val) => !isNaN(val) && val > 0, { message: 'mrp must be a positive number' })
  ]),
  validity: z.coerce.date(),
  userId: z.string().min(3, "user is required"),
  review: z.string().min(3, "review is required"),
  rating:z.union([
    z.number().positive('Rating must be a positive number'),
    z.string().transform((val) => Number(val)).refine((val) => !isNaN(val) && val > 0, { message: 'mrp must be a positive number' })
  ]),
  code: z.string().min(3, "Coupon code is required"),
  phone: z.string().min(10, "Phone is required"),
  country: z.string().min(3, "Country is required"),
  state: z.string().min(3, "State is required"),
  city: z.string().min(3, "City is required"),
  pincode: z.string().min(3, "Pincode is required"),
  landmark: z.string().min(3, "landmark is required"),
  address: z.string().min(3, "Address is required"),
  ordernote: z.string().optional(),
  
})