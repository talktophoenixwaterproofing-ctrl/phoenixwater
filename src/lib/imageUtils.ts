/**
 * Translates Google Drive share/view links into direct download/embed links
 * suitable for use in standard <img> src attributes.
 */
export function getGoogleDriveEmbedUrl(url?: string): string {
  if (!url) return '';
  
  const trimmed = url.trim();
  
  // Check if it is a Google Drive URL
  if (trimmed.includes('drive.google.com') || trimmed.includes('docs.google.com') || trimmed.includes('googleusercontent.com')) {
    // Try to extract the 33-character Google Drive file ID
    // Standard formats:
    // - https://drive.google.com/file/d/[FILE_ID]/view?usp=drivesdk
    // - https://drive.google.com/open?id=[FILE_ID]
    // - https://drive.google.com/uc?id=[FILE_ID]
    // - https://drive.usercontent.google.com/download?id=[FILE_ID]
    // - https://lh3.googleusercontent.com/d/[FILE_ID]
    const fileIdRegex = /\/file\/d\/([a-zA-Z0-9_-]+)/;
    const openIdRegex = /[?&]id=([a-zA-Z0-9_-]+)/;
    const dIdRegex = /\/d\/([a-zA-Z0-9_-]+)/;
    
    let match = trimmed.match(fileIdRegex);
    if (!match) match = trimmed.match(openIdRegex);
    if (!match) match = trimmed.match(dIdRegex);
    
    if (match && match[1]) {
      const fileId = match[1];
      // Google User Content CDN is cookie-free and bypasses browser third-party cookie restrictions
      return `https://lh3.googleusercontent.com/d/${fileId}`;
    }
  }
  return trimmed;
}
