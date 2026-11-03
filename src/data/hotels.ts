export interface Hotel {
  id: string;
  name: string;
  category: string;
  city: string;
  address: string;
  starRating: number;
  price: string;
  rating: string;
  reviews: string;
  phone: string;
  roomTypes: string[];
}

export const hotels: Hotel[] = [
  // Premium & Luxury Hotels in Dubai
  {
    id: 'jw-marriott-marquis',
    name: 'JW Marriott Marquis Hotel Dubai',
    category: 'Premium & Luxury Hotels',
    city: 'Dubai',
    address: 'Business Bay, Dubai, United Arab Emirates',
    starRating: 5,
    price: '₹20,682',
    rating: '4.6',
    reviews: '22.6K',
    phone: '+971 4 327 9999',
    roomTypes: ['Deluxe Room', 'Executive Room', 'Junior Suite', 'Premium Suite']
  },
  {
    id: 'atlantis-palm',
    name: 'Atlantis - The Palm',
    category: 'Premium & Luxury Hotels',
    city: 'Dubai',
    address: 'Crescent Rd, Nakhlat Jumeira, Dubai, United Arab Emirates',
    starRating: 5,
    price: '₹47,767',
    rating: '4.7',
    reviews: '103.1K',
    phone: '+971 4 426 0000',
    roomTypes: ['Deluxe Room', 'Premium Room', 'Ocean View Suite', 'Royal Bridge Suite']
  },
  {
    id: 'creekside-accor',
    name: 'The Creekside Hotel Dubai an Accor Hotel',
    category: 'Premium & Luxury Hotels',
    city: 'Dubai',
    address: '31A St, Al Garhoud, Dubai, United Arab Emirates',
    starRating: 5,
    price: '₹10,320',
    rating: '4.5',
    reviews: '5.6K',
    phone: '+971 4 282 2222',
    roomTypes: ['Standard Room', 'Superior Room', 'Deluxe Room', 'Executive Suite']
  },
  {
    id: 'doubletree-m-square',
    name: 'DoubleTree by Hilton Dubai M Square Hotel & Residences',
    category: 'Premium & Luxury Hotels',
    city: 'Dubai',
    address: 'Sheikh Khalifa Bin Zayed St, Mankhool, Dubai, United Arab Emirates',
    starRating: 5,
    price: '₹12,369',
    rating: '4.8',
    reviews: '12.4K',
    phone: '+971 4 351 9999',
    roomTypes: ['Standard Room', 'Deluxe Room', 'Executive Room', 'Suite']
  },
  {
    id: 'radisson-deira-creek',
    name: 'Radisson Blu Hotel, Dubai Deira Creek',
    category: 'Premium & Luxury Hotels',
    city: 'Dubai',
    address: 'Baniyas Rd, Deira, Dubai, United Arab Emirates',
    starRating: 5,
    price: '₹10,854',
    rating: '4.4',
    reviews: '13.3K',
    phone: '+971 4 205 8888',
    roomTypes: ['Standard Room', 'Superior Room', 'Deluxe Room', 'Executive Suite']
  },
  {
    id: 'westminster-dubai-mall',
    name: 'Westminster Dubai Mall',
    category: 'Premium & Luxury Hotels',
    city: 'Dubai',
    address: 'Mall Residence, The Address Hotel, Dubai, United Arab Emirates',
    starRating: 5,
    price: '₹10,502',
    rating: '4.5',
    reviews: '2.0K',
    phone: '+971 4 339 9999',
    roomTypes: ['Standard Room', 'Deluxe Room', 'Premium Room', 'Suite']
  },
  {
    id: 'millennium-central',
    name: 'Millennium Central Downtown - Dubai',
    category: 'Premium & Luxury Hotels',
    city: 'Dubai',
    address: 'Al Asayel St, Business Bay, Dubai, United Arab Emirates',
    starRating: 4,
    price: '₹9,846',
    rating: '4.3',
    reviews: '7.8K',
    phone: '+971 4 438 9999',
    roomTypes: ['Standard Room', 'Superior Room', 'Deluxe Room', 'Executive Suite']
  },
  {
    id: 'marriott-executive-creek',
    name: 'Marriott Executive Apartments Dubai Creek',
    category: 'Premium & Luxury Hotels',
    city: 'Dubai',
    address: 'Riggat Al Buteen, Dubai, United Arab Emirates',
    starRating: 5,
    price: '₹10,318',
    rating: '4.3',
    reviews: '1.6K',
    phone: '+971 4 312 9999',
    roomTypes: ['Studio Apartment', 'One Bedroom', 'Two Bedroom', 'Executive Suite']
  },
  {
    id: 'tower-plaza',
    name: 'The Tower Plaza Hotel Dubai',
    category: 'Premium & Luxury Hotels',
    city: 'Dubai',
    address: 'Sheikh Zayed Road, opp. Emirates Towers, Dubai, United Arab Emirates',
    starRating: 5,
    price: '₹11,538',
    rating: '4.3',
    reviews: '11.0K',
    phone: '+971 4 321 0000',
    roomTypes: ['Deluxe Room', 'Premium Room', 'Executive Room', 'Tower Suite']
  },
  {
    id: 'movenpick-creek',
    name: 'Mövenpick Dubai Creek',
    category: 'Premium & Luxury Hotels',
    city: 'Dubai',
    address: 'Dubai Creek, Baniyas Rd, Riggat Al Buteen, Dubai, United Arab Emirates',
    starRating: 5,
    price: '₹9,313',
    rating: '4.7',
    reviews: '2.3K',
    phone: '+971 4 205 7777',
    roomTypes: ['Standard Room', 'Superior Room', 'Deluxe Room', 'Executive Suite']
  },
  {
    id: 'paramount-dubai',
    name: 'Paramount Hotel Dubai',
    category: 'Premium & Luxury Hotels',
    city: 'Dubai',
    address: 'Business Bay, Dubai, United Arab Emirates',
    starRating: 5,
    price: '₹13,309',
    rating: '4.7',
    reviews: '17.0K',
    phone: '+971 4 436 8888',
    roomTypes: ['Deluxe Room', 'Premium Room', 'Studio Suite', 'Executive Suite']
  },
  // Mid-Range & Smart-Value Hotels in Dubai
  {
    id: 'holiday-inn-express-airport',
    name: 'Holiday Inn Express Dubai Airport by IHG',
    category: 'Mid-Range & Smart-Value Hotels',
    city: 'Dubai',
    address: 'Opp. Dubai Int\'l Airport Terminal 3, Umm Ramool, Dubai, United Arab Emirates',
    starRating: 3,
    price: '₹4,950',
    rating: '4.6',
    reviews: '19.7K',
    phone: '+971 4 299 9999',
    roomTypes: ['Standard Room', 'Superior Room', 'Family Room']
  },
  {
    id: 'mercure-gold-al-mina',
    name: 'Mercure Gold Hotel Al Mina Road Dubai',
    category: 'Mid-Range & Smart-Value Hotels',
    city: 'Dubai',
    address: 'Al Mina St, Bur Dubai, Al Mina, Dubai, United Arab Emirates',
    starRating: 4,
    price: '₹5,900',
    rating: '4.3',
    reviews: '5.4K',
    phone: '+971 4 355 8888',
    roomTypes: ['Standard Room', 'Superior Room', 'Deluxe Room', 'Suite']
  },
  {
    id: 'holiday-inn-express-safa',
    name: 'Holiday Inn Express Dubai - Safa Park by IHG',
    category: 'Mid-Range & Smart-Value Hotels',
    city: 'Dubai',
    address: 'Al Wasl District Sheikh Zayed Road, Al Wasl Rd, Dubai, United Arab Emirates',
    starRating: 3,
    price: '₹7,536',
    rating: '4.6',
    reviews: '6.6K',
    phone: '+971 4 317 9999',
    roomTypes: ['Standard Room', 'Superior Room', 'Family Room']
  },
  {
    id: 'golden-sands-3',
    name: 'Golden Sands 3 Hotel Apartments',
    category: 'Mid-Range & Smart-Value Hotels',
    city: 'Dubai',
    address: '31 Street 10B, Mankhool, Dubai, United Arab Emirates',
    starRating: 3,
    price: '₹5,457',
    rating: '4.2',
    reviews: '3.7K',
    phone: '+971 4 352 5555',
    roomTypes: ['Studio Apartment', 'One Bedroom', 'Two Bedroom']
  },
  {
    id: 'ibis-styles-deira',
    name: 'ibis Styles Dubai Deira',
    category: 'Mid-Range & Smart-Value Hotels',
    city: 'Dubai',
    address: 'Maitha Plaza, Deira, Dubai, United Arab Emirates',
    starRating: 3,
    price: '₹6,825',
    rating: '4.7',
    reviews: '3.3K',
    phone: '+971 4 295 5555',
    roomTypes: ['Standard Room', 'Superior Room', 'Family Room']
  },
  {
    id: 'atana-hotel',
    name: 'Atana Hotel Dubai',
    category: 'Mid-Range & Smart-Value Hotels',
    city: 'Dubai',
    address: 'Al Barsha Third, Barsha Heights, Dubai, United Arab Emirates',
    starRating: 4,
    price: '₹7,781',
    rating: '4.2',
    reviews: '10.2K',
    phone: '+971 4 449 9999',
    roomTypes: ['Standard Room', 'Deluxe Room', 'Executive Room', 'Suite']
  },
  {
    id: 'jannah-creek',
    name: 'Jannah Dubai Creek Hotel',
    category: 'Mid-Range & Smart-Value Hotels',
    city: 'Dubai',
    address: 'Near Deira Clock Tower, 4th St, Riggat Al Buteen, Dubai, United Arab Emirates',
    starRating: 4,
    price: '₹6,262',
    rating: '4.7',
    reviews: '1.6K',
    phone: '+971 4 268 8888',
    roomTypes: ['Standard Room', 'Superior Room', 'Deluxe Room', 'Suite']
  },
  {
    id: 'courtyard-wtc',
    name: 'Courtyard by Marriott World Trade Centre, Dubai',
    category: 'Mid-Range & Smart-Value Hotels',
    city: 'Dubai',
    address: 'Al Hassabi St, Al Satwa, Dubai, United Arab Emirates',
    starRating: 4,
    price: '₹11,048',
    rating: '4.4',
    reviews: '1.6K',
    phone: '+971 4 312 8888',
    roomTypes: ['Standard Room', 'Superior Room', 'Executive Room', 'Suite']
  },
  {
    id: 'four-points-sheikh-zayed',
    name: 'Four Points by Sheraton Sheikh Zayed Road, Dubai',
    category: 'Mid-Range & Smart-Value Hotels',
    city: 'Dubai',
    address: 'Union Tower, Sheikh Zayed Rd, Trade Center First, Dubai, United Arab Emirates',
    starRating: 4,
    price: '₹11,012',
    rating: '4.5',
    reviews: '5.3K',
    phone: '+971 4 317 5555',
    roomTypes: ['Standard Room', 'Superior Room', 'Deluxe Room', 'Suite']
  },
  // Premium & Luxury Hotels in Abu Dhabi
  {
    id: 'emirates-palace',
    name: 'Emirates Palace Mandarin Oriental',
    category: 'Premium & Luxury Hotels',
    city: 'Abu Dhabi',
    address: 'West Corniche Road, Al Ras Al Akhdar, Abu Dhabi, United Arab Emirates',
    starRating: 5,
    price: '₹79,608',
    rating: '4.8',
    reviews: '32.5K',
    phone: '+971 2 690 7999',
    roomTypes: ['Deluxe Room', 'Premium Room', 'Corner Suite', 'Palace Suite']
  },
  {
    id: 'dusit-thani-ad',
    name: 'Dusit Thani Abu Dhabi',
    category: 'Premium & Luxury Hotels',
    city: 'Abu Dhabi',
    address: '925 Sultan Bin Zayed The First Street (Al Muroor Road), Abu Dhabi, United Arab Emirates',
    starRating: 5,
    price: '₹13,688',
    rating: '4.6',
    reviews: '9.8K',
    phone: '+971 2 698 9999',
    roomTypes: ['Deluxe Room', 'Premium Room', 'Executive Room', 'Suite']
  },
  {
    id: 'rixos-marina',
    name: 'Rixos Marina Abu Dhabi',
    category: 'Premium & Luxury Hotels',
    city: 'Abu Dhabi',
    address: 'Marina Mall, Ring Road, Al Kasir, Al Marina, Abu Dhabi, United Arab Emirates',
    starRating: 5,
    price: '₹30,940',
    rating: '4.8',
    reviews: '9.1K',
    phone: '+971 2 406 6666',
    roomTypes: ['Deluxe Room', 'Premium Room', 'Junior Suite', 'Royal Suite']
  },
  {
    id: 'khalidiya-palace',
    name: 'Khalidiya Palace Rayhaan by Rotana',
    category: 'Premium & Luxury Hotels',
    city: 'Abu Dhabi',
    address: 'Corniche St, Al Khubeirah, Abu Dhabi, United Arab Emirates',
    starRating: 5,
    price: '₹18,882',
    rating: '4.7',
    reviews: '15.4K',
    phone: '+971 2 610 8888',
    roomTypes: ['Deluxe Room', 'Premium Room', 'Executive Room', 'Royal Suite']
  },
  {
    id: 'hilton-yas-island',
    name: 'Hilton Abu Dhabi Yas Island',
    category: 'Premium & Luxury Hotels',
    city: 'Abu Dhabi',
    address: 'Yas Bay, Yas Island, Abu Dhabi, United Arab Emirates',
    starRating: 5,
    price: '₹33,964',
    rating: '4.8',
    reviews: '20.2K',
    phone: '+971 2 610 7777',
    roomTypes: ['Deluxe Room', 'Premium Room', 'Executive Suite', 'Presidential Suite']
  },
  {
    id: 'w-abu-dhabi',
    name: 'W Abu Dhabi - Yas Island',
    category: 'Premium & Luxury Hotels',
    city: 'Abu Dhabi',
    address: 'Yas Island, Abu Dhabi, United Arab Emirates',
    starRating: 5,
    price: '₹30,717',
    rating: '4.6',
    reviews: '8.1K',
    phone: '+971 2 610 6666',
    roomTypes: ['Wonderful Room', 'Spectacular Room', 'Extreme Suite', 'Wow Suite']
  },
  {
    id: 'royal-m-hotel',
    name: 'Royal M Hotel by Gewan Abu Dhabi',
    category: 'Premium & Luxury Hotels',
    city: 'Abu Dhabi',
    address: 'Al Bateen Marina, King Abdullah Bin Abdulaziz Al Saud Street, Abu Dhabi, United Arab Emirates',
    starRating: 5,
    price: '₹13,971',
    rating: '4.5',
    reviews: '4.8K',
    phone: '+971 2 666 5555',
    roomTypes: ['Deluxe Room', 'Premium Room', 'Executive Room', 'Suite']
  },
  {
    id: 'intercontinental-abu-dhabi',
    name: 'InterContinental Abu Dhabi by IHG',
    category: 'Premium & Luxury Hotels',
    city: 'Abu Dhabi',
    address: 'King Abdullah Bin Abdulaziz Al Saud St, Al Bateen, Abu Dhabi, United Arab Emirates',
    starRating: 5,
    price: '₹18,587',
    rating: '4.8',
    reviews: '25.2K',
    phone: '+971 2 666 6888',
    roomTypes: ['Deluxe Room', 'Premium Room', 'Club Room', 'Executive Suite']
  },
  {
    id: 'conrad-etihad',
    name: 'Conrad Abu Dhabi Etihad Towers',
    category: 'Premium & Luxury Hotels',
    city: 'Abu Dhabi',
    address: 'Corniche St, Al Bateen, Abu Dhabi, United Arab Emirates',
    starRating: 5,
    price: '₹24,160',
    rating: '4.8',
    reviews: '12.4K',
    phone: '+971 2 698 2000',
    roomTypes: ['Deluxe Room', 'Premium Room', 'Executive Room', 'Royal Suite']
  },
  {
    id: 'grand-hyatt-ad',
    name: 'Grand Hyatt Abu Dhabi Hotel & Residences',
    category: 'Premium & Luxury Hotels',
    city: 'Abu Dhabi',
    address: 'West Corniche, Corniche Road, Abu Dhabi, United Arab Emirates',
    starRating: 5,
    price: '₹22,928',
    rating: '4.6',
    reviews: '4.3K',
    phone: '+971 2 656 1234',
    roomTypes: ['Deluxe Room', 'Premium Room', 'Executive Room', 'Grand Suite']
  },
  {
    id: 'marriott-downtown-ad',
    name: 'Marriott Hotel Downtown, Abu Dhabi',
    category: 'Premium & Luxury Hotels',
    city: 'Abu Dhabi',
    address: 'Sheikh Rashid Bin Saeed St, Al Manhal, Al Tibbiya, Abu Dhabi, United Arab Emirates',
    starRating: 5,
    price: '₹17,589',
    rating: '4.5',
    reviews: '4.4K',
    phone: '+971 2 697 7000',
    roomTypes: ['Deluxe Room', 'Premium Room', 'Executive Room', 'Suite']
  },
  {
    id: 'royal-rose',
    name: 'Royal Rose Hotel Abu Dhabi, Curio Collection by Hilton',
    category: 'Premium & Luxury Hotels',
    city: 'Abu Dhabi',
    address: '1025 Zayed The First St, Al Danah, Al Markaziyah District, Abu Dhabi, United Arab Emirates',
    starRating: 5,
    price: '₹15,025',
    rating: '4.4',
    reviews: '6.3K',
    phone: '+971 2 635 5555',
    roomTypes: ['Deluxe Room', 'Premium Room', 'Executive Room', 'Royal Suite']
  },
  {
    id: 'sofitel-corniche',
    name: 'Sofitel Abu Dhabi Corniche',
    category: 'Premium & Luxury Hotels',
    city: 'Abu Dhabi',
    address: 'Capital Plaza Complex, Corniche Rd E, Al Danah, Abu Dhabi, United Arab Emirates',
    starRating: 5,
    price: '₹14,800',
    rating: '4.5',
    reviews: '8.4K',
    phone: '+971 2 633 6777',
    roomTypes: ['Superior Room', 'Deluxe Room', 'Premium Room', 'Suite']
  },
  {
    id: 'st-regis-ad',
    name: 'The St. Regis Abu Dhabi',
    category: 'Premium & Luxury Hotels',
    city: 'Abu Dhabi',
    address: 'Nation Towers, Corniche St, Al Bateen, Abu Dhabi, United Arab Emirates',
    starRating: 5,
    price: '₹35,465',
    rating: '4.7',
    reviews: '4.7K',
    phone: '+971 2 698 3000',
    roomTypes: ['Deluxe Room', 'Premium Room', 'Executive Suite', 'Presidential Suite']
  },
  {
    id: 'four-seasons-al-maryah',
    name: 'Four Seasons Hotel Abu Dhabi at Al Maryah Island',
    category: 'Premium & Luxury Hotels',
    city: 'Abu Dhabi',
    address: 'Abu Dhabi Global Market, Second St, Al Maryah Island, Abu Dhabi, United Arab Emirates',
    starRating: 5,
    price: '₹46,486',
    rating: '4.7',
    reviews: '6.3K',
    phone: '+971 2 400 8200',
    roomTypes: ['Deluxe Room', 'Premium Room', 'Executive Suite', 'Royal Suite']
  }
];

export const categories = [
  'Premium & Luxury Hotels - Dubai',
  'Mid-Range & Smart-Value Hotels - Dubai',
  'Premium & Luxury Hotels - Abu Dhabi'
];

export const getHotelsByCategory = (category: string): Hotel[] => {
  if (category.includes('Dubai') && category.includes('Mid')) {
    return hotels.filter(h => h.city === 'Dubai' && h.category === 'Mid-Range & Smart-Value Hotels');
  } else if (category.includes('Dubai') && category.includes('Premium')) {
    return hotels.filter(h => h.city === 'Dubai' && h.category === 'Premium & Luxury Hotels');
  } else if (category.includes('Abu Dhabi')) {
    return hotels.filter(h => h.city === 'Abu Dhabi');
  }
  return hotels;
};
