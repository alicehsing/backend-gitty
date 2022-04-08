const { Router } = require('express');
// const QuoteService = require('../services/QuoteService');
const fetch = require('cross-fetch');
const { response } = require('../app');

module.exports = Router()
  //GET /api/v1/quotes
  .get('/', async (req, res) => {
    const arrayOfURLs = [
      'https://programming-quotes-api.herokuapp.com/quotes/random',
      'https://futuramaapi.herokuapp.com/api/quotes/1',
      'https://api.quotable.io/random',
    ];

    //fetch from api using Promise.all
    // convert the response to json using .then()
    function fetchQuotes(arrayOfURLs) {
      return Promise.all(arrayOfURLs.map((url) => fetch(url))).then(
        (responses) => {
          return Promise.all(responses.map((response) => response.json()));
        }
      );
    }
    // munge the data into the shape we want
    function mungeQuotes(quote) {
      if (quote.en) return quote.en;
      if (quote.content) return quote.content;
      if (quote[0].quote) return quote[0].quote;
    }

    fetchQuotes(arrayOfURLs)
      .then((rawQuotes) =>
        rawQuotes.map((quote) => {
          return {
            author: quote.author || quote[0].character,
            content: mungeQuotes(quote),
          };
        })
      )
      .then((mungedQuotes) => res.send(mungedQuotes));
  });
