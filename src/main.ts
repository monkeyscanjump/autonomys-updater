import fs from 'fs';
import path from 'path';
import { config } from './config';
import { SubspaceConfig, FileInfo, InstalledFile } from './types';
import { getLatestTag } from './utils/github.utils';
import { downloadFile, moveFile, cleanupTempDir } from './utils/file.utils';
import { logger } from './utils/logger.utils';

async function getConfig(): Promise<SubspaceConfig> {
  const defaultConfig: SubspaceConfig = {
    lastTag: '',
    lastUpdate: new Date().toISOString(),
    installedFiles: []
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

function generateFileInfo(tag: string): FileInfo[] {
  return config.files.map(file => ({
    name: file.targetName,
    originalName: `${file.downloadName}-${tag}`,
    url: `${config.github.baseUrl}/releases/download/${tag}/${file.downloadName}-${tag}`,
    required: file.required
  }));
}

function checkMissingFiles(localConfig: SubspaceConfig): string[] {
  const configuredFiles = new Set(config.files.map(f => f.targetName));
  const installedFiles = new Set(localConfig.installedFiles.map(f => f.targetName));

  return Array.from(configuredFiles).filter(file => !installedFiles.has(file));
}

function verifyInstalledFiles(localConfig: SubspaceConfig): string[] {
  const missingOnDisk = localConfig.installedFiles.filter(file => {
    const finalPath = path.resolve(__dirname, '..', file.targetName);
    return !fs.existsSync(finalPath);
  }).map(file => file.targetName);

  return missingOnDisk;
}

async function updateFiles(tag: string, forceUpdate: string[] = []): Promise<boolean> {
  const files = generateFileInfo(tag);
  const results: { file: string; success: boolean }[] = [];
  const updatedFiles: InstalledFile[] = [];

  for (const file of files) {
    // Skip files that don't need updating
    if (!forceUpdate.includes(file.name)) {
      const existingFile = localConfig.installedFiles.find(f => f.targetName === file.name);
      if (existingFile) {
        updatedFiles.push(existingFile);
        continue;
      }
    }

    try {
      logger.info(`Processing ${file.name}...`);

      const downloadResult = await downloadFile(file);
      if (!downloadResult.success) {
        results.push({ file: file.name, success: false });
        if (file.required) {
          logger.error(`Failed to download required file: ${file.name}`);
          return false;
        }
        continue;
      }

      const moveResult = await moveFile(file);
      if (!moveResult) {
        results.push({ file: file.name, success: false });
        if (file.required) {
          logger.error(`Failed to move required file: ${file.name}`);
          return false;
        }
        continue;
      }

      results.push({ file: file.name, success: true });
      updatedFiles.push({
        targetName: file.name,
        originalName: file.originalName,
        installDate: new Date().toISOString()
      });
      logger.info(`Successfully updated ${file.name}`);
    } catch (error) {
      logger.error(`Error processing ${file.name}:`, error);
      results.push({ file: file.name, success: false });
      if (file.required) {
        return false;
      }
    }
  }

  // Update config with new file information
  localConfig.installedFiles = updatedFiles;
  localConfig.lastUpdate = new Date().toISOString();
  fs.writeFileSync(config.paths.configFile, JSON.stringify(localConfig, null, 2));

  // Log summary of all operations
  logger.info('Update summary:', {
    successful: results.filter(r => r.success).map(r => r.file),
    failed: results.filter(r => !r.success).map(r => r.file),
    skipped: files.filter(f => !forceUpdate.includes(f.name)).map(f => f.name)
  });

  // Return true if all required files were processed successfully
  return results.every(result => {
    const fileConfig = config.files.find(f => f.targetName === result.file);
    return !fileConfig?.required || result.success;
  });
}

let localConfig: SubspaceConfig;

async function main() {
  try {
    if (!fs.existsSync(config.paths.temp)) {
      fs.mkdirSync(config.paths.temp, { recursive: true });
    }

    localConfig = await getConfig();
    const latestTag = await getLatestTag();

    if (!latestTag) {
      logger.warn('Could not fetch latest tag');
      return;
    }

    // Check for missing files in config
    const missingInConfig = checkMissingFiles(localConfig);

    // Check for files missing on disk
    const missingOnDisk = verifyInstalledFiles(localConfig);

    // Combine all files that need to be updated
    const filesToUpdate = new Set([...missingInConfig, ...missingOnDisk]);

    // If there's a new tag, update all files
    if (latestTag !== localConfig.lastTag) {
      logger.info(`New version ${latestTag} detected. Updating all files...`);
      config.files.forEach(file => filesToUpdate.add(file.targetName));
    }

    if (filesToUpdate.size === 0) {
      logger.info('All files are up to date');
      return;
    }

    logger.info(`Files to update: ${Array.from(filesToUpdate).join(', ')}`);
    const updateSuccess = await updateFiles(latestTag, Array.from(filesToUpdate));

    if (updateSuccess) {
      localConfig.lastTag = latestTag;
      fs.writeFileSync(config.paths.configFile, JSON.stringify(localConfig, null, 2));
      logger.info('Update completed successfully');
    } else {
      logger.error('Update failed for one or more required files');
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