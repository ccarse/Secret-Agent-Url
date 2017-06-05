import * as fs from 'fs';
import * as path from 'path';
import * as rp from 'request-promise-native';

import { IUrlConfig } from "ConfigTypes";
import { my_unified_diff } from "./DiffHelpers";
import { FormatOutput } from "./FormatOutput";
import { stringToLineArray } from "./StringHelpers";

export function ProcessJob(urlConfig: IUrlConfig, cacheDir: string, userAgent?: {'User-Agent': string}, proxy?: string): Promise<IJobResult> {

  console.log('Now processing: ' + urlConfig.name);
  
  const jobFileName = urlConfig.name.replace(/[^a-z0-9_\-]/gi, '_');

  const filePath = path.resolve(cacheDir, jobFileName);

  const requestOptions = {
    url: urlConfig.location,
    headers: userAgent,
    method: urlConfig.postData ? 'POST' : 'GET',
    form: urlConfig.postData ? urlConfig.postData : undefined,
    proxy
  };

  console.log('Request options: ' + JSON.stringify(requestOptions));

  return rp(requestOptions)
  .then( bodyString => {
    let result: IJobResult = {};
    const resultString: string = urlConfig.filter ? urlConfig.filter(bodyString) : bodyString;

    if (fs.existsSync(filePath)) {
      console.log(filePath + ' exists - creating unified diff');

      const base = stringToLineArray(fs.readFileSync(filePath, {encoding: 'utf8'}));
      const newText = stringToLineArray(resultString);
      
      const diff = my_unified_diff(base, newText, 0, '\n');

      if (diff.length > 0) {
        console.log(urlConfig.name + ' has changed - adding diff');
        result = FormatOutput('changed', urlConfig.name, diff);
      } else {
        console.log(urlConfig.name + ' has not changed');
      }
    } else {
      console.log(filePath + ' does not exist - is considered "new"');
      result = FormatOutput('new', urlConfig.name, null);
    }

    try {
      console.log('Writing current content of ' + urlConfig.name + ' to ' + filePath);
      fs.writeFileSync(filePath, resultString);
    } catch (e) {
      console.log('Error writing ' + urlConfig.name + ' to file. \n' + e);
      result = {error: e};
    }

    return result;
  })
  .catch( err => {
    console.log('Error processing job: ' + urlConfig.name);
    console.log(err);
    return {error: err};
  });
}

export interface IJobResult {
    summary?: string;
    details?: string[];
    error?: any;
}
