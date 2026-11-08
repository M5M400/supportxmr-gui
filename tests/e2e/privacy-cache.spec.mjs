import { test, expect } from "@playwright/test";
import { expectHashParams, expectHashPath, mockApi, openApp, VALID_WALLET, waitForStableMicrotasks } from "./fixtures.mjs";

test("GDPR local-history banner allow and deny paths update visible wallet behavior", async ({ page }) => {
  const api = await mockApi(page);
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "language", { value: "de-DE", configurable: true });
  });
  await openApp(page, "#/");

  await expect(page.locator(".local-history-consent")).toBeVisible();
  await page.locator("#cno").click();
  await expect(page.locator(".local-history-consent")).toHaveCount(0);
  await expect(page.locator("[data-wallet-submit]")).toHaveText("Temporary track wallet");
  await expect(page.evaluate(() => localStorage.getItem("mo.wallets.v1"))).resolves.toBeNull();

  await openApp(page, "#/help");
  await openPrivacySupport(page);
  await page.locator("[data-local-history]").click();
  await expect(page.locator("[data-local-history]")).toHaveAttribute("aria-pressed", "true");
  await openApp(page, "#/");
  await expect(page.locator("[data-wallet-submit]")).toHaveText("Track wallet");
  api.assertNoConsoleErrors();
});

test("GDPR deny and disable paths clear all optional browser persistence", async ({ page, context }) => {
  const api = await mockApi(page);
  await context.addCookies([
    { name: "mo.theme", value: "light", url: "http://127.0.0.1:4173/" },
    { name: "mo.explain", value: "off", url: "http://127.0.0.1:4173/" }
  ]);
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "language", { value: "de-DE", configurable: true });
  });

  await openApp(page, "#/");
  await expect(page.locator(".local-history-consent")).toBeVisible();
  await page.evaluate((wallet) => {
    localStorage.setItem("mo.wallets.v1", JSON.stringify([{ address: wallet, time: Date.now() }]));
    localStorage.setItem("mo.motd.dismissed.v1", "old-notice");
  }, VALID_WALLET);
  await page.locator("#cno").click();
  await expectStorageAudit(page, {
    consent: false,
    wallets: null,
    motd: null,
    themeCookie: "",
    explainCookie: ""
  });

  await page.reload();
  await expect(page.locator(".local-history-consent")).toHaveCount(0);
  await expect(page.locator("[data-wallet-submit]")).toHaveText("Temporary track wallet");
  await expectStorageAudit(page, {
    consent: false,
    wallets: null,
    motd: null,
    themeCookie: "",
    explainCookie: ""
  });

  await openApp(page, "#/help");
  await openPrivacySupport(page);
  await page.locator("[data-local-history]").click();
  await openApp(page, "#/");
  await page.locator("#ai").fill(VALID_WALLET);
  await page.locator("#af").evaluate((form) => form.requestSubmit());
  await expect.poll(() => page.evaluate(() => localStorage.getItem("mo.wallets.v1"))).not.toBeNull();

  await openApp(page, "#/help");
  await openPrivacySupport(page);
  await page.locator("#theme-toggle").click();
  await page.locator("#comments-toggle").click();
  await page.locator("[data-local-history]").click();
  await expectStorageAudit(page, {
    consent: false,
    wallets: null,
    motd: null,
    themeCookie: "",
    explainCookie: ""
  });
  api.assertNoConsoleErrors();
});

test("wallet history persists only when local history is enabled", async ({ page }) => {
  const api = await mockApi(page);
  await page.addInitScript(() => localStorage.setItem("mo.consent.v1", JSON.stringify({ value: true, time: Date.now() })));
  await openApp(page, "#/");
  await page.locator("#ai").fill(VALID_WALLET);
  await page.locator("#af").evaluate((form) => form.requestSubmit());
  await expectHashPath(page, `#/wallet/${VALID_WALLET}/overview`);
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem("mo.wallets.v1") || "[]").length)).toBe(1);

  await openApp(page, "#/help");
  await openPrivacySupport(page);
  await page.locator("[data-local-history]").click();
  await expect.poll(() => page.evaluate(() => localStorage.getItem("mo.wallets.v1"))).toBeNull();
  await openApp(page, "#/");
  await page.locator("#ai").fill(VALID_WALLET);
  await page.locator("#af").evaluate((form) => form.requestSubmit());
  await expect.poll(() => page.evaluate(() => localStorage.getItem("mo.wallets.v1"))).toBeNull();
  api.assertNoConsoleErrors();
});

test("wallet address is not sent to miner APIs before explicit wallet navigation", async ({ page }) => {
  const api = await mockApi(page);
  await page.addInitScript(() => localStorage.setItem("mo.consent.v1", JSON.stringify({ value: false, time: Date.now() })));
  await openApp(page, "#/");
  expect(minerCallCount(api)).toBe(0);

  await page.locator("#ai").fill("not-a-wallet");
  await page.locator("#af").evaluate((form) => form.requestSubmit());
  expect(minerCallCount(api)).toBe(0);
  await expect(page.locator("#ai")).toHaveJSProperty("validationMessage", "Enter a complete XMR address");

  await openApp(page, `#/wallet/${VALID_WALLET}/payout`);
  expect(api.calls.get(`user/${VALID_WALLET}`) || 0).toBeGreaterThan(0);
  expect(api.calls.get(`miner/${VALID_WALLET}/chart/hashrate`) || 0).toBe(0);
  expect(api.calls.get(`miner/${VALID_WALLET}/stats/allWorkers`) || 0).toBe(0);

  await openApp(page, `#/wallet/${VALID_WALLET}/overview`);
  expect(api.calls.get(`miner/${VALID_WALLET}/stats`) || 0).toBeGreaterThan(0);
  expect(api.calls.get(`miner/${VALID_WALLET}/chart/hashrate`) || 0).toBeGreaterThan(0);
  expect(api.calls.get(`miner/${VALID_WALLET}/stats/allWorkers`) || 0).toBeGreaterThan(0);
  api.assertNoConsoleErrors();
});

test("wallet tracking recovers after correcting an invalid address", async ({ page }) => {
  const api = await mockApi(page);
  await page.addInitScript(() => localStorage.setItem("mo.consent.v1", JSON.stringify({ value: true, time: Date.now() })));
  await openApp(page, "#/");
  const input = page.locator("#ai");
  const submit = page.locator("[data-wallet-submit]");

  await input.fill("not-a-wallet");
  await submit.click();
  await expect(input).toHaveJSProperty("validationMessage", "Enter a complete XMR address");
  expect(minerCallCount(api)).toBe(0);

  await input.fill(VALID_WALLET);
  const validityAfterEdit = await input.evaluate((element) => ({
    customError: element.validity.customError,
    message: element.validationMessage
  }));
  await waitForStableMicrotasks(page);
  expect(minerCallCount(api)).toBe(0);
  await submit.click();

  await expectHashPath(page, `#/wallet/${VALID_WALLET}/overview`);
  expect(validityAfterEdit).toEqual({ customError: false, message: "" });
  await expect.poll(() => api.calls.get(`miner/${VALID_WALLET}/stats`) || 0).toBeGreaterThan(0);
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem("mo.wallets.v1") || "[]").map((wallet) => wallet.address))).toEqual([VALID_WALLET]);
  api.assertNoConsoleErrors();
});

test("cached same-view navigation avoids loader flashes and duplicate graph fetches", async ({ page }) => {
  const api = await mockApi(page);
  await openApp(page, "#/");
  await expect(page.locator(".skeleton")).toHaveCount(0);
  const beforePoolChart = api.calls.get("pool/chart/hashrate") || 0;

  await page.getByRole("link", { name: "12h" }).click();
  await expectHashParams(page, { window: "12h" });
  await expect(page.locator(".skeleton")).toHaveCount(0);
  await expect.poll(() => api.calls.get("pool/chart/hashrate") || 0).toBeLessThanOrEqual(beforePoolChart + 1);

  await openApp(page, "#/help");
  const callsBeforeStaticWait = new Map(api.calls);
  await waitForStableMicrotasks(page);
  expect(api.calls.get("pool/stats") || 0).toBe(callsBeforeStaticWait.get("pool/stats") || 0);
  api.assertNoConsoleErrors();
});

test("wallet tabs fetch only the data needed for the active tab", async ({ page }) => {
  const api = await mockApi(page);
  await openApp(page, `#/wallet/${VALID_WALLET}/payout`);
  expect(api.calls.get(`miner/${VALID_WALLET}/chart/hashrate`) || 0).toBe(0);
  expect(api.calls.get(`miner/${VALID_WALLET}/stats/allWorkers`) || 0).toBe(0);
  expect(api.calls.get(`user/${VALID_WALLET}`) || 0).toBeGreaterThan(0);

  await openApp(page, `#/wallet/${VALID_WALLET}`);
  expect(api.calls.get(`miner/${VALID_WALLET}/chart/hashrate`) || 0).toBeGreaterThan(0);
  expect(api.calls.get(`miner/${VALID_WALLET}/stats/allWorkers`) || 0).toBeGreaterThan(0);
  api.assertNoConsoleErrors();
});

function minerCallCount(api) {
  return [...api.calls].filter(([path]) => path.startsWith("miner/")).reduce((sum, [, count]) => sum + count, 0);
}

async function openPrivacySupport(page) {
  const summary = page.locator("summary", { hasText: "Privacy/support" });
  await expect(summary).toBeVisible();
  await summary.click();
  await expect(page.locator("[data-local-history]")).toBeVisible();
}

async function expectStorageAudit(page, expected) {
  await expect.poll(() => page.evaluate(() => {
    const consent = localStorage.getItem("mo.consent.v1");
    const cookie = document.cookie;
    const cookieValue = (key) => cookie.split(";").map((item) => item.trim()).find((item) => item.startsWith(`${key}=`))?.slice(key.length + 1) || "";
    return {
      consent: consent ? JSON.parse(consent).value : null,
      wallets: localStorage.getItem("mo.wallets.v1"),
      motd: localStorage.getItem("mo.motd.dismissed.v1"),
      themeCookie: cookieValue("mo.theme"),
      explainCookie: cookieValue("mo.explain")
    };
  })).toMatchObject(expected);
}
