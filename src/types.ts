export interface InstalledFile {
  targetName: string;
  originalName: string;
  installDate: string;
}

export interface SubspaceConfig {
  lastTag: string;
  lastUpdate: string;
  installedFiles: InstalledFile[];
}

export interface FileInfo {
  name: string;
  originalName: string;
  url: string;
  required: boolean;
}

export interface DownloadResult {
  success: boolean;
  error?: Error;
}