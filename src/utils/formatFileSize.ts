export const formatFileSize = (bytes: number): string => {
  const KB_CONVERSION_FACTOR = 1024;
  const MB_CONVERSION_FACTOR = KB_CONVERSION_FACTOR * 1024;
  if (typeof bytes !== 'number' || isNaN(bytes) || bytes <= 0) {
    return "0.00 KB";
  }
  if (bytes >= MB_CONVERSION_FACTOR) {
    const mbs = bytes / MB_CONVERSION_FACTOR;
    return `${mbs.toFixed(2)} MB`;
  } else {
    const kbs = bytes / KB_CONVERSION_FACTOR;
    return `${kbs.toFixed(2)} KB`;
  }
};