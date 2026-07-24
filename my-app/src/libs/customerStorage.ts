import type { StorePageInfoDto, OfferCustomerInfoDto, DiscountShortInfoDto, ProductSimpleInfoDto } from '@/types/dtos';

const KEYS = {
  store: 'customer-store',
  offers: 'customer-offers',
  discounts: 'customer-discounts',
  products: (slug: string) => `customer-products-${slug}`,
};

export function setCustomerStore(data: StorePageInfoDto): void {
  sessionStorage.setItem(KEYS.store, JSON.stringify(data));
}

export function getCustomerStore(): StorePageInfoDto | null {
  const raw = sessionStorage.getItem(KEYS.store);
  return raw ? JSON.parse(raw) : null;
}

export function setCustomerOffers(data: OfferCustomerInfoDto[]): void {
  sessionStorage.setItem(KEYS.offers, JSON.stringify(data));
}

export function getCustomerOffers(): OfferCustomerInfoDto[] | null {
  const raw = sessionStorage.getItem(KEYS.offers);
  return raw ? JSON.parse(raw) : null;
}

export function setCustomerDiscounts(data: DiscountShortInfoDto[]): void {
  sessionStorage.setItem(KEYS.discounts, JSON.stringify(data));
}

export function getCustomerDiscounts(): DiscountShortInfoDto[] | null {
  const raw = sessionStorage.getItem(KEYS.discounts);
  return raw ? JSON.parse(raw) : null;
}

export function setCustomerProducts(slug: string, data: ProductSimpleInfoDto[]): void {
  sessionStorage.setItem(KEYS.products(slug), JSON.stringify(data));
}

export function appendCustomerProducts(slug: string, data: ProductSimpleInfoDto[]): void {
  const existing = getCustomerProducts(slug) || [];
  const merged = [...existing, ...data];
  sessionStorage.setItem(KEYS.products(slug), JSON.stringify(merged));
}

export function getCustomerProducts(slug: string): ProductSimpleInfoDto[] | null {
  const raw = sessionStorage.getItem(KEYS.products(slug));
  return raw ? JSON.parse(raw) : null;
}
