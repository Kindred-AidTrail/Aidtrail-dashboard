import { STELLAR_NETWORK, CONTRACT_CONFIG, API_CONFIG } from './constants';

export function getNetworkConfig() {
  return {
    networkPassphrase: STELLAR_NETWORK.PASSPHRASE,
    rpcUrl: STELLAR_NETWORK.RPC_URL,
    horizonUrl: STELLAR_NETWORK.HORIZON_URL,
    contractId: CONTRACT_CONFIG.AIDTRAIL_CONTRACT_ID,
    nativeAssetContractId: CONTRACT_CONFIG.NATIVE_ASSET_CONTRACT_ID,
    registryApiUrl: API_CONFIG.REGISTRY_API_URL,
    homeDomain: API_CONFIG.HOME_DOMAIN,
    ipfsGateway: API_CONFIG.IPFS_GATEWAY,
    explorerBaseUrl: API_CONFIG.EXPLORER_BASE_URL,
  };
}

export function getExplorerTxUrl(txHash: string): string {
  return `${API_CONFIG.EXPLORER_BASE_URL}/tx/${txHash}`;
}

export function getExplorerAccountUrl(account: string): string {
  return `${API_CONFIG.EXPLORER_BASE_URL}/account/${account}`;
}

export function getExplorerContractUrl(contractId: string): string {
  return `${API_CONFIG.EXPLORER_BASE_URL}/contract/${contractId}`;
}
