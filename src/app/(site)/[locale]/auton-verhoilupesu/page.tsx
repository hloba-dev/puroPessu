import {LandingPage, landingMetadata} from '@/components/landing/landing-page';

export const revalidate = 300;

export const generateMetadata = ({params}: PageProps<'/[locale]/auton-verhoilupesu'>) => landingMetadata('car', params);

export default function Page({params}: PageProps<'/[locale]/auton-verhoilupesu'>) {
  return <LandingPage kind="car" params={params} />;
}
