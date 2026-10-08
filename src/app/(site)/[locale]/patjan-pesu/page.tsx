import {LandingPage, landingMetadata} from '@/components/landing/landing-page';

export const revalidate = 300;

export const generateMetadata = ({params}: PageProps<'/[locale]/patjan-pesu'>) => landingMetadata('mattress', params);

export default function Page({params}: PageProps<'/[locale]/patjan-pesu'>) {
  return <LandingPage kind="mattress" params={params} />;
}
