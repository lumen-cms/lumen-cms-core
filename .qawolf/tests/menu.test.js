const qawolf = require("qawolf");
const selectors = require("../selectors/menu.json");

let browser;
let page;

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

test('menu', async () => {
  await page.goto("https://play.lumen.media/");
  await page.click(selectors["0_explorernav_men_a"]);
  await page.click(selectors["1_div"]);
});
