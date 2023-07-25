import { useQuery } from "wagmi";
import { Product } from "../types/products";
import { useBirdbox } from "./use-Birdbox";

export const useProduct = (productId: number) => {
  const Birdbox = useBirdbox();

  return useQuery<Product | undefined>(["product", productId], async () => {
    if (!Birdbox) return;

    const product = await Birdbox.products(productId);
    const { seller, name, slug, description, price, priceEuro, image } =
      product;

    return {
      id: productId,
      seller: seller as `0x${string}`,
      name,
      slug,
      description,
      price,
      priceEuro,
      image,
    };
  });
};
