import { IUser } from "@/entities/models/user.interface";
import { db } from "@/lib/db";
import { IUserRepository } from "../user.repository.interface";

export class UserRepository implements IUserRepository {
    async findByEmail(email: string): Promise<IUser | undefined> {
        const result = await db.clientInstance?.query<IUser>(
        `SELECT id, email, senha FROM users WHERE email = $1`,
        [email]
        );
        return result?.rows[0];
    }
    
}