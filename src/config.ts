// let $ = import from 'jquery')(import from "jsdom").jsdom().parentWindow) //You can use full jquery with jsdom but cheerio is probably sufficient
import * as cheerio from 'cheerio';
import * as nodemailer from 'nodemailer';

import { IJobConfig } from "ConfigTypes";

export const config: IJobConfig = {
  urls: [
    {
      name: 'Random word', //Must be unique
      location: 'http://randomword.com/',
      filter: (content: string) => {
        const $ = cheerio.load(content);
        return $("body").text();
      }
    }
    // {
    //   name: 'Some other location',
    //   location: 'http://www.someOtherUrl.com/',
    //   postData: {
    //     blah: 'coa',
    //     keyword: 'whoa',
    //     stype: 'ANY',
    //     search: 'Go!'
    //   },
    //   filter(content: any) {
    //     const $ = cheerio.load(content);
    //     return $("table#DataTable").text();
    //   }
    // }
  ],
  email: { //See https://github.com/andris9/nodemailer-smtp-transport#usage
    smtp: {
      service: 'Gmail', //See https://github.com/andris9/nodemailer-wellknown#supported-services
      auth: {
        user: process.env.EMAIL_AUTH_USER, //Use environment variables to prevent from commiting to source control
        pass: process.env.EMAIL_AUTH_PASS
      }
    },
    options: {
      fromEmailAddress: process.env.EMAIL_OPTIONS_FROM,
      toEmailAddress: process.env.EMAIL_OPTIONS_TO
    }
  },
  user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2227.1 Safari/537.36', // Not required
  cache_dir: 'cache/' // Not required, this is the default location
};
