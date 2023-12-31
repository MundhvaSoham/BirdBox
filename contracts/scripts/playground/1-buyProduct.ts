import hre, { ethers } from 'hardhat';
import { getDeploymentProperty, ConfigProperty } from '../../.deployment/deploymentManager';

async function main() {
  const network = hre.network.name;
  console.log('Network:', network);

  const [, , bob] = await ethers.getSigners();

  // Get contract
  const Birdbox = await ethers.getContractAt(
    'BIRDBOX',
    getDeploymentProperty(network, ConfigProperty.Birdbox),
  );

  // Set data
  const productId = 1;
  const tx = await Birdbox.connect(bob).buyProduct(productId, {
    value: ethers.utils.parseEther('100'),
  });
  await tx.wait();

  console.log('Bought product with id: ', productId);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
