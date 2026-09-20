import { CartItem, CheckoutForm, Product } from '../types';
import { STORE_CONFIG } from '../data/storeConfig';

export const EASYLIFE_WHATSAPP_NUMBER = STORE_CONFIG.whatsappDisplayNumber;
export const EASYLIFE_WHATSAPP_PHONE_CLEAN = STORE_CONFIG.whatsappNumber;
export const EASYLIFE_WHATSAPP_BASE_URL = STORE_CONFIG.whatsappUrl;

/**
 * Currency Formatter for Nigerian Naira
 */
export function formatNaira(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return `${STORE_CONFIG.currencySymbol}0`;
  }
  return STORE_CONFIG.currencySymbol + Math.round(amount).toLocaleString('en-NG');
}

/**
 * Calculates discount percentage automatically from originalPrice and salePrice.
 * Formula: Math.round(((originalPrice - salePrice) / originalPrice) * 100)
 * If originalPrice === salePrice or invalid, returns 0.
 */
export function calculateDiscount(originalPrice: number, salePrice: number): number {
  if (!originalPrice || !salePrice || originalPrice <= salePrice) {
    return 0;
  }
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
}

/**
 * Calculates total savings: originalPrice - salePrice
 */
export function calculateSavings(originalPrice: number, salePrice: number): number {
  if (!originalPrice || !salePrice || originalPrice <= salePrice) {
    return 0;
  }
  return originalPrice - salePrice;
}

/**
 * Computes availability status from stock number:
 * IN STOCK | LOW STOCK | OUT OF STOCK
 */
export function getStockStatus(stock: number): 'IN STOCK' | 'LOW STOCK' | 'OUT OF STOCK' {
  if (stock <= 0) return 'OUT OF STOCK';
  if (stock <= 5) return 'LOW STOCK';
  return 'IN STOCK';
}

/**
 * Section 16: Generates WhatsApp URL for single product order
 * Template:
 * Hello EASYLIFE SUPERMARKET 👋
 * 
 * I would like to order:
 * 
 * Product: [PRODUCT NAME]
 * Brand: [BRAND]
 * Quantity: [QUANTITY]
 * Price: ₦[CURRENT SALE PRICE]
 * 
 * Please confirm availability and delivery details.
 * 
 * Thank you.
 */
export function getProductWhatsAppUrl(product: Product, quantity: number = 1): string {
  const message = `Hello EASYLIFE SUPERMARKET 👋

I would like to order:

Product: ${product.name}
Brand: ${product.brand}
Quantity: ${quantity}
Price: ${formatNaira(product.salePrice)}

Please confirm availability and delivery details.

Thank you.`;

  return `${STORE_CONFIG.whatsappUrl}?text=${encodeURIComponent(message)}`;
}

/**
 * Section 17: Generates WhatsApp URL for entire cart directly or completed checkout
 */
export function getCartWhatsAppUrl(
  items: CartItem[],
  subtotal: number,
  discount: number,
  delivery: number,
  total: number
): string {
  const itemsText = items
    .map(
      (item, index) =>
        `${index + 1}. ${item.product.name} (${item.product.brand})\n   Quantity: ${item.quantity}\n   Price: ${formatNaira(item.product.salePrice * item.quantity)}`
    )
    .join('\n');

  const message = `Hello EASYLIFE SUPERMARKET 👋

I would like to place an order.

ORDER DETAILS:

${itemsText}

Subtotal: ${formatNaira(subtotal)}
Discount: ${formatNaira(discount)}
Delivery: ${delivery === 0 ? 'FREE' : formatNaira(delivery)}
Total: ${formatNaira(total)}

Please confirm my order, delivery fee and payment instructions.

Thank you for shopping with EASYLIFE SUPERMARKET ❤️`;

  return `${STORE_CONFIG.whatsappUrl}?text=${encodeURIComponent(message)}`;
}

/**
 * Section 17: Generates WhatsApp URL for full checkout with customer and delivery details
 */
export function getCheckoutWhatsAppUrl(
  items: CartItem[],
  form: CheckoutForm,
  subtotal: number,
  discount: number,
  delivery: number,
  total: number
): string {
  const itemsText = items
    .map(
      (item, index) =>
        `${index + 1}. ${item.product.name}\n   Quantity: ${item.quantity}\n   Price: ${formatNaira(item.product.salePrice * item.quantity)}`
    )
    .join('\n');

  const notesText = form.additionalNotes ? `\nNotes: ${form.additionalNotes}` : '';

  const message = `Hello EASYLIFE SUPERMARKET 👋

I would like to place an order.

ORDER DETAILS:

${itemsText}

Subtotal: ${formatNaira(subtotal)}
Discount: ${formatNaira(discount)}
Delivery: ${delivery === 0 ? 'FREE' : formatNaira(delivery)}
Total: ${formatNaira(total)}

CUSTOMER DETAILS:

Name: ${form.fullName}
Phone: ${form.phone}
Delivery Address: ${form.deliveryAddress}
City: ${form.city}
State: ${form.state}${notesText}

Please confirm my order, delivery fee and payment instructions.

Thank you for shopping with EASYLIFE SUPERMARKET ❤️`;

  return `${STORE_CONFIG.whatsappUrl}?text=${encodeURIComponent(message)}`;
}

/**
 * Generates general WhatsApp consultation URL
 */
export function getGeneralWhatsAppUrl(subject?: string): string {
  const message = subject
    ? `Hello EASYLIFE SUPERMARKET 👋\n\nI have an enquiry about: ${subject}`
    : `Hello EASYLIFE SUPERMARKET 👋\n\nI would like to enquire about your supermarket products and delivery.`;

  return `${STORE_CONFIG.whatsappUrl}?text=${encodeURIComponent(message)}`;
}
