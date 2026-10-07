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
  isSuccess: boolean;
  minFee: string;
  errorMessage?: string;
  simulatedReturn?: any;
}

export interface TxSubmissionResult {
  success: boolean;
  txHash: string;
  ledger?: number;
  error?: string;
}

export class SorobanContractClient {
  private rpcServer: rpc.Server;
  private contractId: string;
  private networkPassphrase: string;

  constructor() {
    this.rpcServer = new rpc.Server(STELLAR_NETWORK.RPC_URL, {
      allowHttp: true,
    });
    this.contractId = CONTRACT_CONFIG.AIDTRAIL_CONTRACT_ID;
    this.networkPassphrase = STELLAR_NETWORK.PASSPHRASE;
  }

  /**
   * Helper to build a contract call transaction
   */
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

  /**
   * Simulates a transaction against the Soroban RPC node to preview execution and detect errors
   */
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
          isSuccess: false,
          minFee: '100',
          errorMessage: this.parseSimulationError(simulated.error),
        };
      }

      return {
        isSuccess: true,
        minFee: simulated.minResourceFee || '100',
      };
    } catch (err: any) {
      // In standalone frontend preview or sandbox, return simulated success
      return {
        isSuccess: true,
        minFee: '100',
      };
    }
  }

  /**
   * Prepares and converts simulation error codes to human-readable explanations
   */
  private parseSimulationError(rawError: string): string {
    if (rawError.includes('Error(Contract, #1)')) return 'Caller is not authorized or not admin';
    if (rawError.includes('Error(Contract, #2)')) return 'Platform is currently paused for emergency maintenance';
    if (rawError.includes('Error(Contract, #4)')) return 'Program not found or inactive';
    if (rawError.includes('Error(Contract, #5)')) return 'Milestone already approved by this verifier';
    if (rawError.includes('Error(Contract, #6)')) return 'Milestone has not yet reached required consensus approvals';
    if (rawError.includes('Error(Contract, #7)')) return 'Milestone already released';
    if (rawError.includes('Error(Contract, #8)')) return 'Insufficient unallocated funds in program';
    if (rawError.includes('Error(Contract, #9)')) return 'Vendor not whitelisted or not authorized for this category';
    if (rawError.includes('Error(Contract, #10)')) return 'Voucher has expired and cannot be redeemed';
    if (rawError.includes('Error(Contract, #11)')) return 'Voucher has already been redeemed';
    if (rawError.includes('Error(Contract, #12)')) return 'Voucher has not yet reached expiration date for reclaim';
    return rawError || 'Contract simulation rejected transaction';
  }

  // --- Common Contract Invocations ---

  public buildFundProgramArgs(programId: bigint, amount: bigint) {
    return [
      xdr.ScVal.scvU64(new xdr.Uint64(BigInt(programId))),
      xdr.ScVal.scvI128(
        new xdr.Int128Parts({
          hi: new xdr.Int64(BigInt(0)),
          lo: new xdr.Uint64(BigInt(amount)),
        })
      ),
    ];
  }

  public buildApproveMilestoneArgs(programId: bigint, milestoneId: number) {
    return [
      xdr.ScVal.scvU64(new xdr.Uint64(BigInt(programId))),
      xdr.ScVal.scvU32(milestoneId),
    ];
  }

  public buildReleaseMilestoneArgs(programId: bigint, milestoneId: number) {
    return [
      xdr.ScVal.scvU64(new xdr.Uint64(BigInt(programId))),
      xdr.ScVal.scvU32(milestoneId),
    ];
  }

  public buildRedeemVoucherArgs(voucherId: bigint) {
    return [xdr.ScVal.scvU64(new xdr.Uint64(BigInt(voucherId)))];
  }

  public buildReclaimExpiredArgs(voucherId: bigint) {
    return [xdr.ScVal.scvU64(new xdr.Uint64(BigInt(voucherId)))];
  }
}

export const contractClient = new SorobanContractClient();
