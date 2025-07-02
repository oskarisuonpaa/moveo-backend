export const logger = {
  trace: (...args: unknown[]) => {
    const msg = [
      '[TRACE]\t',
      `[${new Date().toLocaleString()}]\t`,
      ...args,
    ].join(' ');
    console.debug(`\x1b[35m${msg}\x1b[0m`);
  },
  debug: (...args: unknown[]) => {
    const msg = [
      '[DEBUG]\t',
      `[${new Date().toLocaleString()}]\t`,
      ...args,
    ].join(' ');
    console.debug(`\x1b[36m${msg}\x1b[0m`);
  },
  info: (...args: unknown[]) => {
    const msg = [
      '[INFO]\t ',
      `[${new Date().toLocaleString()}]\t`,
      ...args,
    ].join(' ');
    console.info(`\x1b[32m${msg}\x1b[0m`);
  },
  warn: (...args: unknown[]) => {
    const msg = [
      '[WARN]\t ',
      `[${new Date().toLocaleString()}]\t`,
      ...args,
    ].join(' ');
    console.warn(`\x1b[33m${msg}\x1b[0m`);
  },
  error: (...args: unknown[]) => {
    const msg = [
      '[ERROR]\t',
      `[${new Date().toLocaleString()}]\t`,
      ...args,
    ].join(' ');
    console.error(`\x1b[31m${msg}\x1b[0m`);
  },
  fatal: (...args: unknown[]) => {
    const msg = [
      '[FATAL]\t',
      `[${new Date().toLocaleString()}]\t`,
      ...args,
    ].join(' ');
    console.error(`\x1b[5;91m${msg}\x1b[0m`);
    process.exit(1);
  },
};
