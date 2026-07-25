export interface CartProduct {
  id: string;
  quantity: number;
}

export interface CartOffer {
  id: string;
}

export interface CartData {
  products: CartProduct[];
  offers: CartOffer[];
}

function getDateKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getCartKey(): string {
  return `cart-${getDateKey()}`;
}

export function initCart(): void {
  const key = getCartKey();
  if (!sessionStorage.getItem(key)) {
    sessionStorage.setItem(key, JSON.stringify({ products: [], offers: [] }));
  }
}

export function getCart(): CartData {
  const raw = sessionStorage.getItem(getCartKey());
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      // fall through
    }
  }
  return { products: [], offers: [] };
}

function saveCart(cart: CartData): void {
  sessionStorage.setItem(getCartKey(), JSON.stringify(cart));
}

export function addProductToCart(id: string, quantity: number): void {
  const cart = getCart();
  const existing = cart.products.find((p) => p.id === id);
  if (existing) {
    existing.quantity = quantity;
  } else {
    cart.products.push({ id, quantity });
  }
  saveCart(cart);
}

export function removeProductFromCart(id: string): void {
  const cart = getCart();
  cart.products = cart.products.filter((p) => p.id !== id);
  saveCart(cart);
}

export function updateProductQuantity(id: string, delta: number): void {
  const cart = getCart();
  const existing = cart.products.find((p) => p.id === id);
  if (existing) {
    existing.quantity += delta;
    if (existing.quantity <= 0) {
      cart.products = cart.products.filter((p) => p.id !== id);
    }
  }
  saveCart(cart);
}

export function getProductQuantity(id: string): number {
  const cart = getCart();
  return cart.products.find((p) => p.id === id)?.quantity ?? 0;
}

export function addOfferToCart(id: string): void {
  const cart = getCart();
  if (!cart.offers.find((o) => o.id === id)) {
    cart.offers.push({ id });
  }
  saveCart(cart);
}

export function removeOfferFromCart(id: string): void {
  const cart = getCart();
  cart.offers = cart.offers.filter((o) => o.id !== id);
  saveCart(cart);
}

export function isOfferInCart(id: string): boolean {
  const cart = getCart();
  return cart.offers.some((o) => o.id === id);
}

export function getCartCount(): number {
  const cart = getCart();
  return cart.products.reduce((sum, p) => sum + p.quantity, 0) + cart.offers.length;
}

export function clearCart(): void {
  sessionStorage.removeItem(getCartKey());
}
