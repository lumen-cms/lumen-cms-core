import { Browser, Page } from "playwright";
import qawolf from "qawolf";

let browser: Browser;
let page: Page;

beforeAll(async () => {
  browser = await qawolf.launch();
  const context = await browser.newContext();
  await qawolf.register(context);
  page = await context.newPage();
});

afterAll(async () => {
  await qawolf.stopVideos();
  await browser.close();
});

test("iframe", async () => {
  await page.goto("localhost:6006");
  await page.click('[href="#iframe"]');
  await page.click('[href="?path=/story/iframe--responsive"]');
  await page.click('[href="?path=/story/iframe--advanced"]');
  await page.click("#iframe--with-message");
  await page.click('[href="?path=/story/iframe--playground"]');
});