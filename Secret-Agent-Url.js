var nodemailer = require('nodemailer');
var fs = require('fs');
var path = require('path');
var async = require('async');
var request = require('request');
var difflib = require('difflib');
var querystring = require('querystring');
var config = require('./config.js');

var emailTransporter = nodemailer.createTransport(config.email);

// Check to see if cache directory exists and if not create it.
if (!fs.existsSync(config.cache_dir)) {
  try{
    console.log('Cache directory not found. Creating...');
    fs.mkdirSync(config.cache_dir);
  } catch (e) {
    console.log('Error creating cache directory.');
    throw e;
  }
  console.log('Successfully created ' + config.cache_dir);
}

function send_email(subject, bodyText) {
  var mailOptions = {
      from: config.email.options.from,
      to: config.email.options.to,
      subject: subject,
      text: bodyText
      // html: '<b>Hello world ✔</b>'
  };

  emailTransporter.sendMail(mailOptions, function (error, info) {
      if (error) {
          console.log(error);
      } else {
          console.log('Message sent: ' + info.response);
      }
  });
}

function stripLineBreaks(str) { return str.replace(/^[\n\r]*|[\n\r]*$/g, ""); }

function stringToLineArray(str) {
    var lfpos = str.indexOf("\n");
    var crpos = str.indexOf("\r");
    var linebreak = ((lfpos > -1 && crpos > -1) || crpos < 0) ? "\n" : "\r";
    
    var lines = str.split(linebreak);
    for (var i = 0; i < lines.length; i++) {
      lines[i] = stripLineBreaks(lines[i]);
    }
    
    return lines;
  }

function foutput(type, jobName, content, summary) {

  // Returns a message type (i.e. 'changed') for
  // a URL and an optional (possibly multi-line) content.

  // The parameter "summary" is a list variable
  // that gets one item appended for the summary of the changes.

  // The return value is a list of strings (one item per line).
  var summary_txt = type.toUpperCase() + ': '+ jobName + '\n';

  if (summary) {
    if (content) {
      summary.push(summary_txt + ' (' + content.length + ' characters)');
    } else {
      summary.push(summary_txt);
    } 
  }

  var result = [];
  result.push(summary_txt);

  if (content) {
    result.push(content);
  }

  return result;
}

function my_unified_diff(fromText, toText, n, lineterm) {
  var diffStr = '';
  var s = new difflib.SequenceMatcher(null, fromText,toText);
  var groups = s.getGroupedOpcodes(n);
  console.log(groups.length + ' Changes');
  
  for (var i=0; i<groups.length; i++) {
    var group = groups[i];
    for (var m=0; m<group.length; m++) {
      var change = group[m];

      var tag = change[0];
      var i1 = change[1];
      var i2 = change[2];
      var j1 = change[3];
      var j2 = change[4];
  
      if (tag == 'replace' || tag == 'delete') {
        var lines = fromText.slice(i1,i2);
        for (var j=0; j<lines.length; j++)  {
          var line = lines[j];
          diffStr += '-' + line + '\n';
        }
      }
      if (tag == 'replace' || tag == 'insert') {
        var lines = toText.slice(j1,j2);
        for (var k=0; k<lines.length; k++)  {
          var line = lines[k];
          diffStr += '+' + line + '\n';
        }
      }
    }
  }
  // console.log(diffStr);
  return diffStr;
}

var startTime = new Date();
var summary = [];
var details = [];

function process_job(job, callback) {
  console.log('Now processing: ' + job.name);
  var result = {};
  var jobFileName = job.name.replace(/[^a-z0-9_\-]/gi, '_');
  result.job = job;

  var filePath = path.resolve(config.cache_dir, jobFileName);

  var requestOptions = {
    url: job.location,
    headers: {
        'User-Agent': job.user_agent ? job.user_agent : config.user_agent
    },
    method: job.postData ? 'POST' : 'GET',
    form: job.postData ? job.postData : undefined
  };

  request(requestOptions, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      if (job.filter) {
        result.content = job.filter(body);
      } else {
        result.content = body;
      }
    } else {
      console.log('Error processing job: ' + job.name);
      console.log(error);
      console.log(response);
    }

    if (fs.existsSync(filePath)) {
      console.log(filePath + ' exists - creating unified diff');

      var base = stringToLineArray(fs.readFileSync(filePath, {encoding: 'utf8'}));
      var newText = stringToLineArray(result.content);
      
      var diff = my_unified_diff(base, newText, 0, '\n');

      if (diff.length > 0) {
        console.log(job.name + ' has changed - adding diff');
        details.push(foutput('changed', job.name, diff, summary));
      } else {
        console.log(job.name + ' has not changed');
      }
    } else {
      console.log(filePath + ' does not exist - is considered "new"');
      details.push(foutput('new', job.name, null, summary));
    }

    try {
      console.log('Writing current content of ' + job.name + ' to ' + filePath);
      fs.writeFileSync(filePath, result.content);
    } catch(e) {
      console.log('Error writing ' + job.name + ' to file. \n' + e);
    }

    callback(null, result);
  });
}

var jobs = config.urls;

console.log('Processing ' + jobs.length + ' jobs');

async.mapLimit(jobs, config.max_concurrent_requests, process_job, function(err, results) {
  
  if (err) {
    console.log('Error processing jobs.');
    console.log(err);
  }
  console.log('Start time: ' + startTime);
  console.log( results.length + ' jobs complete' );
  var endTime = new Date();
  console.log('End time: ' + endTime);

  short_summary = '';

  // Output everything
  if (summary.length > 0) {
    console.log('Printing summary with ' + summary.length + ' items');
    
    short_summary += summary.length + ' change(s)' + '\n\n';
    for (l=0; l < summary.length; l++) {
      short_summary += (l+1) + '. ' + summary[l] + '\n\n';
    }
    short_summary += '\n';
    console.log(short_summary);
  } else {
    console.log('Summary is too short - not printing');
  }
  
  if (details.length > 0) {
    console.log('Printing details with ' + details.length + ' items');
    console.log('-- ');
    var seconds = (endTime.getTime() - startTime.getTime())/1000;
    console.log('Watched ' + config.urls.length + ' URLs in ' + seconds + ' seconds\n' );

    try {
      emailSubject = 'Changes detected (' + summary.length + ')';
      send_email(emailSubject, short_summary + '\n' + details.join('\n'));

      console.log('E-Mail sent.')
    } catch(e) {
      console.log('E-Mail delivery error: ' + e);
    }
  } else {
    console.log('no details collected - not printing');
  }
});
