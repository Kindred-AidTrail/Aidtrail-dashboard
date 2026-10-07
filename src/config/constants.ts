export const STELLAR_NETWORK = {
  PASSPHRASE:
    process.env.NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE ||
    'Test SDF Network ; September 2015',
  RPC_URL:
    process.env.NEXT_PUBLIC_SOROBAN_RPC_URL ||
    'https://soroban-testnet.stellar.org',
  HORIZON_URL:
    process.env.NEXT_PUBLIC_HORIZON_URL ||
    'https://horizon-testnet.stellar.org',
  NETWORK_NAME: 'TESTNET',
} as const;

export const CONTRACT_CONFIG = {
  AIDTRAIL_CONTRACT_ID:
    process.env.NEXT_PUBLIC_CONTRACT_ID ||
    'CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD2KM',
  NATIVE_ASSET_CONTRACT_ID:
    process.env.NEXT_PUBLIC_NATIVE_ASSET_CONTRACT_ID ||
    'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC',
} as const;

export const API_CONFIG = {
  REGISTRY_API_URL:
    process.env.NEXT_PUBLIC_REGISTRY_API_URL || 'http://localhost:4000',
  HOME_DOMAIN:
    process.env.NEXT_PUBLIC_HOME_DOMAIN || 'api.aidtrail.kindred.org',
  IPFS_GATEWAY:
    process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://ipfs.io/ipfs',
  EXPLORER_BASE_URL:
    process.env.NEXT_PUBLIC_EXPLORER_URL ||
    'https://stellar.expert/explorer/testnet',
} as const;

export type UserRole =
  | 'DONOR'
  | 'NGO'
  | 'VERIFIER'
  | 'BENEFICIARY'
  | 'VENDOR'
  | 'PUBLIC';

export interface CategoryMeta {
  id: string;
  name: string;
  color: string;
  bgColor: string;
  borderColor: string;
  iconName: string;
}

export const AID_CATEGORIES: Record<string, CategoryMeta> = {
  FOOD: {
    id: 'FOOD',
    name: 'Food & Nutrition',
    color: '#10B981',
    bgColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.25)',
    iconName: 'Apple',
  },
  HEALTH: {
    id: 'HEALTH',
    name: 'Healthcare & Medical',
    color: '#06B6D4',
    bgColor: 'rgba(6, 182, 212, 0.1)',
    borderColor: 'rgba(6, 182, 212, 0.25)',
    iconName: 'Activity',
  },
  SHELTER: {
    id: 'SHELTER',
    name: 'Shelter & Non-Food',
    color: '#8B5CF6',
    bgColor: 'rgba(139, 92, 246, 0.1)',
    borderColor: 'rgba(139, 92, 246, 0.25)',
    iconName: 'Home',
  },
  EDUCATION: {
    id: 'EDUCATION',
    name: 'Education & Supplies',
    color: '#F59E0B',
    bgColor: 'rgba(245, 158, 11, 0.1)',
    borderColor: 'rgba(245, 158, 11, 0.25)',
    iconName: 'BookOpen',
  },
  UTILITIES: {
    id: 'UTILITIES',
    name: 'Water & Utilities',
    color: '#3B82F6',
    bgColor: 'rgba(59, 130, 246, 0.1)',
    borderColor: 'rgba(59, 130, 246, 0.25)',
    iconName: 'Droplet',
  },
  EMERGENCY: {
    id: 'EMERGENCY',
    name: 'Emergency Relief',
    color: '#EF4444',
    bgColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.25)',
    iconName: 'AlertTriangle',
  },
};
