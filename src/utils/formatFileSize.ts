/**
 * Converts a size in bytes to the most appropriate human-readable format (MB or KB).
 *
 * - If the size is 1 MB or greater, it returns the value in MB (Megabytes).
 * - If the size is less than 1 MB, it returns the value in KB (Kilobytes).
 * - The result is formatted to two decimal places.
 *
 * @param bytes - The size in bytes (number).
 * @returns A formatted string (e.g., "1.50 MB", "48.27 KB", or "0.00 KB").
 */
export const formatFileSize = (bytes: number): string => {
  // Define conversion constants
  const KB_CONVERSION_FACTOR = 1024;
  const MB_CONVERSION_FACTOR = KB_CONVERSION_FACTOR * 1024; // 1,048,576

  // Check for invalid or zero input
  if (typeof bytes !== 'number' || isNaN(bytes) || bytes <= 0) {
    return "0.00 KB";
  }

  // Check if the size is 1 MB or greater
  if (bytes >= MB_CONVERSION_FACTOR) {
    // Return in MB format
    const mbs = bytes / MB_CONVERSION_FACTOR;
    return `${mbs.toFixed(2)} MB`;
  } else {
    // If less than 1 MB, return in KB format
    const kbs = bytes / KB_CONVERSION_FACTOR;
    return `${kbs.toFixed(2)} KB`;
  }
};