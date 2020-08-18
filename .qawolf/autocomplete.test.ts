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

test("autocomplete", async () => {
  await page.goto("localhost:6006");
  await page.click('[href="#autocomplete-search"]');
  const frame = await (await page.$("#storybook-preview-iframe")).contentFrame();
  await frame.click(".MuiInputBase-input");
  await frame.fill(".MuiInputBase-input", "der");
  await frame.click('[aria-label="Clear"]');
  await frame.click(".MuiContainer-root div");
  await page.click("#autocomplete-search--mobile");
  await frame.click("xpath=//*[@id='root']/div/main/div/button");
  await frame.click(".Mui-focused");
  await frame.fill(".Mui-focused .MuiInputBase-input", "der");
  await frame.click(".MuiAutocomplete-clearIndicatorDirty");
  await frame.click(".Mui-focused");
  await page.click("#autocomplete-search--shaped");
  await page.click("#autocomplete-search--playground");
  await frame.click(".MuiInputBase-input");
  await frame.fill(".MuiInputBase-input", "ter");
  await frame.click('[aria-label="Clear"]');
  await frame.click("html");
});