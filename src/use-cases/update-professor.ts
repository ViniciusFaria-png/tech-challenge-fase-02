import { Professor } from "@/entities/professor.entity";
import { IProfessorRepository } from "@/repositories/professor.repository.interface";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface UpdateProfessorUseCaseRequest {
  professorId: number;
  nome?: string;
  materia?: string;
  user_id?: number;
}

interface UpdateProfessorUseCaseResponse {
  professor: Professor;
}

export class UpdateProfessorUseCase {
  constructor(private professorRepository: IProfessorRepository) {}

  async execute({
    professorId,
    ...data
  }: UpdateProfessorUseCaseRequest): Promise<UpdateProfessorUseCaseResponse> {
    const professor = await this.professorRepository.update(professorId, data);

    if (!professor) {
      throw new ResourceNotFoundError();
    }

    return {
      professor,
    };
  }
}
