import { Professor } from "@/entities/professor.entity";
import { IProfessorRepository } from "@/repositories/professor.repository.interface";

interface FindAllProfessorsUseCaseResponse {
  professors: Professor[];
}

export class FindAllProfessorsUseCase {
  constructor(private professorRepository: IProfessorRepository) {}

  async execute(): Promise<FindAllProfessorsUseCaseResponse> {
    const professors = await this.professorRepository.findAll();

    return {
      professors,
    };
  }
}
