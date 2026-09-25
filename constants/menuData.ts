import { MenuItem } from '@/types';

export const menuData: MenuItem[] = [
  {
    id: '1',
    name: 'Jollof Rice with Chicken',
    description: 'Rich and flavorful tomato-based rice served with grilled chicken',
    price: 3500,
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=delicious%20nigerian%20jollof%20rice%20with%20grilled%20chicken%2C%20colorful%20presentation&image_size=square',
    category: 'rice',
    ingredients: ['rice', 'tomatoes', 'pepper', 'onions', 'chicken', 'spices'],
    preparationTime: 25,
    isAvailable: true
  },
  {
    id: '2',
    name: 'Amala with Ewedu Soup',
    description: 'Traditional yoruba dish - Amala served with fresh Ewedu soup and assorted meat',
    price: 2800,
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=traditional%20nigerian%20amala%20with%20ewedu%20soup%20and%20assorted%20meat&image_size=square',
    category: 'swallow',
    ingredients: ['yam flour', 'ewedu leaves', 'assorted meat', 'crayfish', 'spices'],
    preparationTime: 20,
    isAvailable: true
  },
  {
    id: '3',
    name: 'Pounded Yam with Egusi Soup',
    description: 'Smooth pounded yam served with rich melon seed soup and goat meat',
    price: 3200,
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=nigerian%20pounded%20yam%20with%20egusi%20soup%20and%20goat%20meat&image_size=square',
    category: 'swallow',
    ingredients: ['yam', 'egusi', 'goat meat', 'spinach', 'spices'],
    preparationTime: 30,
    isAvailable: true
  },
  {
    id: '4',
    name: 'Fried Rice with Dodo',
    description: 'Savory fried rice with vegetables served with fried plantains',
    price: 3000,
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=nigerian%20fried%20rice%20with%20vegetables%20and%20fried%20plantains%20dodo&image_size=square',
    category: 'rice',
    ingredients: ['rice', 'carrots', 'green beans', 'peas', 'plantains', 'spices'],
    preparationTime: 20,
    isAvailable: true
  },
  {
    id: '5',
    name: 'Beans Porridge (Ewa Agoyin)',
    description: 'Creamy beans porridge with agoyin sauce and bread',
    price: 2000,
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=nigerian%20ewa%20agoyin%20beans%20porridge%20with%20bread&image_size=square',
    category: 'soup',
    ingredients: ['black-eyed beans', 'pepper', 'palm oil', 'bread', 'spices'],
    preparationTime: 40,
    isAvailable: true
  },
  {
    id: '6',
    name: 'Suya',
    description: 'Spicy grilled meat skewers with peanut sauce',
    price: 1800,
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=nigerian%20suya%20grilled%20meat%20skewers%20with%20pepper&image_size=square',
    category: 'snacks',
    ingredients: ['beef', 'groundnut cake', 'pepper', 'spices', 'onions'],
    preparationTime: 15,
    isAvailable: true
  },
  {
    id: '7',
    name: 'Puff Puff',
    description: 'Soft, sweet deep-fried dough balls - a Nigerian favorite',
    price: 800,
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=nigerian%20puff%20puff%20sweet%20fried%20dough%20balls&image_size=square',
    category: 'snacks',
    ingredients: ['flour', 'sugar', 'yeast', 'oil'],
    preparationTime: 20,
    isAvailable: true
  },
  {
    id: '8',
    name: 'Zobo Drink',
    description: 'Refreshing hibiscus drink with natural spices',
    price: 600,
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=nigerian%20zobo%20hibiscus%20drink%20in%20glass&image_size=square',
    category: 'drinks',
    ingredients: ['hibiscus leaves', 'ginger', 'garlic', 'sugar'],
    preparationTime: 5,
    isAvailable: true
  },
  {
    id: '9',
    name: 'Fufu with Okra Soup',
    description: 'Cassava fufu served with fresh okra soup and fish',
    price: 2600,
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=nigerian%20fufu%20with%20okra%20soup%20and%20fish&image_size=square',
    category: 'swallow',
    ingredients: ['cassava fufu', 'okra', 'fish', 'spices'],
    preparationTime: 25,
    isAvailable: true
  },
  {
    id: '10',
    name: 'Moin Moin',
    description: 'Steamed bean pudding - a delicious and healthy meal',
    price: 1200,
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=nigerian%20moin%20moin%20steamed%20bean%20pudding&image_size=square',
    category: 'snacks',
    ingredients: ['black-eyed beans', 'pepper', 'eggs', 'fish', 'spices'],
    preparationTime: 35,
    isAvailable: true
  },
  {
    id: '11',
    name: 'Ogbono Soup',
    description: 'Rich ogbono soup with assorted meats, served with eba',
    price: 2900,
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=nigerian%20ogbono%20soup%20with%20assorted%20meat%20and%20eba&image_size=square',
    category: 'soup',
    ingredients: ['ogbono seeds', 'assorted meat', 'ugwu leaves', 'spices'],
    preparationTime: 30,
    isAvailable: true
  },
  {
    id: '12',
    name: 'Kunu Aya',
    description: 'Creamy tiger nut drink - refreshing and nutritious',
    price: 700,
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=nigerian%20kunu%20aya%20tiger%20nut%20drink&image_size=square',
    category: 'drinks',
    ingredients: ['tiger nuts', 'dates', 'coconut', 'spices'],
    preparationTime: 5,
    isAvailable: true
  }
];
