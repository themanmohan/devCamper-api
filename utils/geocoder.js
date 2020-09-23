const Nodegeocoder=require('node-geocoder')

const option={
    provider: process.env.GEOCODE_PROVIDER,
    httpAdapter:'https',
    apiKey: process.env.GEOCODE_API_KEY,
    formatter:null
}

const geocoder=Nodegeocoder(option)
module.exports=geocoder