import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtOptionalAuthGuard extends AuthGuard('jwt') {
    handleRequest(err: unknown, user: any, info: unknown) {
        if (err || info) {
            return null;
        }

        return user;
    }
}
