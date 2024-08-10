const p = require("puppeteer")

const { myEmail, myPass } = require('./login')
let page;

async function automate() {
  const browser = await p.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  });

  let pages = await browser.pages()
  page = pages[0]

  //Redirecting to the main website
  await page.goto("https://internshala.com/", { waitUntil: 'networkidle2' })

  //getting it to login page
  await page.click("button[data-target='#login-modal']", { delay: 100 })

  //typing into email field
  await page.waitForSelector("input[type='email']", { delay: 50 })
  await page.type("input[type='email']", myEmail, { delay: 100 })

  //typing into password field
  await page.waitForSelector("input[type='password']")
  await page.type("input[type='password']", myPass, { delay: 100 })

  //clicking the submit button
  await page.waitForSelector("button[type='submit']")
  await page.click("button[type='submit']", { delay: 50 })


}

automate()