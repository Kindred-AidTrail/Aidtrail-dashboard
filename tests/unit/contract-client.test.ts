import { describe, it, expect } from 'vitest';
import {
  SorobanContractClient,
  toStroops,
  fromStroops,
  mapCategoryToSymbol,
} from '../../src/lib/contract-client';

describe('SorobanContractClient & Precision Utilities', () => {
  it('instantiates client with valid testnet RPC and contract ID', () => {
    const client = new SorobanContractClient(
      'CAIDTRAILTESTNETCONTRACTADDRESS000000000000000000000000000000',
      'https://soroban-testnet.stellar.org'
    );
    expect(client).toBeDefined();
  });

  it('accurately converts human amounts to 7-decimal Stellar stroops', () => {
    expect(toStroops(1)).toBe(10_000_000n);
    expect(toStroops(50)).toBe(500_000_000n);
    expect(toStroops('25.5')).toBe(255_000_000n);
    expect(fromStroops(500_000_000n)).toBe(50);
  });

  it('maps descriptive UI categories to canonical Soroban symbols', () => {
    expect(mapCategoryToSymbol('Clean Water & Sanitation')).toBe('WATER');
    expect(mapCategoryToSymbol('Emergency Food & Nutrition')).toBe('FOOD');
    expect(mapCategoryToSymbol('Medical Pharmacy')).toBe('HEALTH');
    expect(mapCategoryToSymbol('Shelter Materials')).toBe('SHELTER');
    expect(mapCategoryToSymbol('unknown')).toBe('FOOD');
  });

  it('simulates contract actions gracefully in client environment', async () => {
    const client = new SorobanContractClient(
      'CAIDTRAILTESTNETCONTRACTADDRESS000000000000000000000000000000',
      'https://soroban-testnet.stellar.org'
    );
    const fundResult = await client.fundProgram(
      1,
      toStroops(100),
      'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5'
    );
    expect(fundResult).toHaveProperty('success');

    const voucherResult = await client.redeemVoucher(
      101,
      'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5',
      'GDUKMGUGDZQK6YHYA5Z6TI2GLVEOJR6K2GTI2GLVEGYZ745PUMF43AOP'
    );
    expect(voucherResult).toHaveProperty('success');
  });
});
