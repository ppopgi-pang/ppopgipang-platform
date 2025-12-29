import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { IGNORE_JWT_GUARD_KEY } from "../decorators/ignore-jwt-guard.decorator";
import { OPTIONAL_ACCESS_KEY } from "../decorators/optional-access.decorator";

@Injectable()
export class JwtGlobalAuthGuard extends AuthGuard('jwt') {

    constructor(
        private readonly reflector: Reflector
    ) {
        super();
    }

    canActivate(context: ExecutionContext) {
        const ignoreJwtGuard = this.reflector.getAllAndOverride<boolean>(IGNORE_JWT_GUARD_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        // 전역 JWT 스킵
        if (ignoreJwtGuard) return true;

        // 여기서 request.user 세팅
        return super.canActivate(context);
    }

    handleRequest(err: unknown, user: any, info: unknown, context: ExecutionContext) {
        const optionalAccess = this.reflector.getAllAndOverride<boolean>(OPTIONAL_ACCESS_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (optionalAccess) {
            if (err || info) {
                return null;
            }

            return user;
        }

        if (err || info || !user) {
            throw err || new UnauthorizedException();
        }

        return user;
    }
}
