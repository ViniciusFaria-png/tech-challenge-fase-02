import { IUser } from "@/entities/models/user.interface";
import { db } from "@/lib/db";
import { IUserRepository } from "@/repositories/user.repository.interface";

export class UserRepository implements IUserRepository {
    async create(
        data: Omit<IUser, "id">
    ): Promise<IUser | undefined> {
        const result = await db.clientInstance?.query<IUser>(
        `INSERT INTO user (email, senha, created_at, updated_at)
        VALUES ($1, $2, NOW(), NOW())
        RETURNING id, email, created_at, updated_at`,
        [data.email, data.senha]
        );
        return result?.rows[0];
    }

    async findById(id: string): Promise<IUser| undefined> {
        const result = await db.clientInstance?.query<IUser>(
        `SELECT id, email, senha,created_at, updated_at FROM user WHERE id = $1`,
        [id]
        );
        return result?.rows[0];
    }   

    async delete(id: string): Promise<void> {
        await db.clientInstance?.query(`DELETE FROM user WHERE id = $1`, [id]);
    }

}
