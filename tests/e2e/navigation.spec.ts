import { test, expect } from '@playwright/test';

test.describe('AidTrail Portal Navigation and Role Access', () => {
  test('landing page loads and renders key call-to-actions', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Kindred AidTrail/);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.getByRole('link', { name: /Explore Public Audit/i })).toBeVisible();
  });

  test('public audit explorer displays programs directory and solvency stats', async ({ page }) => {
    await page.goto('/explorer');
    await expect(page.locator('h1')).toContainText(/Public Humanitarian Audit Explorer/i);
    await expect(page.getByPlaceholder(/Search programs/i)).toBeVisible();
  });

  test('donor portal displays funding options and milestone releases', async ({ page }) => {
    await page.goto('/donor');
    await expect(page.locator('h1')).toContainText(/Donor Impact Portal/i);
  });

  test('beneficiary wallet interface renders mobile-friendly balance pass', async ({ page }) => {
    await page.goto('/beneficiary');
    await expect(page.getByText(/Total Available Aid Balance/i)).toBeVisible();
  });

  test('vendor portal enables simulated camera optical scanner', async ({ page }) => {
    await page.goto('/vendor');
    await expect(page.locator('h1')).toContainText(/Vendor Redemption Terminal/i);
    await expect(page.getByRole('button', { name: /Simulate Customer QR Scan/i })).toBeVisible();
  });

  test('verifier portal loads milestone attestation and quorum reviews', async ({ page }) => {
    await page.goto('/verifier');
    await expect(page.locator('h1')).toContainText(/Milestone Verification & Attestation/i);
  });
});
