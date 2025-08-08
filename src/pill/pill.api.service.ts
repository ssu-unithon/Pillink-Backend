import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import axios from 'axios';

const API_URL =
  'http://apis.data.go.kr/1471000/DrbEasyDrugInfoService/getDrbEasyDrugList';

const numOfRows = 10;

interface APIOptions {
  entpName?: string;
  itemName?: string;
  itemSeq?: string;
  efcyQesitm?: string;
  useMethodQesitm?: string;
  atpnWarnQesitm?: string;
  atpnQesitm?: string;
  intrcQesitm?: string;
  seQesitm?: string;
  depositMethodQesitm?: string;
  openDe?: string;
  updateDe?: string;
}

export interface PillInfo {
  entpName: string;
  itemName: string;
  itemSeq: string;
  efcyQesitm: string;
  useMethodQesitm: string;
  atpnWarnQesitm: string | null;
  atpnQesitm: string;
  intrcQesitm: string;
  seQesitm: string;
  depositMethodQesitm: string;
  openDe: string; // ISO date string
  updateDe: string; // ISO date string
  itemImage: string | null;
  bizrno: string;
}

export interface APIResponse {
  pageNo: number;
  totalCount: number;
  numOfRows: number;
  items: PillInfo[];
}

@Injectable()
export class PillAPIService {
  /**pageNo: number,
    totalCount: number,
    numOfRows: number,
    items: item[] */
  request(pageNo: number, options: APIOptions): Promise<APIResponse> {
    const params = new URLSearchParams();
    params.append('ServiceKey', process.env.PILL_API_KEY as string);
    params.append('numOfRows', numOfRows.toString());
    params.append('pageNo', (pageNo ?? 1).toString());
    params.append('type', 'json');
    for (const [key, value] of Object.entries(options)) {
      // undefined 또는 빈 문자열 제외 (빈문자열도 서버에 따라 다름, 필요시 조절)
      if (value !== undefined && value !== '') {
        params.append(key, value);
      }
    }
    const url = `${API_URL}?${params.toString()}`;

    return axios
      .get(url)
      .then((response) => response.data.body as APIResponse)
      .catch((error) => {
        throw new BadRequestException(
          `API 요청 실패: ${error.response?.status} ${error.response?.statusText}`,
        );
      });
  }

  findByItemName(pageNo: number, itemName: string) {
    return this.request(pageNo, { itemName });
  }

  /** 품목기준코드(id)로 검색 */
  findByItemSeq(pageNo: number, itemSeq: number) {
    return this.request(pageNo, { itemSeq: itemSeq.toString() });
  }

  async findOne(itemSeq: number): Promise<PillInfo> {
    const response = await this.findByItemSeq(1, itemSeq);
    if (response.totalCount < 1)
      throw new NotFoundException(
        `품목기준코드가 '${itemSeq}'인 아이템은 존재하지 않습니다`,
      );
    return response.items[0];
  }
}
