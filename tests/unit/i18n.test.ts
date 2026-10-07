import { describe, it, expect } from 'vitest';
import { TRANSLATIONS } from '../../src/i18n/translations';

describe('i18n Translations Dictionary', () => {
  it('supports English, Swahili and Arabic locales', () => {
    expect(TRANSLATIONS).toHaveProperty('en');
    expect(TRANSLATIONS).toHaveProperty('sw');
    expect(TRANSLATIONS).toHaveProperty('ar');
  });

  it('contains consistent translation keys across all languages', () => {
    const enKeys = Object.keys(TRANSLATIONS.en);
    const swKeys = Object.keys(TRANSLATIONS.sw);
    const arKeys = Object.keys(TRANSLATIONS.ar);

    expect(enKeys.length).toBeGreaterThan(10);
    expect(swKeys).toEqual(expect.arrayContaining(['common.appName', 'roles.donor', 'roles.beneficiary']));
    expect(arKeys).toEqual(expect.arrayContaining(['common.appName', 'roles.donor', 'roles.beneficiary']));
  });

  it('translates app name correctly in Swahili and Arabic', () => {
    expect(TRANSLATIONS.sw['common.appName']).toBe('Kindred AidTrail');
    expect(TRANSLATIONS.ar['common.appName']).toBe('كيندريد إيدتريل');
  });
});
