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

test("navlist", async () => {
  await page.goto("localhost:6006");
  await qawolf.scroll(page, ".os-padding div", { x: 0, y: 4 });
  await page.click("#nav-list");
  const frame = await (await page.$("#storybook-preview-iframe")).contentFrame();
});
