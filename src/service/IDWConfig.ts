/**
 * @file IDWConfig.ts
 * @fileoverview - A file containing a standard interface for the configuration
 * for estabilishing a connection to a Sales Force Commerce Cloud sandbox.
 */

/**
 * @interface IDWConfig - Provides a standard interface for the needed
 * configuration fields to connect to an SFCC sandbox instance.
 */
export interface IDWConfig {
  username: string;
  password: string;
  endpoint: string;
}
