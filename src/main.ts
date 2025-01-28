import fs from 'fs';
import path from 'path';
import { config } from './config';
import { SubspaceConfig, FileInfo } from './types';
import { getLatestTag } from './utils/github.utils';
import { downloadFile, moveFile, cleanupTempDir } from './utils/file.utils';
import { logger } from './utils/logger.utils';

async function getConfig(): Promise<SubspaceConfig> {
  const defaultConfig: SubspaceConfig = {
    lastTag: '',
    lastUpdate: new Date().toISOString()
  };

  try {
    if (fs.existsSync(config.paths.configFile)) {
      return JSON.parse(fs.readFileSync(config.paths.configFile, 'utf8'));
    }
    return defaultConfig;
  } catch (error) {
    logger.error('Error reading config file:', error);
    return defaultConfig;
  }
}

async function updateFiles(tag: string): Promise<boolean> {
  const files: FileInfo[] = [
    {
      name: config.files.farmer,
      originalName: `${config.files.farmer}-ubuntu-x86_64-v2-${tag}`,
      url: `${config.github.baseUrl}/releases/download/${tag}/${config.files.farmer}-ubuntu-x86_64-v2-${tag}`
    },
    {
      name: config.files.node,
      originalName: `${config.files.node}-ubuntu-x86_64-v2-${tag}`,
      url: `${config.github.baseUrl}/releases/download/${tag}/${config.files.node}-ubuntu-x86_64-v2-${tag}`
    }
  ];

  for (const file of files) {
    const downloadResult = await downloadFile(file);
    if (!downloadResult.success) {
      return false;
    }

    const moveResult = await moveFile(file);
    if (!moveResult) {
      return false;
    }
  }

  return true;
}

async function main() {
  try {
    if (!fs.existsSync(config.paths.temp)) {
      fs.mkdirSync(config.paths.temp, { recursive: true });
    }

    const localConfig = await getConfig();
    const latestTag = await getLatestTag();

    if (!latestTag) {
      logger.warn('Could not fetch latest tag');
      return;
    }

    if (latestTag === localConfig.lastTag) {
      logger.info(`Already on latest version (${latestTag})`);
      return;
    }

    logger.info(`Updating to version ${latestTag}`);
    const updateSuccess = await updateFiles(latestTag);

    if (updateSuccess) {
      localConfig.lastTag = latestTag;
      localConfig.lastUpdate = new Date().toISOString();
      fs.writeFileSync(config.paths.configFile, JSON.stringify(localConfig, null, 2));
      logger.info(`Update completed successfully (${latestTag})`);
    }

    cleanupTempDir();
  } catch (error) {
    logger.error('Fatal error during update:', error);
    throw error;
  }
}

if (require.main === module) {
  main().catch(error => {
    logger.error('Application crashed:', error);
    process.exit(1);
  });
}