import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility function to get asset paths that work both locally and on GitHub Pages
export function getAssetPath(path: string) {
  const basePath = "";
  return `${basePath}${path}`;
}

// Azure storage URL
const AZURE_STORAGE_URL = 'https://langal.blob.core.windows.net/public';

/**
 * Convert profile photo URL to proper Azure URL
 * Handles localhost URLs and relative paths
 */
export function getProfilePhotoUrl(photoPath: string | undefined): string | undefined {
  if (!photoPath) return undefined;
  
  // If it's a localhost URL, convert to Azure URL
  if (photoPath.includes('localhost') || photoPath.includes('127.0.0.1')) {
    try {
      const url = new URL(photoPath);
      let path = url.pathname;
      // Remove leading /storage/ if present
      path = path.replace(/^\/storage\//, '');
      // Remove leading slash
      path = path.replace(/^\//, '');
      return `${AZURE_STORAGE_URL}/${path}`;
    } catch {
      // If URL parsing fails, try simple string replacement
      const pathMatch = photoPath.match(/\/storage\/(.+)$/);
      if (pathMatch) {
        return `${AZURE_STORAGE_URL}/${pathMatch[1]}`;
      }
    }
  }
  
  // If already a full Azure/HTTPS URL, return as is
  if (photoPath.startsWith('https://')) {
    return photoPath;
  }
  
  // If it's just a path (e.g., profile_photos/xxx.jpg), prepend Azure URL
  if (!photoPath.startsWith('http')) {
    return `${AZURE_STORAGE_URL}/${photoPath.replace(/^\//, '')}`;
  }
  
  // Return as-is for other cases
  return photoPath;
}
