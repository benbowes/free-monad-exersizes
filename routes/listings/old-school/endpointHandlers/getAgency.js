const request = require('request-promise');
const getOrElse = require('get-or-else');

const AGENT_API_URL = 'https://www.realestate.com.au/api/resi-agent-api/agencies';

module.exports = async (id) => {
  let result;
  let error;

  try {
    result = await request({ url: `${AGENT_API_URL}/${id}`, json: true });
  } catch (err) {
    error = err;
  }

  return {
    statusCode: error ? (error.statusCode || 500) : 200,
    agencyName: getOrElse([result, 'name'], null),
  };
};
