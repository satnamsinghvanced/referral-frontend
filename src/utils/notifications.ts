export const urlBase64ToUint8Array = (base64String: string) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

export const getBrowserId = () => {
  const ua = window.navigator.userAgent;
  if (ua.includes("Chrome")) return `chrome_${Date.now()}`;
  if (ua.includes("Firefox")) return `firefox_${Date.now()}`;
  if (ua.includes("Safari")) return `safari_${Date.now()}`;
  if (ua.includes("Edge")) return `edge_${Date.now()}`;
  return `browser_${Date.now()}`;
};
