import {apiRequest} from "@src/redux/api/ApiRequest";

/** A picture kept online, by its hash (`GET /api/pictures/<hash>`). */
export async function downloadPicture(hash: string): Promise<Blob> {
  const response = await apiRequest(`/api/pictures/${hash}`);

  if (!response.ok) {
    throw new Error(`The API answered ${response.status} to a picture.`);
  }

  return await response.blob();
}
