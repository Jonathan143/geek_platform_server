module.exports = {
  apps: [
    {
      name: 'geek_platform_server',
      script: 'app.js',
      instances: 1,
      autorestart: true,
      watch: true,
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      max_memory_restart: '500M',
      ignore_watch: ['node_modules', 'logs', 'public', 'wechat-info.json']
    }
  ]
}
