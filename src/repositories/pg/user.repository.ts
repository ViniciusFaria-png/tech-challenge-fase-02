import { User } from "@/entities/user.entity";
import { db } from "@/lib/db";
import { IUserRepository } from "../user.repository.interface";

export class UserRepository implements IUserRepository {
  async signin(email: string): Promise<User | null> {
    const result = await db.clientInstance?.query(
      `
      SELECT * FROM "user"
      WHERE "user".email = $1
      `,
      [email]
    );
    return result?.rows[0];
  }

  async create({ email, senha }: User): Promise<User> {
    const result = await db.clientInstance?.query(
      `
      INSERT INTO "user" (email, senha) VALUES($1, $2) RETURNING *
      `,
      [email, senha]
    );

    return result?.rows[0];
  }

  async findById(id: number): Promise<User | null> {
    const result = await db.clientInstance?.query(
      `
      SELECT * FROM "user" WHERE id = $1
      `,
      [id]
    );

    return result?.rows[0] || null;
  }

  async findAll(): Promise<User[]> {
    const result = await db.clientInstance?.query(
      `
      SELECT * FROM "user" ORDER BY id ASC
      `
    );

    return result?.rows || [];
  }

  async update(id: number, data: Partial<Omit<User, "id">>): Promise<User | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.email !== undefined) {
      fields.push(`email = $${paramCount++}`);
      values.push(data.email);
    }
    if (data.senha !== undefined) {
      fields.push(`senha = $${paramCount++}`);
      values.push(data.senha);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const query = `
      UPDATE "user" 
      SET ${fields.join(", ")} 
      WHERE id = $${paramCount} 
      RETURNING *
    `;

    const result = await db.clientInstance?.query(query, values);
    return result?.rows[0] || null;
  }

  async delete(id: number): Promise<void> {
    await db.clientInstance?.query(
      `
      DELETE FROM "user" WHERE id = $1
      `,
      [id]
    );
  }
}
