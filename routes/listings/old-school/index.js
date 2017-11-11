const express = require('express');
const { getBlapi, getAgency } = require('./endpointHandlers');

const router = express.Router();

const getTextResponse = (req, blapiRes, agencyRes) => {
  const agencyName = agencyRes.agencyName ? ` by ${agencyRes.agencyName}` : '';
  return `Listing ${req.params.id} was listed at ${blapiRes.address}${agencyName}`;
};

module.exports = router.get('/listings/old-school/:id', async (req, res) => {
  const blapiRes = await getBlapi(req.params.id);
  const agencyRes = await getAgency(blapiRes.id);

  if (blapiRes.statusCode > 200) {
    return res.status(blapiRes.statusCode).send();
  }

  return res.status(200).send(getTextResponse(req, blapiRes, agencyRes));
});
