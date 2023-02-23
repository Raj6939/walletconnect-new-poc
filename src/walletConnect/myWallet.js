import { configureChains, createClient } from '@wagmi/core';
import { goerli, mainnet, polygon, polygonMumbai } from '@wagmi/core/chains';
// import toast from "../elements/toast"
// import { WalletConnectConnector } from '@wagmi/core/connectors/walletConnect';
import { EthereumClient, modalConnectors,walletConnectProvider } from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/html';

// import type { RuntimeConfiguration } from '@/plugins/runtimeConfiguration';
// import { store } from '@/store/store';

let web3modal;

const initWalletConnect = () => {
    const chains = [mainnet, goerli, polygonMumbai, polygon]
    const projectId = "fbfdbb1de5edf959542332ca2fd47946";

    // const wcConnector = new WalletConnectConnector({
    //     chains: chains,
    //     options: {
    //         version: '2',
    //         projectId,
    //     },
    // });

    // const { provider, webSocketProvider } = configureChains(chains, [walletConnectProvider({ projectId })]);
    // const wagmiClient = createClient({
    //     autoConnect: true,
    //     connectors: [wcConnector],
    //     provider,
    //     webSocketProvider,
    // });

    const { provider, webSocketProvider } = configureChains(chains, [walletConnectProvider({ projectId })]);
    const wagmiClient = createClient({
        autoConnect: true,
        connectors: modalConnectors({ appName: 'Reward Dist Poc', chains }),
        provider,
        webSocketProvider,
    });

    const ethereumClient = new EthereumClient(wagmiClient, chains);

    web3modal = new Web3Modal(
        { projectId, themeMode: 'dark', themeColor: 'blue', themeBackground: 'gradient' },
        ethereumClient
    );

    // watchNetwork(network => {
    //     console.log(network)
    //     // if (network.chains.length !== 0) {
    //     //     console.log(network.chains)
    //     //     const isChainValid = network.chains[0].id === network?.chain?.id;
    //     //     console.log(isChainValid)
    //     // }
    // });
    //  watchAccount(account =>{        
    //     console.log(account)
    //     // toast('connected','success')
    //  })
    // switchNetwork(chain =>{
    //     console.log(chain)
    // });
    // const network = await switchNetwork({
    //     chainId: 5,
    //   })
    // console.log(network)
};
// mixi:[toast]
export { initWalletConnect, web3modal };