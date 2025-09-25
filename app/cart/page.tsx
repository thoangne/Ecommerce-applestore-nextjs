import Breadcrumbs from "@/components/breadscums";
import CartEntry from "@/components/cart-entry";
import CartSummary from "@/components/cart-summary";
import { Button } from "@/components/ui/button";
import { getCart } from "@/lib/action";
import { processCheckout, ProcessCheckoutResponse } from "@/lib/orders";
import { redirect } from "next/navigation";

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

  return (
    <main className="container mx-auto py-4">
      <Breadcrumbs items={breadScrumbs}></Breadcrumbs>
      {!cart || cart.items.length === 0 ? (
        <div className="text-center">
          <h2>Your cart is empty</h2>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {cart.items.map((item) => (
              <CartEntry cartItem={item} key={item.id} />
            ))}
          </div>
          <CartSummary />
          <form action={handleCheckout}>
            <Button
              type="submit"
              size={"lg"}
              className="mt-4 w-full hover:cursor-pointer"
            >
              Checkout
            </Button>
          </form>
        </>
      )}
    </main>
  );
}
