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

export interface DeviceResponse {
  data: Device[];
  totalData: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
