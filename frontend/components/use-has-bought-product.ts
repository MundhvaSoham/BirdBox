import { useAccount, useQuery } from "wagmi";
import { useBirdbox } from "../hooks/use-Birdbox";

export const useHasBoughtProduct = (productId: number) => {
  const { address } = useAccount();
  const Birdbox = useBirdbox();

  return useQuery(["has-bought-product", productId, address], async () => {
    if (!Birdbox || !address) return false;

    const eventFilter = Birdbox.filters.ProductBought(productId, address);
    const events = await Birdbox.queryFilter(eventFilter);

    if (events.length > 0) return true;
  });
};
