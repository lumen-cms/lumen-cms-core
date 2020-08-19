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

test("paragraph", async () => {
  await page.goto("localhost:6006");
  await page.click("#paragraph");
  await qawolf.scroll(page, ".os-padding div", { x: 0, y: 265 });
  await page.click("#paragraph--rich-text-paragraph");
  const frame = await (await page.$("#storybook-preview-iframe")).contentFrame();
  await qawolf.scroll(frame, "html", { x: 0, y: 288 });
  await page.click("#paragraph--playground");
});