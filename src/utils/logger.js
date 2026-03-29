function log(level, message, extra = null) {
  const payload = {
    time: new Date().toISOString(),
    level,
    message,
    ...(extra ? { extra } : {})
  };

  console.log(JSON.stringify(payload));
}

module.exports = {
  info: (message, extra) => log('info', message, extra),
  warn: (message, extra) => log('warn', message, extra),
  error: (message, extra) => log('error', message, extra)
};