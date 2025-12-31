export type EmailProvider = "SendGrid" | "Mailchimp" | "Custom";
export type EncryptionType = "TLS" | "SSL" | "None";
export type IntegrationStatus = "Connected" | "Disconnected";
export type TestStatus = "success" | "failure";

export interface EmailIntegrationBody {
  provider: string;
  host: string;
  port: number;
  username: string;
  password?: string;
  encryption: EncryptionType;
  status?: IntegrationStatus;
}

export interface UpdateEmailIntegrationRequest {
  provider?: string;
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  encryption?: EncryptionType;
  status?: IntegrationStatus;
}

export interface EmailIntegrationResponse extends EmailIntegrationBody {
  _id: string;
  userId: string;
  status: IntegrationStatus;
  testStatus: TestStatus;
  lastTestedAt: string;
  createdAt: string;
  updatedAt: string;
}
