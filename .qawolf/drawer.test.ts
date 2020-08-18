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

test("drawer", async () => {
  await page.goto("localhost:6006");
  await page.click("#drawer");
  const frame = await (await page.$("#storybook-preview-iframe")).contentFrame();
  await frame.click(".MuiButton-root");
  await frame.click(".MuiPaper-root div:nth-of-type(4)");
  await frame.click(".MuiPaper-root div:nth-of-type(4)");
  await frame.click(".MuiBackdrop-root");
  await page.click("#drawer--custom");
  await frame.click(".MuiButton-root");
  await frame.click(".MuiPaper-root div:nth-of-type(4)");
  await frame.click(".MuiPaper-root div:nth-of-type(4)");
  await frame.click(".MuiPaper-root div:nth-of-type(5)");
  await frame.click(".MuiPaper-root div:nth-of-type(5)");
  await page.click("#drawer--dedicated-drawer");
  await frame.click(".MuiButton-root");
  await frame.click(".MuiPaper-root div:nth-of-type(4)");
  await frame.click("div:nth-of-type(6)");
  await qawolf.scroll(frame, ".MuiPaper-root", { x: 0, y: 65 });
  await frame.click(".MuiBackdrop-root");
});