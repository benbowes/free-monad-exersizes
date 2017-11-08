const request = require('request-promise');
const _get = require('lodash.get');
const { BLAPI_URL } = require('../constants');

module.exports = async function getBlapi(id) {
  let result;
  let error;

  try {
    const str = await request(`${BLAPI_URL}/${id}`);
    result = JSON.parse(str);
  } catch (err) {
    error = err;
  }

  return {
    statusCode: error ? (error.statusCode || 500) : 200,
    id: _get(result, 'agency.id', undefined),
    address: _get(result, 'address.display.shortAddress', undefined)
  }
}
