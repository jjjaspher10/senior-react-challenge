import { useQuery } from "@tanstack/react-query"
import { UsersResponse } from "../types/user"
import { getUsers, searchUser } from "@/services/userService"

export const userUsers = (page: number, limit: number, search: string) => {
  return useQuery<UsersResponse>({
    queryKey: ["users", page, limit, search],
    queryFn: () => search
        ? searchUser(page, limit, search)
        : getUsers(page, limit),
    refetchOnWindowFocus: false,
    staleTime: 1 * 60 * 1000,
    retry: 1
  })
}