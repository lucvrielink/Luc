import productCatalog from "../data/product_catalog.json";
import bundleCatalog from "../data/bundle_catalog.json";

const DOMAIN = "https://sovahcare.com";

type ProductEntry = {
  title: string;
  first_available_variant_id: number;
};

type BundleEntry = {
  name: string;
  products: string[];
};

const products = (productCatalog as { products: ProductEntry[] }).products;
const bundles = (bundleCatalog as { bundles: BundleEntry[] }).bundles;

const productVariantByTitle = new Map(
  products.map((p) => [p.title.toLowerCase(), p.first_available_variant_id])
);

export function resolveVariantId(productTitle: string): number | undefined {
  return productVariantByTitle.get(productTitle.toLowerCase());
}

export function buildProductCartPermalink(productTitle: string, quantity = 1): string | null {
  const variantId = resolveVariantId(productTitle);
  if (!variantId) return null;
  return `${DOMAIN}/cart/${variantId}:${quantity}`;
}

export function buildBundleCartPermalink(bundleName: string): string | null {
  const bundle = bundles.find((b) => b.name === bundleName);
  if (!bundle) return null;

  const items = bundle.products
    .map((title) => resolveVariantId(title))
    .filter((v): v is number => typeof v === "number")
    .map((variantId) => `${variantId}:1`);

  if (!items.length) return null;
  return `${DOMAIN}/cart/${items.join(",")}`;
}
