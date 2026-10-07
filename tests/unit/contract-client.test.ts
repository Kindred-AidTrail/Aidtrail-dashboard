import { describe, it, expect } from 'vitest';
import { SorobanContractClient } from '../../src/lib/contract-client';

describe('SorobanContractClient Simulation Wrapper', () => {
  it('instantiates client with valid testnet RPC and contract ID', () => {
    const client = new SorobanContractClient(
      'CAIDTRAILTESTNETCONTRACTADDRESS000000000000000000000000000000',
      'https://soroban-testnet.stellar.org'
    );
    expect(client).toBeDefined();
  });

  it('safely handles missing parameters during dry-run simulation', async () => {
    const client = new SorobanContractClient(
      'CAIDTRAILTESTNETCONTRACTADDRESS000000000000000000000000000000',
      'https://soroban-testnet.stellar.org'
    );
    const result = await client.fundProgram(1, BigInt(1000000), 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5');
    expect(result).toHaveProperty('success');
  });
});
