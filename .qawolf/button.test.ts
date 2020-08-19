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

test("button", async () => {
  await page.goto("localhost:6006");
  await page.click("#button");
  const frame = await (await page.$("#storybook-preview-iframe")).contentFrame();
  await frame.click("button:nth-of-type(4).MuiFab-root");
  await frame.click(".MuiFab-secondary");
  await qawolf.scroll(frame, "html", { x: 0, y: 1005 });
  await page.click("#button--button-with-image");
  await page.click("#button--button-with-addons");
  await qawolf.scroll(frame, "html", { x: 0, y: 132 });
  await frame.click("button:nth-of-type(4).lm-button-large");
  await qawolf.scroll(frame, "html", { x: 0, y: 0 });
  await frame.click(".MuiButton-textSecondary");
  await page.click("#button--playground");
  await frame.click(".MuiButton-root");
  await frame.click("html");
});