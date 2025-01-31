export const config = {
  github: {
    baseUrl: 'https://github.com/autonomys/subspace',
    tagPrefix: 'mainnet-'
  },
  paths: {
    temp: '/temp',
    configFile: 'updater-config.json'
  },
  files: [
    {
      downloadName: 'subspace-farmer-ubuntu-x86_64-v2', // Will be appended with tag
      targetName: 'subspace-farmer',                    // Final name after rename
      required: true                                    // If download/install fails for required files, entire update fails
    },
    {
      downloadName: 'subspace-node-ubuntu-x86_64-v2',
      targetName: 'subspace-node',
      required: true
    },
    // Example of how to add more files:
    // {
    //   downloadName: 'subspace-farmer-windows-x86_64-v2.exe', // Windows version
    //   targetName: 'subspace-farmer.exe',
    //   required: true
    // }
  ],
  system: {
    retryAttempts: 3,
    retryDelay: 5000, // 5 seconds
    checkInterval: 24 * 60 * 60 * 1000 // 24 hours
  }
} as const;

// Type for the config file structure
export type Config = typeof config;