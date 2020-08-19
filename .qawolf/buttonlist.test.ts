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

test("buttonlist", async () => {
  await page.goto("localhost:6006");
  await page.click("#button-list");
  const frame = await (await page.$("#storybook-preview-iframe")).contentFrame();
  await frame.click(".lm-button-large");
  await frame.click(".MuiButton-root");
  await page.click("#button-list--icon-list");
  await frame.click(".MuiContainer-root div:nth-of-type(3) .lm-default-color");
  await frame.click(".MuiContainer-root div:nth-of-type(3) button:nth-of-type(2)");
  await frame.click(".MuiContainer-root div:nth-of-type(3) button:nth-of-type(3)");
  await page.click("#button-list--fab-list");
  await frame.click("button:nth-of-type(3)");
  await frame.click("button:nth-of-type(2)");
  await page.click("#button-list--image-list");
  await frame.click("button:nth-of-type(2)");
  await frame.click("button:nth-of-type(3)");
  await page.click("#button-list--image-list-fab");
  await frame.click("body");
  await frame.click(".MuiFab-root");
  await frame.click("button:nth-of-type(2)");
  await page.click("#button-list--playground");
  await frame.click(".MuiButton-root");
  await frame.click("button:nth-of-type(2)");
});