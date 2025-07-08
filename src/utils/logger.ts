/**
 * A utility logger object that provides various logging methods with different severity levels.
 * Each method logs messages with a timestamp and a specific color for better visibility in the console.
 */
const logger = {
  /**
   * Logs a trace-level message.
   * Typically used for very detailed debugging information.
   *
   * @param {...unknown[]} args - The message or data to log.
   */
  trace: (...args: unknown[]) => {
    const msg = [
      '[TRACE]\t',
      `[${new Date().toLocaleString()}]\t`,
      ...args,
    ].join(' ');
    console.debug(`\x1b[35m${msg}\x1b[0m`);
  },

  /**
   * Logs a debug-level message.
   * Useful for general debugging purposes.
   *
   * @param {...unknown[]} args - The message or data to log.
   */
  debug: (...args: unknown[]) => {
    const msg = [
      '[DEBUG]\t',
      `[${new Date().toLocaleString()}]\t`,
      ...args,
    ].join(' ');
    console.debug(`\x1b[36m${msg}\x1b[0m`);
  },

  /**
   * Logs an info-level message.
   * Used for informational messages that highlight the progress of the application.
   *
   * @param {...unknown[]} args - The message or data to log.
   */
  info: (...args: unknown[]) => {
    const msg = [
      '[INFO]\t ',
      `[${new Date().toLocaleString()}]\t`,
      ...args,
    ].join(' ');
    console.info(`\x1b[32m${msg}\x1b[0m`);
  },

  /**
   * Logs a warning-level message.
   * Indicates a potential issue or something to be cautious about.
   *
   * @param {...unknown[]} args - The message or data to log.
   */
  warn: (...args: unknown[]) => {
    const msg = [
      '[WARN]\t ',
      `[${new Date().toLocaleString()}]\t`,
      ...args,
    ].join(' ');
    console.warn(`\x1b[33m${msg}\x1b[0m`);
  },

  /**
   * Logs an error-level message.
   * Used for errors that occur during the execution of the application.
   *
   * @param {...unknown[]} args - The message or data to log.
   */
  error: (...args: unknown[]) => {
    const msg = [
      '[ERROR]\t',
      `[${new Date().toLocaleString()}]\t`,
      ...args,
    ].join(' ');
    console.error(`\x1b[31m${msg}\x1b[0m`);
  },

  /**
   * Logs a fatal-level message and exits the process.
   * Used for critical errors that require the application to terminate.
   *
   * @param {...unknown[]} args - The message or data to log.
   */
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

export default logger;
