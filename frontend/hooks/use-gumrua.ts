import { useContract, useNetwork, useProvider, useSigner } from "wagmi";
import { BirdboxAbi } from "../abis/Birdbox";

import { Birdbox } from "../abis/types/Birdbox";
import { Birdbox_PRODUCT_ADDRESS } from "../constants/addresses";

export const useBirdbox = (withSigner: boolean = false) => {
  const provider = useProvider();
  const { data: signer } = useSigner();

  const { chain } = useNetwork();

  return useContract({
    address: Birdbox_PRODUCT_ADDRESS[chain?.id ?? 31337],
    abi: BirdboxAbi,
    signerOrProvider: withSigner ? signer : provider,
  }) as Birdbox | null;
};
