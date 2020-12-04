import * as fs from 'fs';

import { config } from './config';
import { IJobResult, ProcessJob } from "./ProcessJob";
import { send_email } from './SendMail';

const main = async () => { 

  const cacheDir = config.cache_dir || '/cache';

  // Check to see if cache directory exists and if not create it.
  if (!fs.existsSync(cacheDir)) {
    try {
      console.log('Cache directory not found. Creating...');
      fs.mkdirSync(cacheDir);
    } catch (e) {
      console.log('Error creating cache directory.');
      throw e;
    }
    console.log('Successfully created ' + cacheDir);
  }

  const startTime = new Date();

  const urlConfigs = config.urls;

  console.log('Processing ' + urlConfigs.length + ' jobs');

  const urlPromises = urlConfigs.map( urlConfig => {
    const userAgent = urlConfig.user_agent ? urlConfig.user_agent : config.user_agent;
    const userAgentObj = userAgent ? {'User-Agent': userAgent} : undefined;

    return ProcessJob(urlConfig, cacheDir, userAgentObj, config.proxy);
  });

  try {
    const results = await Promise.all(urlPromises);

    if (!results) { console.log('No results.'); return; }

    console.log('Start time: ' + startTime);
    console.log(results.length + ' jobs complete');
    const endTime = new Date();
    console.log('End time: ' + endTime);

    let shortSummary = '';
    const summary: string[] = [];
    const details: string[] = [];

    results.forEach( (result: IJobResult | void) => {
      console.log(result);
      if ( !result ) { return; }

      if ( result.summary ) { summary.push(result.summary); }
      if ( result.details ) { details.push(...result.details); }
    });
    // Output everything
    if (summary.length > 0) {
      console.log('Printing summary with ' + summary.length + ' items');

      shortSummary += summary.length + ' change(s)' + '\n\n';
      for (let l = 0; l < summary.length; l++) {
        shortSummary += (l + 1) + '. ' + summary[l] + '\n\n';
      }
      shortSummary += '\n';
      console.log(shortSummary);
    } else {
      console.log('Summary is too short - not printing');
    }

    if (details.length > 0) {
      console.log('Printing details with ' + details.length + ' items');
      console.log('-- ');
      const seconds = (endTime.getTime() - startTime.getTime()) / 1000;
      console.log('Watched ' + config.urls.length + ' URLs in ' + seconds + ' seconds\n');

      if (config.email) {
        const emailSubject = 'Changes detected (' + summary.length + ')';
        send_email(config.email, emailSubject, shortSummary + '\n' + details.join('\n'));
      }
    } else {
      console.log('no details collected - not printing');
    }
  } catch (err) {
    console.log("Fatal error! " + err);
  }
};

main();
