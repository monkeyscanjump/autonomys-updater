import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { promisify } from 'util';
import { exec } from 'child_process';
import { config } from '../config';
import { FileInfo, DownloadResult } from '../types';
import { logger } from './logger.utils';

const execAsync = promisify(exec);

export async function downloadFile(fileInfo: FileInfo): Promise<DownloadResult> {
  const tempPath = path.join(config.paths.temp, fileInfo.originalName);

  try {
    const response = await axios({
      url: fileInfo.url,
      method: 'GET',
      responseType: 'stream',
      timeout: 30000
    });

    const writer = fs.createWriteStream(tempPath);
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    // Only make the file executable if it's not a Windows .exe file
    if (!fileInfo.originalName.toLowerCase().endsWith('.exe')) {
      try {
        await execAsync(`chmod +x "${tempPath}"`);
      } catch (error) {
        logger.error(`Error making file executable: ${fileInfo.name}`, error);
        // Don't fail the download just because chmod failed
      }
    }
    return { success: true };
  } catch (error) {
    logger.error(`Error downloading file ${fileInfo.name}:`, error);
    return { success: false, error: error as Error };
  }
}

export async function moveFile(fileInfo: FileInfo): Promise<boolean> {
  const tempPath = path.join(config.paths.temp, fileInfo.originalName);
  const finalPath = path.resolve(__dirname, '../..', fileInfo.name);

  try {
    if (fs.existsSync(finalPath)) {
      fs.unlinkSync(finalPath);
    }
    fs.renameSync(tempPath, finalPath);
    return true;
  } catch (error) {
    logger.error(`Error moving file ${fileInfo.name}:`, error);
    return false;
  }
}

export function cleanupTempDir(): void {
  try {
    if (fs.existsSync(config.paths.temp)) {
      const files = fs.readdirSync(config.paths.temp);
      files.forEach(file => {
        fs.unlinkSync(path.join(config.paths.temp, file));
      });
    }
  } catch (error) {
    logger.error('Error cleaning temp directory:', error);
  }
}