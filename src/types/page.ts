export interface BasePageConfig {
    type: 'about' | 'publication' | 'card' | 'text';
    title: string;
    description?: string;
}

export interface PublicationPageConfig extends BasePageConfig {
    type: 'publication';
    source: string;
}

export interface TextPageConfig extends BasePageConfig {
    type: 'text';
    source: string;
    download_directory?: string;
}

export interface CardItem {
    role?: string;
    stage?: 'undergraduate' | 'masters';
    section?: string;
    journal?: string;
    authors?: string;
    status?: string;
    doi?: string;
    apa?: string;
    title: string;
    subtitle?: string;
    date?: string;
    content?: string;
    tags?: string[];
    link?: string;
    image?: string;
    image_width?: number;
    image_height?: number;
}

export interface CardPageConfig extends BasePageConfig {
    type: 'card';
    layout?: 'publications' | 'timeline' | 'awards';
    items: CardItem[];
}
