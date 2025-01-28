export const config = {
    github: {
      baseUrl: 'https://github.com/autonomys/subspace',
      tagPrefix: 'mainnet-'
    },
    paths: {
      temp: '/temp',
      configFile: 'subspace-config.json'
    },
    files: {
      farmer: 'subspace-farmer',
      node: 'subspace-node'
    },
    system: {
      retryAttempts: 3,
      retryDelay: 5000, // 5 seconds
      checkInterval: 24 * 60 * 60 * 1000 // 24 hours
    }
  } as const;