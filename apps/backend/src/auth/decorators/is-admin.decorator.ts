import { Reflector } from "@nestjs/core";

export const IsAdmin = Reflector.createDecorator<boolean>();