export interface Device {
  _id: string;
  userId: string;
  sessionId: string;
  deviceName: string;
  browser: string;
  browserVersion: string;
  os: string;
  ip: string;
  deviceType: string;
  isActive: boolean;
  lastSeen: string;
  createdAt: string;
  updatedAt: string;
  isCurrentDevice: boolean;
}
