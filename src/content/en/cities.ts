import type {CityContent, CitySlug, CityTemplates} from '../types';

export const cityTemplates: CityTemplates = {
  sofa: {
    metaTitle: 'Sofa Cleaning {inCity} — from {price}, at Home',
    metaDescription:
      'Steam cleaning for sofas and armchairs right at your home {inCity}, from {price}. Every day {from}–{to}, no prepayment. See free times and book easily online.',
    h1: 'Sofa cleaning {inCity} — steam cleaned at your home',
    breadcrumb: '{city}',
    pricesTitle: 'Sofa cleaning prices {inCity}'
  },
  mattress: {
    metaTitle: 'Mattress Cleaning {inCity} — from {price}, at Home',
    metaDescription:
      'Mattress steam cleaning and odour removal right at your home {inCity}, from {price}. Every day {from}–{to}, pay after the work. See free times and book online.',
    h1: 'Mattress cleaning {inCity} — done right on your bed',
    breadcrumb: '{city}',
    pricesTitle: 'Mattress cleaning prices {inCity}'
  },
  badge: 'At your home · every day {from}–{to}',
  travelTitle: 'Travel costs: {city}',
  travelFree: 'All of {city} is inside our free travel zone, so there is no travel fee.',
  travelFee: 'A travel fee of {fee} applies {inCity}, and you will see it in the booking before you confirm.',
  travelRange:
    'The travel fee {inCity} is {minFee}–{maxFee} depending on your postal code, and the booking calculates it for you automatically.',
  districtsTitle: 'Areas we cover: {city}',
  arrivalTitle: 'Arrival and parking',
  homesTitle: 'Homes and drying {inCity}',
  galleryTitle: 'Before and after',
  faqTitle: 'FAQ: {city}',
  otherCitiesTitle: 'We also come to these towns',
  otherCityLink: '{city}',
  cta: {
    title: 'Book a cleaning {inCity}',
    text: 'Pick a free time in the calendar and pay only once the work is done. We come every day, including evenings and weekends.'
  }
};

export const cities: Record<CitySlug, CityContent> = {
  helsinki: {
    name: 'Helsinki',
    inCity: 'in Helsinki',
    sofa: {
      intro: [
        'In Helsinki, your sofa probably went up a narrow stairwell to get into the flat, and nobody wants to carry it back down to a cleaner. So we come to you and clean it where it stands — in the old stone buildings of Töölö and Kallio just as well as in newer homes in Lauttasaari or Vuosaari.',
        'Our sofa cleaning in Helsinki uses hot steam and strong extraction, pulling dirt and moisture out of the fabric in one go. The detergents are allergy-friendly and biodegradable, and odour removal is always included. Afterwards we set up blower fans to speed up drying, at no extra cost.'
      ]
    },
    mattress: {
      intro: [
        'In a Helsinki studio or one-bedroom flat, the same room often doubles as bedroom, home office and drying room. That means the mattress collects dust, sweat and moisture faster than usual — and nobody fancies carrying it down the stairs of a building with no lift.',
        'We do mattress cleaning in Helsinki at your home with steam and powerful extraction, so the mattress stays on the bed the whole time. Left alone, a mattress takes longer to dry than a sofa, so we speed it up with blower fans, and drying is always included in the price. A morning clean leaves the most time before bedtime.'
      ]
    },
    districts: [
      'Kallio',
      'Töölö',
      'Kamppi',
      'Punavuori',
      'Kruununhaka',
      'Lauttasaari',
      'Munkkiniemi',
      'Pasila',
      'Arabianranta',
      'Herttoniemi',
      'Vuosaari',
      'Malmi',
      'Kannelmäki',
      'Pitäjänmäki'
    ],
    arrival:
      'In the inner city — Kallio, Töölö, Punavuori — parking is zoned and courtyards are often locked. Add the door code to your booking and tell us where we can leave the van while we work, such as the building’s courtyard or a visitor space. In suburbs like Malmi and Vuosaari, parking is usually easier.',
    homes:
      'Most people in Helsinki live in apartment buildings, and in older stone buildings the lift may be tiny or missing altogether. That’s fine: our equipment goes up the stairs and the furniture is cleaned in place. In a flat, a good cross-draught speeds up drying, so let us know in advance if the windows can’t be opened.',
    faq: [
      {
        q: 'Do you come to Suomenlinna or the islands?',
        a: 'We come to islands you can reach by car, such as Lauttasaari, Kulosaari and Laajasalo. Suomenlinna and other islands without a road connection need to be agreed separately before booking.'
      },
      {
        q: 'I live in an old building with no lift — is that a problem?',
        a: 'Not at all. We carry the equipment up the stairs and clean the sofa or mattress where it is, so nothing needs to be moved. Mention the floor in your booking so we can plan for it.'
      },
      {
        q: 'Do I need to arrange parking for you?',
        a: 'Not necessarily, but let us know in the booking notes if the building has a visitor space or a courtyard we can drive into. Otherwise we’ll park at the nearest legal spot.'
      }
    ]
  },

  espoo: {
    name: 'Espoo',
    inCity: 'in Espoo',
    sofa: {
      intro: [
        'In Espoo we clean a lot of family sofas — in detached houses in Tapiola and Haukilahti, apartment blocks in Matinkylä and Olari, and terraced houses in Espoonlahti and Kivenlahti. Juice spills, a muddy dog and crumbs from evening snacks all leave their mark sooner or later.',
        'Sofa cleaning in Espoo happens at your home with hot steam and extraction, and odour removal is always included — which helps a lot if the dog or cat likes to sleep on the sofa. Our biodegradable, allergy-friendly detergents suit homes with small children and pets.'
      ]
    },
    mattress: {
      intro: [
        'Families with children have plenty of mattresses, and each one has its own story: a leaking nappy, a stomach bug or juice knocked over at bedtime. With mattress cleaning in Espoo done at home, one visit can take care of every bed in the house.',
        'Steam and extraction lift dirt and odours from the upper layers of the mattress, and odour removal is included. Our blower fans speed up drying at no extra cost, and in a terraced or detached house a warm room with good airflow helps too.'
      ]
    },
    districts: [
      'Tapiola',
      'Leppävaara',
      'Matinkylä',
      'Olari',
      'Espoonlahti',
      'Kivenlahti',
      'Soukka',
      'Niittykumpu',
      'Otaniemi',
      'Espoon keskus',
      'Kauklahti',
      'Kalajärvi',
      'Laajalahti',
      'Haukilahti'
    ],
    arrival:
      'In detached and terraced house areas such as Haukilahti, Soukka and Kauklahti, we can usually park in the driveway or on the street near your door. For apartment buildings in Matinkylä, Leppävaara and Espoon keskus, add the door code and where the visitor parking is. Weekday evenings tend to fill up first, so a weekend slot may be easier to get.',
    homes:
      'Espoo has lots of terraced and detached houses, where the sofa often sits in the living room by a big window. In a house, drying is usually quick as long as the ventilation works and the room is warm. If the sofa is in a room with a fireplace, don’t light it right after cleaning — an even room temperature is better for the fabric.',
    faq: [
      {
        q: 'Our dog sleeps on the sofa — will the hair and smell come out?',
        a: 'We vacuum loose hair before cleaning, and odour removal is part of every job. If the smell has soaked deep into the filling, we’ll tell you honestly beforehand what cleaning can achieve.'
      },
      {
        q: 'Can you clean the sofa and the kids’ mattresses in one visit?',
        a: 'Yes. Add all the furniture to your booking and you’ll see the full price up front, while the calendar reserves enough time for the job.'
      },
      {
        q: 'Do you also come to northern Espoo?',
        a: 'Yes, for example to Kalajärvi and the areas north of Espoon keskus. Any travel fee is calculated from your postal code and shown in the booking before you confirm.'
      }
    ]
  },

  vantaa: {
    name: 'Vantaa',
    inCity: 'in Vantaa',
    sofa: {
      intro: [
        'Lots of people in Vantaa leave for work early or get home late — to the airport, logistics jobs or on the train into Helsinki. That’s why sofa cleaning in Vantaa is available every day, including evenings and weekends, and you can see the free times right in the calendar.',
        'We come to Tikkurila, Myyrmäki, Korso or Kivistö and clean your sofa, armchair or loose cushions at home with hot steam. You only pay once the work is done, and the price is the one you saw in the booking. If you’re not happy with the result, we’ll clean it again free of charge.'
      ]
    },
    mattress: {
      intro: [
        'Shift work means sleeping by day one week and by night the next, and the mattress gets heavy use. Plan your mattress cleaning in Vantaa so it has time to dry before your next sleep — a mattress takes longer than a sofa, though our blower fans, always included in the price, speed it up.',
        'Book, for example, a morning slot on a day off or an evening before a free night. We clean the mattress at your home, remove odours and leave it to dry, and you don’t have to move it anywhere.'
      ]
    },
    districts: [
      'Tikkurila',
      'Myyrmäki',
      'Martinlaakso',
      'Hakunila',
      'Korso',
      'Koivukylä',
      'Aviapolis',
      'Kivistö',
      'Pakkala',
      'Länsimäki',
      'Simonkylä',
      'Rekola'
    ],
    arrival:
      'Parking in Vantaa is usually easy: apartment blocks in Myyrmäki, Martinlaakso and Hakunila have visitor spaces, and in the house areas of Korso and Rekola we can pull into the driveway. In central Tikkurila, add the door code and where we can leave the van. Early-morning and late-evening times often go quickly, so book them in good time.',
    homes:
      'Vantaa mixes older apartment suburbs, newer areas such as Kivistö and Aviapolis, and plenty of small houses. Newer apartment buildings usually have roomy lifts, and mechanical ventilation dries the fabric evenly. In a house, opening a window slightly and keeping the room warm speed up drying.',
    faq: [
      {
        q: 'Do you have evening times in Vantaa?',
        a: 'Yes. We work every day, including evenings and weekends. Free times are shown in the booking calendar and you can book straight online.'
      },
      {
        q: 'Can the cleaning be done if I’m not home the whole time?',
        a: 'Someone needs to open the door and show us what to clean. Describe the arrangement in the booking notes and we’ll agree on the rest — payment is always after the work.'
      },
      {
        q: 'Do you come to Kivistö and other parts of northern Vantaa?',
        a: 'We cover all of Vantaa, including Kivistö, Keimola and Seutula. If a travel fee applies to your postal code, it is shown in the booking before you confirm.'
      }
    ]
  },

  kauniainen: {
    name: 'Kauniainen',
    inCity: 'in Kauniainen',
    sofa: {
      intro: [
        'In Kauniainen, home is often a spacious detached house, and the living-room sofa has been chosen to match the interior — frequently light linen, wool or another natural fibre. Light fabric looks lovely, but every coffee mark and greying armrest shows straight away.',
        'Sofa cleaning in Kauniainen is done at your home: we check the fabric first, adjust the steam and detergent to suit it and clean the whole surface evenly so no tide marks are left. With a light sofa, that even finish matters most, and our blower fans, always included in the price, speed up drying.'
      ]
    },
    mattress: {
      intro: [
        'A large house usually has several beds: the bedrooms, a guest room and perhaps the old rooms of children who have moved out. That’s why mattress cleaning in Kauniainen makes sense in one go — all the mattresses in a single visit.',
        'We clean mattresses with steam and extraction using allergy-friendly, biodegradable products, and odour removal is included. In a roomy house, mattresses usually dry well when the rooms are warm and the air can circulate.'
      ]
    },
    districts: [
      'Kauniaisten keskusta',
      'Kasavuori',
      'Gallträsk',
      'Koivuhovi',
      'Kera',
      'Karakallio',
      'Viherlaakso',
      'Laaksolahti',
      'Kilo'
    ],
    arrival:
      'In Kauniainen’s detached-house areas we usually park in your driveway or on the street next to it. Let us know in the booking if there is a gate or if we shouldn’t drive onto the plot. Kauniainen is small and surrounded by Espoo, so a visit can often be combined with jobs in Espoo on the same day.',
    homes:
      'Kauniainen has many detached houses, some of them old villas, plus smaller apartment buildings near the centre. In larger houses the sofa is often a big corner sofa or a full suite, so allow enough time for the job. When drying happens in a large room, a window left ajar and steady warmth are usually enough.',
    faq: [
      {
        q: 'Is steam cleaning safe for a light linen sofa?',
        a: 'In most cases, yes. We test the fabric on a hidden spot first, and if it can’t take wet cleaning, we’ll tell you before we start.'
      },
      {
        q: 'Do you clean old or valuable furniture?',
        a: 'We assess every piece individually. With fragile antique upholstery or silk, we’ll tell you honestly if cleaning isn’t safe. If you’re unsure, send us a photo through the contact form before booking.'
      },
      {
        q: 'Do you charge travel costs to Kauniainen?',
        a: 'It depends on your postal code. The booking calculates the travel fee automatically, and you’ll see it before you confirm.'
      }
    ]
  },

  kerava: {
    name: 'Kerava',
    inCity: 'in Kerava',
    sofa: {
      intro: [
        'Kerava is a town on the main railway line, and many residents commute to work in the capital region. When your weekdays are spent on the train, you don’t want to leave sofa cleaning to the weekend — so we come to Kerava every day, including evenings and weekends.',
        'We clean your sofa at home in Kaleva, Sompio, Kaskela or wherever you live in Kerava, using hot steam and extraction. Left alone, a sofa typically takes 4–8 hours to dry; we speed this up with blower fans, always included in the price. The price is final, and you pay only after the work is done.'
      ]
    },
    mattress: {
      intro: [
        'Mattress cleaning in Kerava is easy to fit into a day off: we come to your home, clean the mattress on the bed and leave it to dry. We speed up drying with blower fans at no extra cost, but a mattress still needs time, so a morning slot tends to work best.',
        'Cleaning removes dust, sweat and stains from the mattress surface, and odour removal is included. The allergy-friendly detergents are suitable for children’s mattresses and allergy sufferers too.'
      ]
    },
    districts: [
      'Keravan keskusta',
      'Kaleva',
      'Kurkela',
      'Ahjo',
      'Savio',
      'Sompio',
      'Jaakkola',
      'Kilta',
      'Alikerava',
      'Kaskela',
      'Ylikerava',
      'Kivisilta'
    ],
    arrival:
      'In Kerava’s house areas, such as Kaskela, Sompio and Ylikerava, we usually park in the driveway or on the street. For apartment buildings in the centre and near the station, add the door code and the visitor space to your booking. Kerava often has free times on the same days as Järvenpää and Tuusula.',
    homes:
      'Kerava has apartment buildings in the centre, terraced houses, large detached-house areas and the new Kivisilta district. In a terraced house the sofa is often near the patio door, and opening it slightly helps drying. In newer homes, mechanical ventilation does much of the work.',
    faq: [
      {
        q: 'Are there weekend times in Kerava?',
        a: 'Yes. We work every day, including evenings and weekends, and you can see free times directly in the booking calendar.'
      },
      {
        q: 'Is there a travel fee to Kerava?',
        a: 'That depends on your postal code. Any travel fee is calculated automatically in the booking, and you’ll see it before you confirm.'
      },
      {
        q: 'Can you clean armchairs and dining chairs at the same time?',
        a: 'Yes. We clean fabric armchairs, footstools and chairs in the same visit. Add them to your booking and you’ll see the full price in advance.'
      }
    ]
  },

  jarvenpaa: {
    name: 'Järvenpää',
    inCity: 'in Järvenpää',
    sofa: {
      intro: [
        'Järvenpää lies between the main railway line and Lake Tuusulanjärvi, and homes range from apartment blocks in the centre to detached houses in Kyrölä, Saunakallio and Haarajoki. Sofa cleaning in Järvenpää always takes place at your home, so the sofa never has to be transported.',
        'Hot steam and extraction lift dirt out of the fabric, and odour removal comes with every clean. If the sofa has been through family life with kids or is the dog’s favourite spot, mention it in your booking so we come prepared for stains and smells.'
      ]
    },
    mattress: {
      intro: [
        'The mattress is the most-used piece of furniture in the home, yet cleaning it keeps getting postponed because it’s so awkward to move. Mattress cleaning in Järvenpää solves that: we bring the equipment, clean it and leave it to dry.',
        'Left alone, a mattress takes longer to dry than a sofa; we speed it up with blower fans, and drying is always included in the price. If we clean the whole family’s mattresses at once, agree in advance where everyone will sleep in case not all of them are dry by bedtime.'
      ]
    },
    districts: [
      'Järvenpään keskusta',
      'Haarajoki',
      'Kyrölä',
      'Saunakallio',
      'Pajala',
      'Kinnari',
      'Jamppa',
      'Harjula',
      'Mustakivi',
      'Wärtsilä',
      'Lepola',
      'Sorto'
    ],
    arrival:
      'In Järvenpää’s house areas we can usually drive right up to the door, and for apartment buildings in the centre the door code and visitor parking details are enough. If satnav struggles to find your house, add short directions to the booking. Next-day times are often available, but it depends on how full the calendar is.',
    homes:
      'Järvenpää has detached and terraced houses from many decades, plus new apartment buildings near the centre. In a house, the sofa is often in a fireplace room or an upstairs lounge where carrying it would be hard work — we clean it where it is. Keeping interior doors open to let the air move helps it dry.',
    faq: [
      {
        q: 'Do you come out to Haarajoki?',
        a: 'We cover all of Järvenpää, Haarajoki included. Any travel fee is calculated from your postal code and shown in the booking before you confirm.'
      },
      {
        q: 'The sofa is upstairs — does it need to be carried down?',
        a: 'No. We bring the equipment to wherever the sofa is and clean it in place.'
      },
      {
        q: 'Do I have to pay in advance?',
        a: 'No. We don’t take prepayment — you pay once the work is done and you’ve seen the result.'
      }
    ]
  },

  tuusula: {
    name: 'Tuusula',
    inCity: 'in Tuusula',
    sofa: {
      intro: [
        'Many people in Tuusula live in detached houses in Hyrylä, Jokela, Kellokoski or near the shore of Lake Tuusulanjärvi. Big living rooms and corner sofas are common, and the whole family spends a lot of time on them.',
        'Sofa cleaning in Tuusula is done at your home with hot steam and extraction. Living close to nature means sand, pollen and pet hair work their way into the sofa, so we vacuum those out first and then clean the whole surface evenly.'
      ]
    },
    mattress: {
      intro: [
        'In summer, sand and damp find their way onto mattresses from the lakeside; in winter, indoor air is dry and there is more dust. Mattress cleaning in Tuusula removes dust, sweat and stains from the mattress surface, and odour removal is included.',
        'We clean the mattress in the room where it is, and our blower fans speed up drying at no extra cost. In a detached house, drying is quicker when the room is warm and a window is open a crack.'
      ]
    },
    districts: [
      'Hyrylä',
      'Jokela',
      'Kellokoski',
      'Riihikallio',
      'Lahela',
      'Rusutjärvi',
      'Ruotsinkylä',
      'Paijala',
      'Sula',
      'Tuusulan kirkonkylä',
      'Mattila'
    ],
    arrival:
      'In Tuusula’s house areas we usually park in your driveway. If the house is on a private road or the driveway gets narrow in winter, mention it in the booking notes. For apartment buildings in central Hyrylä, the door code and visitor parking details are enough.',
    homes:
      'Tuusula has many detached and terraced houses and rural-style homesteads, with apartment buildings in Hyrylä as well. In a spacious house the sofa is often in a fireplace room: avoid lighting the fire right after cleaning and let the fabric dry at an even room temperature.',
    faq: [
      {
        q: 'Do you come to Jokela and Kellokoski?',
        a: 'Yes. Jokela and Kellokoski are part of our area, just like Hyrylä and Riihikallio. Any travel fee is calculated from your postal code and shown in the booking before you confirm.'
      },
      {
        q: 'Our house is by the lake at the end of a private road — will you find it?',
        a: 'Usually, yes. Add directions or a landmark to your booking if satnav doesn’t take you straight to the house.'
      },
      {
        q: 'Can I book a weekend cleaning?',
        a: 'Yes. We come every day, including evenings and weekends, and the free times are shown in the booking calendar.'
      }
    ]
  },

  sipoo: {
    name: 'Sipoo',
    inCity: 'in Sipoo',
    sofa: {
      intro: [
        'Homes in Sipoo tend to be spacious with large plots — in Nikkilä, Söderkulla and Talma and out in the countryside between the villages. Taking a sofa to a cleaner would mean hiring a van and two people to lift it, so we’d much rather clean it at your home.',
        'Sofa cleaning in Sipoo is available every day, including evenings and weekends. We clean the fabric with steam and extraction, the price is shown in the booking up front, and no prepayment is needed.'
      ]
    },
    mattress: {
      intro: [
        'Country life is hard on mattresses: a wet dog jumping onto the bed, and dry, dusty indoor air all winter. With mattress cleaning in Sipoo done at home, there’s no need to haul the mattress anywhere.',
        'We clean the mattress and remove odours on the spot. In a larger house, a mattress usually dries well when the room stays warm and fresh air can get in.'
      ]
    },
    districts: [
      'Nikkilä',
      'Söderkulla',
      'Talma',
      'Box',
      'Paippinen',
      'Kalkkiranta',
      'Hindsby',
      'Sipoonranta',
      'Eriksnäs',
      'Gumbostrand',
      'Massby'
    ],
    arrival:
      'In rural Sipoo, driveways can be long and narrow, and some houses sit along private roads. Let us know in the booking if the house can only be reached from a certain direction or if snow clearing is unreliable in winter. In central Nikkilä and Söderkulla, parking is usually easy.',
    homes:
      'Most people in Sipoo live in detached houses, and many homes are old farmhouses or villas. Older houses often rely on natural ventilation, so air the room through the windows after cleaning and the fabric will dry faster.',
    faq: [
      {
        q: 'Do you serve customers in Swedish?',
        a: 'We serve customers in Finnish, Russian and English. Booking is done online, and the form asks for everything we need to know.'
      },
      {
        q: 'Do you come to the Sipoo coast and archipelago?',
        a: 'We come to any address that can be reached by car, such as Kalkkiranta and Gumbostrand. Islands without a road connection need to be agreed separately.'
      },
      {
        q: 'Our driveway is long and icy in winter — is that a problem?',
        a: 'Usually not. Describe the road conditions and where we can turn the van in your booking, and we’ll get as close to the door as we can.'
      }
    ]
  },

  kirkkonummi: {
    name: 'Kirkkonummi',
    inCity: 'in Kirkkonummi',
    sofa: {
      intro: [
        'People in Kirkkonummi live in apartment buildings in Masala and the centre, detached houses in Veikkola and by the sea in Kantvik and Upinniemi. Many also have a summer cottage somewhere along the municipality’s long coastline.',
        'Sofa cleaning in Kirkkonummi is done at your home with steam and extraction. Damp sea air and the musty smell a cottage picks up over winter cling to fabric, which is why odour removal is part of every clean.'
      ]
    },
    mattress: {
      intro: [
        'Cottage mattresses often spend the whole winter in cold, damp conditions and smell musty by spring. Mattress cleaning in Kirkkonummi fits nicely at the start or end of cottage season — as long as the cottage can be reached by car.',
        'Steam and extraction remove dust and odours from the mattress surface, and our blower fans, always included in the price, speed up drying. If there is mould in the mattress, we’ll tell you straight: cleaning won’t remove it.'
      ]
    },
    districts: [
      'Kirkkonummen keskusta',
      'Masala',
      'Veikkola',
      'Jorvas',
      'Kantvik',
      'Upinniemi',
      'Sundsberg',
      'Gesterby',
      'Porkkala',
      'Täkter'
    ],
    arrival:
      'In Masala and the centre we usually use visitor parking, and in Veikkola’s house areas the driveway. Cottages and waterfront houses are often reached by a private road, so add directions to your booking. Summer weekends often fill up fast, so book a cottage cleaning in good time.',
    homes:
      'Kirkkonummi has apartment buildings in Masala and the centre, but most homes are detached or terraced houses. Summer cottages don’t always have heating, which slows drying — tell us about the cottage in your booking so we can prepare.',
    faq: [
      {
        q: 'Do you clean sofas and mattresses at summer cottages?',
        a: 'Yes, if the cottage can be reached by car and has electricity, which our equipment needs. Describe the cottage in the booking notes.'
      },
      {
        q: 'Do you come to Porkkala and Upinniemi?',
        a: 'We cover all of Kirkkonummi that has a road connection. Any travel fee is calculated from your postal code and shown in the booking before you confirm.'
      },
      {
        q: 'The cottage mattress smells musty — will that go away?',
        a: 'A musty smell on the surface usually goes with cleaning and odour removal. If there is mould in the mattress, cleaning won’t help, and we’d recommend replacing it.'
      }
    ]
  },

  nurmijarvi: {
    name: 'Nurmijärvi',
    inCity: 'in Nurmijärvi',
    sofa: {
      intro: [
        'Many families in Nurmijärvi live in large detached houses in Klaukkala, Rajamäki or the church village, often with a big corner sofa that fits everyone in the evening. Sofa cleaning in Nurmijärvi is done at your home, so the heavy sofa never has to move.',
        'We clean the sofa, armchairs and footstool with hot steam and extraction, and odour removal is included. Blower fans then speed up drying, and that is always included in the price too.'
      ]
    },
    mattress: {
      intro: [
        'A big family means lots of mattresses, and the children’s ones usually have the most stains and smells. Mattress cleaning in Nurmijärvi is best done for every bed at once, so you see the whole price as one total in the booking.',
        'Cleaning is done on site with allergy-friendly, biodegradable products. Mattresses take longer to dry than sofas, so we speed it up with blower fans, and drying is always included in the price. A morning clean leaves the most time before evening.'
      ]
    },
    districts: [
      'Klaukkala',
      'Rajamäki',
      'Nurmijärven kirkonkylä',
      'Palojoki',
      'Kiljava',
      'Röykkä',
      'Perttula',
      'Lepsämä',
      'Metsäkylä',
      'Valkjärvi'
    ],
    arrival:
      'In house areas such as Klaukkala, Palojoki and Röykkä we can usually drive right up to the house. In villages and rural areas the address can be tricky for satnav, so add directions to your booking. Weekday evenings often fill up first, so weekends may be easier to get.',
    homes:
      'Most homes in Nurmijärvi are detached or terraced houses, usually with plenty of space. In a large house, drying generally goes smoothly as long as the ventilation works. If the sofa is in a downstairs fireplace room, let it dry fully before lighting the fire.',
    faq: [
      {
        q: 'Do you come to Rajamäki and Kiljava?',
        a: 'We cover all of Nurmijärvi, including Rajamäki and Kiljava. Any travel fee is calculated from your postal code and shown in the booking before you confirm.'
      },
      {
        q: 'We have a big corner sofa and several mattresses — is one visit enough?',
        a: 'Usually, yes. Add all the furniture to your booking so the calendar reserves enough time, and you’ll see the final price in advance.'
      },
      {
        q: 'Is the cleaning safe for children and our dog?',
        a: 'We use allergy-friendly, biodegradable detergents. Still, keep children and pets off the damp sofa until it has dried.'
      }
    ]
  },

  porvoo: {
    name: 'Porvoo',
    inCity: 'in Porvoo',
    sofa: {
      intro: [
        'In Porvoo, furniture often has a history: the wooden houses of Old Porvoo and older homes in the centre are full of sofas and armchairs passed down through generations. We clean them at your home and check the condition of the fabric first, so the method suits the material.',
        'Sofa cleaning in Porvoo works just as well in newer homes in Länsi-Porvoo, Kevätkumpu and Gammelbacka. Many local households speak both Finnish and Swedish; we serve customers in Finnish, Russian and English, and booking is done entirely online.'
      ]
    },
    mattress: {
      intro: [
        'Air moves differently in an old wooden house than in a new apartment block, and mattresses can pick up moisture and smells. Mattress cleaning in Porvoo is done on the bed, so nobody has to carry the mattress down steep stairs.',
        'Cleaning removes dust, sweat and stains from the mattress surface, and odour removal is included. We speed up drying with blower fans at no extra cost, and in a wooden house steady warmth and airing help too.'
      ]
    },
    districts: [
      'Vanha Porvoo',
      'Porvoon keskusta',
      'Länsi-Porvoo',
      'Kevätkumpu',
      'Hamari',
      'Gammelbacka',
      'Tolkkinen',
      'Kokonniemi',
      'Näsinmäki',
      'Hinthaara',
      'Kerkkoo',
      'Kulloo'
    ],
    arrival:
      'Parking is limited in the narrow lanes of Old Porvoo, so tell us in the booking where we can leave the van and how to get into the house. In Länsi-Porvoo, Hamari and Gammelbacka, parking is usually easier. Weekend times are worth booking well ahead.',
    homes:
      'Porvoo has old wooden houses, apartment buildings in the centre and plenty of detached houses and rural homesteads. Stairs in older houses are often narrow and steep, but our equipment fits, and the furniture is cleaned in place. In a wooden house, fabric dries best at a steady room temperature.',
    faq: [
      {
        q: 'Do you charge travel costs to Porvoo?',
        a: 'The travel fee is calculated from your postal code and shown in the booking before you confirm, so you know the total price in advance.'
      },
      {
        q: 'Can you clean an old sofa that has been in the family for years?',
        a: 'We check the fabric and frame before cleaning. If the upholstery is fragile or the fabric can’t take wet cleaning, we’ll tell you honestly beforehand.'
      },
      {
        q: 'Do you come to the Porvoo archipelago?',
        a: 'We come to addresses that can be reached by car. Islands without a road connection need to be agreed separately before booking.'
      }
    ]
  },

  hyvinkaa: {
    name: 'Hyvinkää',
    inCity: 'in Hyvinkää',
    sofa: {
      intro: [
        'Hyvinkää is a town on the main railway line with a real mix of homes: apartment blocks in the centre, detached houses in Paavola and Hakala, and the wooded streets around the Sveitsi area. Sofa cleaning in Hyvinkää is done at your home, so the sofa never has to be moved.',
        'Steam and extraction lift the dirt out of the fabric, and odour removal is included. When the job is done, you pay exactly the price you saw in the booking — not a euro more.'
      ]
    },
    mattress: {
      intro: [
        'Mattress cleaning in Hyvinkää is easy to schedule for a day off: we come in the morning, clean the mattress and it dries during the day, helped by our blower fans, which are always included in the price.',
        'We clean foam, spring and divan mattresses as well as toppers, provided the material can take wet cleaning. The allergy-friendly detergents are suitable for allergy sufferers too.'
      ]
    },
    districts: [
      'Hyvinkään keskusta',
      'Paavola',
      'Sveitsi',
      'Hakala',
      'Hyvinkäänkylä',
      'Martti',
      'Noppo',
      'Puolimatka',
      'Vehkoja',
      'Ahdenkallio',
      'Sahanmäki',
      'Kytäjä'
    ],
    arrival:
      'In central Hyvinkää, add the door code to your booking and tell us where the van can stand while we work. In house areas such as Paavola, Hakala and Hyvinkäänkylä, we can usually park in the driveway. For villages like Kytäjä, please add directions.',
    homes:
      'Hyvinkää has apartment buildings in the centre and near Sveitsi, plus large areas of detached and terraced houses. In a house, a freshly cleaned sofa usually dries well if the room is warm. In a flat, open a window slightly and keep the ventilation on high.',
    faq: [
      {
        q: 'Do you come out to Kytäjä?',
        a: 'We cover all of Hyvinkää, including the villages. Any travel fee is calculated from your postal code and shown in the booking before you confirm.'
      },
      {
        q: 'Can I sleep on the mattress the same night?',
        a: 'Often, yes, if it is cleaned in the morning or before noon. Left alone, upholstery typically takes 4–8 hours to dry and mattresses longer, depending on room temperature and ventilation; we speed this up with blower fans, always included in the price.'
      },
      {
        q: 'What if a stain doesn’t come out?',
        a: 'We tell you beforehand which stains are likely to come out and which aren’t. If you’re not happy with the result, we’ll clean again free of charge.'
      }
    ]
  }
};
