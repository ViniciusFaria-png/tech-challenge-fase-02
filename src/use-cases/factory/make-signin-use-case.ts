import { UserRepository } from "@/repositories/pg/user.repository";
import { SigninUseCase } from "../sign-in-user";

export function makeSigninUseCase() {
  const userRepository = new UserRepository();
  const useCase = new SigninUseCase(userRepository);

  return useCase;
}