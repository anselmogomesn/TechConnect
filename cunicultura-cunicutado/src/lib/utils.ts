/**
 * Utility to merge class names, filtering out falsy values
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Format price to Brazilian Real (BRL)
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
}

/**
 * Format date to Brazilian format
 */
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

/**
 * Calculate discount percentage
 */
export function calculateDiscount(originalPrice: number, currentPrice: number): number {
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
}

/**
 * Generate slug from string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + "...";
}

/**
 * Get stock status label
 */
export function getStockStatus(stock: number): { label: string; color: string } {
  if (stock === 0) return { label: "Indisponível", color: "text-red-500" };
  if (stock <= 5) return { label: "Últimas unidades", color: "text-orange-500" };
  if (stock <= 20) return { label: "Disponível", color: "text-green-500" };
  return { label: "Em estoque", color: "text-primary" };
}

/**
 * Generate placeholder image URL
 */
export function getPlaceholderImage(width: number, height: number, text: string): string {
  return `/api/placeholder?width=${width}&height=${height}&text=${encodeURIComponent(text)}`;
}

/**
 * Mask email for privacy
 */
export function maskEmail(email: string): string {
  const [name, domain] = email.split("@");
  const maskedName = name[0] + "***" + name[name.length - 1];
  return `${maskedName}@${domain}`;
}

/**
 * Get order status label and color
 */
export function getOrderStatusInfo(
  status: string
): { label: string; color: string; bgColor: string } {
  const statusMap: Record<string, { label: string; color: string; bgColor: string }> = {
    pending: { label: "Pendente", color: "text-yellow-800", bgColor: "bg-yellow-100" },
    confirmed: { label: "Confirmado", color: "text-blue-800", bgColor: "bg-blue-100" },
    processing: { label: "Processando", color: "text-indigo-800", bgColor: "bg-indigo-100" },
    shipped: { label: "Enviado", color: "text-purple-800", bgColor: "bg-purple-100" },
    delivered: { label: "Entregue", color: "text-green-800", bgColor: "bg-green-100" },
    cancelled: { label: "Cancelado", color: "text-red-800", bgColor: "bg-red-100" },
  };
  return statusMap[status] || statusMap.pending;
}
