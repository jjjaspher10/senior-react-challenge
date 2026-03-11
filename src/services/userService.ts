import { UsersResponse } from "@/app/types/user";

const DUMMY_JASON_SERVER = "https://dummyjson.com";


export const getUsers = async (page: number, limit: number): Promise<UsersResponse> => {
  const skip = (page - 1) * limit;
  const response = await fetch(`${DUMMY_JASON_SERVER}/users?limit=${limit}&skip=${skip}`);
  const jsonResponse = await response.json();
  return jsonResponse;
};

export const searchUser = async (page: number, limit: number, query: string): Promise<UsersResponse> => {
  const skip = (page - 1) * limit;
  const response = await fetch(`${DUMMY_JASON_SERVER}/users/search?q=${query}&limit=${limit}&skip=${skip}`);
  const jsonResponse = await response.json();
  return jsonResponse;
}