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
# Build the project
npm run build
# Start with PM2
npm run pm2
```

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
├── ecosystem.config.js    # PM2 configuration
├── package.json
└── tsconfig.json
```
