const mongoCollections = require('./config/mongoCollections');
const mobiles = mongoCollections.mobiles;

const siteUrl = "https://www.gsmarena.com/samsung-phones-9.php";
const axios = require("axios");
const cheerio = require("cheerio");

let device_specs = {};
let newDevice = {};

const fetchData = async () => {
  const result = await axios.get(siteUrl);
  return cheerio.load(result.data);
};

const fetchPage = async (url) => {
  const result = await axios.get(url);
  return cheerio.load(result.data);
};

const fetchDevices = async () => {
  const $ = await fetchData();

  $(".makers ul li").each((index, element) => {
    let deviceUrl = "https://www.gsmarena.com/" + $(element).find("a").attr("href");

    getResults(deviceUrl);
  });
}

const getResults = async (url) => {
    const $ = await fetchPage(url);
    
    $("table tbody tr").each((index, element) => {
      let prop = $(element).find(".ttl a").text().split('.').join(' ');
      let item = $(element).find(".nfo").text().replace(/(\r\n|\n|\r)/g, '');

      device_specs[prop] = item;
    });

    let name = $(".article-info .article-info-line .specs-phone-name-title").text().split('.').join(' ');
    console.log(name);
    
    newDevice[name] = device_specs;
    // console.log(newDevice);
    const mobileCollection = await mobiles();

    const insertInfo = await mobileCollection.updateOne({}, { $set: newDevice }, { upsert: true });
    if (insertInfo.modifiedCount === 0) throw 'Could not add new device';

    device_specs = {}

    return newDevice;

    
};

// getResults().catch(console.log);

fetchDevices();

module.exports = fetchDevices;

