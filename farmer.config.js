module.exports = {
    apps: [
      {
        name: 'subspace-farmer-no-gpu',
        script: './subspace-farmer',
        args: 'farm --reward-address <wallet-address> path=<path-to-farmer-data>,size=<data-size> --cuda-gpus ""',
        watch: ['updater-config.json'],
        autorestart: true,
        error_file: 'subspace-farmer-no-gpu-error.log',
        out_file: 'subspace-farmer-no-gpu-output.log',
        merge_logs: false,
        max_size: '100M'
      },
      {
        name: 'subspace-farmer-2',
        script: './subspace-farmer',
        args: 'farm --reward-address <wallet-address> path=<path-to-farmer-data>,size=<data-size> --cuda-gpus "0"',
        watch: ['updater-config.json'],
        autorestart: true,
        error_file: 'farmer-2-error.log',
        out_file: 'farmer-2-output.log',
        merge_logs: false,
        max_size: '100M'
      },
      {
        name: 'subspace-farmer-3',
        script: './subspace-farmer',
        args: 'farm --reward-address <wallet-address> path=<path-to-farmer-data>,size=<data-size> --cuda-gpus "1,2"',
        watch: ['updater-config.json'],
        autorestart: true,
        error_file: 'farmer-3-error.log',
        out_file: 'farmer-3-output.log',
        merge_logs: false,
        max_size: '100M'
      },
      {
        name: 'subspace-farmer-auto-select',
        script: './subspace-farmer',
        args: 'farm --reward-address <wallet-address> path=<path-to-farmer-data>,size=<data-size>',
        watch: ['updater-config.json'],
        autorestart: true,
        error_file: 'subspace-farmer-auto-select-error.log',
        out_file: 'subspace-farmer-auto-select-output.log',
        merge_logs: false,
        max_size: '100M'
      }
    ]
  };