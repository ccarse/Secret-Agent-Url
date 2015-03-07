# urlwatch-node
My take on a url monitoring tool.

# Quick Start
1. Clone repository
  ```
  git clone https://github.com/ccarse/urlwatch-node
  cd urlwatch-node
  ```
2. Install dependencies
  ```
  npm install
  ```
3. Edit config.js, most importantly the URLs object to include the URLs you'd like to monitor.
4. If using environment variables to store email credentials, set those.  
5. Run!
  ```
  node urlwatch.js
  ```

# TODO 
- Error handling
- More customizable and richer output options
- Video quickstart tutorial
- Cron/launchd instructions
- Better logging

Special thanks to github.com/thp. I've based a lot of this on his excellent python urlwatch tool. https://github.com/thp/urlwatch
