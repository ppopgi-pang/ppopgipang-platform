import { SetMetadata } from "@nestjs/common";

export const OPTIONAL_ACCESS_KEY = 'optionalAccess';
export const OptionalAccess = () => SetMetadata(OPTIONAL_ACCESS_KEY, true);
