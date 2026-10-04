export interface RecentWorkItem {
    category: string;
    organization: string;
    date: string;
    location?: string;
    title: string;
    description: string;
}

export interface RecentWorkConfig {
    title: string;
    items: RecentWorkItem[];
}

export default function RecentWork({ config }: { config: RecentWorkConfig }) {
    return <section id="recent-work" className="mt-14 border-t border-neutral-200 dark:border-neutral-800 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-[160px_minmax(0,1fr)] gap-7 lg:gap-10">
            <h2 className="text-3xl font-serif font-bold text-accent leading-tight">{config.title}</h2>
            <div className="space-y-9">{config.items.map(item => <article key={item.title} className="grid grid-cols-1 md:grid-cols-[220px_minmax(0,1fr)] gap-4 md:gap-7">
                <div>
                    <p className="text-sm italic text-accent mb-3">{item.category}</p>
                    <h3 className="text-xl font-serif font-bold text-primary leading-snug">{item.organization}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">{item.date}</p>
                    {item.location && <p className="text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">{item.location}</p>}
                </div>
                <div>
                    <h3 className="text-xl font-serif font-semibold text-primary leading-relaxed">{item.title}</h3>
                    <p className="mt-3 leading-relaxed text-neutral-600 dark:text-neutral-400">{item.description}</p>
                </div>
            </article>)}</div>
        </div>
    </section>;
}
