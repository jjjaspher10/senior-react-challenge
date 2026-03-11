"use client";

import { useState } from "react";
import Modal from "../Modal/Modal";
import { User } from "@/app/types/user";
import FullScreenLoader from "../Loader/FullscreenLoader";

export interface Column<T> {
  key: keyof T;
  label: string;
  cellValue?: (value: T[keyof T], row: T) => React.ReactNode;
  isVisible?: boolean;
}

interface UsersTableProps<T> {
  users: T[];
  columns: Column<T>[];
  onSearch: (query: string) => void;
  query: string;
  isFetching: boolean;
}

export default function UsersTable<T extends object>({ users, columns, onSearch, query, isFetching }: UsersTableProps<T>) {
  const [visibleColumns, setVisibleColumns] = useState(columns.filter(col => col.isVisible !== false).map(col => col.key));
  const [showModal, setShowModal] = useState(false);
  const [tempVisibleColumns, setTempVisibleColumns] = useState(visibleColumns);
  const [genderFilter, setGenderFilter] = useState<"all" | "male" | "female">("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const toggleColumn = (key: keyof T) => {
    setTempVisibleColumns(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const applyColumns = () => {
    console.log('tempVisibleColumns', tempVisibleColumns);
    setVisibleColumns(tempVisibleColumns);
    setShowModal(false);
  };

  const cancelColumns = () => {
    setTempVisibleColumns(visibleColumns);
    setShowModal(false);
  }
  
  const isEmptyUser = users.length === 0;
  const activeColumns = columns.filter(c => visibleColumns.includes(c.key));
  const filteredUsers = genderFilter === "all" ? users : users.filter((user: any) => user.gender === genderFilter);

  

  return (
    <div className="cmp-user-table__container">

      <div className="cmp-user-table__tools flex justify-end">
        {/* Table Search */}
        <div className="cmp-user-table__search mr-2">
          <input
            type="text"
            placeholder="name or email"
            value={query}
            onChange={(e) => {
              onSearch(e.target.value);
            }}
            className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        {/* Gender Filter */}
        <div className="cmp-user-table__filter flex items-center gap-2 mr-2 mb-4 text-sm">
          <button
            onClick={() => setGenderFilter("all")}
            className={`hover:underline  hover:cursor-pointer p-1 ${
              genderFilter === "all" ? "text-black font-medium" : "text-gray-400"
            }`}
          >
            ALL
          </button>

          <span className="text-gray-400">|</span>

          <button
            onClick={() => setGenderFilter("male")}
            className={`hover:underline hover:cursor-pointer p-1 ${
              genderFilter === "male" ? "text-black font-medium" : "text-gray-400"
            }`}
          >
            MALE
          </button>

          <span className="text-gray-400">|</span>

          <button
            onClick={() => setGenderFilter("female")}
            className={`hover:underline hover:cursor-pointer p-1 ${
              genderFilter === "female" ? "text-black font-medium" : "text-gray-400"
            }`}
          >
            FEMALE
          </button>
        </div>
        <div className="cmp-user-table__column-selector">
          {/* Column selector button */}
          <button
            className="mb-4 px-4 py-2 bg-white text-black rounded hover:bg-gray-200 hover:cursor-pointer"
            onClick={() => setShowModal(true)}
            title="Set visible column"
          >
            | | |
          </button>
        </div>
      </div>

      {/* Table */}
      {isFetching ? <FullScreenLoader /> : <>
        <div className="overflow-x-auto rounded shadow-lg">
          {isEmptyUser ? (<div className="py-4 text-center text-gray-500">No users found</div>) :
            (
              <table className="min-w-full border border-gray-200 divide-y divide-gray-200 rounded">
                <thead className="bg-gray-50">
                  <tr>
                    {activeColumns.map(col => (
                      <th
                        key={col.key.toString()}
                        className="px-4 py-2 text-left text-gray-700 font-semibold"
                      >
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user, idx) => (
                    <tr 
                      key={idx} 
                      tabIndex={0}
                      className="hover:bg-gray-50 hover:cursor-pointer focus:border-2 focus:border-gray-400 focus:bg-gray-100"
                      role="button"
                      aria-label={`View details for ${(user as User).firstName} ${(user as User).lastName}`}
                      onClick={() => setSelectedUser(user as User)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          setSelectedUser(user as User);
                        }
                      }}>
                      {activeColumns.map(col => {
                        const value = user[col.key];
                        return (
                          <td key={col.key.toString()} className="px-4 py-2 text-gray-700 truncate">
                            {col.cellValue ? col.cellValue(value, user) : value as React.ReactNode ?? "-"}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          }
        </div>
      </>}

      {/* Column selection modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
            <h2 className="text-lg font-bold mb-4">Select Columns</h2>
            <div className="flex flex-col gap-2 max-h-64 overflow-y-aut ml-1">
              {columns.map(col => (
                <label key={col.key.toString()} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={tempVisibleColumns.includes(col.key)}
                    onChange={() => toggleColumn(col.key)}
                    className="form-checkbox hover:cursor-pointer"
                  />
                  <span>{col.label}</span>
                </label>
              ))}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 hover:cursor-pointer"
                onClick={() => cancelColumns()}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 rounded ${
                  tempVisibleColumns.length === 0
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed opacity-60"
                    : "bg-black text-white hover:bg-gray-700 hover:cursor-pointer"
                }`}
                onClick={applyColumns}
                disabled={tempVisibleColumns.length === 0}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      <Modal
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        title="User Details"
        size="md"
      >
        {selectedUser && (
          <div className="flex flex-col items-center space-y-4 text-sm">
            {selectedUser.image && (
              <img
                src={selectedUser.image}
                alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
                className="w-24 h-24 rounded-full object-cover"
              />
            )}

            {/* User details */}
            <div className="text-left space-y-1">
              <p><strong>Name:</strong> {selectedUser.firstName} {selectedUser.lastName}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Phone:</strong> {selectedUser.phone}</p>
              <p><strong>Gender:</strong> {selectedUser.gender}</p>
              <p><strong>Age:</strong> {selectedUser.age}</p>
              {selectedUser.company && (
                <p><strong>Company:</strong> {selectedUser.company.name} ({selectedUser.company.title})</p>
              )}
              {selectedUser.address && (
                <p><strong>Address:</strong> {selectedUser.address.address}, {selectedUser.address.city}, {selectedUser.address.state}, {selectedUser.address.postalCode}</p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}