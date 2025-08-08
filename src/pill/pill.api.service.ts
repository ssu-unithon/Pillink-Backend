import { BadRequestException, Injectable } from '@nestjs/common';
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

@Injectable()
export class PillAPIService {
  request(pageNo: number, options: APIOptions) {
    const params = new URLSearchParams();
    params.append('ServiceKey', process.env.PILL_API_KEY as string);
    params.append('numOfRows', numOfRows.toString());
    params.append('pageNo', pageNo.toString());
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
      .then((response) => response.data)
      .catch((error) => {
        throw new BadRequestException(
          `API 요청 실패: ${error.response?.status} ${error.response?.statusText}`,
        );
      });
  }

  findByItemName(pageNo: number, itemName: string) {
    return this.request(pageNo, {
      itemName,
    });
  }
}
