import {LandingPage, landingMetadata} from '@/components/landing/landing-page';

export const revalidate = 300;

export const generateMetadata = ({params}: PageProps<'/[locale]/sohvan-pesu'>) => landingMetadata('sofa', params);

export default function Page({params}: PageProps<'/[locale]/sohvan-pesu'>) {
  return <LandingPage kind="sofa" params={params} />;
}
