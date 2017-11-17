# medhi-api-test

This is an exercise from <https://git.realestate.com.au/mehdi-mollaverdi/free-monad-exercises>

## free-monad-exercises

### Exercise 1

Build an API with a /listings/old-school/{listingId} endpoint which

- Fetches the listing for the given listingId from BLAPI
- Extracts the listing address and agency Id out of BLAPI response
- Fetches the agency from rea-agency-api bucket
- Extracts agency name out of agency document
- Returns a text response using the following template: Listing {listingId} was listed at {address} by {agencyName}
- Returns a 404 if BLAPI returned a 404
- Returns the following response if the agency document did not exist in the bucket: Listing {listingId} was listed at {address}

Can be done in either

Scala: Use the netty-api-stencil as the starting point
NodeJS: Use your favourite NodeJS web framewrok
Don't use free monads for the first exercise. Don't forget to write tests.

### Exercise 2

Add a /listings/free/{listingId} endpoint which does the same, but uses Free Monad and the interpreter pattern.

If you're doing it in Scala, use the cats reference documentation for free monads. If you're doing it in NodeJS, see my previous attempt at using free monads in JavaScript here.

## Getting started

`nvm install` to install node version in `.nvmrc`

`yarn install` to install the dependencies

`yarn test` to run the tests

`yarn start` to run the server

`yarn start:debug` - to run the server with the `--inspect` flag. Allowing you to debug the server code in Chrome, like you would with client-side code. Add breakpoints via the `Sources` panel and the like...

View in a browser at <http://localhost:3005/listings/old-school/112>
