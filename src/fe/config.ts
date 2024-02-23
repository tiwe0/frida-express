import axios from "axios"

interface responseData {
    status: string,
    data?: any,
    reason?: string
}

export class Config {
  public static async fetch(
    url: string,
    data: object = {}
  ): Promise<responseData> {
    let response = await axios.post(url, data);
    let response_data: responseData = response.data;
    return response_data;
  }
}
