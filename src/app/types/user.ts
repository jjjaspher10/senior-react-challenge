export interface User {
  id: number;
  firstName: string;
  lastName: string;
  maidenName?: string;
  age: number;
  gender: "male" | "female";
  email: string;
  phone: string;
  username: string;
  image?: string;
  company?: {
    name: string;
    department: string;
    title: string;
  };
  address?: {
    address: string;
    city: string;
    state: string;
    postalCode: string;
  };
};


export interface UsersResponse {
  users: User[]
  total: number
  skip: number
  limit: number
}