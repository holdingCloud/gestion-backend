export class UserEntity {
  id: number;
  email: string;
  fullName: string;
  password: string;
  imagen: string;
  rol: string;
  isActive: boolean;
  isLoged: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}