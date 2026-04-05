import { getVotes, createVotesTable } from '@/lib/db';
import VoteList from '@/components/VoteList';
import { MousePointer2, Database, LayoutDashboard } from 'lucide-react';
import { cookies } from 'next/headers';

export default async function Home() {
  const cookieStore = await cookies();
  const hasVoted = !!cookieStore.get('has-voted');
  
  let initialVotes: any[] = [];
  let isDbReady = false;
  let connectionError = false;

  try {
    // データベースが初期化されていない場合に備えてテーブル作成を試みる
    await createVotesTable();
    initialVotes = await getVotes();
    isDbReady = true;
  } catch (error) {
    console.error('Database connection failed:', error);
    connectionError = true;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 font-sans selection:bg-indigo-500/30">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-from),_transparent_70%)] from-indigo-500/10 dark:from-indigo-400/5 shadow-2xl" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-from),_transparent_70%)] from-fuchsia-500/10 dark:from-fuchsia-400/5 shadow-2xl" />

      <main className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 py-24 sm:py-32">
        <div className="mb-12 flex h-16 w-16 items-center justify-center rounded-3xl bg-white p-4 shadow-xl ring-1 ring-zinc-200 transition-all hover:rotate-12 dark:bg-zinc-900 dark:ring-zinc-800">
          <LayoutDashboard className="h-8 w-8 text-indigo-500" />
        </div>

        <h1 className="text-balance text-center text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-6xl">
          Excel 関数 <span className="bg-gradient-to-r from-indigo-600 to-fuchsia-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-fuchsia-400">総選挙</span>
        </h1>
        
        <p className="mt-6 text-center text-lg leading-8 text-zinc-600 dark:text-zinc-400 sm:max-w-xl">
          最強の検索関数はどれだ？ Vercel Postgres と Server Actions を使用したリアルタイム投票システムです。 
        </p>

        <div className="mt-16 w-full flex flex-col items-center">
          {connectionError ? (
            <div className="bg-white/50 backdrop-blur-md rounded-3xl p-12 border border-zinc-200 text-center max-w-lg dark:bg-zinc-900/50 dark:border-zinc-800">
              <Database className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4 text-zinc-800 dark:text-zinc-100">Postgres 接続エラー</h2>
              <p className="text-zinc-500 mb-6 dark:text-zinc-400">
                Vercel Postgres の環境環境変数が設定されていない、もしくはデータベースにアクセスできません。
              </p>
              <div className="text-left bg-zinc-100 p-4 rounded-xl font-mono text-sm dark:bg-zinc-800 dark:text-zinc-400">
                POSTGRES_URL が見つかりませんでした。 Vercel の Storage タブから Postgres データベースを接続してください。
              </div>
            </div>
          ) : (
            <VoteList initialVotes={initialVotes} hasVotedInit={hasVoted} />
          )}
        </div>

        <footer className="mt-32 border-t border-zinc-200 pt-8 text-center text-sm text-zinc-500 dark:border-zinc-900 dark:text-zinc-600">
          Built with <span className="font-semibold text-zinc-900 dark:text-zinc-400">Next.js 15 & Vercel Postgres</span>
        </footer>
      </main>
    </div>
  );
}
