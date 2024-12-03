export type Single = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type Tag = {
  id: string;
  name: string;
}; 