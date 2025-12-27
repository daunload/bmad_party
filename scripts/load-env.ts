/**
 * Load environment variables from .env.local file
 * This is a simple env loader without external dependencies
 */

import { readFileSync } from 'fs';
import { join } from 'path';

export function loadEnv() {
  const envPath = join(process.cwd(), '.env.local');
  
  try {
    const envFile = readFileSync(envPath, 'utf-8');
    const lines = envFile.split('\n');
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Skip empty lines and comments
      if (!trimmedLine || trimmedLine.startsWith('#')) {
        continue;
      }
      
      // Parse KEY=VALUE format
      const equalIndex = trimmedLine.indexOf('=');
      if (equalIndex === -1) {
        continue;
      }
      
      const key = trimmedLine.substring(0, equalIndex).trim();
      let value = trimmedLine.substring(equalIndex + 1).trim();
      
      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      
      // Only set if not already set (environment variables take precedence)
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch (error: any) {
    if (error.code !== 'ENOENT') {
      console.warn(`Warning: Could not load .env.local: ${error.message}`);
    }
  }
}

