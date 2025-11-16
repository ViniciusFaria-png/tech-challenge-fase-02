import { Professor } from "../entities/professor.entity";

export interface IProfessorRepository {
  create(professor: Professor): Promise<Professor>;
  getName(id: number): Promise<string>;
  getProfessorId(userId: number): Promise<number>;
  findByUserId(userId: number): Promise<Professor | null>;
  findById(id: number): Promise<Professor | null>;
  findAll(): Promise<Professor[]>;
  update(id: number, data: Partial<Omit<Professor, "id">>): Promise<Professor | null>;
  delete(id: number): Promise<void>;
}
