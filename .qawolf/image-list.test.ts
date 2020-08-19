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

test("image-list", async () => {
  await page.goto("localhost:6006");
  await qawolf.scroll(page, "#panel-tab-content .observed", { x: 1060, y: 237 });
  await page.click("#image-list");
  const frame = await (await page.$("#storybook-preview-iframe")).contentFrame();
  await qawolf.scroll(frame, "html", { x: 0, y: 483 });
  await page.click("#image-list--with-lightbox");
  await frame.click('[src="https://img2.storyblok.com/256x0//f/57008/4541x2202/dc46a24330/bicycles-608747.jpg"]');
  await frame.click(".carousel-control-next");
  await frame.click(".carousel-control-next");
  await frame.click(".text-white");
  await page.click("#image-list--with-image-protect");
  await page.click("#image-list--image-ratio");
  await qawolf.scroll(frame, "html", { x: 0, y: 2441 });
  await page.click("#image-list--playground");
  await qawolf.scroll(frame, "html", { x: 0, y: 14 });
});