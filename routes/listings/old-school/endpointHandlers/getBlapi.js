const request = require('request-promise');
const get = require('lodash.get');

const BLAPI_URL = 'https://blapi.buy-listings-pipeline.resi-property.realestate.com.au/services/listings';

const getAddress = (result) => {
  const street = get(result, 'address.display.shortAddress', '');
  const suburb = get(result, 'address.suburb', '');
  const state = get(result, 'address.state', '');
  const postcode = get(result, 'address.postcode', '');
  const addressStr = `${street} ${suburb} ${state} ${postcode}`.trim().replace(/\s+/g, ' ');

  return addressStr.length
    ? addressStr
    : null;
};

module.exports = async (id) => {
  let result;
  let error;

  try {
    result = await request({ url: `${BLAPI_URL}/${id}`, json: true });
  } catch (err) {
    error = err;
  }

  return {
    statusCode: error ? (error.statusCode || 500) : 200,
    id: get(result, 'agency.id', null),
    address: getAddress(result),
  };
};
