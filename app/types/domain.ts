import { Timestamp } from "firebase/firestore";

export interface User {
  id?: string;
  uid?: string;
  username?: string;
  email?: string;
  description?: string;
  imageUrl?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Link {
  id?: string;
  caption?: string;
  categoryid?: string;
  createdAt?: Date;
  updateAt?: Date;
  description?: string;
  imageUrl?: string;
  title?: string;
  uid?: string;
  url?: string;
}

export interface Category {
  id?: string;
  color?: string;
  title?: string;
  uid?: string;
  privacy?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Comment {
  id?: string;
  authorId?: string;
  categoryId?: string;
  comment?: string;
  createdAt?: Timestamp;
}

export interface UserComment extends Comment {
  username?: string;
  imageUrl?: string;
}

export interface Follow {
  id?: string;
  follower?: string;
  following?: string;
}

export interface UserFollow extends Follow {
  username?: string;
  imageUrl?: string;
}
