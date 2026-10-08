import {CityLandingPage, cityMetadata, cityStaticParams} from '@/components/landing/CityLandingView';

export const revalidate = 300;
// only the listed cities exist; anything else is a 404
export const dynamicParams = false;

export const generateStaticParams = cityStaticParams;

export const generateMetadata = ({params}: PageProps<'/[locale]/sohvan-pesu/[city]'>) => cityMetadata('sofa', params);

export default function Page({params}: PageProps<'/[locale]/sohvan-pesu/[city]'>) {
  return <CityLandingPage kind="sofa" params={params} />;
}
