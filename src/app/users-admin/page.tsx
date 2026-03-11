"use client"

import { useState } from "react";
import { userUsers } from "../hooks/useUsers";
import UsersTable, { Column } from "@/components/Table/UserTable";
import { User } from "../types/user";
import Pagination from "@/components/Pagination/Pagination";
import useDebounce from "../hooks/useDebounce";

export default function UsersAdminPage() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);

  const { data, isError, refetch, isFetching } = userUsers(page, limit, debouncedSearch);

  const columns: Column<User>[]  = [
    { key: "firstName", label: "First Name", isVisible: true },
    { key: "lastName", label: "Last Name", isVisible: true },
    { key: "email", label: "Email", isVisible: true },
    { key: "phone", label: "Phone", isVisible: true },
    { key: "gender", label: "Gender", isVisible: true },
    { key: "age", label: "Age", isVisible: true },
    {
      key: "company",
      label: "Company",
      cellValue: (_value, row: User) => (
        <span className="font-semibold">
          {row.company?.name} ({row.company?.title})
        </span>
      ),
      isVisible: false,
    },
    {
      key: "address",
      label: "Address",
      cellValue: (_value, row: User) => <em>{row.address?.city}</em>,
      isVisible: false,
    },
  ];

  const onSearch = (query: string) => {
    setPage(1);
    setSearch(query);
  };

  const isEmptyUser = data?.users.length === 0;
  return (
    <>  
      <div className="cmp-user-admin__container p-5 pt-10">
        <h1 className="text-3xl text-gray-700 font-semibold mb-4">Users Admin Dashboard</h1>
        {isError && (
          <div className="flex flex-col items-center justify-center p-6 mt-4 border border-red-300 bg-red-50 rounded-md text-center">
            <svg
              className="w-8 h-8 text-red-500 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>

            <p className="text-red-700 font-medium mb-2">Oops! Something went wrong.</p>
            <p className="text-red-600 text-sm mb-4">Unable to load users. Please try again.</p>

            {/* Retry button */}
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 hover:cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}
        {!isError && (
          <>
            <UsersTable users={data?.users ?? []} columns={columns} onSearch={onSearch} query={search} isFetching={isFetching}/>
            {(!isFetching && !isEmptyUser) && <Pagination
              page={page}
              limit={limit}
              total={data?.total ?? 0}
              onPageChange={setPage}
            />}
          </>
        )}

      </div>
    </>
  )
}