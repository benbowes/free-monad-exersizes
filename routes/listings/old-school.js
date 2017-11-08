const express = require('express');
const router = express.Router();
const request = require('request-promise');
const _get = require('lodash.get');

const { getBlapi, get500, get404 } = require('../../endpointHandlers');

module.exports = router.get('/listings/old-school/:id', async (req, res) => {
  const blapiRes = await getBlapi(req.params.id);
  const error404 = await get404(req.params.id);
  const error500 = await get500(req.params.id);

  res.send({ blapiRes, error404, error500 });
});
