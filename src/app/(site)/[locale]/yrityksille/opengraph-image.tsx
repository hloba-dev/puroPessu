import {pageOg, ogContentType, ogSize} from '@/lib/og';

export const size = ogSize;
export const contentType = ogContentType;
export const alt = 'Puro';

export default function Image(props: {params: Promise<{locale: string}>}) {
  return pageOg('business', props);
}
