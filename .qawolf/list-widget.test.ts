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

test("list-widget", async () => {
  await page.goto("localhost:6006");
  await page.click("#list-widget");
  const frame = await (await page.$("#storybook-preview-iframe")).contentFrame();
  await qawolf.scroll(frame, "html", { x: 0, y: 0 });
});