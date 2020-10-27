import { Browser, BrowserContext } from "playwright";
import qawolf from "qawolf";

let browser: Browser;
let context: BrowserContext;

beforeAll(async () => {
  browser = await qawolf.launch();
  context = await browser.newContext();
  await qawolf.register(context);
});

afterAll(async () => {
  await qawolf.stopVideos();
  await browser.close();
});

test("isc-base", async () => {
  const page = await context.newPage();
  await page.goto("https://insidesoccercoaching.de/", { waitUntil: "domcontentloaded" });
  await page.click(".MuiButton-outlined");
  const page2 = await qawolf.waitForPage(context, 1, { waitUntil: "domcontentloaded" });
  await page2.click('[aria-label="Email"]');
  await page2.fill('[aria-label="Email"]', "stbaer.maillgmail.com");
  await page2.press('[aria-label="Email"]', "Tab");
  await page2.fill('[aria-label="Password"]', "A12345b!");
  await page2.click('[aria-label="Log In"]');
  await page2.click('[aria-label="Email"]');
  await page2.fill('[aria-label="Email"]', "stbaer.mail@gmail.com");
  await page2.click('[aria-label="Log In"]');
  await qawolf.scroll(page2, "html", { x: 0, y: 383 });
  await page2.click('text="Jetzt für $24.95 Kaufen"');
  // const frame = await (await page2.waitForSelector('[name$="-frame"]')).contentFrame();
  // await frame.click("#contact-email");
  await setTimeout(() => {}, 3000)
  // await frame.click("#card-number");
  // await frame.fill("#card-number", "4242 4242 4242 4242");
  // await frame.click("#card-expire-month");
  // await frame.fill("#card-expire-month", "01");
  // await frame.press("#card-expire-month", "Tab");
  // await frame.fill("#card-expire-year", "22");
  // await frame.click("#contact-email");
  // await frame.fill("#contact-email", "test@test");
  // await frame.click("#card-security");
  // await frame.click("#contact-first-name");
  // await frame.fill("#contact-first-name", "test");
  // await frame.press("#contact-first-name", "Tab");
  // await frame.fill("#contact-last-name", "test");
  // await frame.click("#card-security");
  // await frame.fill("#card-security", "*H3DR");
  // await frame.click("#contact-phone");
  // await frame.fill("#contact-phone", "123456789");
  // await frame.click('text="Pay $24.95"');
});
