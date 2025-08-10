import CartEntry from "@/components/cart-entry";
import CartSummary from "@/components/cart-summary";
import { getCart } from "@/lib/action";
import { delay } from "@/lib/utils";

export default async function CartPage() {
  const cart = await getCart();
  await delay(1000); // Simulate loading delay
  return (
    <main className="container mx-auto py-4">
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
        </>
      )}
    </main>
  );
}
