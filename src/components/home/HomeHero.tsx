'use client';

import Image from 'next/image';
import { publicPath } from '@/lib/public-path';
import Link from 'next/link';
import { Mail, GraduationCap, ExternalLink, Heart, Eye } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { SiteConfig } from '@/lib/config';
import { useLocaleStore } from '@/lib/stores/localeStore';

export default function HomeHero({ author, social, enableLikes, statisticsUrl }: { author: SiteConfig['author']; social: SiteConfig['social']; enableLikes: boolean; statisticsUrl?: string }) {
    const zh = useLocaleStore(state => state.locale) === 'zh';
    const [liked, setLiked] = useState(false);
    const [counts, setCounts] = useState<{ likes: number; visitors: number } | null>(null);
    const [busy, setBusy] = useState(false);
    const [statisticsError, setStatisticsError] = useState(false);
    function visitorId() {
        const stored = localStorage.getItem('qihong-website-visitor-id');
        if (stored) return stored;
        const id = crypto.randomUUID();
        localStorage.setItem('qihong-website-visitor-id', id);
        return id;
    }
    async function updateStatistics(action: 'visit' | 'like' | 'unlike', signal?: AbortSignal) {
        const response = await fetch(statisticsUrl!, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: visitorId(), action }), signal });
        if (!response.ok) throw new Error('Statistics unavailable');
        const result = await response.json();
        if (!Number.isInteger(result.likes) || result.likes < 0 || !Number.isInteger(result.visitors) || result.visitors < 0 || typeof result.liked !== 'boolean') throw new Error('Invalid statistics');
        setCounts({ likes: result.likes, visitors: result.visitors });
        setLiked(result.liked);
        setStatisticsError(false);
        localStorage.setItem('qihong-website-user-liked', String(result.liked));
    }
    useEffect(() => {
        if (!enableLikes) return;
        try { setLiked(localStorage.getItem('qihong-website-user-liked') === 'true'); } catch { /* Keep likes available without storage. */ }
    }, [enableLikes]);
    useEffect(() => {
        if (!statisticsUrl) return;
        const controller = new AbortController();
        const refresh = () => updateStatistics('visit', controller.signal).catch(() => { if (!controller.signal.aborted) setStatisticsError(true); });
        refresh();
        const timer = setInterval(refresh, 30000);
        return () => { controller.abort(); clearInterval(timer); };
        // Only reconnect when the configured service changes.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statisticsUrl]);
    async function toggleLike() {
        if (statisticsUrl) {
            setBusy(true);
            try { await updateStatistics(liked ? 'unlike' : 'like'); }
            catch { setStatisticsError(true); }
            finally { setBusy(false); }
            return;
        }
        const next = !liked;
        setLiked(next);
        try {
            if (next) localStorage.setItem('qihong-website-user-liked', 'true');
            else localStorage.removeItem('qihong-website-user-liked');
        } catch { /* The current session can still use the button. */ }
    }
    return <header className="relative isolate overflow-hidden min-h-[460px] sm:min-h-[520px] flex items-center">
        <Image src={publicPath(author.background || '/home-background.jpg')} alt="" fill priority sizes="100vw" className="object-cover object-center -z-20" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/75 via-black/50 to-black/20" />
        <div className="w-full max-w-6xl mx-auto px-5 sm:px-8 py-16 text-white">
            <p className="text-sm sm:text-base text-white/85 mb-5">{author.institution} · {author.title}</p>
            <h1 className="font-serif text-5xl sm:text-7xl font-bold tracking-wide leading-tight">{author.name}</h1>
            <p className="mt-6 text-lg sm:text-xl text-white/90">{zh ? '欢迎来到我的主页。' : 'Welcome to my personal website.'}</p>
            <p lang={zh ? 'zh-CN' : 'en'} className={`hero-epigraph mt-5 max-w-2xl ${zh ? 'hero-epigraph-zh' : 'hero-epigraph-en'}`}>{zh ? '待来日，轻衣快马，当年旧路。' : 'To strive, to seek, to find, and not to yield.'}</p>
            {!zh && <p className="mt-2 text-xs tracking-wide text-white/65">— Alfred, Lord Tennyson, <cite>Ulysses</cite></p>}
            <div className="flex flex-wrap gap-6 mt-8 text-sm font-medium">
                <a href="#recent-work" className="border-b border-white/70 pb-1 hover:border-white">{zh ? '近期工作' : 'Recent Work'}</a>
                <Link href="/cv/" className="border-b border-white/70 pb-1 hover:border-white">{zh ? '查看简历' : 'View CV'}</Link>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-7 text-sm text-white/90">
                {social.email && <a href={`mailto:${social.email}`} className="inline-flex items-center gap-2 hover:text-white"><Mail className="h-4 w-4" />{zh ? '邮箱' : 'Email'}</a>}
                {social.google_scholar && <a href={social.google_scholar} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-white"><GraduationCap className="h-4 w-4" />{zh ? '谷歌学术' : 'Google Scholar'}</a>}
                {social.orcid && <a href={social.orcid} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-white"><ExternalLink className="h-4 w-4" />ORCID</a>}
                {enableLikes && <button type="button" onClick={toggleLike} disabled={busy} aria-pressed={liked} className={`inline-flex items-center gap-2 transition-colors disabled:opacity-60 ${liked ? 'text-rose-300' : 'hover:text-rose-200'}`}><Heart className="h-4 w-4" fill={liked ? 'currentColor' : 'none'} />{liked ? (zh ? '已点赞' : 'Liked') : (zh ? '点赞' : 'Like')}<span className="tabular-nums">{counts?.likes.toLocaleString() ?? '—'}</span></button>}
                <span className="inline-flex items-center gap-2" title={zh ? '按浏览器去重的累计访客数' : 'Total visitors, deduplicated by browser'}><Eye className="h-4 w-4" />{zh ? '访客' : 'Visitors'}<span className="tabular-nums">{counts?.visitors.toLocaleString() ?? '—'}</span></span>
                {statisticsError && <span role="status" className="text-xs text-white/65">{zh ? '统计暂不可用' : 'Statistics unavailable'}</span>}
            </div>
        </div>
    </header>;
}
