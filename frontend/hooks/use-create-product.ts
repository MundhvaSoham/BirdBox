import { BigNumber, ContractReceipt } from "ethers";
import { useMutation } from "wagmi";
import { uploadImage, uploadPdf } from "../utils/upload-file";

import { useBirdbox } from "./use-Birdbox";

const EURO_TO_DAI = 107;

export interface CreateProductData {
  name: string;
  price: BigNumber; // price in euro
  image: File;
  pdf: File;
  slug: string;
  description: string;
}

interface UseCreateProductOptions {
  onSuccess?: (data: ContractReceipt | undefined) => void;
}

export const useCreateProduct = (options?: UseCreateProductOptions) => {
  const Birdbox = useBirdbox(true);
  const mutation = useMutation(
    async ({
      name,
      slug,
      description,
      price,
      image,
      pdf,
    }: CreateProductData) => {
      if (!Birdbox) return;

      const imageUrl = await uploadImage(image);
      if (!imageUrl) return;

      await uploadPdf(pdf, slug);

      const priceDai = price.mul(EURO_TO_DAI).div(100);
      const tx = await Birdbox.createProduct(
        name,
        slug,
        description,
        priceDai,
        price,
        imageUrl
      );
      return await tx.wait();
    },
    {
      onSuccess: options?.onSuccess,
    }
  );

  return mutation;
};
