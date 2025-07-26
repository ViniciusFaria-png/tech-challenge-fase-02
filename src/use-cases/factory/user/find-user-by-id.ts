import { IUser } from "@/entities/models/user.interface";
import { IUserRepository } from "@/repositories/user.repository.interface";
import { ResourceNotFoundError } from "../../errors/resource-not-found-error";

interface FindUserByIdUseCaseRequest {
  userId: string;
}

interface FindUserByIdUseCaseResponse {
  user: IUser;
}

export class FindUserByIdUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute({
    userId,
  }: FindUserByIdUseCaseRequest): Promise<FindUserByIdUseCaseResponse> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new ResourceNotFoundError();
    }

    return {
      user,
    };
  }
}
