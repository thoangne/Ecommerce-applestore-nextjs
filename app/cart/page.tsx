import Breadcrumbs from "@/components/breadscums";
import CartEntry from "@/components/cart-entry";
import CartSummary from "@/components/cart-summary";
import { getCart, getProductsByCategory } from "@/lib/action";
import { processCheckout, ProcessCheckoutResponse } from "@/lib/orders";
import { redirect } from "next/navigation";
import { CheckoutButton } from "@/components/checkout-button";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import ProductCarouselGallery from "@/components/ProductCarouselGallery";

export default async function CartPage() {
  const cart = await getCart();

  const handleCheckout = async () => {
    "use server";
    let result: ProcessCheckoutResponse | null = null;
    try {
      result = await processCheckout();
    } catch (error) {
      console.error("Checkout error", error);
    }
    if (result) {
      redirect(result.sessionUrl);
    }
  };

  const breadScrumbs = [{ label: "Cart", href: "/cart" }];
  const ipad = await getProductsByCategory("Ipad");
  const macbook = await getProductsByCategory("Macbook");

  return (
    <main className="container mx-auto py-6 space-y-16">
      {/* ========================== */}
      {/* 🛒 KHU VỰC CART */}
      {/* ========================== */}
      <section>
        <Breadcrumbs items={breadScrumbs} />

        {!cart || cart.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="p-[2px] rounded-2xl shadow-lg border border-neutral-300 dark:border-neutral-700">
              <div className="bg-white dark:bg-neutral-900 rounded-2xl p-10 flex flex-col items-center">
                {/* Icon */}
                <ShoppingBag className="w-24 h-24 text-neutral-800 dark:text-neutral-200 mb-4" />

                {/* Text */}
                <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                  Your cart is empty
                </h2>
                <p className="text-neutral-500 dark:text-neutral-400 mb-6">
                  Looks like you haven’t added anything yet.
                </p>

                {/* Button */}
                <Link
                  href="/products"
                  className="
                px-6 py-3 rounded-xl font-medium
                border border-neutral-800 dark:border-neutral-200
                text-neutral-900 dark:text-white
                bg-white dark:bg-neutral-900
                hover:bg-neutral-900 hover:text-white
                dark:hover:bg-white dark:hover:text-neutral-900
                transition
              "
                >
                  Continue shopping
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col gap-4">
              {cart.items.map((item) => (
                <CartEntry cartItem={item} key={item.id} />
              ))}
            </div>

            <CartSummary />
            <CheckoutButton handleCheckout={handleCheckout} />
          </div>
        )}
      </section>

      {/* Divider */}
      <div className="border-t border-neutral-300 dark:border-neutral-700" />

      {/* ========================== */}
      {/* 📱 SẢN PHẨM GỢI Ý: IPAD */}
      {/* ========================== */}
      <section className="space-y-6">
        <ProductCarouselGallery products={ipad} title="Ipad" />
      </section>

      {/* Divider */}
      <div className="border-t border-neutral-300 dark:border-neutral-700" />

      {/* ========================== */}
      {/* 💻 SẢN PHẨM GỢI Ý: MACBOOK */}
      {/* ========================== */}
      <section className="space-y-6">
        <ProductCarouselGallery products={macbook} title="Macbook" />
      </section>

      {/* Divider */}
      <div className="border-t border-neutral-300 dark:border-neutral-700" />

      {/* ========================== */}
      {/* ❤️ CÓ THỂ BẠN CŨNG THÍCH */}
      {/* ========================== */}
      <section className="space-y-6">
        <ProductCarouselGallery
          products={macbook}
          title="Có thể bạn cũng thích"
        />
      </section>
    </main>
  );
}
