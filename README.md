# Commently - Comment the web!

Commently is a Chrome extension that allows you to comment and have discussions over any webpage on the internet.

**Note**: This extension might not work out of the box and may need several updates and/or fixes (the last commit before this information update was about 2 years ago). However, a web app is currently in the works to translate this idea into a more accessible platform. The source code for the same can be found here: [Web App](https://github.com/aannirajpatel/commently-web-app), [Backend](https://github.com/aannirajpatel/commently-backend).

How to use:

1. Download this repo as a ZIP file by clikcing [here](https://github.com/aannirajpatel/Commently/archive/refs/heads/main.zip) or through GitHub.
2. Unzip the file, to get a folder named Commently.
3. In Google Chrome, go to [chrome://extensions](chrome://extensions) and enable `Developer Mode` from the top right corner.
4. Drag the `build` folder that is in `Commently/` onto anywhere on that Chrome Extensions page to import it. (Please keep the folder after importing, as Chrome uses that folder for whenever the extension's code gets used)

## License

Copyright (C) 2021 Aan Patel. All rights reserved.

## React Chrome Extension

We have open sourced the boilerplate of chrome extension with ReactJs using inject page strategy. Read [detailed blog](https://medium.com/@satendra02/create-chrome-extension-with-reactjs-using-inject-page-strategy-137650de1f39)

The boilerplate is to quickly create a chrome extension using ReactJs, The motivation behind creating a boilerplate was:

1. Instead of chrome's ready-made popup, We wanted our own page injected into DOM as a sidebar for better UX.

2. We wanted to use ReactJs for the Component-based approach, Routing, and its build mechanism.

3. We need to make sure that the extension CSS should not conflict with the host page styles in any case.

## Features

- Used ReactJs to write chrome extension
- Injecting extension to host page as content script
- Utilized the Chrome messaging API
- Isolated extension CSS using Iframe

## Installation

> Make sure you have latest **NodeJs** version installed

Clone repo

```
git clone https://github.com/satendra02/react-chrome-extension.git
```

Go to `react-chrome-extension` directory run

```
yarn install
```

Now build the extension using

```
yarn build
```

You will see a `build` folder generated inside `[PROJECT_HOME]`

To avoid running `yarn build` after updating any file, you can run

```
yarn watch
```

which listens to any local file changes, and rebuilds automatically.

## Adding React app extension to Chrome

In Chrome browser, go to chrome://extensions page and switch on developer mode. This enables the ability to locally install a Chrome extension.

<img src="https://cdn-images-1.medium.com/max/1600/1*OaygCwLSwLakyTqCADbmDw.png" />

Now click on the `LOAD UNPACKED` and browse to `[PROJECT_HOME]\build` ,This will install the React app as a Chrome extension.

When you go to any website and click on extension icon, injected page will toggle.

<img src="https://cdn-images-1.medium.com/max/1600/1*bXJYfvrcHDWKwUZCrPI-8w.png" />

## Using SASS

Boilerplate contains [sass-loader](https://github.com/webpack-contrib/sass-loader), so you can use SASS instead of pure CSS in your project. To do so:

1. Rename `src/App.css` file to `src/App.scss`
2. Change import line in `src/app.js` from
   `import './App.css';` to `import './App.scss';`
