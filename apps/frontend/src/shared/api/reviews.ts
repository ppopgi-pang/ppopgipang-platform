import type { ReviewResult, ReviewInput } from "@ppopgipang/types";
import { apiClient } from "../lib/axios";

export const getMyReviews = async (
    dto: ReviewInput.GetMyReviewsDto
): Promise<ReviewResult.GetMyReviewsResultDto> => {
    const { data } = await apiClient.get<ReviewResult.GetMyReviewsResultDto>("/reviews/my", {
        params: dto,
    });
    return data;
};
