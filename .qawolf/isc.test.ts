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

test("isc", async () => {
  const page = await context.newPage();
  await page.goto("https://dev-36d8hyhi.eu.auth0.com/login?state=g6Fo2SB1ZkpYbTBKM0lxdE1NZG1sRWhpUTlKSHZvVW8xZzFuSaN0aWTZIFJ6RFUyeC1nTEZzZlhZcU5kOUdJRUdFMEs0WU1Ib3BJo2NpZNkgTHdId0JldU1rZ3BGZm85MEZXRlRBZmtuUkx2RlAwQlk&client=LwHwBeuMkgpFfo90FWFTAfknRLvFP0BY&protocol=oauth2&scope=openid%20profile%20email%20read%3Ausers%20read%3Ausers_app_metadata&response_type=code&redirect_uri=https%3A%2F%2Fapp.insidesoccercoaching.com%2Fapi%2Fauth0%2Fcallback&auth0Client=eyJuYW1lIjoibmV4dGpzLWF1dGgwIiwidmVyc2lvbiI6IjAuMTYuMCJ9", { waitUntil: "domcontentloaded" });
  await page.click('[aria-label="Email"]');
  await page.fill('[aria-label="Email"]', "stbaer.mail@gmail.com");
  await page.press('[aria-label="Email"]', "Tab");
  await page.fill('[aria-label="Password"]', "A12345b!");
  await page.click('[aria-label="Log In"]');
  // await qawolf.scroll(page, "html", { x: 0, y: 527 });
  await page.click(".MuiButton-contained");
  const frame = await (await page.waitForSelector('[name$="-frame"]')).contentFrame();
  if(frame) {
    await frame.click("#contact-email");
    await frame.fill("#contact-email", "test@test.test");
  }
});
