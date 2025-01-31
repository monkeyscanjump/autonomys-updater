# Autonomys Updater

Automated updater for Autonomys Network node and farmer binaries.

## Description

This service automatically checks for and downloads the latest Autonomys Network binaries from the official GitHub repository. It runs as a background service using PM2 and updates the binaries once every 24 hours if a new version is available.

## Prerequisites

- Node.js (v14 or higher)
- npm
- PM2 (`npm install -g pm2`)
- Sufficient disk space for binary downloads
- Write permissions in the installation directory

## Installation

1. Clone the repository:

```bash
# Clone repo
git clone https://github.com/yourusername/autonomys-updater.git
# Go to repo folder
cd autonomys-updater
# Install dependencies
npm install
```

### Configure binaries

Edit file `src/config.ts` > `config.files` array list with OS and use case speciffic Autonomys binaries.

## Start the Updater

```bash
# Build the project
npm run build
# Start Updater with PM2
npm run updater
```

### Additional PM2 processes for running an Autonomys Node and Farmer(s)

```bash
# Start Node with PM2
npm run node
# Start Farmer(s) with PM2
npm run farmer
```

## PM2 Start on OS boot

```bash
pm2 startup
```

## PM2 Process files

### updater.config.js

Handles the auto-update logic and will restart whenever `dist/config.js` is updated.

### node.config.js

> Optional PM2 process file. Custom edits needed.

Handles the node needed for farmers and will restart whenever a new version of the node binary has been downloaded, based on `updater-config.json` (file will update once a new version of the binaries are available).

### farmer.config.js

> Optional PM2 process file. Custom edits needed.

Handles the farmer or farmers and will restart whenever a new version of the node binary has been downloaded, based on `updater-config.json` (file will update once a new version of the binaries are available).

## Ensure PM2 processes are saved in order to restart them on reboot

```bash
pm2 save
```

### [PM2 Guide](https://pm2.keymetrics.io/docs/usage/quick-start/)

## Project Structure

```plaintext
autonomys-updater/
├── src/
│   ├── config.ts          # Configuration settings
│   ├── types.ts           # TypeScript interfaces
│   ├── utils/
│   │   ├── file.utils.ts    # File operations
│   │   ├── github.utils.ts  # GitHub API interactions
│   │   └── logger.utils.ts  # Logging utility
│   └── main.ts           # Main application logic
├── farmer.config.js    # Farmer(s) PM2 configuration
├── node.config.js    # Node PM2 configuration
├── package.json
├── tsconfig.json
└── updater-config.js    # Updater PM2 configuration
```
