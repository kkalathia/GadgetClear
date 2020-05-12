const mongoCollections = require('../config/mongoCollections');
const mobiles = mongoCollections.mobiles;
var ObjectId = require('mongodb').ObjectId; 


const getDevice = async (brand, display, processor, storage) => {
    const mobileCollection = await mobiles();
    // console.log('------------VAri')
    // console.log(brand)
    // console.log(display)
    // console.log(processor)
    // console.log(storage)
    // console.log('------------/VAri')

    const brands = brand.match(/^([\w\-\.]+)/)
    const displays = display.match(/^([\w\-\.]+)/)
    const pro = processor.split(' ')[1];
    const sto = storage;

    // console.log("Brand: ", brands[0])
    // console.log("Processor: ", processor.split(' ')[1]);
    // console.log("display: ", displays[0].split('.')[0]);
    // console.log("storage: ", storage);

    // var regexSize = `^([6^inches]*)`;
    // console.log('regex', regexSize)
    const res = await mobileCollection.find({
        'device': new RegExp(brands[0], 'i'), 
        'Size': new RegExp("^" + displays[0].split('.')[0]),
        'Chipset': new RegExp(pro, 'i'),
        'Internal': new RegExp(sto,'i')
    }).toArray();

    return res
};

const getDeviceById = async (id) => {
    var o_id = new ObjectId(id);

    const mobileCollection = await mobiles();
    const res = await mobileCollection.findOne({_id:  o_id});
    console.log(res);
    return res;
}

module.exports = {
    getDevice,
    getDeviceById
};

