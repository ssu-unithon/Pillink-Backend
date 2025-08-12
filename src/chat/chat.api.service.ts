import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';

export interface ChatAPIResponse {
  result: string;
  medicine_info: undefined | string;
  question: string;
  score: number;
}

export interface RiskAPIResponse {
  count: number;
  collisionCount: number;
  collisions: string[];
  duplicateCount: number;
  duplicates: string[];
  errors: [];
  pairCount: number;
  riskRate: number;
  warnings: { ingredient: string; reason: string; type: string }[];
}

const API_URL = process.env.CHATBOT_ADDRESS;

@Injectable()
export class ChatAPIService {
  constructor() {}

  async requestChat(content: string): Promise<ChatAPIResponse> {
    const url = `${API_URL}/inquiry_answer?corpus=${content}`;

    return axios
      .get(url)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.warn('err', error._currentUrl, error);
        throw new BadRequestException(
          `API 요청 실패: ${error.response?.status} ${error.response?.statusText}`,
        );
      });
  }

  async requestRisk(pill_names: string[]): Promise<RiskAPIResponse> {
    const url = `${API_URL}/ingredient_risk`;
    return axios
      .post(url, {
        ingredients: pill_names,
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.warn('err2', error._currentUrl);
        throw new BadRequestException(
          `API 요청 실패: ${error.response?.status} ${error.response?.statusText} ${error.response?.data.error}`,
        );
      });
  }

  async question(content: string) {
    const response = await this.requestChat(content);
    console.log(response);
    if (response.medicine_info) {
      return response.medicine_info;
    }
    return response.result;
  }
}
