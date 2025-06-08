export enum BalancePackId {
  SMALL = "SMALL",
  MEDIUM = "MEDIUM",
  LARGE = "LARGE",
}

export interface CreditPack {
  id: BalancePackId;
  name: string;
  label: string;
  credits: number;
  price: number;
  stripePriceId: string;
}

export const CreditPacks: CreditPack[] = [
  {
    id: BalancePackId.SMALL,
    name: "Small Pack",
    label: "1000 Credits",
    credits: 1000,
    price: 1, // PRICE IN CENTS (9.99$)
    stripePriceId: "small", // STRIPE PRICE ID process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_SMALL_PACK
  },
  {
    id: BalancePackId.MEDIUM,
    name: "Medium Pack",
    label: "5000 Credits",
    credits: 5000,
    price: 2, // PRICE IN CENTS (33.99$)
    stripePriceId: "medium", // STRIPE PRICE ID process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_MEDIUM_PACK
  },
  {
    id: BalancePackId.LARGE,
    name: "Large Pack",
    label: "12000 Credits",
    credits: 12000,
    price: 3, // PRICE IN CENTS (49.99$)
    stripePriceId: "large", // STRIPE PRICE ID process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_LARGE_PACK
  },
] as const;

export const getCreditPackById = (
  id: BalancePackId,
): CreditPack | undefined => {
  return CreditPacks.find((pack) => pack.id === id);
};
