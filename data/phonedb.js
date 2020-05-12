const mongoCollections = require('../config/mongoCollections');
const mobiles = mongoCollections.mobiles;

const siteUrl = "https://www.gsmarena.com/";
const axios = require("axios");
const cheerio = require("cheerio");

let newDevice = {};

// Fetch Website's homepage
const fetchData = async () => {
  const result = await axios.get(siteUrl);
  return cheerio.load(result.data);
};

// Fetch the webpage of the provided url
const fetchPage = async (url) => {
  const result = await axios.get(url);
  return cheerio.load(result.data);
};

// Fetch all the devices of a brand and store in MongoDB
const fetchDevices = async (brandUrl) => {
  const $ = await fetchPage(brandUrl).catch(console.log)
  let finalDevice = [];

  $(".makers ul li").each(async (index, element) => {
    let deviceUrl = "https://www.gsmarena.com/" + $(element).find("a").attr("href");

    finalDevice[index] = await getResults(deviceUrl).catch(console.log);

    if (index === $(".makers ul li").length - 1) {
      finalDevice.forEach(async (item) => {
        const mobileCollection = await mobiles();
        const insertInfo = await mobileCollection.insertOne(item).catch(console.log);
      });
    }
  });
}

// Fetch the webpage of a brand
const fetchBrands = async () => {
  const $ = await fetchData().catch(console.log);

  // $(".brandmenu-v2 ul li").each((index, element) => {
  //     let brandUrl = "https://www.gsmarena.com/" + $(element).find("a").attr("href");
  //     // console.log(brandUrl);
  //     fetchDevices(brandUrl).catch(console.log);
  // });

  // Change the url of the brand here to generate the list of different brand's devices
  fetchDevices('https://www.gsmarena.com/samsung-phones-9.php').catch(console.log);
}

// Fetch the device's specifications
const getResults = async (url) => {
  const $ = await fetchPage(url).catch(console.log);
  let device_specs = {}

  $("table tbody tr").each((index, element) => {
    let prop = $(element).find(".ttl a").text().split('.').join(' ');
    let item = $(element).find(".nfo").text().replace(/(\r\n|\n|\r)/g, '');

    device_specs[prop] = item;
  });

  let img = $(".specs-photo-main a img")
  let name =$(".article-info .article-info-line .specs-phone-name-title").text().split('.').join(' ')

  device_specs['device'] = name;
  device_specs['image'] = img.attr().src;

  newDevice[name] = device_specs;

  return device_specs;
};


fetchBrands().catch(console.log);