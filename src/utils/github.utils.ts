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

    if (response.headers.location) {
      const tag = response.headers.location.split('/').pop();
      if (tag && 
          tag.startsWith(config.github.tagPrefix) && 
          /mainnet-\d{4}-[a-z]+-\d{1,2}/.test(tag)) {
        return tag;
      }
    }
    return null;
  } catch (error) {
    logger.error('Error fetching latest tag:', error);
    return null;
  }
}