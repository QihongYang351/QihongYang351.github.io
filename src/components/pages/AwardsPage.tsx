'use client';

import { Plus, Minus } from 'lucide-react';
import type { CardPageConfig, CardItem } from '@/types/page';
import { useLocaleStore } from '@/lib/stores/localeStore';

export default function AwardsPage({ config }: { config: CardPageConfig }) {
    const zh = useLocaleStore(state => state.locale) === 'zh';
    const groups = [
        { title: zh ? '奖学金' : 'Scholarships', sections: ['奖学金', 'Scholarships'] },
        { title: zh ? '荣誉称号' : 'Honorary Titles', sections: ['荣誉称号', 'Honorary Titles'] },
        { title: zh ? '科研竞赛与论文荣誉' : 'Competitions & Thesis Honors', sections: ['全国竞赛与社会实践', 'National Competitions & Social Practice', '省级竞赛', 'Provincial Competitions', '校际竞赛', 'Inter-University Competitions', '校内奖项与毕业论文荣誉', 'University Awards & Thesis Honors'] },
        { title: zh ? '学术交流' : 'Academic Forums & Conferences', sections: ['学术论坛奖项', 'Academic Forum Awards', '会议报告', 'Conference Presentations'] },
    ];
    function entries(items: CardItem[]) {
        return <div className="divide-y divide-neutral-200 dark:divide-neutral-800">{items.map(item => <article key={`${item.title}-${item.date}`} className="py-5">
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 sm:gap-6">
                <h3 className="text-lg font-serif font-bold text-primary leading-relaxed">{item.title}</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 shrink-0">{item.date}</p>
            </div>
            {item.subtitle && <p className="mt-2 text-neutral-600 dark:text-neutral-400 leading-relaxed">{item.subtitle}</p>}
            {item.content && <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">{item.content}</p>}
        </article>)}</div>;
    }
    return <div>
        <h1 className="text-4xl font-serif font-bold text-primary mb-8">{config.title}</h1>
        <div>{(['undergraduate', 'masters'] as const).map(stage => {
            const stageItems = config.items.filter(item => (item.stage || 'undergraduate') === stage);
            return <details key={stage} className="group/stage border-b border-neutral-200 dark:border-neutral-700">
                <summary className="cursor-pointer list-none flex items-center justify-between gap-4 py-7 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent [&::-webkit-details-marker]:hidden">
                    <h2 className="text-2xl font-serif font-bold text-primary">{stage === 'undergraduate' ? (zh ? '本科' : 'Undergraduate') : (zh ? '硕士' : 'Master’s')}</h2>
                    <span className="flex items-center gap-4 shrink-0 text-neutral-500"><span className="text-sm tabular-nums">{stageItems.length}</span><span aria-hidden="true"><Plus className="h-5 w-5 group-open/stage:hidden" /><Minus className="hidden h-5 w-5 group-open/stage:block" /></span></span>
                </summary>
                <div className="pb-6 pl-3 sm:pl-6">
                {!stageItems.length ? <p className="text-neutral-500 dark:text-neutral-400">{zh ? '暂无记录。' : 'No records yet.'}</p> : <div>{groups.map(group => {
            const items = stageItems.filter(item => group.sections.includes(item.section || ''));
            if (!items.length) return null;
            const sections = Array.from(new Set(items.map(item => item.section!)));
            return <details key={group.title} className="group/category border-b border-neutral-200 dark:border-neutral-800 last:border-b-0">
                <summary className="cursor-pointer list-none flex items-center justify-between gap-4 py-5 [&::-webkit-details-marker]:hidden">
                    <h3 className="text-xl font-serif font-bold text-primary">{group.title}</h3>
                    <span className="flex items-center gap-4 shrink-0 text-neutral-500"><span className="text-sm tabular-nums">{items.length}</span><span aria-hidden="true"><Plus className="h-5 w-5 group-open/category:hidden" /><Minus className="hidden h-5 w-5 group-open/category:block" /></span></span>
                </summary>
                <div className="pl-3 sm:pl-6 pb-3">
                    {sections.length === 1 ? entries(items) : sections.map(section => <details key={section} className="group/level border-b border-neutral-200 dark:border-neutral-800 last:border-b-0">
                        <summary className="cursor-pointer list-none flex items-center justify-between gap-3 py-4 [&::-webkit-details-marker]:hidden">
                            <h3 className="font-semibold text-accent">{section}</h3>
                            <span className="flex items-center gap-4 shrink-0 text-neutral-500"><span className="text-sm tabular-nums">{items.filter(item => item.section === section).length}</span><span aria-hidden="true"><Plus className="h-4 w-4 group-open/level:hidden" /><Minus className="hidden h-4 w-4 group-open/level:block" /></span></span>
                        </summary>
                        <div className="pl-4 sm:pl-7">{entries(items.filter(item => item.section === section))}</div>
                    </details>)}
                </div>
            </details>;
        })}</div>}
                </div>
            </details>;
        })}</div>
    </div>;
}
