import { IUser } from "@/entities/models/user.interface";

import { IUserRepository } from "@/repositories/user.repository.interface";

interface CreateUserUseCaseRequest {
  email: string;
  senha: string;
}

interface CreateUserUseCaseResponse {
  user: IUser;
}

export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute({
    email,
    senha
  }: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
    const user = await this.userRepository.create({
      email,
      senha
    });

    if (!user) {
      throw new Error("Failed to create user.");
    }

    return {
      user
    };
  }
}
