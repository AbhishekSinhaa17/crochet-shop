import { wrapInEmailTemplate } from '@/lib/email';
import { EmailType, OrderConfirmationData, OrderDeliveredData, AdminNotificationData } from '@/types/email';
import { formatPrice } from '@/lib/utils';

/**
 * 🎨 Real-time Email Template Engine
 * Generates professional HTML strings for ecommerce transactions.
 */
export async function renderEmailTemplate(type: EmailType, data: any): Promise<string> {
  switch (type) {
    case 'ORDER_CONFIRMATION':
      return renderOrderConfirmation(data);
    case 'ORDER_DELIVERED':
      return renderOrderDelivered(data);
    case 'ADMIN_NOTIFICATION':
      return renderAdminNotification(data);
    case 'CUSTOM_ORDER_RECEIVED':
      return renderCustomOrderReceived(data);
    default:
      throw new Error(`Unknown email type: ${type}`);
  }
}

function renderOrderConfirmation(data: OrderConfirmationData) {
  const itemsHtml = data.items.map(item => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9;">
        <p style="margin: 0; font-weight: 600; font-size: 14px; color: #1e293b;">${item.name}</p>
        <p style="margin: 4px 0 0 0; font-size: 12px; color: #64748b;">Qty: ${item.quantity} &times; ${formatPrice(item.price)}</p>
      </td>
      <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; text-align: right; font-weight: 700; font-size: 14px; color: #1e293b;">
        ${formatPrice(item.price * item.quantity)}
      </td>
    </tr>
  `).join('');

  const content = `
    <h2 style="font-size: 24px; font-weight: 800; color: #111827; margin-bottom: 8px;">Order Confirmed! 🎉</h2>
    <p style="font-size: 16px; color: #4b5563; line-height: 1.6; margin-bottom: 32px;">
      Hi ${data.customerName}, your order <strong>#${data.orderNumber}</strong> has been successfully placed and is being prepared with love.
    </p>

    <div style="background-color: #f8fafc; border-radius: 16px; padding: 24px; margin-bottom: 32px;">
      <h3 style="font-size: 14px; font-weight: 700; text-transform: uppercase; color: #64748b; margin-top: 0; margin-bottom: 16px;">Order Summary</h3>
      
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        ${itemsHtml}
      </table>
      
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 16px;">
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Subtotal</td>
          <td style="padding: 6px 0; text-align: right; font-weight: 600; font-size: 14px; color: #1e293b;">${formatPrice(data.subtotal)}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-size: 14px;">Shipping</td>
          <td style="padding: 6px 0; text-align: right; font-weight: 600; font-size: 14px; color: #1e293b;">${data.shippingFee === 0 ? 'FREE' : formatPrice(data.shippingFee)}</td>
        </tr>
        <tr>
          <td style="padding: 16px 0 0 0; border-top: 1px solid #e2e8f0; font-weight: 700; font-size: 18px; color: #1e293b;">Total</td>
          <td style="padding: 16px 0 0 0; border-top: 1px solid #e2e8f0; text-align: right; font-weight: 800; font-size: 24px; color: #7c3aed;">${formatPrice(data.total)}</td>
        </tr>
      </table>
    </div>

    <div style="border-radius: 16px; border: 1px solid #e2e8f0; padding: 24px; margin-bottom: 32px;">
      <h3 style="font-size: 14px; font-weight: 700; text-transform: uppercase; color: #64748b; margin-top: 0; margin-bottom: 16px;">Shipping Address</h3>
      <p style="margin: 0; color: #4b5563; font-size: 14px; line-height: 1.6;">
        ${data.customerName}<br/>
        ${data.shippingAddress.line1}<br/>
        ${data.shippingAddress.line2 ? `${data.shippingAddress.line2}<br/>` : ''}
        ${data.shippingAddress.city}, ${data.shippingAddress.state} - ${data.shippingAddress.pincode}<br/>
        Phone: ${data.shippingAddress.phone}
      </p>
    </div>

    <div style="text-align: center;">
      <a href="${data.orderLink}" class="btn">View Order Details</a>
    </div>
  `;

  return wrapInEmailTemplate(content, `Order Confirmed: #${data.orderNumber}`);
}

function renderOrderDelivered(data: OrderDeliveredData) {
  const content = `
    <h2 style="font-size: 24px; font-weight: 800; color: #111827; margin-bottom: 16px; text-align: center;">It's Arrived! 📦</h2>
    
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 40px 24px; text-align: center; margin-bottom: 32px;">
      <img src="https://img.icons8.com/color/200/shipped.png" width="100" height="100" alt="Delivered" style="margin-bottom: 24px;" />
      
      <p style="font-size: 16px; color: #1e293b; line-height: 1.6; margin: 0 0 16px 0;">
        Hi <strong>${data.customerName}</strong>, your order <strong style="color: #7c3aed;">#${data.orderNumber}</strong> has been successfully delivered. We hope it brings a smile to your face!
      </p>

      <p style="font-size: 14px; color: #64748b; line-height: 1.6; margin: 0;">
        How was your experience? We would love to see your new crochet item in its new home. Tag us on Instagram!
      </p>
    </div>

    <div style="text-align: center;">
      <a href="${data.reviewLink || data.orderLink}" style="display: inline-block; padding: 16px 32px; background: #7c3aed; color: #ffffff; text-decoration: none; border-radius: 14px; font-weight: 600; font-size: 16px;">Leave a Review</a>
    </div>
  `;

  return wrapInEmailTemplate(content, `Delivery Confirmation for Order #${data.orderNumber}`);
}

function renderAdminNotification(data: AdminNotificationData) {
  const itemsHtml = data.items.map(item => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #1e293b; font-weight: 600;">
        ${item.name} <span style="color: #64748b; font-weight: 400; font-size: 12px; margin-left: 8px;">Qty: ${item.quantity}</span>
      </td>
    </tr>
  `).join('');

  const content = `
    <h2 style="font-size: 20px; font-weight: 800; color: #111827; margin-bottom: 16px;">New Order Received! 🚀</h2>
    <p style="font-size: 14px; color: #4b5563; line-height: 1.6; margin-bottom: 24px;">
      A new order <strong>#${data.orderNumber}</strong> has been received from ${data.customerName}.
    </p>

    <div style="background-color: #f1f5f9; border-radius: 12px; padding: 20px; margin-bottom: 24px; text-align: center;">
      <p style="margin: 0 0 8px 0; font-size: 12px; color: #64748b; font-weight: 700; text-transform: uppercase;">Revenue Generated</p>
      <p style="margin: 0; font-size: 32px; font-weight: 800; color: #059669;">${formatPrice(data.total)}</p>
    </div>

    <div style="border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
      <h3 style="font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; margin: 0 0 8px 0;">Customer Details</h3>
      <p style="margin: 0; font-size: 14px; color: #1e293b; font-weight: 600;">${data.customerName}</p>
      <p style="margin: 4px 0 0 0; font-size: 14px; color: #64748b;">${data.customerEmail}</p>
    </div>

    <div style="margin-bottom: 32px;">
      <h3 style="font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; margin: 0 0 12px 0;">Items Ordered</h3>
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        ${itemsHtml}
      </table>
    </div>

    <div style="text-align: center;">
      <a href="${data.adminLink}" class="btn">Process in Admin Dashboard</a>
    </div>
  `;

  return wrapInEmailTemplate(content, `New Order Alert: ${data.customerName} - ${formatPrice(data.total)}`);
}

function renderCustomOrderReceived(data: any) {
    const content = `
      <h2 style="font-size: 24px; font-weight: 800; color: #111827; margin-bottom: 8px;">Custom Request Received 🧶</h2>
      <p style="font-size: 16px; color: #4b5563; line-height: 1.6; margin-bottom: 32px;">
        Hi ${data.customerName}, we've received your request for: <strong>${data.title}</strong>. 
        Our artisans will review it and get back to you with a quote soon!
      </p>
       <div style="text-align: center;">
        <a href="${data.orderLink}" class="btn">View My Request</a>
      </div>
    `;
    return wrapInEmailTemplate(content, `Custom Request Confirmation`);
}
