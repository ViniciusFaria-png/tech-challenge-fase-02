import { ProfessorRepository } from "@/repositories/pg/professor.repository";
import { FindAllProfessorsUseCase } from "../find-all-professors";

export function makeFindAllProfessorsUseCase() {
  const professorRepository = new ProfessorRepository();
  const findAllProfessorsUseCase = new FindAllProfessorsUseCase(
    professorRepository
  );

  return findAllProfessorsUseCase;
}
