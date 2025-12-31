export interface Permission {
  _id: string;
  title: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  _id: string;
  title: string;
  role: string;
  description: string;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
}

export interface Specialty {
  _id: string;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityType {
  _id: string;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Location {
  _id?: string;
  userId?: string;
  name: string;
  address: {
    coordinates?: {
      lat: number;
      long: number;
    };
    street: string;
    city: string;
    state: string;
    zipcode: string;
  };
  phone: string;
  isPrimary: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LocationsResponse<T> {
  data: T[];
  totalData: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
