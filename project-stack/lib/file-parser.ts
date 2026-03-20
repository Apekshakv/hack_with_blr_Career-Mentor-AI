/**
 * Client-side file validation only
 * Server-side parsing happens in app/actions.ts via parseResumeFile action
 */

export function validateResumeFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const supportedFormats = ['txt', 'pdf', 'docx', 'doc'];
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (!extension || !supportedFormats.includes(extension)) {
    return {
      valid: false,
      error: `Unsupported file format. Supported: TXT, PDF, DOCX, DOC`
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum size is 5MB.`
    };
  }

  return { valid: true };
}

/**
 * Convert File to base64 for transmission to server
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]); // Remove data:application/... prefix
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}
