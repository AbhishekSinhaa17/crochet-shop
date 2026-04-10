export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  address: Address | null;
  role: "customer" | "admin" | "seller";
  created_at: string;
  updated_at: string;
}

export interface Address {
  name?: string;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  postal_code?: string;
  phone?: string;
  country?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compare_price: number | null;
  category_id: string | null;
  images: string[];
  stock: number;
  is_active: boolean;
  is_featured: boolean;
  tags: string[];
  metadata: Record<string, any>;
  avg_rating: number;
  review_count: number;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  product?: Product;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product?: Product;
}

export interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  shipping_fee: number;
  discount: number;
  total: number;
  shipping_address: Address;
  payment_method: string;
  payment_status: PaymentStatus;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  razorpay_signature: string | null;
  tracking_number: string | null;
  courier: string | null;
  estimated_delivery: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  profile?: Profile;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface OrderStatusHistory {
  id: string;
  order_id: string;
  status: string;
  note: string | null;
  created_at: string;
}

export interface Review {
  id: string;
  user_id: string;
  product_id: string;
  order_id: string | null;
  rating: number;
  title: string | null;
  comment: string | null;
  images: string[];
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  profile?: Profile;
}

export interface CustomOrder {
  id: string;
  user_id: string;
  title: string;
  description: string;
  reference_images: string[];
  preferred_colors: string | null;
  size_details: string | null;
  budget_min: number | null;
  budget_max: number | null;
  deadline: string | null;
  status: string;
  quoted_price: number | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  customer_id: string;
  subject: string;
  last_message: string | null;
  last_message_at: string;
  is_closed: boolean;
  created_at: string;
  profile?: Profile;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: "text" | "image" | "system";
  image_url: string | null;
  is_read: boolean;
  created_at: string;
  profile?: Profile;
}