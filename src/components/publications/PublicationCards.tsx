'use client';

import { useState } from 'react';
import Image from 'next/image';
import { publicPath } from '@/lib/public-path';
import ReactMarkdown from 'react-markdown';
import { Search, Copy, Check, BookOpen, ExternalLink, Plus, Minus } from 'lucide-react';
import type { CardPageConfig } from '@/types/page';
import { useLocaleStore } from '@/lib/stores/localeStore';

export default function PublicationCards({ config }: { config: CardPageConfig }) {
    const zh = useLocaleStore(state => state.locale) === 'zh';
    const [query, setQuery] = useState('');
    const [year, setYear] = useState('all');
    const [copied, setCopied] = useState<string | null>(null);
    const [copyError, setCopyError] = useState<string | null>(null);
    const items = config.items.filter(item =>
        `${item.title} ${item.authors || ''} ${item.journal || ''} ${item.content || ''}`.toLowerCase().includes(query.toLowerCase()) &&
        (year === 'all' || item.date === year));
    const years = Array.from(new Set(config.items.map(item => item.date).filter(Boolean))).sort().reverse();
    async function copyCitation(id: string, text: string) {
        try {
            await navigator.clipboard.writeText(text.replace(/\*/g, ''));
            setCopied(id);
            setCopyError(null);
            setTimeout(() => setCopied(null), 2000);
        } catch { setCopyError(id); }
    }
    return <div>
        <h1 className="text-4xl font-serif font-bold text-primary mb-4">{config.title}</h1>
        <p className="text-neutral-600 dark:text-neutral-400 mb-8">{config.description}</p>
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <label className="relative flex-1">
                <Search className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
                <input aria-label={zh ? '搜索研究成果' : 'Search publications'} placeholder={zh ? '搜索标题、作者或期刊…' : 'Search title, author, or journal…'} value={query} onChange={e => setQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border-b border-neutral-200 dark:border-neutral-700 bg-transparent focus:outline-none focus:border-accent" />
            </label>
            <select aria-label={zh ? '按年份筛选' : 'Filter by year'} value={year} onChange={e => setYear(e.target.value)} className="border-b border-neutral-200 dark:border-neutral-700 bg-background px-4 py-2.5 focus:outline-none focus:border-accent">
                <option value="all">{zh ? '全部年份' : 'All years'}</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
        </div>
        {['published', 'forthcoming', 'working'].map(section => {
            const group = items.filter(item => item.section === section);
            if (!group.length) return null;
            return <details key={section} open={section === 'published'} className="group/publication-section border-b border-neutral-200 dark:border-neutral-700">
                <summary className="cursor-pointer list-none flex items-center justify-between gap-4 py-7 [&::-webkit-details-marker]:hidden">
                    <h2 className="text-2xl font-serif font-bold text-primary">{section === 'published' ? (zh ? '已发表文章' : 'Published Articles') : section === 'forthcoming' ? (zh ? '即将发表' : 'Forthcoming') : (zh ? '工作论文' : 'Working Papers')}</h2>
                    <span className="flex items-center gap-4 shrink-0 text-neutral-500"><span className="text-sm tabular-nums">{group.length}</span><span aria-hidden="true"><Plus className="h-5 w-5 group-open/publication-section:hidden" /><Minus className="hidden h-5 w-5 group-open/publication-section:block" /></span></span>
                </summary>
                <div className="divide-y divide-neutral-200 dark:divide-neutral-800">{group.map(item => <article key={item.title} className="py-7 sm:py-8">
                    <div className={item.journal ? 'grid md:grid-cols-[180px_minmax(0,1fr)] gap-6 items-start' : ''}>
                        {item.journal && <div className="aspect-[3/4] max-w-[180px] w-full overflow-hidden border border-neutral-200 dark:border-neutral-700">
                            {item.image ? <Image src={publicPath(item.image)} alt={item.journal} width={180} height={240} className="h-full w-full object-cover" /> : <div className="h-full flex flex-col justify-between bg-neutral-100 dark:bg-neutral-800 p-5">
                                <span className="text-xs tracking-widest uppercase text-neutral-500">{zh ? '期刊' : 'Journal'}</span>
                                <span className="font-serif text-xl font-bold text-primary leading-snug break-words">{item.journal}</span>
                                <span className="text-sm text-neutral-500">{item.date}</span>
                            </div>}
                        </div>}
                        <div className="min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 sm:gap-6 mb-3">
                                <h3 className="text-xl font-serif font-bold text-primary leading-snug">{item.title}</h3>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400 shrink-0">{item.date}</p>
                            </div>
                            {item.authors && <p className="text-neutral-600 dark:text-neutral-400 mb-3">{item.authors.split(/(Qihong Yang|杨其洪)/g).map((part, index) => part === 'Qihong Yang' || part === '杨其洪' ? <strong key={index} className="font-bold text-primary">{part}</strong> : part)}</p>}
                            <p className="font-medium text-primary mb-3">{item.journal || item.subtitle}</p>
                            {item.status && <p className="text-sm text-accent mb-3">{item.status}</p>}
                            {item.content && <div className="text-neutral-600 dark:text-neutral-400 mb-4"><ReactMarkdown>{item.content}</ReactMarkdown></div>}
                            {item.doi && <div className="text-sm mb-4 break-all">
                                <a href={`https://doi.org/${item.doi}`} target="_blank" rel="noopener noreferrer" className="inline-flex gap-2 items-center text-accent hover:underline"><ExternalLink className="h-4 w-4 shrink-0" />DOI: {item.doi}</a>
                            </div>}
                            {item.apa && <details className="group">
                                <summary className="cursor-pointer inline-flex items-center gap-2 py-1 text-sm font-medium text-accent hover:underline"><BookOpen className="h-4 w-4" />{zh ? '引用' : 'Citation'}</summary>
                                <div className="mt-4 border-t border-neutral-200 dark:border-neutral-800 pt-4 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300 break-words">
                                    <ReactMarkdown>{item.apa}</ReactMarkdown>
                                    <button onClick={() => copyCitation(item.title, item.apa!)} className="mt-3 inline-flex items-center gap-2 text-accent">{copied === item.title ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}{copied === item.title ? (zh ? '已复制' : 'Copied') : (zh ? '复制引用' : 'Copy citation')}</button>
                                    {copyError === item.title && <p role="status" className="mt-2">{zh ? '复制失败，请选择上方引用文字手动复制。' : 'Please select and copy the citation above manually.'}</p>}
                                </div>
                            </details>}
                        </div>
                    </div>
                </article>)}</div>
            </details>;
        })}
        {!items.length && <p className="text-neutral-500">{zh ? '没有找到匹配的文章。' : 'No matching articles.'}</p>}
    </div>;
}
