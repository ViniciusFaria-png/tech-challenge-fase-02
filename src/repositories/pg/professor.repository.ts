import { Professor } from "@/entities/professor.entity";
import { db } from "@/lib/db";
import { IProfessorRepository } from "../professor.repository.interface";

export class ProfessorRepository implements IProfessorRepository {
  async create({ nome, materia, user_id }: Professor): Promise<Professor> {
    const result = await db.clientInstance?.query(
      `
      INSERT INTO "professor" (nome, materia, user_id) VALUES ($1, $2, $3) RETURNING *
      `,
      [nome, materia, user_id]
    );

    return result?.rows[0];
  }

  async getName(id: number): Promise<string> {
    const result = await db.clientInstance?.query(
      `
      SELECT nome FROM professor WHERE professor.user_id = $1
      `,
      [id]
    );

    const nome = result?.rows[0].nome;

    return nome;
  }

  async getProfessorId(userId: number): Promise<number> {
    const result = await db.clientInstance?.query(
      `
      SELECT id FROM professor WHERE professor.user_id = $1
      `,
      [userId]
    );

    return result?.rows[0]?.id;
  }

  async findByUserId(userId: number): Promise<Professor | null> {
    const result = await db.clientInstance?.query(
      `
      SELECT * FROM professor WHERE professor.user_id = $1
      `,
      [userId]
    );

    return result?.rows[0] || null;
  }

  async findById(id: number): Promise<Professor | null> {
    const result = await db.clientInstance?.query(
      `
      SELECT * FROM professor WHERE professor.id = $1
      `,
      [id]
    );

    return result?.rows[0] || null;
  }

  async findAll(): Promise<Professor[]> {
    const result = await db.clientInstance?.query(
      `
      SELECT * FROM professor ORDER BY id ASC
      `
    );

    return result?.rows || [];
  }

  async update(id: number, data: Partial<Omit<Professor, "id">>): Promise<Professor | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.nome !== undefined) {
      fields.push(`nome = $${paramCount++}`);
      values.push(data.nome);
    }
    if (data.materia !== undefined) {
      fields.push(`materia = $${paramCount++}`);
      values.push(data.materia);
    }
    if (data.user_id !== undefined) {
      fields.push(`user_id = $${paramCount++}`);
      values.push(data.user_id);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const query = `
      UPDATE professor 
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
      DELETE FROM professor WHERE id = $1
      `,
      [id]
    );
  }
}
