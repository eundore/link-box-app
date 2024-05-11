import { User, UserChatRoom } from "./domain";

export interface ChatStore {
  chatRoom: UserChatRoom;
  setChatRoom: (chatRoom: UserChatRoom) => void;
}
