import axios from 'axios';

// フロントエンドで利用するステージ情報の型定義
export interface Stage {
  id: string;
  stageName: string;
  summary: string;
  videoUrl: string;
  excitement: number;
  tags: string[];
}

// バックエンドAPIからのレスポンスの型定義
interface ApiStageResponse {
  name: string;
  summary: string;
  videoUrl: string;
}

const API_BASE_URL = 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

const sampleTags = ['#AI', '#Live', '#Tech', '#Music', '#Future', '#Demo'];

export const fetchStages = async (): Promise<Stage[]> => {
  try {
    const response = await apiClient.get<ApiStageResponse[]>('/stages');
    
    // APIからのレスポンスをフロントエンドのデータ構造に変換
    const stages: Stage[] = response.data.map((stage, index) => ({
      id: `${stage.name}-${index}`, // APIにidがないため仮のIDを生成
      stageName: stage.name,
      summary: stage.summary,
      videoUrl: stage.videoUrl,
      // APIにないので、フロントでダミーデータを生成
      excitement: Math.floor(Math.random() * 36) + 60, // 60-95のランダムな値
      tags: [...new Set(Array.from({ length: 3 }, () => sampleTags[Math.floor(Math.random() * sampleTags.length)]))], // 3つのユニークなタグをランダムに選択
    }));

    return stages;
  } catch (error) {
    console.error("Error fetching stages:", error);
    // エラーが発生した場合は空の配列を返すか、エラーをスローする
    // ここではエラーを再スローして、呼び出し元で処理できるようにする
    throw error;
  }
};
