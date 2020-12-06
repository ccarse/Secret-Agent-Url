import { JSDOM } from 'jsdom';
import { JobConfig, PushoverNotifier } from "ConfigTypes";

export const config: JobConfig = {
  notifiers: [
    { 
      notifierType: 'PUSHOVER', 
      pushoverUser: process.env.PUSHOVER_USER, 
      pushoverToken: process.env.PUSHOVER_TOKEN
    },
    { notifierType: 'CONSOLE' }
  ],
  urls: [
    {
      name: 'Newport music hall events', //Must be unique
      location: 'https://promowestlive.com/',
      filter: (content: string) => {
        const dom = new JSDOM(content);
        return dom.window.document.querySelector("#calendar-component > ul")?.textContent || '';
      }
    },
    {
      name: 'Random word',
      location: 'http://randomword.com/'
    }
  ],
  cache_dir: 'cache/'
};
