module.exports = {
    apps: [
      {
        name: 'subspace-node',
        script: './subspace-node',
        args: 'run --chain mainnet --base-path <path-to-node-data>',
        watch: ['updater-config.json'],
        autorestart: true,
        error_file: 'node-error.log',
        out_file: 'node-output.log',
        merge_logs: false,
        max_size: '200M'
      }
    ]
  };