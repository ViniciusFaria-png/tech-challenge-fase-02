import { ProfessorRepository } from "../../repositories/pg/professor.repository";
import { FindProfessorByIdUseCase } from "../find-professor-by-id";

export function makeFindProfessorByIdUseCase() {
  const professorRepository = new ProfessorRepository();
  const useCase = new FindProfessorByIdUseCase(professorRepository);
  return useCase;
}