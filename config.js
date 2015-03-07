var cheerio = require('cheerio');
// var $ = require('jquery')(require("jsdom").jsdom().parentWindow) //You can use full jquery with jsdom but cheerio is probably sufficient

var config = {
  email: { //See https://github.com/andris9/nodemailer-smtp-transport#usage
    service: 'Gmail', //See https://github.com/andris9/nodemailer-wellknown#supported-services
    auth: {
      user: process.env.EMAIL_AUTH_USER, //Use environment variables to prevent from commiting to source control
      pass: process.env.EMAIL_AUTH_PASS
    },
    options: {
      from: process.env.EMAIL_OPTIONS_FROM,
      to: process.env.EMAIL_OPTIONS_TO
    }
  },
  urls: [ //Name and location are the only two required fields for each URL. 
    {
      name: 'Google I/O', //Must be unique
      location: 'https://www.google.com/events/io'
    },
    {
      name: 'Apple Open Source', 
      location: 'https://www.apple.com/opensource/',
      filter: function(content) { // Use the filter function to return the specific part of a page to watch. Content is a string of the page entire 
        var $ = cheerio.load(content); 
        return $("section").text(); //Get the entire contents of the <section> tag
      }
    }, 
    {
      name: 'Post example', 
      location: 'http://example.com/',
      postData: { 
        keyword: 'example',
        otherPostData: 'something else'
      },
      filter: function(content) {
        var $ = cheerio.load(content);
        return $("table").text();
      }
    }
  ],
  user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2227.1 Safari/537.36',
  max_concurrent_requests: 10,
  cache_dir: 'cache/',
};

module.exports = config;