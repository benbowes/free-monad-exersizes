const nock = require('nock');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('./');

const { expect } = chai;
chai.use(chaiHttp);

const blapiResponse = {
  documentType: 'ResidentialListing',
  id: '112',
  title: 'Fabulous City Views!',
  dateActive: '2016-11-22T00:00:00Z',
  address: {
    suburb: 'Richmond', state: 'Vic', postcode: '3121', display: { shortAddress: '409/20 Burnley Street', geocode: { latitude: -37.812667, longitude: 145.008914 } },
  },
  generalFeatures: { bedrooms: { value: 1 }, bathrooms: { value: 1 }, parkingSpaces: { value: 1 } },
  description: '61sqm of lifestyle living <br/>                                 <br/>Quiet, Rear location<br/> <br/>- Superior one bedroom apartment - built in robes<br/>- Open plan living and dining with city views<br/>- Balcony to both lounge and bedroom<br/>- Sleek kitchen - Miele appliances, stainless steel gas hot plates and dishwasher<br/>- Stone bench tops<br/>- Separate bathroom<br/>- European laundry<br/>- Reverse cycle air conditioning <br/>- Security under cover car space<br/>- Storage cage<br/>- Approx 52 sqm internally plus balcony <br/>- Low Owners corp $458pq<br/>- Potential return $21,000pa; $400pw<br/>- Pool and gym facilities<br/><br/>Ideally located within walking distance to Victoria Gardens, cinemas, cafes, restaurants, shops and transport at your door. Yarra River, bike paths, golf course and parkland minutes away.<br/><br/>Conditions of entry - IDENTIFICATION and contact number required, otherwise entry may be refused.<br/>    ',
  propertyType: 'apartment',
  price: { display: '\n      Contact Agent\n    ' },
  auction: { time: '2016-12-16T23:00:00Z' },
  inspections: [],
  agency: { id: 'XBSRIC' },
  listers: [{ id: '1458122' }, { id: '323851' }],
  productDepth: 'signature',
  media: { mainImage: { path: '2302bfd2851e7131e97f40da33f31bdb9e8cbf365c1b92c44bff3aaf867c7ec1/image.jpg' }, images: [{ path: '2302bfd2851e7131e97f40da33f31bdb9e8cbf365c1b92c44bff3aaf867c7ec1/image.jpg' }, { path: '5865e56a2d1055129523c908b964d3494d93a9c83f50a167d68b48682bdfcf4e/image.jpg' }, { path: '8b47cfb014129023179241e21e39e3d35cce92f122a2739e5fea736c23cee422/image.jpg' }, { path: 'c4d8b2c811d5093cbbd635e5810e3eaf0ae510835a1089658c7273d34658363b/image.jpg' }, { path: '090ba82b78654df6b0eb2ad6989e99b115c97b2ab98e60ede9d14211a0ecec34/image.jpg' }, { path: 'b836b0f7bdea6bc559a209a1623605336e59334621dc99e0488334d825c8cc4d/image.jpg' }], floorplans: [{ path: '48857d207912a08a72fca517400ce26b4516eda12171649497903c49df3b87cf/image.jpg' }] },
  underOffer: false,
};

const agencyResponse = {
  name: 'Biggin & Scott - Richmond',
  heroImage: {
    uri: '/efff6d0ce35afa99776bf004b84e0bf3aaaf0db972d5327bbdb0df7c6091eda2/main.gif',
  },
  description: 'Occupying shop fronts 22 - 28 Bridge Rd, Richmond. Prominently located with 4 window street frontage. Great exposure, enormous pedestrian traffic close to main tram stop/train stations, restaurants, shopping and MCG ensure a regular street clientele! Richmond Office is the No. 1 performing branch in the network. We are also currently the No 1. Agent in the local market place. Our sales department completes close to 400 sales per annum with an annual turnover of over $300 million in property sales. The sales team is outstanding, the best in the business. Our team includes the leading sales representatives in the Biggin & Scott network over the past 20 years.',
  urls: {
    facebook: 'https://www.facebook.com/bigginscottrichmond/',
    website: 'http://www.bigginscott.com.au/',
  },
  contacts: {
    businessFax: '9428 6558',
    businessPhone: '03 9426 4000',
  },
  logo: {
    uri: '/9dbf5bdb671a0f74c7e4461c92b9fcb91fec67199e01445e2e7f24b75060e94a/main.gif',
  },
  id: 'XBSRIC',
  address: {
    state: 'VIC',
    suburb: 'RICHMOND',
    postcode: '3121',
    streetAddress: '28 Bridge Road',
  },
  isResidentialCustomer: true,
  branding: {
    textColor: '#ffffff',
    primaryColor: '#002A5C',
  },
  _links: {
    'http://data.realestate.com.au/doc/relations#contactService': {
      href: 'https://agent-contact.resi-agent.realestate.com.au/contact-agency/XBSRIC',
    },
  },
};

describe('Expected responses for /listings/old-school/', () => {
  it('Expected text is returned when Blapi returns 200 and AgencyAPI returns 200', (done) => {
    nock('https://blapi.buy-listings-pipeline.resi-property.realestate.com.au')
      .get('/services/listings/112')
      .reply(200, blapiResponse);

    nock('https://www.realestate.com.au')
      .get('/api/resi-agent-api/agencies/XBSRIC')
      .reply(200, agencyResponse);

    chai.request(server)
      .get('/listings/old-school/112')
      .end((err, res) => {
        expect(res.text).to.equal('Listing 112 was listed at 409/20 Burnley Street Richmond Vic 3121 by Biggin & Scott - Richmond');
        done();
      });
  });

  it('Expected text is returned when Blapi returns 200 and AgencyAPI returns 404', (done) => {
    nock('https://blapi.buy-listings-pipeline.resi-property.realestate.com.au')
      .get('/services/listings/112')
      .reply(200, blapiResponse);

    nock('https://www.realestate.com.au')
      .get('/api/resi-agent-api/agencies/XBSRIC')
      .reply(404);

    chai.request(server)
      .get('/listings/old-school/112')
      .end((err, res) => {
        expect(res.text).to.equal('Listing 112 was listed at 409/20 Burnley Street Richmond Vic 3121');
        done();
      });
  });

  it('Expected text is returned when Blapi returns 200 and AgencyAPI returns 500', (done) => {
    nock('https://blapi.buy-listings-pipeline.resi-property.realestate.com.au')
      .get('/services/listings/112')
      .reply(200, blapiResponse);

    nock('https://www.realestate.com.au')
      .get('/api/resi-agent-api/agencies/XBSRIC')
      .reply(500);

    chai.request(server)
      .get('/listings/old-school/112')
      .end((err, res) => {
        expect(res.text).to.equal('Listing 112 was listed at 409/20 Burnley Street Richmond Vic 3121');
        done();
      });
  });

  it('404 is returned when Blapi returns 404 and AgencyAPI returns 200', (done) => {
    nock('https://blapi.buy-listings-pipeline.resi-property.realestate.com.au')
      .get('/services/listings/112')
      .reply(404);

    nock('https://www.realestate.com.au')
      .get('/api/resi-agent-api/agencies/XBSRIC')
      .reply(200, agencyResponse);

    chai.request(server)
      .get('/listings/old-school/112')
      .end((err, res) => {
        expect(res.statusCode).to.equal(404);
        done();
      });
  });

  it('401 is returned when Blapi returns 401 and AgencyAPI returns 200', (done) => {
    nock('https://blapi.buy-listings-pipeline.resi-property.realestate.com.au')
      .get('/services/listings/112')
      .reply(401);

    nock('https://www.realestate.com.au')
      .get('/api/resi-agent-api/agencies/XBSRIC')
      .reply(200, agencyResponse);

    chai.request(server)
      .get('/listings/old-school/112')
      .end((err, res) => {
        expect(res.statusCode).to.equal(401);
        done();
      });
  });

  it('500 is returned when Blapi returns 500 and AgencyAPI returns 200', (done) => {
    nock('https://blapi.buy-listings-pipeline.resi-property.realestate.com.au')
      .get('/services/listings/112')
      .reply(500);

    nock('https://www.realestate.com.au')
      .get('/api/resi-agent-api/agencies/XBSRIC')
      .reply(200, agencyResponse);

    chai.request(server)
      .get('/listings/old-school/112')
      .end((err, res) => {
        expect(res.statusCode).to.equal(500);
        done();
      });
  });
});
