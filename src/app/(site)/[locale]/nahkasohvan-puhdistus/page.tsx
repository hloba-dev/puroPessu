import {LandingPage, landingMetadata} from '@/components/landing/landing-page';

export const revalidate = 300;

export const generateMetadata = ({params}: PageProps<'/[locale]/nahkasohvan-puhdistus'>) => landingMetadata('leather', params);

export default function Page({params}: PageProps<'/[locale]/nahkasohvan-puhdistus'>) {
  return <LandingPage kind="leather" params={params} />;
}
