import { ContractReceipt } from "ethers";
import { useMutation } from "wagmi";
import { useEureToken } from "./use-eure-token";

import { useBirdbox } from "./use-Birdbox";

export interface BuyProductData {
  id: number;
  withEuro?: boolean;
}

interface UseBuyProductOptions {
  onSuccess?: (data: ContractReceipt | undefined) => void;
}

export const useBuyProduct = (options?: UseBuyProductOptions) => {
  const Birdbox = useBirdbox(true);
  const eureToken = useEureToken(true);

  const mutation = useMutation(
    async ({ id, withEuro }: BuyProductData) => {
      if (!Birdbox || !eureToken) return;

      if (withEuro) {
        const priceEuro = (await Birdbox.products(id)).priceEuro;

        // approve usafe of euro token
        const approveTx = await eureToken.approve(Birdbox.address, priceEuro);
        await approveTx.wait();
      }

      const price = (await Birdbox.products(id)).price;
      const tx = await Birdbox.buyProduct(id, {
        value: withEuro ? 0 : price,
      });

      return await tx.wait();
    },
    {
      onSuccess: options?.onSuccess,
    }
  );

  return mutation;
};
