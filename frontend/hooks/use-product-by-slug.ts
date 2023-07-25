import { useQuery } from "wagmi";
import { Product } from "../types/products";
import { useBirdbox } from "./use-Birdbox";

export const useProductBySlug = (productSlug: string) => {
  const Birdbox = useBirdbox();

  return useQuery<Product | undefined>(
    ["product-by-slug", productSlug],
    async () => {
      if (!Birdbox) return;

      const productId = await Birdbox.slugToId(productSlug);
      if (productId.eq(0)) return;

      const product = await Birdbox.products(productId);
      const { seller, name, slug, description, price, priceEuro, image } =
        product;

      return {
        id: productId.toNumber(),
        seller: seller as `0x${string}`,
        name,
        slug,
        description,
        price,
        priceEuro,
        image,
      };
    }
  );
};
