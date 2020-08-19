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

test("menu", async () => {
  await page.goto("localhost:6006");
  await page.click("#menu");
  const frame = await (await page.$("#storybook-preview-iframe")).contentFrame();
  await frame.click(".MuiButton-root");
  await frame.click(".MuiPopover-root div");
  await frame.click(".text-center .MuiButton-root");
  await frame.click(".MuiPopover-root div");
  await frame.click("button:nth-of-type(2)");
  await frame.click(".MuiPopover-root div");
  await qawolf.scroll(frame, "html", { x: 0, y: 109 });
  await frame.click("div:nth-of-type(3).text-center .MuiButton-root");
  await frame.click(".MuiPopover-root div");
  await page.click("#menu--mega-menu");
  const frame = await (await page.$("#storybook-preview-iframe")).contentFrame();
  await frame.click(".MuiButton-root");
});
