import type {SiteContent} from '../types';
import {about} from './about';
import {boat} from './boat';
import {business} from './business';
import {car} from './car';
import {careProducts} from './care-products';
import {cities, cityTemplates} from './cities';
import {compare} from './compare';
import {contact} from './contact';
import {deletion} from './deletion';
import {giftCard} from './gift-card';
import {leather} from './leather';
import {mattress} from './mattress';
import {odor} from './odor';
import {pricing} from './pricing';
import {privacy} from './privacy';
import {services} from './services';
import {sofa} from './sofa';

const content: SiteContent = {
  sofa,
  leather,
  mattress,
  car,
  boat,
  services,
  odor,
  pricing,
  business,
  giftCard,
  about,
  contact,
  privacy,
  deletion,
  compare,
  careProducts,
  cityTemplates,
  cities
};

export default content;
