import { User } from "./domain";

export interface UserStore {
  user: User;
  setUser: (user: User) => void;
}
