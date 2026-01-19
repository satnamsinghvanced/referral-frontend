export interface DeviceLocation {
  city?: string;
  region?: string;
  country?: string;
}

export interface Device {
  _id: string;
  userId: string;
  sessionId: string;
  deviceName?: string;
  browser?: string;
  browserVersion?: string;
  os?: string;
  ip?: string;
  location?: DeviceLocation;
  isActive: boolean;
  lastSeen: string;
  createdAt: string;
  updatedAt: string;
}
