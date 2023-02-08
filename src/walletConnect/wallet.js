import { SafeConnector } from '@gnosis.pm/safe-apps-wagmi'
import { configureChains, createClient,watchNetwork } from '@wagmi/core'
import { goerli, mainnet, polygon, polygonMumbai } from '@wagmi/core/chains'
// import { WalletConnectConnector } from '@wagmi/core/connectors/walletConnect';
import { EthereumClient, modalConnectors, walletConnectProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/html'

// 1. Define constants
const projectId = 'fbfdbb1de5edf959542332ca2fd47946'
const chains = [mainnet, goerli, polygonMumbai, polygon]

// 2. Configure wagmi client
const { provider } = configureChains(chains, [walletConnectProvider({ projectId })])
const wagmiClient = createClient({
  autoConnect: true,
  connectors: [...modalConnectors({ appName: 'web3Modal', chains }), new SafeConnector({ chains })],
  provider
})

// 3. Create ethereum and modal clients
const ethereumClient = new EthereumClient(wagmiClient, chains)
export const web3Modal = new Web3Modal(
  {
    projectId,
    walletImages: {
      safe: 'https://pbs.twimg.com/profile_images/1566773491764023297/IvmCdGnM_400x400.jpg'
    }
  },
  ethereumClient
)
