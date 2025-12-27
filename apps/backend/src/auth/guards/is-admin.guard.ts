import { Injectable } from "@nestjs/common";
import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { IsAdmin } from "../decorators/is-admin.decorator";

@Injectable()
export class IsAdminGuard implements CanActivate {

    constructor(
        private readonly reflector: Reflector
    ) { }

    canActivate(context: ExecutionContext): boolean {
        const criterionIsAdmin = this.reflector.get<boolean>(IsAdmin, context.getHandler()) ?? this.reflector.get<boolean>(IsAdmin, context.getClass());

        if (criterionIsAdmin === undefined) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            return false;
        }
        
        // 기준값이 true라면, 관리자만 허가, false라면 일반 사용자만 허가
        return criterionIsAdmin === user.isAdmin;
    }
}