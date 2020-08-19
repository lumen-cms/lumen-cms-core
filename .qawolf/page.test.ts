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

test("page", async () => {
  await page.goto("localhost:6006");
  await page.click("#page");
  const frame = await (await page.$("#storybook-preview-iframe")).contentFrame();
  await page.click("#page--with-drawer");
  const frame = await (await page.$("#storybook-preview-iframe")).contentFrame();
  await qawolf.scroll(frame, "html", { x: 0, y: 0 });
  await frame.click('text="open if mobile"');
  await page.click("#page--playground");
  await qawolf.scroll(frame, "html", { x: 0, y: 0 });
  await frame.click("div:nth-of-type(2) button:nth-of-type(4)");
  await frame.click(".MuiPopover-root-273 div");
});