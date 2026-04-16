/**
 * 📧 Email System Types & Interfaces
 */

export type EmailType = 
  | 'ORDER_CONFIRMATION' 
  | 'ORDER_DELIVERED' 
  | 'ADMIN_NOTIFICATION' 
  | 'CUSTOM_ORDER_RECEIVED'
  | 'CUSTOM_ORDER_ADMIN_ALERT'
  | 'CUSTOM_ORDER_UPDATE';

export interface EmailPayload {
  to: string | string[];
  subject: string;
  type: EmailType;
  data: any;
  orderId?: string;
}

export interface OrderConfirmationData {
  orderNumber: string;
  customerName: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    image?: string;
  }>;
  subtotal: number;
  shippingFee: number;
  total: number;
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };
  orderLink: string;
}

export interface OrderDeliveredData {
  orderNumber: string;
  customerName: string;
  orderId: string;
  orderLink: string;
  reviewLink?: string;
}

export interface AdminNotificationData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: number;
  items: Array<{
    name: string;
    quantity: number;
  }>;
  adminLink: string;
}

export interface CustomOrderAdminAlertData {
  customerName: string;
  customerEmail: string;
  title: string;
  description: string;
  adminLink: string;
}

export interface CustomOrderUpdateData {
  customerName: string;
  title: string;
  status: string;
  message: string;
  quotedPrice?: number;
  orderLink: string;
  showPayButton?: boolean;
}
