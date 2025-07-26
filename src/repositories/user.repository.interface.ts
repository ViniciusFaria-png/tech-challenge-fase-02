import { IUser } from "@/entities/models/user.interface";

export interface IUserRepository {
  create(
    data: Omit<IUser, "id" | "email" | "senha">
  ): Promise<IUser | undefined>;
  
  findById(id: string): Promise<IUser | undefined>;
  
  delete(id: string): Promise<void>;

}
