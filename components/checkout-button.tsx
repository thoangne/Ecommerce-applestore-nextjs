"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import AuthModal from "@/components/auth-modal";
import { useAuth } from "@/app/hooks/useAuth";

export function CheckoutButton({
  handleCheckout,
}: {
  handleCheckout: () => Promise<void>;
}) {
  const { isAuthenticated, isLoading } = useAuth(); // ✅ kiểm tra đăng nhập
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const onCheckout = () => {
    // 🧠 Nếu đang loading thì bỏ qua
    if (isLoading) return;

    // ❌ Nếu chưa đăng nhập → mở modal
    if (!isAuthenticated) {
      setOpen(true);
      return;
    }

    // ✅ Nếu đã đăng nhập → tiến hành checkout
    startTransition(async () => {
      await handleCheckout();
    });
  };

  return (
    <>
      <Button
        type="button"
        size="lg"
        disabled={pending}
        className="mt-4 w-full"
        onClick={onCheckout}
      >
        {pending ? "Processing..." : "Checkout"}
      </Button>

      {/* Modal login/register */}
      <AuthModal open={open} onOpenChange={setOpen} />
    </>
  );
}
