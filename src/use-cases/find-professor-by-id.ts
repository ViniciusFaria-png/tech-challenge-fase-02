import { IProfessor } from "@/entities/models/professor.interface";
import { IProfessorRepository } from "../repositories/professor.repository.interface";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface FindProfessorByIdUseCaseRequest {
  id: string;
}

interface FindProfessorByIdUseCaseResponse {
  professor: IProfessor;
}

export class FindProfessorByIdUseCase {
  constructor(private professorRepository: IProfessorRepository) {}

  async execute({
    id,
  }: FindProfessorByIdUseCaseRequest): Promise<FindProfessorByIdUseCaseResponse> {
    const professor = await this.professorRepository.findById(Number(id));

    if (!professor) {
      throw new ResourceNotFoundError();
    }

    return { professor: professor as IProfessor };
  }
}