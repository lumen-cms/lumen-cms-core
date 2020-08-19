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

test("headline", async () => {
  await page.goto("localhost:6006");
  await page.click("#headline");
  const frame = await (await page.$("#storybook-preview-iframe")).contentFrame();
  await qawolf.scroll(frame, "html", { x: 0, y: 115 });
  await page.click("#headline--alternative-font");
  await page.click("#headline--alternative-config");
  await qawolf.scroll(frame, "html", { x: 0, y: 1243 });
  await page.click("#headline--headline-with-date");
  await page.click("#headline--playground");
});