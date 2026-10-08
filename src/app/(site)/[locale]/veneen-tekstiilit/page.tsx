import {LandingPage, landingMetadata} from '@/components/landing/landing-page';

export const revalidate = 300;

export const generateMetadata = ({params}: PageProps<'/[locale]/veneen-tekstiilit'>) => landingMetadata('boat', params);

export default function Page({params}: PageProps<'/[locale]/veneen-tekstiilit'>) {
  return <LandingPage kind="boat" params={params} />;
}
