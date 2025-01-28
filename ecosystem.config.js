module.exports = {
  apps: [{
    name: 'autonomys-updater',
    script: './dist/main.js',
    watch: ['dist/config.js'],
    watch_delay: 3000,
    cron_restart: '0 0 * * *', // Run at midnight every day
    autorestart: false,
    max_memory_restart: '200M',
    error_file: 'error.log',
    out_file: 'output.log',
    merge_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
};