import { UserRepository } from "@/repositories/pg/user.repository";
import { DeleteUserUseCase } from "./delete-user";

export function makeDeleteUserUseCase() {
  const userRepository = new UserRepository();
  const useCase = new DeleteUserUseCase(userRepository);

  return useCase;
}
