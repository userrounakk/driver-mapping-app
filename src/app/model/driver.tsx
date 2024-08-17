export interface DriverResponse {
  status: string;
  drivers: Driver[];
  totalPages: number;
}

export interface Driver {
  _id: string;
  driverId: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  preferredLocation: any;
  __v: number;
}
