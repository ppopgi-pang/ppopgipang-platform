import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthResult } from "@ppopgipang/types";
import { User } from "src/users/entities/user.entity";
import { Repository } from "typeorm";
import { JwtSignOptions } from '@nestjs/jwt';
import { AuthInput } from "@ppopgipang/types";
import bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
    private JWT_REFRESH_SECRET: string;
    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {
        this.JWT_REFRESH_SECRET = configService.getOrThrow<string>('JWT_REFRESH_SECRET');
    }

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

            const refreshToken = this.issueToken('refresh', savedUser);

            await this.userRepository.update(savedUser.id, { refreshToken });

            return new AuthResult.LoginDto(
                this.issueToken('access', savedUser),
                refreshToken,
                newUser
            );
        }

        const refreshToken = this.issueToken('refresh', existingUser);

        await this.userRepository.update(existingUser.id, { refreshToken });

        return new AuthResult.LoginDto(
            this.issueToken('access', existingUser),
            refreshToken,
            user
        );
    }

    async findUser(id: number) {
        return await this.userRepository.findOneBy({ id });
    }

    async createAdminUser(userId: number, adminUserDto: AuthInput.CreateAdminUserDto): Promise<void> {
        const user = await this.userRepository.findOneBy({ 'id': userId });

        if (!user) {
            throw new InternalServerErrorException('존재하지 않는 사용자입니다.');
        }

        if (!user.isAdmin) {
            throw new InternalServerErrorException('관리자 권한이 없습니다.');
        }

        const existingUser = await this.userRepository.findOneBy({ 'email': adminUserDto.email });

        if (existingUser) {
            throw new InternalServerErrorException('이미 존재하는 이메일입니다.');
        }

        const hashedPassword = await bcrypt.hash(adminUserDto.password, 10);

        const newUser = this.userRepository.create({
            email: adminUserDto.email,
            nickname: adminUserDto.nickname,
            adminPassword: hashedPassword,
            isAdmin: true
        });

        await this.userRepository.save(newUser);
    }

    async adminLogin(adminLoginDto: AuthInput.AdminLoginDto): Promise<AuthResult.LoginDto> {
        const user = await this.userRepository.findOneBy({ 'email': adminLoginDto.email });

        if (!user) {
            throw new InternalServerErrorException('존재하지 않는 사용자입니다.');
        }

        if (!user.isAdmin) {
            throw new InternalServerErrorException('관리자 권한이 없습니다.');
        }

        const isPasswordMatched = bcrypt.compare(adminLoginDto.password, user.adminPassword);

        if (!isPasswordMatched) {
            throw new InternalServerErrorException('비밀번호가 일치하지 않습니다.');
        }

        const refreshToken = this.issueToken('refresh', user);

        await this.userRepository.update(user.id, { refreshToken });

        return new AuthResult.LoginDto(
            this.issueToken('access', user),
            refreshToken,
            user
        );
    }

    issueToken(option: string, user: any) {
        const optionLowerCase = option.toLocaleLowerCase();

        let signature: JwtSignOptions;
        if (optionLowerCase === 'access') {
            signature = {
                expiresIn: '5m'
            }
        } else if (optionLowerCase === 'refresh') {
            signature = {
                secret: this.JWT_REFRESH_SECRET,
                expiresIn: '7d'
            }
        } else {
            throw new InternalServerErrorException('처리할 수 없는 값을 설정했습니다.')
        }

        const payload = {
            sub: user.id,
            isAdmin: user.isAdmin,
        }
        const jwt = this.jwtService.sign(payload, signature);

        return jwt;
    }


}