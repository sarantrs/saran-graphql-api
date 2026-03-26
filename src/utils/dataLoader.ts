import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { dataLogger as logger } from './logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_DIR = join(__dirname, '..', 'dataModel');

/**
 * Read data from a JSON file in the dataModel directory
 */
export function readData<T>(filename: string): T[] {
  const filePath = join(DATA_DIR, filename);
  logger.debug(`Reading data from ${filename}`);
  
  try {
    const content = readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content) as T[];
    logger.debug(`Successfully read ${data.length} records from ${filename}`);
    return data;
  } catch (error) {
    logger.error(`Failed to read data from ${filename}`, { error: (error as Error).message });
    throw error;
  }
}

/**
 * Write data to a JSON file in the dataModel directory
 */
export function writeData<T>(filename: string, data: T[]): void {
  const filePath = join(DATA_DIR, filename);
  logger.debug(`Writing ${data.length} records to ${filename}`);
  
  try {
    writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    logger.info(`Successfully wrote ${data.length} records to ${filename}`);
  } catch (error) {
    logger.error(`Failed to write data to ${filename}`, { error: (error as Error).message });
    throw error;
  }
}

/**
 * Generate a simple unique ID
 */
export function generateId(): string {
  const id = Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  logger.debug(`Generated new ID: ${id}`);
  return id;
}
