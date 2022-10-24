# DFM: Diamond Facet Manager

What started as a [simple extension](https://github.com/proggR/diamond-hardhat) to add some Hardhat flavor to a Diamond starter repo has become something... more...

I imagine DFM/diamond.json being to Diamond driven Solidity development what NPM/package.json is to Node dev. Now that I've seen it... I can't unsee it.

Still a very crude implementation, uploading to test a second offshoot prototype: [dfm-min.js](https://github.com/proggR/dfm-min) (will be a 404 for the moment), a simple script that depends on only git and node being installed, and then starts with nothing but a diamond.json file and installs the dev environment you need around it with a simple `node dfm-min.js` (more to come once that link doesn't 404).

## diamond.json

At the moment, most of the file is ignored, but 2 fields are worth noting: `repository` and `dependencies`.

The repository URL is used by `dfm-min.js` (yet to be published) to clone the referenced project. If omitted, dfm-min will fall back on the base repo (this one), which may work for some projects, while others will want to base from their own.

The dependencies are used by `lib/dfm/dfm.js` to import facets into the project. Atm, only github repositories are supported, and are supported in the format of `<account>/<repo>` with no leading/trailing slashes.

## Installation

1. Clone this repo:
```console
git clone git@github.com:proggR/dfm.git
```

2. Install NPM packages:
```console
cd dfm
npm install
```

## Build Your First Diamond from diamond.json

Note first the barebones base project (contracts/tasks/tests), and then the dependencies listed in diamond.json. Then its as easy as:

```console
node lib/dfm/dfm.js
```

For the moment this step is a bit goofy but will be polished over time to leverage diamond.json fully.

Once you've ran that command and cloned/pushed your dependencies to your project, you'll need to manually link the tasks and tests in `tasks/index.js` and `test/facets/index.js`. The test objects once defined should also be added to the array defined in `enabledFacets`. Necessary changes for this diamond.json file included in comments.

Also, for the moment the `dfm-install` task doesn't work. It clones, but doesn't push to local and I haven't yet figured out what's different about a HH task context vs CLI :\


## Local Node Deployment

```console
cp .env.example .env
. .env
npx hardhat node --network hardhat
```

## Test Your DFM Constructed Diamond

Once you've linked your tests in `test/facets/index.js` and spun up your local Hardhat node, the simplest way to make sure everything worked correctly is to run the facet tests (assuming the imported facets have corresponding tests)

```console
npx hardhat test
```

## Current Facets

Currently DFM has a whopping 2 Facets available! [DiamondGreeterFacet](https://github.com/proggR/DiamondGreeterFacet) and [DiamondERC20Facet](https://github.com/proggR/DiamondERC20Facet). A separate dfm-facets repo will be made if any interest in sharing develops, otherwise I'll aim to update the list here as I roll some to play with.

Mock implementations for ERC20, ERC721, and ERC1155 facets built leveraging diamond storage, including tests and management tasks have been made for the [diamond-hardhat](https://github.com/proggR/diamond-hardhat) starter repo, so the remainder will also be published as standalone DFM compliant repos.

As mentioned in the starter repo, additional EIPs being researched for inclusion: ERC137, ERC681, ERC725/ERC735, ERC884, ERC1400/ERC1404.

I've also spun off a seperate WIP/currently unpublished starter repo (diamond-hardhat-chainlink) to add chainlink related facets without littering the simpler starter repo, and will release those chainlinked facets standalone in DFM compliant form as they're finished.

## Facet Tests

Per-Facet tests are simple to add if you follow the examples in `test/facets/Greeter.ts`, `test/facets/DiamondERC20.ts` (once imported), and most critically `test/facets/index.ts` which is all that needs to be changed to construct and test Diamonds from the available facets.

A Facet test conforms if: it exposes a `runTest` function that takes the diamond address, the owner, and a counter representing which Facet this is (should account for the 3 Base Facets), and then calls `describe`, passing it the local Facet test callback to execute.

Tests that conform to this pattern need only be required in the `test/facets/index.ts` file and added to array returned by `enabledFacets`. Non-conforming tests can be added/required/adapted into the `test/Diamond.ts` file. The `deployFacets`/`cutFacets`/`removeFacets` functions in `facet.ts` don't currently support the callback option of `diamondCut` (passes empty string), but will amend that to support optional callback functions to execute initialization functions as needed.


## Tasks

### Diamond Management

#### DFM
```console
// Run dfm.install to clone/push your diamond.json dependencies to your project
// NOTE: currently doesn't work. It clones, but won't copy for you when ran via HH task.
npx hardhat dfm-install
```

#### Construction & Deployments
```console
// Deploy Facet, but don't cut
npx hardhat facet-deploy --network localhost --name FarewellFacet

// Deploy & cut new Facet to Diamond
npx hardhat facet-deploy --network localhost --diamond 0xblah --name FarewellFacet

// Deploy & cut upgrade of Facet to Diamond
npx hardhat facet-upgrade --network localhost --diamond 0xblah --name FarewellFacet

// Remove & cut Facet from Diamond
npx hardhat facet-remove --network localhost --diamond 0xblah --name FarewellFacet

// Cut Newly deployed Facet to  Diamond (called by facet-deploy)
npx hardhat cut-add --network localhost --diamond 0xblah --facet 0xblah --name FarewellFacet

// Cut upgraded Facet to Diamond (called by facet-upgrade)
npx hardhat cut-replace --network localhost --diamond 0xblah --facet 0xblah --name FarewellFacet
```

#### Loupe Functions

```console
// Get the facet address for a given function signature
npx hardhat loupe-facet-address --network localhost --diamond 0xblah --func 0xblah

// Get a list of facet addresses for a given diamond
npx hardhat loupe-facet-addresses --network localhost --diamond 0xblah

// Get the selectors for a given facet
npx hardhat loupe-facet-function-selectors --network localhost --diamond 0xblah --facet 0xblah

// Get the facets for a given diamond
npx hardhat loupe-facets --network localhost --diamond 0xblah

```

### Testing Functions (once [DiamondGreeterFacet](https://github.com/proggR/DiamondGreeterFacet) imported)

```console
// Call hello function from GreeterFacet through Diamond contract
npx hardhat call-hello --network localhost --diamond 0xblah
```

### ERC20 Management (once [DiamondERC20Facet](https://github.com/proggR/DiamondERC20Facet) imported)

```console
// Get the total supply for a given diamond
npx hardhat erc20-symbol --network localhost --diamond 0xblah

// Get the total supply for a given diamond
npx hardhat erc20-name --network localhost --diamond 0xblah

// Get the total supply for a given diamond
npx hardhat erc20-decimals --network localhost --diamond 0xblah

// Get the total supply for a given diamond
npx hardhat erc20-total-supply --network localhost --diamond 0xblah

// Get the signer balance for a given diamond
npx hardhat erc20-balance --network localhost --diamond 0xblah

// Get the total supply for a given diamond
npx hardhat erc20-allowance --network localhost --diamond 0xblah --owner 0xblah --spender 0xblah

// Get the total supply for a given diamond
npx hardhat erc20-approve --network localhost --diamond 0xblah --spender 0xblah --amount 1000

// Get the total supply for a given diamond
npx hardhat erc20-transfer --network localhost --diamond 0xblah --to 0xblah --amount 1000

// Get the total supply for a given diamond
npx hardhat erc20-transfer-from --network localhost --diamond 0xblah --from 0xblah --to 0xblah --amount 1000


```

### ERC721 Management (once DiamondERC721Facet imported)

```console
// Get the signer balance for a given diamond
npx hardhat erc721-balance --network localhost --diamond 0xblah

// Get the total supply for a given diamond
npx hardhat erc721-total-supply --network localhost --diamond 0xblah

// Approve a spender for a token ID
npx hardhat erc721-approve --network localhost --diamond 0xblah --spender 0xblah --id 1

// Get approvals for a token ID
npx hardhat erc721-get-approved --network localhost --diamond 0xblah --id 1

// Get approval status for an owner=>operator
npx hardhat erc721-is-approved-for-all --network localhost --diamond 0xblah --owner 0xblah --operator 0xblah

// Get the owner of a token ID
npx hardhat erc721-owner --network localhost --diamond 0xblah --id 1

// Call safeTransferFrom
npx hardhat erc721-safe-transfer-from --network localhost --diamond 0xblah --from 0xblah --to 0xblah --id 1

// Set approval status for an owner=>operator
npx hardhat erc721-set-approved-for-all --network localhost --diamond 0xblah --owner 0xblah --operator 0xblah --approved 0

// Call transferFrom
npx hardhat erc721-transfer-from --network localhost --diamond 0xblah --from 0xblah --to 0xblah --id 1


```

### ERC1155 Management (once DiamondERC1155Facet imported)

```console
// Get the signer balance for a given diamond and token ID
npx hardhat erc1155-balance --network localhost --diamond 0xblah --id 1

// Get the total supply for a given diamond and token ID
npx hardhat erc1155-total-supply --network localhost --diamond 0xblah --id 1

// Get the signer balance for a given diamond and token ID
npx hardhat erc1155-balance-batch --network localhost --diamond 0xblah --id 1

// Get the signer balance for a given diamond and token ID
npx hardhat erc1155-is-approved-for-all --network localhost --diamond 0xblah --owner 0xblah --operator 0xblah

// Get the signer balance for a given diamond and token ID
npx hardhat erc1155-safe-batch-transfer-from --network localhost --diamond 0xblah --from 0xblah --to 0xblah --id 1 --amount 1

// Get the signer balance for a given diamond and token ID
npx hardhat erc1155-safe-transfer-from --network localhost --diamond 0xblah  --from 0xblah --to 0xblah --id 1 --amount 1

// Get the signer balance for a given diamond and token ID
npx hardhat erc1155-set-approved-for-all --network localhost --diamond 0xblah  --operator 0xblah --approved 0

```

# Diamond-3

This is an implementation for [EIP-2535 Diamond Standard](https://github.com/ethereum/EIPs/issues/2535). To learn about other implementations go here: https://github.com/mudgen/diamond

The standard loupe functions have been gas-optimized in this implementation and can be called in on-chain transactions. However keep in mind that a diamond can have any number of functions and facets so it is still possible to get out-of-gas errors when calling loupe functions. Except for the `facetAddress` loupe function which has a fixed gas cost.

**Note:** The loupe functions in DiamondLoupeFacet.sol MUST be added to a diamond and are required by the EIP-2535 Diamonds standard.


### How the lib/diamond/deploy.ts script works

1. DiamondCutFacet is deployed.
1. The diamond is deployed, passing as arguments to the diamond constructor the owner address of the diamond and the DiamondCutFacet address. DiamondCutFacet has the `diamondCut` external function which is used to upgrade the diamond to add more functions.
1. The `DiamondInit` contract is deployed. This contains an `init` function which is called on the first diamond upgrade to initialize state of some state variables. Information on how the `diamondCut` function works is here: https://eips.ethereum.org/EIPS/eip-2535#diamond-interface
1. Facets are deployed.
1. The diamond is upgraded. The `diamondCut` function is used to add functions from facets to the diamond. In addition the `diamondCut` function calls the `init` function from the `DiamondInit` contract using `delegatecall` to initialize state variables.

How a diamond is deployed is not part of the EIP-2535 Diamonds standard. This implementation shows a usable example.


## Upgrade a diamond

Check `tasks/diamond/facet-upgrade.js`, `lib/diamond/facet.ts`, `test/Diamond.ts`, and `test/facets/Farewell.ts` for examples of upgrades.

Note that upgrade functionality is optional. It is possible to deploy a diamond that can't be upgraded, which is a 'Single Cut Diamond'.  It is also possible to deploy an upgradeable diamond and at a later date remove its `diamondCut` function so it can't be upgraded any more.

Note that any number of functions from any number of facets can be added/replaced/removed on a diamond in a single transaction. In addition an initialization function can be executed in the same transaction as an upgrade to initialize any state variables required for an upgrade. This 'everything done in a single transaction' capability ensures a diamond maintains a correct and consistent state during upgrades.

## Facet Information

The `contracts/Diamond.sol` file shows an example of implementing a diamond.

The `contracts/facets/DiamondCutFacet.sol` file shows how to implement the `diamondCut` external function.

The `contracts/facets/DiamondLoupeFacet.sol` file shows how to implement the four standard loupe functions.

The `contracts/libraries/LibDiamond.sol` file shows how to implement Diamond Storage and a `diamondCut` internal function.

The `lib/diamond/deploy.ts` file shows how to deploy a diamond.

`test/Diamond.ts` and `test/facets/Farewell.ts` gives tests for the `diamondCut` function and the Diamond Loupe functions.

## How to Get Started Making Your Diamond

1. Reading and understand [EIP-2535 Diamonds](https://github.com/ethereum/EIPs/issues/2535). If something is unclear let me know!

2. Use a diamond reference implementation. You are at the right place because this is the README for a diamond reference implementation.

This diamond implementation is boilerplate code that makes a diamond compliant with EIP-2535 Diamonds.

Specifically you can copy and use the [DiamondCutFacet.sol](./contracts/facets/DiamondCutFacet.sol) and [DiamondLoupeFacet.sol](./contracts/facets/DiamondLoupeFacet.sol) contracts. They implement the `diamondCut` function and the loupe functions.

The [Diamond.sol](./contracts/Diamond.sol) contract could be used as is, or it could be used as a starting point and customized. This contract is the diamond. Its deployment creates a diamond. It's address is a stable diamond address that does not change.

The [LibDiamond.sol](./contracts/libraries/LibDiamond.sol) library could be used as is. It shows how to implement Diamond Storage. This contract includes contract ownership which you might want to change if you want to implement DAO-based ownership or other form of contract ownership. Go for it. Diamonds can work with any kind of contract ownership strategy. This library contains an internal function version of `diamondCut` that can be used in the constructor of a diamond or other places.

## Calling Diamond Functions

In order to call a function that exists in a diamond you need to use the ABI information of the facet that has the function.

Here is an example that uses web3.js:

```javascript
let myUsefulFacet = new web3.eth.Contract(MyUsefulFacet.abi, diamondAddress);
```

In the code above we create a contract variable so we can call contract functions with it.

In this example we know we will use a diamond because we pass a diamond's address as the second argument. But we are using an ABI from the MyUsefulFacet facet so we can call functions that are defined in that facet. MyUsefulFacet's functions must have been added to the diamond (using diamondCut) in order for the diamond to use the function information provided by the ABI of course.

Similarly you need to use the ABI of a facet in Solidity code in order to call functions from a diamond. Here's an example of Solidity code that calls a function from a diamond:

```solidity
string result = MyUsefulFacet(address(diamondContract)).getResult()
```

## Get Help and Join the Community

If you need help or would like to discuss diamonds then send Nick a message [on twitter](https://twitter.com/mudgen), or [email him](mailto:nick@perfectabstractions.com). Or join the [EIP-2535 Diamonds Discord server](https://discord.gg/kQewPw2).

## Useful Links
1. [Introduction to the Diamond Standard, EIP-2535 Diamonds](https://eip2535diamonds.substack.com/p/introduction-to-the-diamond-standard)
1. [EIP-2535 Diamonds](https://github.com/ethereum/EIPs/issues/2535)
1. [Understanding Diamonds on Ethereum](https://dev.to/mudgen/understanding-diamonds-on-ethereum-1fb)
1. [Solidity Storage Layout For Proxy Contracts and Diamonds](https://medium.com/1milliondevs/solidity-storage-layout-for-proxy-contracts-and-diamonds-c4f009b6903)
1. [New Storage Layout For Proxy Contracts and Diamonds](https://medium.com/1milliondevs/new-storage-layout-for-proxy-contracts-and-diamonds-98d01d0eadb)
1. [Upgradeable smart contracts using the Diamond Standard](https://hiddentao.com/archives/2020/05/28/upgradeable-smart-contracts-using-diamond-standard)
1. [buidler-deploy supports diamonds](https://github.com/wighawag/buidler-deploy/)

## Author

Diamond spec and original example implementation was written by Nick Mudge.

DFM, Hardhat Tasks and some adjustments to the JS library made by @proggR

Contact Nick:

- https://twitter.com/mudgen
- nick@perfectabstractions.com

Contact @proggR:

- https://deit.ca
- proggR@pm.me

## License

MIT license. See the license file.
Anyone can use or modify this software for their purposes.
