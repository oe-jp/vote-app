'use client';

import { useState, useOptimistic } from 'react';
import { vote } from '@/app/actions';
import { motion, AnimatePresence } from 'framer-motion';
import { MousePointerClick, CheckCircle2, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

type Vote = {
  id: number;
  option: string;
  count: number;
};

interface VoteListProps {
  initialVotes: Vote[];
}

export default function VoteList({ initialVotes }: VoteListProps) {
  const [isVoting, setIsVoting] = useState<string | null>(null);
  
  const [optimisticVotes, addOptimisticVote] = useOptimistic(
    initialVotes,
    (state, optionToUpdate: string) =>
      state.map((v) =>
        v.option === optionToUpdate ? { ...v, count: v.count + 1 } : v
      )
  );

  const totalVotes = optimisticVotes.reduce((sum, v) => sum + v.count, 0);

  const handleVote = async (option: string) => {
    setIsVoting(option);
    addOptimisticVote(option);
    try {
      await vote(option);
    } catch (error) {
      alert('投票に失敗しました。');
    } finally {
      setIsVoting(null);
    }
  };

  return (
    <div className="w-full max-w-2xl space-y-8">
      <div className="grid gap-6">
        {optimisticVotes.map((v) => {
          const percentage = totalVotes > 0 ? (v.count / totalVotes) * 100 : 0;
          
          return (
            <motion.div
              key={v.option}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative"
            >
              <button
                disabled={!!isVoting}
                onClick={() => handleVote(v.option)}
                className={cn(
                  "group relative w-full overflow-hidden rounded-2xl border bg-white/5 p-6 text-left transition-all hover:scale-[1.01] active:scale-[0.98]",
                  "border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/50 dark:hover:border-indigo-400/50",
                  "backdrop-blur-xl shadow-sm hover:shadow-indigo-500/10",
                  isVoting === v.option && "ring-2 ring-indigo-500 border-transparent"
                )}
              >
                {/* 背景のプログレスバー */}
                <motion.div
                  className="absolute inset-y-0 left-0 -z-10 bg-indigo-500/5 transition-all duration-1000 ease-out dark:bg-indigo-400/10"
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 transition-colors group-hover:bg-indigo-100 dark:bg-zinc-900 dark:group-hover:bg-indigo-900/30",
                      isVoting === v.option && "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400"
                    )}>
                      {isVoting === v.option ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        >
                          <MousePointerClick className="h-5 w-5" />
                        </motion.div>
                      ) : (
                        <CheckCircle2 className="h-5 w-5 text-zinc-400 group-hover:text-indigo-500 dark:text-zinc-600 dark:group-hover:text-indigo-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-zinc-800 dark:text-zinc-100">{v.option}</h3>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        {v.count} 票 ({percentage.toFixed(1)}%)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-indigo-500 opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                </div>
              </button>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-12 flex items-center justify-center">
        <p className="text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          現在の総投票数: <span className="font-bold text-zinc-900 dark:text-zinc-100">{totalVotes}</span>
        </p>
      </div>
    </div>
  );
}
