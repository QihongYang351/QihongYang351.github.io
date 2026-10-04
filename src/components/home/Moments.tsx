'use client';

import Image from 'next/image';
import { publicPath } from '@/lib/public-path';
import { ImageIcon } from 'lucide-react';
import { useLocaleStore } from '@/lib/stores/localeStore';

export interface MomentItem {
    image: string;
    title: string;
    location?: string;
    date?: string;
    alt?: string;
}

export interface MomentsConfig {
    title: string;
    description: string;
    items: MomentItem[];
}

export default function Moments({ config }: { config: MomentsConfig }) {
    const zh = useLocaleStore(state => state.locale) === 'zh';
    return <section id="moments" className="mt-16 border-t border-neutral-200 dark:border-neutral-800 pt-10">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-3 mb-7">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-accent">{config.title}</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">{config.description}</p>
        </div>
        <div tabIndex={0} aria-label={config.title} className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-5 focus-visible:outline focus-visible:outline-accent">
            {config.items.length ? config.items.map(item => <figure key={item.image} className="w-[280px] sm:w-[320px] shrink-0 snap-start">
                <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                    <Image src={publicPath(item.image)} alt={item.alt || item.title} fill sizes="(max-width: 640px) 280px, 320px" className="object-cover" />
                </div>
                <figcaption className="mt-3 text-sm leading-relaxed">
                    <p className="text-primary font-medium">{item.title}</p>
                    <p className="mt-1 text-neutral-500 dark:text-neutral-400">{[item.location,item.date].filter(Boolean).join(' · ')}</p>
                </figcaption>
            </figure>) : Array.from({ length: 4 }, (_, i) => <div key={i} className="w-[280px] sm:w-[320px] shrink-0 snap-start">
                <div className="aspect-[4/3] flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 text-neutral-400"><ImageIcon aria-hidden="true" className="h-8 w-8" /></div>
                <p className="mt-3 text-sm text-neutral-500">{zh ? '待添加照片' : 'Photos coming soon'}</p>
            </div>)}
        </div>
    </section>;
}
