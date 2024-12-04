export type Single = {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber: string;
  gender: 'MALE' | 'FEMALE';
  dateOfBirth: string;
  image?: Uint8Array;
  tags: string[];
};

export type CreateSingleDto = {
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber: string;
  gender: 'MALE' | 'FEMALE';
  dateOfBirth: string;
  image?: Uint8Array;
  tags?: string[];
}; 