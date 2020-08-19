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

test("html", async () => {
  await page.goto("localhost:6006");
  await page.click("#html");
  await page.click('[href="?path=/story/html--mixcloud"]');
  await page.click("#html--basic");
  await page.click('[href="?path=/story/html--mixcloud"]');
});