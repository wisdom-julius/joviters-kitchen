-- Seed data for Joviter's Kitchen

-- Insert menu items
insert into menu_items (name, description, price, image, category, ingredients, preparation_time, is_available)
values 
(
    'Jollof Rice with Chicken',
    'Rich and flavorful tomato-based rice served with grilled chicken',
    3500,
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=delicious%20nigerian%20jollof%20rice%20with%20grilled%20chicken%2C%20colorful%20presentation&image_size=square',
    'rice',
    array['rice', 'tomatoes', 'pepper', 'onions', 'chicken', 'spices'],
    25,
    true
),
(
    'Amala with Ewedu Soup',
    'Traditional yoruba dish - Amala served with fresh Ewedu soup and assorted meat',
    2800,
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=traditional%20nigerian%20amala%20with%20ewedu%20soup%20and%20assorted%20meat&image_size=square',
    'swallow',
    array['yam flour', 'ewedu leaves', 'assorted meat', 'crayfish', 'spices'],
    20,
    true
),
(
    'Pounded Yam with Egusi Soup',
    'Smooth pounded yam served with rich melon seed soup and goat meat',
    3200,
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=nigerian%20pounded%20yam%20with%20egusi%20soup%20and%20goat%20meat&image_size=square',
    'swallow',
    array['yam', 'egusi', 'goat meat', 'spinach', 'spices'],
    30,
    true
),
(
    'Fried Rice with Dodo',
    'Savory fried rice with vegetables served with fried plantains',
    3000,
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=nigerian%20fried%20rice%20with%20vegetables%20and%20fried%20plantains%20dodo&image_size=square',
    'rice',
    array['rice', 'carrots', 'green beans', 'peas', 'plantains', 'spices'],
    20,
    true
),
(
    'Beans Porridge (Ewa Agoyin)',
    'Creamy beans porridge with agoyin sauce and bread',
    2000,
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=nigerian%20ewa%20agoyin%20beans%20porridge%20with%20bread&image_size=square',
    'soup',
    array['black-eyed beans', 'pepper', 'palm oil', 'bread', 'spices'],
    40,
    true
),
(
    'Suya',
    'Spicy grilled meat skewers with peanut sauce',
    1800,
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=nigerian%20suya%20grilled%20meat%20skewers%20with%20pepper&image_size=square',
    'snacks',
    array['beef', 'groundnut cake', 'pepper', 'spices', 'onions'],
    15,
    true
),
(
    'Puff Puff',
    'Soft, sweet deep-fried dough balls - a Nigerian favorite',
    800,
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=nigerian%20puff%20puff%20sweet%20fried%20dough%20balls&image_size=square',
    'snacks',
    array['flour', 'sugar', 'yeast', 'oil'],
    20,
    true
),
(
    'Zobo Drink',
    'Refreshing hibiscus drink with natural spices',
    600,
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=nigerian%20zobo%20hibiscus%20drink%20in%20glass&image_size=square',
    'drinks',
    array['hibiscus leaves', 'ginger', 'garlic', 'sugar'],
    5,
    true
),
(
    'Fufu with Okra Soup',
    'Cassava fufu served with fresh okra soup and fish',
    2600,
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=nigerian%20fufu%20with%20okra%20soup%20and%20fish&image_size=square',
    'swallow',
    array['cassava fufu', 'okra', 'fish', 'spices'],
    25,
    true
),
(
    'Moin Moin',
    'Steamed bean pudding - a delicious and healthy meal',
    1200,
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=nigerian%20moin%20moin%20steamed%20bean%20pudding&image_size=square',
    'snacks',
    array['black-eyed beans', 'pepper', 'eggs', 'fish', 'spices'],
    35,
    true
),
(
    'Ogbono Soup',
    'Rich ogbono soup with assorted meats, served with eba',
    2900,
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=nigerian%20ogbono%20soup%20with%20assorted%20meat%20and%20eba&image_size=square',
    'soup',
    array['ogbono seeds', 'assorted meat', 'ugwu leaves', 'spices'],
    30,
    true
),
(
    'Kunu Aya',
    'Creamy tiger nut drink - refreshing and nutritious',
    700,
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=nigerian%20kunu aya tiger nut drink&image_size=square',
    'drinks',
    array['tiger nuts', 'dates', 'coconut', 'spices'],
    5,
    true
);
