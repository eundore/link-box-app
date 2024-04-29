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
  createdAt?: Date;
  updatedAt?: Date;
}
