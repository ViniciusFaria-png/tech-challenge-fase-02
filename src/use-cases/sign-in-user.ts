    import { IUser } from "@/entities/models/user.interface";
import { IUserRepository } from "@/repositories/user.repository.interface";

    export class SigninUseCase {
      constructor(private userRepository: IUserRepository) {}

      async execute(email: string, senha: string): Promise<IUser> {
        const user = await this.userRepository.findByEmail(email);

        if (!user || user.senha !== senha) {
          throw new Error("Invalid email or password");
        }

        return user;
      }
    }   