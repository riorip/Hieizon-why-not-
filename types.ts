
export interface Article {
  id: string;
  headline: string;
  subheadline: string;
  summaryPoints: string[];
  content: string;
  imageUrl: string;
  sourceUri: string;
  sourceTitle: string;
}

export interface Category {
  id: string;
  name: string;
  icon: IconName;
}

export type IconName = 'home' | 'globe' | 'briefcase' | 'chip' | 'trophy' | 'bookmark' | 'sun' | 'moon' | 'back' | 'share' | 'bookmarkOutline' | 'reader';