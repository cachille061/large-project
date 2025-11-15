import { useMemo } from "react";
import { Order } from "../contexts/DataContext";

export interface CategorizedOrders {
  all: Order[];
  pending: Order[];
  completed: Order[];
  cancelled: Order[];
}

export function useOrderManagement(orders: Order[]): CategorizedOrders {
  return useMemo(() => {
    const pending = orders.filter((o) => o.status === "CURRENT");
    const completed = orders.filter((o) => o.status === "FULFILLED");
    const cancelled = orders.filter((o) => o.status === "CANCELED");

    return {
      all: orders,
      pending,
      completed,
      cancelled,
    };
  }, [orders]);
}

export function useSortedProducts<T extends { createdAt: string }>(
  products: T[]
): T[] {
  return useMemo(
    () =>
      [...products].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [products]
  );
}

export function useActiveProducts<T extends { status: string }>(
  products: T[]
): T[] {
  return useMemo(() => products.filter((p) => p.status === "active"), [products]);
}
