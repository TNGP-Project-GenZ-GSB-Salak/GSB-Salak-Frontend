import { chromium } from "@playwright/test";

const base = "http://localhost:5174";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 420, height: 900 } });
page.on("pageerror", (e) => console.log("PAGEERROR:", e.message));
page.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") console.log("CONSOLE:", m.type(), m.text()); });
page.on("requestfailed", (r) => console.log("REQFAIL:", r.url(), r.failure()?.errorText));
page.on("response", (r) => { if (!r.ok()) console.log("BAD RESPONSE:", r.status(), r.url()); });

await page.goto(`${base}/login`);
await page.getByTestId("username-input").fill("demo");
await page.getByTestId("password-input").fill("demopass123");
await page.getByTestId("submit-button").click();
await page.waitForURL(`${base}/`);
await page.evaluate(() => Object.keys(localStorage).forEach(k => k.startsWith('kapook:') && localStorage.removeItem(k)));
await page.reload();

await page.goto(`${base}/salak`);
await page.getByTestId("salak-buy-action").click();
await page.waitForURL(`${base}/salak/buy`);
await page.getByTestId("buy-button").first().click();
await page.getByTestId("mode-choose-sheet").waitFor();
await page.getByTestId("mode-save-first").click();
await page.waitForURL(`${base}/kapook/open`);

await page.getByTestId("kyc-id-input").fill("123456789012");
await page.getByTestId("kyc-next").click();
await page.getByTestId("kyc-confirm-button").click();
await page.getByTestId("confirm-dialog-confirm").click();
await page.getByTestId("accept-terms").click();
await page.getByTestId("go-to-goal-setup").click();
await page.waitForURL(`${base}/kapook/goal/new`);

console.log("current url:", page.url());
await page.getByTestId("goal-amount-preset").nth(3).click(); // 50000
console.log("amount selected, url:", page.url());

const btn = page.getByTestId("goal-confirm-button");
console.log("button disabled attr:", await btn.getAttribute("disabled"));
console.log("button classList:", await btn.getAttribute("class"));

await btn.click();
await page.waitForTimeout(1500);
console.log("after click, url:", page.url());

const ls = await page.evaluate(() => {
  const out = {};
  for (const k of Object.keys(localStorage)) if (k.startsWith('kapook:')) out[k] = localStorage.getItem(k);
  return out;
});
console.log("kapook localStorage:", JSON.stringify(ls, null, 2));

await page.screenshot({ path: "/private/tmp/claude-502/-Users-pearwa-tu-Documents-GitHub-GSB-Salak-Monorepo/63e909b5-9566-4119-adf4-53cb19e5369a/scratchpad/repro-confirm-after.png" });
await browser.close();
