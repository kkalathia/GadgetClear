const mongoCollections = require('../config/mongoCollections');
const mobiles = mongoCollections.mobiles;

const getDeviceDisplay = async (filterdisplay) => {
    const dev = await filterdisplay.filter
    console.log('-----------------Display-----------------')
    console.log(dev)
    console.log('-----------------/Display-----------------')
    return res
};
const getDevice = async (brand, display, processor, storage) => {
    const mobileCollection = await mobiles();
    console.log('------------VAri')
    console.log(brand)
    console.log(display)
    console.log(processor)
    console.log(storage)
    console.log('------------/VAri')

    const brands = brand.match(/^([\w\-\.]+)/)
    const displays = display.match(/^([\w\-\.]+)/)
    const pro = processor.split(' ')[1];
    const sto = storage;

    console.log("Brand: ", brands[0])
    console.log("Processor: ", processor.split(' ')[1]);
    console.log("display: ", displays[0].split('.')[0]);
    console.log("storage: ", storage);

    var regexSize = `^([6^inches]*)`;
    console.log('regex', regexSize)
    const res = await mobileCollection.find({
        'device': new RegExp(brands[0], 'i'), 
        'Size': new RegExp("^" + displays[0].split('.')[0]),
        'Chipset': new RegExp(pro, 'i'),
        'Internal': new RegExp(sto,'i')
    }).toArray();
    console.log('-----------------BRAND-----------------')

    console.log('legth: ', res.length)
    console.log(res)
    console.log('-----------------/BRAND-----------------')

    //const res = await mobileCollection.find({});
    return res
};
const getDeviceProcessor = async (processor) => {
    const mobileCollection = await mobiles();
    console.log(processor)
    const processors = processor.match(/^([\w\-\.]+)/)
    console.log("size: ", processors[0])
    // const res = mobileCollection.find({$regex: /^([\w\-]+)/});
    // const res = await mobileCollection.find({$text: {$search: screen_size[0]}}).toArray();
    const res = await mobileCollection.find({}).toArray();

    return res
};
const getDeviceStorage = async (storage) => {
    const mobileCollection = await mobiles();
    console.log(storage)
    const storages = storage.match(/^([\w\-\.]+)/)
    console.log("size: ", storages[0])
    // const res = mobileCollection.find({$regex: /^([\w\-]+)/});
    // const res = await mobileCollection.find({$text: {$search: screen_size[0]}}).toArray();
    const res = await mobileCollection.find({}).toArray();

    return res
};



module.exports = {
    getDeviceDisplay,
    getDevice,
    getDeviceProcessor,
    getDeviceStorage
};
