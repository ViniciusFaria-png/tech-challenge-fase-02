import { ProfessorRepository } from "@/repositories/pg/professor.repository";
import { DeleteProfessorUseCase } from "../delete-professor";

export function makeDeleteProfessorUseCase() {
  const professorRepository = new ProfessorRepository();
  const deleteProfessorUseCase = new DeleteProfessorUseCase(
    professorRepository
  );

  return deleteProfessorUseCase;
}
