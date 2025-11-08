import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthResult } from "@ppopgipang/types";
import { User } from "src/users/entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async validateOauthLogin(user: any) {
        const kakaoId = user.kakaoId;
        const existingUser = await this.userRepository.findOneBy({ 'kakaoId': kakaoId });

        if (!existingUser) {
            const newUser = this.userRepository.create({
                kakaoId,
                email: user.email,
                nickname: user.nickname,
                profileImage: user.profileImage
            });

            const savedUser = await this.userRepository.save(newUser);

            return new AuthResult.LoginDto(
                this.jwtService.sign({ sub: savedUser.id, email: savedUser.email }),
                '',
                newUser
            );
        }
        
        return new AuthResult.LoginDto(
                this.jwtService.sign({ sub: existingUser.id, email: existingUser.email }),
                '',
                user
            );
    }

}