# Secret-Agent-Url
My take on a url monitoring tool.

# Quick Start
1. Clone repository

  ```
  git clone https://github.com/ccarse/Secret-Agent-Url
  cd Secret-Agent-Url
  ```
2. Install dependencies
  
  ```
  npm install
  ```
3. Edit config.js, most importantly the URLs object to include the URLs you'd like to monitor.
4. If using environment variables to store email credentials, set those.  
5. Run!
  
  ```
  node Secret-Agent-Url.js
  ```

# TODO 
- [ ] Error handling
- [ ] More customizable and richer output options
- [ ] Video quickstart tutorial
- [ ] Cron/launchd instructions
- [ ] Better logging

# FAQ
### Hey n00b, you didn't capitalize URL, what gives? 
The project is pronounced Secret Agent Earl, it's not capitalized to try and help point out that it's a play on words. 

Special thanks to http://github.com/thp. I've based a lot of this on his excellent python urlwatch tool. http://thp.io/2008/urlwatch/
