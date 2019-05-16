This project was conceived of as a hackathon project in May 2019, and I built it as fast as I could. It's very messy and not well documented :anguished: Please help!

### Developing Locally
1. `npm i` to get all the packages
2. `npm start` to build the compiled scripts
3. If you have the old `bv-analytics-inspector` installed on Chrome, please disable it. They don't play nice together.
4. Open chrome and navigate to [`chrome://extensions/`](chrome://extensions/)
5. Toggle Developer Mode in the upper right hand corner if you don't already have it on
6. Click the "Load Unpacked" button and navigate in your file explorer to the `public` directory of this repo
7. When you select it, hopefully you shouldn't see any errors and the extension will pop up in Chrome
8. Whenever you make changes, you'll have to hit the refresh button in this extensions view so that the extension stays up to date (no hot reloading, sorry :frowning:)
9. That should be it! If you navigate to a page with BV content, it should capture some information in the extension. Let me know if you have problems getting set up :smile: