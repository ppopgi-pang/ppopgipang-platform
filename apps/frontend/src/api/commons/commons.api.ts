import { apiClient } from "../common/client";

export interface FileUploadResponse {
  url: string;
  filename: string;
}

export const commonsApi = {
  /**
   * 파일 업로드 (최대 10MB)
   */
  uploadFile: async (file: File): Promise<FileUploadResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post<FileUploadResponse>(
      "/api/v1/commons/file-upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  },
};
