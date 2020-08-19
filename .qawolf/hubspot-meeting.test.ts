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

test("hubspot-meeting", async () => {
  await page.goto("localhost:6006");
  await page.click('[href="#hubspot-meeting"]');
  await page.click(".time-picker-btn");
  await page.click("#hubspot-meeting--playground");
  await page.click(".private-selectable-box--hovered");
});