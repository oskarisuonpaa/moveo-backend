import util from 'util';

export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export interface LoggerOptions {
  level?: LogLevel;
  prefix?: string;
  useColors?: boolean;
  timestamps?: boolean;
}

const LEVEL_PRIORITIES: Record<LogLevel, number> = {
  trace: 0,
  debug: 1,
  info: 2,
  warn: 3,
  error: 4,
  fatal: 5,
};

const ANSI_COLORS: Record<LogLevel, string> = {
  trace: '\x1b[35m',
  debug: '\x1b[36m',
  info: '\x1b[32m',
  warn: '\x1b[33m',
  error: '\x1b[31m',
  fatal: '\x1b[5;91m',
};

export class Logger {
  private level: LogLevel;
  private prefix: string;
  private useColors: boolean;
  private timestamps: boolean;

  constructor(opts: LoggerOptions = {}) {
    this.level = opts.level ?? 'debug';
    this.prefix = opts.prefix ? `[${opts.prefix}] ` : '';
    this.useColors = opts.useColors ?? true;
    this.timestamps = opts.timestamps ?? true;
  }

  private shouldLog(l: LogLevel) {
    return LEVEL_PRIORITIES[l] >= LEVEL_PRIORITIES[this.level];
  }

  private format(level: LogLevel, args: unknown[]) {
    const timeStr = this.timestamps ? `[${new Date().toISOString()}]\t` : '';
    const prefix = `${this.prefix}${level.toUpperCase()}: `;
    const msg = util.formatWithOptions({ depth: null }, ...args);

    let out = `${timeStr}${prefix}${msg}`;
    if (this.useColors) {
      const color = ANSI_COLORS[level] || '';
      out = `${color}${out}\x1b[0m`;
    }
    return out;
  }

  private log(level: LogLevel, ...args: unknown[]) {
    if (!this.shouldLog(level)) return;
    const out = this.format(level, args);
    if (level === 'error' || level === 'fatal') {
      console.error(out);
    } else if (level === 'warn') {
      console.warn(out);
    } else {
      console.log(out);
    }
  }

  trace(...args: unknown[]) {
    this.log('trace', ...args);
  }
  debug(...args: unknown[]) {
    this.log('debug', ...args);
  }
  info(...args: unknown[]) {
    this.log('info', ...args);
  }
  warn(...args: unknown[]) {
    this.log('warn', ...args);
  }
  error(...args: unknown[]) {
    this.log('error', ...args);
  }
  fatal(...args: unknown[]) {
    this.log('fatal', ...args);
  }

  setLevel(level: LogLevel) {
    this.level = level;
  }
  setPrefix(prefix: string) {
    this.prefix = `[${prefix}] `;
  }
  enableColors(flag = true) {
    this.useColors = flag;
  }
  enableTimestamps(flag = true) {
    this.timestamps = flag;
  }
}

export default new Logger();
