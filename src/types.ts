export interface SubspaceConfig {
    lastTag: string;
    lastUpdate: string;
  }
  
  export interface FileInfo {
    name: string;
    originalName: string;
    url: string;
  }
  
  export interface DownloadResult {
    success: boolean;
    error?: Error;
  }