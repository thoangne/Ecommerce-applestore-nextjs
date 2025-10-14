"use client";

import useSWR, { mutate } from "swr";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useCart() {
  const { data, error, isLoading } = useSWR("/api/cart", fetcher);

    
const revalidateCart = () => mutate("/api/cart");
    return {
      revalidateCart,
    cart: data,
    itemCount: data?.itemCount,
    isLoading,
    isError: error
  };
}
