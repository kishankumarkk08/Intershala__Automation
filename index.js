const p = require("puppeteer");
const stealthlugin = require("puppeteer-extra-plugin-stealth")
let { myEmail, myPass } = require("./secret");
let data = require("./data");
let page;

//Using the puppeteer-extra-plugin-stealth
p.use(stealthlugin());

async function automate() {

  //launching the browser
  let browser = await p.launch({
    headless: false,
    defaultViewport: false,
    args: ["--start-maximized"]
  });

  let pages = await browser.pages();
  page = pages[0];

  //Redirecting to the main website
  await page.goto("https://internshala.com/", { waitUntil: 'networkidle2' });

  //click the login button
  await page.click("button[data-target='#login-modal']", { delay: 100 })

  //type in to the email and the password field
  await page.waitForSelector("input[type='email']")
  await page.type("input[type='email']", id, { delay: 100, });
  await page.waitForSelector("input[type='password']")
  await page.type("input[type='password']", pass, { delay: 100 });

  //click the submit button
  await page.waitForSelector("button[type='submit']");
  await page.click("button[type='submit']");

  await page.waitForNavigation({ waitUntil: "networkidle2" });
  await page.click(".nav-link.dropdown-toggle.profile_container .is_icon_header.ic-24-filled-down-arrow");


  // selecting from the profile dropdown
  let profile_dropdown_options = await page.$$(".profile_options a");
  let urls = [];
  for (let i = 0; i < 6; i++) {
    let url = await page.evaluate(function (element) {
      return element.getAttribute("href");
    }, profile_dropdown_options[i]);
    urls.push(url);
  }

  //setting a timeout
  await new Promise(function (resolve, reject) {
    return setTimeout(resolve, 2000);
  });
  page.goto("https://internshala.com" + urls[1]);

  await page.waitForSelector("#graduation-page .ic-16-plus");
  await page.click("#graduation-page .ic-16-plus", { delay: 50 });
  await graduation(data[0]);

  await new Promise(function (resolve, reject) {
    return setTimeout(resolve, 1000);
  });

  await page.waitForSelector(".next-button", { visible: true });
  await page.click(".next-button", { delay: 50 });

  await training(data[0]);

  await new Promise(function (resolve, reject) {
    return setTimeout(resolve, 1000)
  });

  await page.waitForSelector(".next-button", { visible: true });
  await page.click(".next-button", { delay: 50 });

  await page.waitForSelector(".btn.btn-secondary.skip.skip-button", { visible: true });
  await page.click(".btn.btn-secondary.skip.skip-button", { delay: 50 });

  await workSample(data[0]);

  await new Promise(function (resolve, reject) {
    return setTimeout(resolve, 1000);
  });

  await page.waitForSelector("#save_work_samples", { visible: true });
  await page.click("#save_work_samples", { delay: 50 });


  await new Promise(function (resolve, reject) {
    return setTimeout(resolve, 1000);
  });
  await application(data[0]);
}

//graduation function
async function graduation(data) {
  await page.waitForSelector("#degree_completion_status_pursuing", { visible: true });
  await page.click("#degree_completion_status_pursuing");

  //type in the name of the college
  await page.waitForSelector("#college", { visible: true });
  await page.type("#college", data["College"]);

  //selecting the graduation start year
  await page.waitForSelector("#start_year_chosen", { visible: true });
  await page.click("#start_year_chosen");
  await page.waitForSelector(".active-result[data-option-array-index='5']", { visible: true });
  await page.click(".active-result[data-option-array-index='5']");

  //selecting the graduation end year
  await page.waitForSelector("#end_year_chosen", { visible: true });
  await page.click('#end_year_chosen');
  await page.waitForSelector("#end_year_chosen .active-result[data-option-array-index = '6']", { visible: true });
  await page.click("#end_year_chosen .active-result[data-option-array-index = '6']");

  //selecting the type of degree
  await page.waitForSelector("#degree", { visible: true });
  await page.type("#degree", data["Degree"]);

  //setting a timeout of 1 sec
  await new Promise(function (resolve, reject) {
    return setTimeout(resolve, 1000);
  });

  //selecting the stream
  await page.waitForSelector("#stream", { visible: true });
  await page.type("#stream", data["Stream"]);

  await new Promise(function (resolve, reject) {
    return setTimeout(resolve, 1000);
  });

  await page.waitForSelector("#performance-college", { visible: true });
  await page.type("#performance-college", data["Percentage"]);

  await new Promise(function (resolve, reject) {
    return setTimeout(resolve, 1000);
  });

  //clicking the submit button
  await page.click("#college-submit");

}

//training function
async function training(data) {
  await page.waitForSelector(".experiences-pages[data-target='#training-modal'] .ic-16-plus", { visible: true });
  await page.click(".experiences-pages[data-target='#training-modal'] .ic-16-plus");

  await page.waitForSelector("#other_experiences_course", { visible: true });
  await page.type("#other_experiences_course", data["Training"]);

  await new Promise(function (resolve, reject) {
    return setTimeout(resolve, 1000);
  });

  await page.waitForSelector("#other_experiences_organization", { visible: true });
  await page.type("#other_experiences_organization", data["Organization"]);

  await new Promise(function (resolve, reject) {
    return setTimeout(resolve, 1000);
  });

  await page.click("#other_experiences_location_type_label");

  await page.click("#other_experiences_start_date");

  await new Promise(function (resolve, reject) {
    return setTimeout(resolve, 1000);
  });

  await page.waitForSelector(".ui-state-default[href='#']", { visible: true });
  let date = await page.$$(".ui-state-default[href='#']");
  await date[0].click();
  await page.click("#other_experiences_is_on_going");

  await page.waitForSelector("#other_experiences_training_description", { visible: true });
  await page.type("#other_experiences_training_description", data["description"]);

  await new Promise(function (resolve, reject) {
    return setTimeout(resolve, 2000);
  });

  await page.click("#training-submit");

}

//workSample function

async function workSample(data) {
  await page.waitForSelector("#other_portfolio_link", { visible: true });
  await page.type("#other_portfolio_link", data["link"]);
}

//application function
async function application(data) {

  await page.goto("https://internshala.com/the-grand-summer-internship-fair");

  await page.waitForSelector(".btn.btn-primary.campaign-btn.view_internship", { visible: true });
  await page.click(".btn.btn-primary.campaign-btn.view_internship")

  await new Promise(function (resolve, reject) {
    return setTimeout(resolve, 2000);
  });
  await page.waitForSelector(".view_detail_button", { visible: true });
  let details = await page.$$(".view_detail_button");
  let detailUrl = [];
  for (let i = 0; i < 3; i++) {
    let url = await page.evaluate(function (ele) {
      return ele.getAttribute("href");
    }, details[i]);
    detailUrl.push(url);
  }

  for (let i of detailUrl) {
    await apply(i, data);
    await new Promise(function (resolve, reject) {
      return setTimeout(resolve, 1000);
    });
  }

}


//apply function
async function apply(url, data) {
  await page.goto("https://internshala.com" + url);

  await page.waitForSelector(".btn.btn-large", { visible: true });
  await page.click(".btn.btn-large");

  await page.waitForSelector("#application_button", { visible: true });
  await page.click("#application_button");

  await page.waitForSelector(".textarea.form-control", { visible: true });


  let ans = await page.$$(".textarea.form-control");
  for (let i = 0; i < ans.length; i++) {
    if (i == 0) {
      await ans[i].type(data["hiringReason"]);
      await new Promise(function (resolve, reject) {
        return setTimeout(resolve, 1000);
      });
    }
    else if (i == 1) {
      await ans[i].type(data["availability"]);
      await new Promise(function (resolve, reject) {
        return setTimeout(resolve, 1000);
      });
    }
    else {
      await ans[i].type(data["rating"]);
      await new Promise(function (resolve, reject) {
        return setTimeout(resolve, 1000);
      });
    }
  }

  //to click the submit button
  await page.click(".submit_button_container");

}


//calling the final function
automate();