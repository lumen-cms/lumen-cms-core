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

test("accordion", async () => {
  await page.goto("localhost:6006");
  const frame = await (await page.$("#storybook-preview-iframe")).contentFrame();
  await frame.click(".MuiButtonBase-root");
  await frame.click(".MuiButtonBase-root");
  await frame.click("div:nth-of-type(2) .MuiAccordionSummary-root");
  await frame.click("div:nth-of-type(2) .MuiAccordionSummary-root");
  const frame = await (await page.$("#storybook-preview-iframe")).contentFrame();
  await frame.click(".MuiButtonBase-root");
  await frame.click(".MuiButtonBase-root");
});
