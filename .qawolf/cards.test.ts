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

test("cards", async () => {
  await page.goto("localhost:6006");
  await page.click("#cards");
  const frame = await (await page.$("#storybook-preview-iframe")).contentFrame();
  await qawolf.scroll(frame, "html", { x: 0, y: 0 });
  await frame.click("li:nth-of-type(2) .MuiButtonBase-root");
  await page.click("#cards--card-list-over-image");
  await qawolf.scroll(frame, "html", { x: 0, y: 1697 });
  await page.click("#cards--card-list-responsive");
  await qawolf.scroll(frame, "html", { x: 0, y: 1831 });
  await page.click("#cards--card-list-cropped-description");
  await qawolf.scroll(frame, "html", { x: 0, y: 1151 });
  await page.click("#cards--cards-of-travels");
  await qawolf.scroll(frame, "html", { x: 0, y: 750 });
  await frame.click("li:nth-of-type(15) .MuiButtonBase-root");
  await page.click("#cards--card-icons");
  await frame.click("li:nth-of-type(3) .MuiButtonBase-root");
  await frame.click("li:nth-of-type(2) .MuiButtonBase-root");
  await page.click("#cards--card-actions");
  await qawolf.scroll(frame, "html", { x: 0, y: 178 });
  await frame.click("li:nth-of-type(6) .MuiButtonBase-root");
  await frame.click(".MuiBackdrop-root");
  await qawolf.scroll(frame, "html", { x: 0, y: 0 });
  await frame.click("li:nth-of-type(2) .MuiButtonBase-root");
  await frame.click(".MuiBackdrop-root");
  await page.click("#cards--playground");
  await qawolf.scroll(frame, "html", { x: 0, y: 0 });
});