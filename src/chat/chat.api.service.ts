import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';

interface APIResponse {
  answer: string;
  medicine_info: undefined | string | { error: string };
  question: string;
  score: number;
}

const API_URL = process.env.CHATBOT_ADDRESS;
@Injectable()
export class ChatAPIService {
  constructor() {}

  async request(content: string): Promise<APIResponse> {
    const url = `${API_URL}/inquiry_answer?corpus=${content}`;

    return axios
      .get(url)
      .then((response) => response.data.body)
      .catch((error) => {
        throw new BadRequestException(
          `API 요청 실패: ${error.response?.status} ${error.response?.statusText}`,
        );
      });
  }

  async question(content: string) {
    const response = await this.request(content);
    if (response.medicine_info) {
      return response.medicine_info;
    }
    return response.answer;
  }
}
