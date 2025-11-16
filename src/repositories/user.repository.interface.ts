import { User } from "@/entities/user.entity";

export interface IUserRepository {
  create(user: User): Promise<User>;
  signin(username: string): Promise<User | null>;
  findById(id: number): Promise<User | null>;
  findAll(): Promise<User[]>;
  update(id: number, data: Partial<Omit<User, "id">>): Promise<User | null>;
  delete(id: number): Promise<void>;
}