import { IProfessorRepository } from "@/repositories/professor.repository.interface";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface DeleteProfessorUseCaseRequest {
  professorId: number;
}

type DeleteProfessorUseCaseResponse = void;

export class DeleteProfessorUseCase {
  constructor(private professorRepository: IProfessorRepository) {}

  async execute({
    professorId,
  }: DeleteProfessorUseCaseRequest): Promise<DeleteProfessorUseCaseResponse> {
    const professorExists = await this.professorRepository.findById(professorId);

    if (!professorExists) {
      throw new ResourceNotFoundError();
    }

    await this.professorRepository.delete(professorId);
  }
}
