import { IUserRepository } from "@/repositories/user.repository.interface";
import { ResourceNotFoundError } from "../../errors/resource-not-found-error";

interface DeleteUserUseCaseRequest {
  userId: string;
}

type DeleteUserUseCaseResponse = void;

export class DeleteUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute({
    userId,
  }: DeleteUserUseCaseRequest): Promise<DeleteUserUseCaseResponse> {
    const userExist = await this.userRepository.findById(userId);

    if (!userExist) {
      throw new ResourceNotFoundError();
    }

    await this.userRepository.delete(userId);
  }
}
