'use server';

import { incrementVote, createVotesTable } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export async function vote(option: string) {
  const cookieStore = await cookies();
  const hasVoted = cookieStore.get('has-voted');

  if (hasVoted) {
    throw new Error('すでに投票済みです。投票は1人1回までです。');
  }

  try {
    await incrementVote(option);
    
    // 投票成功後、Cookie をセット（有効期限1か月など）
    cookieStore.set('has-voted', 'true', {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    revalidatePath('/');
  } catch (error) {
    if (error instanceof Error && error.message.includes('すでに投票済み')) {
      throw error;
    }
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
