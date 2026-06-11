import {
  EmailIntegrationBody,
  EmailIntegrationResponse,
} from "../../types/integrations/emailMarketing";
import axios from "../axios";

const EMAIL_BASE = "/email-integration";

export const createEmailIntegration = async (
  data: EmailIntegrationBody
): Promise<EmailIntegrationResponse> => {
  const response = await axios.post<EmailIntegrationResponse>(EMAIL_BASE, data);
  return response.data;
};

export const fetchEmailIntegration =
  async (): Promise<EmailIntegrationResponse> => {
    const response = await axios.get<EmailIntegrationResponse>(EMAIL_BASE);
    return response.data;
  };

export const fetchEmailIntegrationById = async (
  id: string
): Promise<EmailIntegrationResponse> => {
  const response = await axios.get<EmailIntegrationResponse>(
    `${EMAIL_BASE}/${id}`
  );
  return response.data;
};

export const updateEmailIntegration = async (
  id: string,
  data: EmailIntegrationBody
): Promise<EmailIntegrationResponse> => {
  const response = await axios.put<EmailIntegrationResponse>(
    `${EMAIL_BASE}/${id}`,
    data
  );
  return response.data;
};

export const getEmailAuthUrl = async () => {
  const { data } = await axios.post<{ data: { authUrl: string } }>(
    `${EMAIL_BASE}/auth-url`
  );
  return data;
};

export const getSendGridAuthUrl = async () => {
  const { data } = await axios.post<{ data: { authUrl: string } }>(
    `${EMAIL_BASE}/sendgrid/auth-url`
  );
  return data;
};

