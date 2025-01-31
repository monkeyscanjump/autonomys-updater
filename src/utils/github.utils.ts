import axios from 'axios';
import { config } from '../config';
import { logger } from './logger.utils';

export async function getLatestTag(): Promise<string | null> {
  try {
    const response = await axios.get(`${config.github.baseUrl}/releases/latest`, {
      maxRedirects: 0,
      validateStatus: null,
      timeout: 10000
    });

    const tag = extractTagFromLocation(response.headers.location);
    return isValidTag(tag) ? tag : null;
  } catch (error) {
    logger.error('Error fetching latest tag:', error);
    return null;
  }
}

function extractTagFromLocation(location: string | undefined): string | null {
  if (!location) return null;
  return location.split('/').pop() || null;
}

function isValidTag(tag: string | null): boolean {
  if (!tag) return false;
  return tag.startsWith(config.github.tagPrefix);
}