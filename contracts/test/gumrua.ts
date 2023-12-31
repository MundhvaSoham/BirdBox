import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { ContractTransaction } from 'ethers';
import { ethers } from 'hardhat';
import { EURE_TOKEN_ADDRESS } from '../constants/addresses';
import { Birdbox } from '../typechain-types';

describe('Birdbox', () => {
  let deployer: SignerWithAddress, alice: SignerWithAddress, bob: SignerWithAddress, Birdbox: Birdbox;

  const productId = 1;
  const productName = 'My cool pdf';
  const productSlug = 'my-cool-pdf';
  const productDescription =
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis, velit rerum reprehenderit natus omnis eligendi iure amet fugit assumenda cumque id ad qui quos alias odit iusto provident. Nostrum accusamus quae iure quod maiores!';
  const productPrice = 100;
  const productPriceEuro = 94;
  const productImage =
    'https://public-files.gumroad.com/variants/utn8k57wknpyxf1zjp9ij0f8nvpv/e82ce07851bf15f5ab0ebde47958bb042197dbcdcae02aa122ef3f5b41e97c02';

  before(async () => {
    [deployer, alice, bob] = await ethers.getSigners();

    const Birdbox = await ethers.getContractFactory('Birdbox');
    Birdbox = await Birdbox.deploy(EURE_TOKEN_ADDRESS);
    await Birdbox.deployed();
  });

  describe('Create product', async () => {
    before(async () => {
      // Alice creates a product
      const tx = await Birdbox
        .connect(alice)
        .createProduct(
          productName,
          productSlug,
          productDescription,
          productPrice,
          productPriceEuro,
          productImage,
        );
      await tx.wait();
    });

    it('Creates product with the correct data', async () => {
      const product = await Birdbox.products(productId);
      expect(product.price).to.equal(productPrice);
      expect(product.seller).to.equal(alice.address);
      expect(product.name).to.equal(productName);
    });
  });

  describe('Buy product', async () => {
    let tx: ContractTransaction;

    before(async () => {
      // Bob buys Alice's product
      tx = await Birdbox.connect(bob).buyProduct(productId, {
        value: productPrice,
      });
      await tx.wait();
    });

    it('Mints a product token to Bob', async () => {
      const balance = await Birdbox.balanceOf(bob.address, productId);
      expect(balance).to.equal(1);
    });

    it("Sends Bob's money to Alice and fee to owner", async () => {
      const fee = productPrice * 0.05;
      await expect(tx).to.changeEtherBalances(
        [bob, alice, deployer],
        [-productPrice, productPrice - fee, fee],
      );
    });
  });

  describe('Update product price', async () => {
    const newPrice = 200;
    const newPriceEuro = 188;

    before(async () => {
      // Alice updates her product price
      const tx = await Birdbox.connect(alice).updateProductPrice(productId, newPrice, newPriceEuro);
      await tx.wait();
    });

    it('Updates the product price', async () => {
      const price = (await Birdbox.products(productId)).price;
      expect(price).to.equal(newPrice);
    });

    it('Only the owner can update the product price', async () => {
      const tx = Birdbox.connect(bob).updateProductPrice(productId, newPrice, newPriceEuro);
      expect(tx).to.be.revertedWith('Only seller can update price');
    });
  });

  describe('Token transfers', async () => {
    it("Tokens can't be transferred", async () => {
      const tx = Birdbox.connect(bob).safeTransferFrom(bob.address, alice.address, productId, 1, []);

      await expect(tx).to.be.revertedWith('Token transfer is not allowed');

      const tx2 = Birdbox
        .connect(bob)
        .safeBatchTransferFrom(bob.address, alice.address, [productId], [1], []);

      await expect(tx2).to.be.revertedWith('Token transfer is not allowed');
    });
  });
});
