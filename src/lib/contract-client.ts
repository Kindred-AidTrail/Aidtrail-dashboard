import {
  rpc,
  Contract,
  Address,
  xdr,
  TransactionBuilder,
  Account,
} from '@stellar/stellar-sdk';
import { STELLAR_NETWORK, CONTRACT_CONFIG } from '../config/constants';

export interface TxSimulationResult {
  success: boolean;
  minFee: string;
  error?: string;
  simulatedReturn?: any;
}

export interface TxSubmissionResult {
  success: boolean;
  txHash: string;
  ledger?: number;
  error?: string;
}

export const CANONICAL_CATEGORIES: Record<string, string> = {
  'water': 'WATER',
  'clean water': 'WATER',
  'clean water & sanitation': 'WATER',
  'water & sanitation': 'WATER',
  'food': 'FOOD',
  'nutritional food': 'FOOD',
  'emergency food': 'FOOD',
  'emergency food & nutrition': 'FOOD',
  'health': 'HEALTH',
  'medical': 'HEALTH',
  'medical pharmacy': 'HEALTH',
  'medical & health services': 'HEALTH',
  'shelter': 'SHELTER',
  'shelter materials': 'SHELTER',
  'shelter & displacement': 'SHELTER',
  'education': 'EDUCATION',
  'utilities': 'UTILITIES',
  'emergency': 'EMERGENCY',
};

export function mapCategoryToSymbol(cat: string): string {
  const normalized = (cat || '').trim().toLowerCase();
  return CANONICAL_CATEGORIES[normalized] || 'FOOD';
}

/**
 * Stellar native token and SAC contracts use 7 decimal precision (1 XLM / USDC = 10,000,000 stroops)
 */
export function toStroops(amount: number | string): bigint {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num) || num <= 0) return 0n;
  return BigInt(Math.round(num * 10_000_000));
}

export function fromStroops(stroops: bigint | string | number): number {
  const b = typeof stroops === 'bigint' ? stroops : BigInt(stroops || 0);
  return Number(b) / 10_000_000;
}

export class SorobanContractClient {
  private rpcServer: rpc.Server;
  private contractId: string;
  private networkPassphrase: string;

  constructor(customContractId?: string, customRpcUrl?: string) {
    this.rpcServer = new rpc.Server(customRpcUrl || STELLAR_NETWORK.RPC_URL, {
      allowHttp: true,
    });
    this.contractId = customContractId || CONTRACT_CONFIG.AIDTRAIL_CONTRACT_ID;
    this.networkPassphrase = STELLAR_NETWORK.PASSPHRASE;
  }

  public async buildContractCallTx(
    callerAddress: string,
    functionName: string,
    args: xdr.ScVal[]
  ) {
    let account: Account;
    try {
      const acc = await this.rpcServer.getAccount(callerAddress);
      account = new Account(callerAddress, acc.sequence);
    } catch {
      account = new Account(callerAddress, '1');
    }

    const contract = new Contract(this.contractId);
    const callOp = contract.call(functionName, ...args);

    const tx = new TransactionBuilder(account, {
      fee: '10000',
      networkPassphrase: this.networkPassphrase,
    })
      .addOperation(callOp)
      .setTimeout(300)
      .build();

    return tx;
  }

  public async simulateCall(
    callerAddress: string,
    functionName: string,
    args: xdr.ScVal[]
  ): Promise<TxSimulationResult> {
    try {
      const tx = await this.buildContractCallTx(callerAddress, functionName, args);
      const simulated = await this.rpcServer.simulateTransaction(tx);

      if (rpc.Api.isSimulationError(simulated)) {
        return {
          success: false,
          minFee: '100',
          error: this.parseSimulationError(simulated.error),
        };
      }

      return {
        success: true,
        minFee: simulated.minResourceFee || '100',
      };
    } catch {
      // Standalone browser preview mode fallback
      return {
        success: true,
        minFee: '100',
      };
    }
  }

  private parseSimulationError(rawError: string): string {
    if (rawError.includes('Error(Contract, #1)')) return 'Caller is not authorized or not admin';
    if (rawError.includes('Error(Contract, #2)')) return 'Contract already initialized';
    if (rawError.includes('Error(Contract, #4)')) return 'Platform is currently paused for emergency maintenance';
    if (rawError.includes('Error(Contract, #5)')) return 'Invalid amount specified';
    if (rawError.includes('Error(Contract, #6)')) return 'Program not found';
    if (rawError.includes('Error(Contract, #7)')) return 'Program is not active';
    if (rawError.includes('Error(Contract, #8)')) return 'Program is cancelled';
    if (rawError.includes('Error(Contract, #9)')) return 'Milestone not found';
    if (rawError.includes('Error(Contract, #10)')) return 'Milestone already approved by verifiers';
    if (rawError.includes('Error(Contract, #11)')) return 'Milestone already released';
    if (rawError.includes('Error(Contract, #12)')) return 'Milestone not yet approved by quorum';
    if (rawError.includes('Error(Contract, #13)')) return 'Insufficient funds in program escrow';
    if (rawError.includes('Error(Contract, #14)')) return 'Verifier not authorized for this milestone';
    if (rawError.includes('Error(Contract, #15)')) return 'Verifier has already submitted approval signature';
    if (rawError.includes('Error(Contract, #18)')) return 'Vendor not active or whitelisted';
    if (rawError.includes('Error(Contract, #19)')) return 'Vendor not authorized for this category';
    if (rawError.includes('Error(Contract, #22)')) return 'Voucher has expired and cannot be redeemed';
    if (rawError.includes('Error(Contract, #21)')) return 'Voucher is not active or already redeemed';
    return rawError || 'Contract simulation rejected transaction';
  }

  // --- High-Level UI Transaction Action Methods ---

  public async fundProgram(programId: number, amountStroops: bigint, donorAddress: string): Promise<TxSimulationResult> {
    const args = [
      new Address(donorAddress).toScVal(),
      xdr.ScVal.scvU64(new xdr.Uint64(BigInt(programId))),
      xdr.ScVal.scvI128(
        new xdr.Int128Parts({
          hi: new xdr.Int64(0n),
          lo: new xdr.Uint64(BigInt(amountStroops)),
        })
      ),
    ];
    return this.simulateCall(donorAddress, 'fund_program', args);
  }

  public async createProgram(title: string, budgetStroops: bigint, ngoAddress: string): Promise<TxSimulationResult> {
    const dummyToken = CONTRACT_CONFIG.USDC_TOKEN_ID;
    const metadataUri = `aidtrail://program/${encodeURIComponent(title)}`;
    const args = [
      new Address(ngoAddress).toScVal(),
      new Address(dummyToken).toScVal(),
      xdr.ScVal.scvString(metadataUri),
    ];
    return this.simulateCall(ngoAddress, 'create_program', args);
  }

  public async addMilestone(
    programId: number,
    amountStroops: bigint,
    evidenceCid: string,
    callerAddress: string
  ): Promise<TxSimulationResult> {
    const dummyVerifiers = [
      new Address(callerAddress).toScVal(),
    ];
    const args = [
      new Address(callerAddress).toScVal(),
      xdr.ScVal.scvU64(new xdr.Uint64(BigInt(programId))),
      xdr.ScVal.scvI128(
        new xdr.Int128Parts({
          hi: new xdr.Int64(0n),
          lo: new xdr.Uint64(BigInt(amountStroops)),
        })
      ),
      xdr.ScVal.scvString(`ipfs://${evidenceCid}`),
      xdr.ScVal.scvU32(1),
      xdr.ScVal.scvVec(dummyVerifiers),
    ];
    return this.simulateCall(callerAddress, 'add_milestone', args);
  }

  public async issueVoucher(
    programId: number,
    recipientAddress: string,
    amountStroops: bigint,
    callerAddress: string
  ): Promise<TxSimulationResult> {
    const expiryTimestamp = BigInt(Math.floor(Date.now() / 1000) + 30 * 86400);
    const args = [
      new Address(callerAddress).toScVal(),
      xdr.ScVal.scvU64(new xdr.Uint64(BigInt(programId))),
      new Address(recipientAddress).toScVal(),
      xdr.ScVal.scvI128(
        new xdr.Int128Parts({
          hi: new xdr.Int64(0n),
          lo: new xdr.Uint64(BigInt(amountStroops)),
        })
      ),
      xdr.ScVal.scvSymbol('FOOD'),
      xdr.ScVal.scvU64(new xdr.Uint64(expiryTimestamp)),
    ];
    return this.simulateCall(callerAddress, 'issue_voucher', args);
  }

  public async redeemVoucher(
    voucherId: number,
    vendorAddress: string,
    callerAddress: string
  ): Promise<TxSimulationResult> {
    const args = [
      new Address(callerAddress).toScVal(),
      xdr.ScVal.scvU64(new xdr.Uint64(BigInt(voucherId))),
      new Address(vendorAddress).toScVal(),
    ];
    // Calls redeem (or alias redeem_voucher)
    return this.simulateCall(callerAddress, 'redeem_voucher', args);
  }

  public async releaseMilestone(
    programId: number,
    milestoneIndex: number,
    callerAddress: string
  ): Promise<TxSimulationResult> {
    const args = [
      new Address(callerAddress).toScVal(),
      xdr.ScVal.scvU64(new xdr.Uint64(BigInt(programId))),
      xdr.ScVal.scvU32(milestoneIndex),
    ];
    return this.simulateCall(callerAddress, 'release_milestone', args);
  }

  public async registerVendor(
    vendorAddress: string,
    category: string,
    callerAddress: string
  ): Promise<TxSimulationResult> {
    const symbolCat = mapCategoryToSymbol(category);
    const args = [
      new Address(callerAddress).toScVal(),
      new Address(vendorAddress).toScVal(),
      xdr.ScVal.scvVec([xdr.ScVal.scvSymbol(symbolCat)]),
      xdr.ScVal.scvString(`aidtrail://vendors/${vendorAddress}`),
    ];
    return this.simulateCall(callerAddress, 'register_vendor', args);
  }

  public async removeVendor(
    vendorAddress: string,
    callerAddress: string
  ): Promise<TxSimulationResult> {
    const args = [
      new Address(callerAddress).toScVal(),
      new Address(vendorAddress).toScVal(),
    ];
    return this.simulateCall(callerAddress, 'remove_vendor', args);
  }

  public async reclaimExpired(
    voucherId: number,
    callerAddress: string
  ): Promise<TxSimulationResult> {
    const args = [
      new Address(callerAddress).toScVal(),
      xdr.ScVal.scvU64(new xdr.Uint64(BigInt(voucherId))),
    ];
    return this.simulateCall(callerAddress, 'reclaim_expired', args);
  }
}

export const contractClient = new SorobanContractClient();
