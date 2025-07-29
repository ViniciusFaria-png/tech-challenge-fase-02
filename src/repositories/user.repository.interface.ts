import { IUser } from "@/entities/models/user.interface";

export interface IUserRepository {
  findByEmail(email: string): Promise<IUser | undefined>;
}