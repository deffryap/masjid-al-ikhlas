export interface Event {
    id: string;
    title: string;
    description: string | null;
    date_start: string;
    date_end: string | null;
    location: string | null;
    image_url: string | null;
    created_at: string;
}

export interface GalleryItem {
    id: string;
    caption: string | null;
    image_url: string;
    created_at: string;
}

export interface Settings {
    key: string;
    value: any;
    updated_at: string;
}
