'use server';

import { incrementVote, createVotesTable } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function vote(option: string) {
  try {
    await incrementVote(option);
    revalidatePath('/');
  } catch (error) {
    console.error('Vote failed:', error);
    throw new Error('投票に失敗しました。データベース接続を確認してください。');
  }
}

// 初期化用のアクション（本番ではデプロイ時に行うか、初回アクセス時に実行）
export async function initialize() {
  try {
    await createVotesTable();
    revalidatePath('/');
  } catch (error) {
    console.error('Initialization failed:', error);
    throw new Error('データベースの初期化に失敗しました。');
  }
}
