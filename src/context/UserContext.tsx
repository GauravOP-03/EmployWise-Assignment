import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

import { User } from "@/types"

// user context type
interface UserContextType {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  setTotalPages: React.Dispatch<React.SetStateAction<number>>;
  deletedUsers: number[];
  setDeletedUsers: React.Dispatch<React.SetStateAction<number[]>>;
  editedUsers: Record<number, User>;
  setEditedUsers: React.Dispatch<React.SetStateAction<Record<number, User>>>;
}

// Create context with default values
const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deletedUsers, setDeletedUsers] = useState<number[]>([]);
  const [editedUsers, setEditedUsers] = useState<Record<number, User>>({});

  // fetching from localstorage when component mount
  useEffect(() => {
    const storedDeletedUsers = JSON.parse(
      localStorage.getItem("deletedUsers") || "[]"
    );
    const storedEditedUsers = JSON.parse(
      localStorage.getItem("editedUsers") || "{}"
    );
    setEditedUsers(storedEditedUsers);
    setDeletedUsers(storedDeletedUsers);
  }, []);

  // setting data in local storage
  useEffect(() => {
    localStorage.setItem("deletedUsers", JSON.stringify(deletedUsers));
  }, [deletedUsers]);

  useEffect(() => {
    localStorage.setItem("editedUsers", JSON.stringify(editedUsers));
  }, [editedUsers]);
  return (
    // creating context provider
    <UserContext.Provider
      value={{
        users,
        setUsers,
        page,
        setPage,
        totalPages,
        setTotalPages,
        deletedUsers,
        setDeletedUsers,
        editedUsers,
        setEditedUsers,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook with type safety and error handling
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
