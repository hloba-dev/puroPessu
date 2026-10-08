import {CityLandingPage, cityMetadata, cityStaticParams} from '@/components/landing/CityLandingView';

export const revalidate = 300;
// only the listed cities exist; anything else is a 404
export const dynamicParams = false;

export const generateStaticParams = cityStaticParams;

export const generateMetadata = ({params}: PageProps<'/[locale]/patjan-pesu/[city]'>) => cityMetadata('mattress', params);

export default function Page({params}: PageProps<'/[locale]/patjan-pesu/[city]'>) {
  return <CityLandingPage kind="mattress" params={params} />;
}
