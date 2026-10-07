import {apiRequest} from "@src/redux/api/ApiRequest";

/** Sends a picture's bytes to be kept online under its hash (`PUT /api/pictures/<hash>`). Sending one already kept changes nothing. */
export async function uploadPicture(hash: string, picture: Blob): Promise<void> {
  const response = await apiRequest(`/api/pictures/${hash}`, {
    method: "PUT",
    headers: {"Content-Type": picture.type},
    body: picture,
  });

  if (!response.ok) {
    throw new Error(`The API answered ${response.status} to a picture.`);
  }
}
