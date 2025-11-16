import { ProfessorRepository } from "@/repositories/pg/professor.repository";
import { UpdateProfessorUseCase } from "../update-professor";

export function makeUpdateProfessorUseCase() {
  const professorRepository = new ProfessorRepository();
  const updateProfessorUseCase = new UpdateProfessorUseCase(
    professorRepository
  );

  return updateProfessorUseCase;
}
