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

test("dialog", async () => {
  await page.goto("localhost:6006");
  await page.click("#dialog");
  const frame = await (await page.$("#storybook-preview-iframe")).contentFrame();
  await frame.click(".MuiButton-root");
  await frame.click(".MuiDialog-container");
  await frame.click(".MuiTypography-h4");
  await frame.click(".MuiDialog-container");
  await frame.click("div:nth-of-type(5) .makeStyles-trigger-16");
  await frame.click(".MuiDialog-container");
  await qawolf.scroll(frame, "html", { x: 0, y: 109 });
  await frame.click(".text-danger");
  await frame.click(".MuiDialog-container");
});