import { useAccount, useQuery } from "wagmi";
import { Product } from "../types/products";
import { useBirdbox } from "./use-Birdbox";

export const useCreatedProducts = () => {
  const { address } = useAccount();
  const Birdbox = useBirdbox();

  return useQuery<Product[]>(["created-products", address], async () => {
    if (!Birdbox || !address) return [];

    /* Get requests */
    const products: Product[] = [];
    const eventFilter = Birdbox.filters.ProductCreated(null, address);
    const events = await Birdbox.queryFilter(eventFilter);

    for (const event of events) {
      if (!event.args) continue;

      const id = event.args._productId;
      const product = await Birdbox.products(id);

      products.push({
        id: id.toNumber(),
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        priceEuro: product.priceEuro,
        seller: product.seller as `0x${string}`,
        image: product.image,
      });
    }

    return products;
  });
};
