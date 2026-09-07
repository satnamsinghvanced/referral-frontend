export interface SpecialtyItem {
  _id: string;
  title: string;
  description?: string;
  status: "active" | "inactive";
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSpecialtyPayload {
  title: string;
  description?: string;
  status?: "active" | "inactive";
}

export interface UpdateSpecialtyPayload {
  title?: string;
  description?: string;
  status?: "active" | "inactive";
}

export interface SpecialtyFormErrors {
  title?: string;
  description?: string;
  status?: string;
  general?: string;
}
