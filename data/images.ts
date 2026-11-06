/**
 * Real food photos for recipes, from Unsplash (https://unsplash.com/license):
 * free for commercial and non-commercial use, no permission or attribution
 * required (we credit photographers anyway). Unsplash+ photos are NOT used.
 *
 * Every photo was chosen per recipe from Unsplash's "free" license filter,
 * checked visually to show the actual dish, and verified to load.
 * Recipes without an entry keep the category placeholder.
 */
export type RecipePhoto = {
  /** Unsplash CDN id, e.g. "photo-1612182062633-9ff3b3598e96" */
  photoId: string;
  /** Path of the photo page on unsplash.com (under /photos/) */
  page: string;
  photographer: string;
};

export const RECIPE_PHOTOS: Record<string, RecipePhoto> = {
  "apple-cinnamon-porridge": { photoId: "photo-1559329607-43c470fd9aac", page: "bowl-of-oatmeal-topped-with-chopped-green-apples-4zG050fMarw", photographer: "K8" },
  "apple-crumble": { photoId: "photo-1706799419621-14d7f424de83", page: "a-close-up-of-a-bowl-of-food-on-a-table-e3p5eGEVwf4", photographer: "Alex Bayev" },
  "avocado-toast-with-egg": { photoId: "photo-1770306925042-05987831cb6e", page: "avocado-toast-with-hard-boiled-egg-and-sun-dried-tomatoes-zU_x3GT4ByQ", photographer: "Taylor Friehl" },
  "baked-cinnamon-apples": { photoId: "photo-1793691257681-d8789db3f834", page: "baked-apples-in-air-fryer-uO418iKeIe8", photographer: "Murat Ts." },
  "baked-salmon-with-vegetables": { photoId: "photo-1539136788836-5699e78bfc75", page: "salmon-dinner-with-quinoa-and-broccoli-mmnKI8kMxpc", photographer: "Ella Olsson" },
  "banana-bread": { photoId: "photo-1767065887793-f68f736ea9d6", page: "slices-of-banana-bread-on-a-wooden-cutting-board-bWj_oZPjXS8", photographer: "Diego Arenas de Rodrigo" },
  "banana-oat-porridge": { photoId: "photo-1715098841757-0e9690ec12d6", page: "a-bowl-of-oatmeal-with-banana-slices-on-top-qzRVPgqSWn4", photographer: "Dimitris Asproloupos" },
  "beef-and-broccoli": { photoId: "photo-1783375175952-705a0600e05c", page: "a-bowl-of-beef-and-broccoli-with-white-rice-BA2UZ6w8JfY", photographer: "sheri silver" },
  "beef-lasagna": { photoId: "photo-1709429790175-b02bb1b19207", page: "a-white-plate-topped-with-lasagna-covered-in-sauce-flEUTTwGlJQ", photographer: "Emanuel Ekström" },
  "beef-tacos": { photoId: "photo-1599974579688-8dbdd335c77f", page: "beef-tacos-with-onion-and-cilantro-z_PfaGzeN9E", photographer: "Jeswin Thomas" },
  "berry-yogurt-popsicles": { photoId: "photo-1677513633949-6148b9c6702b", page: "three-popsicles-with-strawberries-on-a-marble-surface-jl_RENWgWwM", photographer: "Miguel Javier" },
  "blueberry-muffins": { photoId: "photo-1637087788449-222cf1da072a", page: "a-bunch-of-blueberry-muffins-sitting-on-top-of-a-wooden-table-HsxSCnDkU_s", photographer: "Tayla Brand" },
  "breakfast-burrito": { photoId: "photo-1635107420756-9f930ed6c97b", page: "a-green-plate-topped-with-a-burrito-and-a-cup-of-coffee-1r_k74aEK58", photographer: "Gonzalo Mendiola" },
  "caesar-salad": { photoId: "photo-1782839577893-da9383e55c96", page: "fresh-caesar-salad-with-grilled-chicken-and-crispy-croutons-5bAi3Cp9wBE", photographer: "R. G" },
  "caprese-salad": { photoId: "photo-1595587870672-c79b47875c6a", page: "vegetable-salad-on-white-ceramic-plate-dJGeISqeEiw", photographer: "Bryony Elena" },
  "carrot-cake-muffins": { photoId: "photo-1676300186098-9b5ae9916e3c", page: "a-piece-of-carrot-cake-on-a-plate-with-a-fork-EvfXG4aK9d8", photographer: "Orkun Orcan" },
  "carrot-ginger-soup": { photoId: "photo-1642497394078-4794e837019c", page: "a-bowl-of-carrot-soup-with-parsley-on-top-2beCqCd8mAc", photographer: "Karyna Panchenko" },
  "cheese-and-chive-scones": { photoId: "photo-1756998461170-e50db744e91f", page: "golden-scone-with-butter-pats-on-a-plate-cOHuRJIwn3k", photographer: "Crystal Stone" },
  "chicken-avocado-salad": { photoId: "photo-1761315600943-d8a5bb0c499f", page: "grilled-chicken-salad-with-avocado-and-tomatoes-9TogNg01qzI", photographer: "Ani Augustine" },
  "chicken-curry": { photoId: "photo-1708782344490-9026aaa5eec7", page: "a-bowl-of-chicken-curry-next-to-a-bowl-of-rice-tsQhEvzU6MQ", photographer: "Rimsha Noor" },
  "chicken-fajitas": { photoId: "photo-1634141613544-001d33883517", page: "a-pan-filled-with-food-sitting-on-top-of-a-wooden-cutting-board-9x6QkgB722w", photographer: "Ahmadreza Rezaie" },
  "chicken-noodle-soup": { photoId: "photo-1612966948332-81d747414a8f", page: "soup-in-white-ceramic-bowl--m0du_taY4g", photographer: "Karolina Kołodziejczak" },
  "chicken-pesto-pasta": { photoId: "photo-1689793605140-c475986c8bee", page: "a-blue-plate-topped-with-pasta-covered-in-pesto-S3AkInyLY2g", photographer: "Oscar Ramirez" },
  "chicken-stir-fry": { photoId: "photo-1788576999396-f73418a7f763", page: "chicken-stir-fry-with-zucchini-YKUJ2L5YveQ", photographer: "Ritupon Baishya" },
  "chili-con-carne": { photoId: "photo-1790701909034-6c7b45c7b58a", page: "chili-bowl-with-cheese-and-cream-HNVi6m5KCr8", photographer: "Chad Montano" },
  "chocolate-chip-cookies": { photoId: "photo-1782852230919-3471990d385d", page: "freshly-baked-chocolate-chip-cookies-one-partially-eaten-nKFObFgq0jA", photographer: "Oleg Bersenev" },
  "classic-carbonara": { photoId: "photo-1764586119076-61711e8ed25a", page: "spaghetti-carbonara-served-in-a-metal-pan-with-cheese-8sdRfiPf4Qo", photographer: "Chris Weiher" },
  "classic-french-toast": { photoId: "photo-1788462613181-3d3c2b62e710", page: "french-toast-with-bananas-breakfast-yUQmFofH-Aw", photographer: "gabbiistudios" },
  "creamy-chicken-alfredo": { photoId: "photo-1761168941826-7efda859bdae", page: "creamy-fettuccine-pasta-with-herbs-and-pine-nuts-5_5tjqjKNAI", photographer: "Leon Bredella" },
  "creamy-mushroom-penne": { photoId: "photo-1791410300150-0752bc56717c", page: "pasta-with-creamy-mushroom-sauce-G99JLO2lDyQ", photographer: "Zoshua Colah" },
  "creamy-scrambled-eggs": { photoId: "photo-1733105666420-729679827ba1", page: "a-piece-of-bread-topped-with-scrambled-eggs-on-a-white-plate-2PuGJE8n5Eo", photographer: "Tadahiro Higuchi" },
  "egg-fried-rice-breakfast": { photoId: "photo-1603133872878-684f208fb84b", page: "fried-rice-with-peas-and-carrots-rQX9eVpSFz8", photographer: "Christopher Alvarenga" },
  "eggplant-parmesan": { photoId: "photo-1792354079048-dd65bc74a9b8", page: "roasted-eggplant-slices-in-baking-dish-EPwMA-dJmKg", photographer: "Benjamin Chambon" },
  "falafel-wraps": { photoId: "photo-1593001872095-7d5b3868fb1d", page: "fried-food-on-white-ceramic-bowl-pQnsKWk5ljQ", photographer: "Anton" },
  "fluffy-pancakes": { photoId: "photo-1612182062633-9ff3b3598e96", page: "pancakes-with-berries-on-white-ceramic-plate-MytHEJlzdcM", photographer: "Jaqueline Pelzer" },
  "french-onion-soup": { photoId: "photo-1741318714411-fad939b8580a", page: "french-onion-soup-with-melted-cheese-NAkk8r6aYfo", photographer: "Meg von Haartman" },
  "fudgy-brownies": { photoId: "photo-1762922425478-7049c54bfbec", page: "several-square-chocolate-brownies-dusted-with-powdered-sugar-JNdKjjB1FXk", photographer: "Jessie Maxwell" },
  "garlic-butter-steak": { photoId: "photo-1678684279246-96e6afb970f2", page: "a-white-plate-topped-with-steak-and-potatoes-87qHNB71qZs", photographer: "Natalia Gusakova" },
  "garlic-shrimp-linguine": { photoId: "photo-1677681483419-e18aa1376db7", page: "a-plate-of-pasta-with-shrimp-and-parsley-WGY9XvzMQ5s", photographer: "Ellie Ellien" },
  "greek-salad": { photoId: "photo-1778449532114-430396ada55b", page: "a-greek-salad-with-feta-cheese-olives-and-cucumbers-25SHQMgsWEQ", photographer: "Shoeib Abolhassani" },
  "greek-yogurt-parfait": { photoId: "photo-1778430421258-293163502996", page: "a-layered-parfait-with-yogurt-strawberries-and-granola-cX8xL_U3xVA", photographer: "Cristian Guillen" },
  "ham-and-cheese-toastie": { photoId: "photo-1647505794572-0a6d945d664d", page: "a-ham-and-cheese-sandwich-cut-in-half-87HPR8VlDfg", photographer: "Glenn Diaz" },
  "honey-almond-cake": { photoId: "photo-1792426430907-93ca589df2d1", page: "almond-cake-on-white-pedestal-9YveTrGjt7s", photographer: "Michael Navarro" },
  "honey-garlic-salmon": { photoId: "photo-1633632811707-41a5e0aa5934", page: "a-white-plate-topped-with-rice-and-a-piece-of-salmon-1115tTZofMs", photographer: "Daniela Crucez" },
  "lemon-garlic-white-fish": { photoId: "photo-1728963228980-71c76178616a", page: "a-piece-of-fish-with-a-lemon-slice-on-top-of-it-_yTPhCFShOU", photographer: "Frolicsome Fairy" },
  "mac-and-cheese": { photoId: "photo-1752095809237-1fe8b70995a2", page: "mac-and-cheese-served-on-a-white-plate-DcjbDVkleqQ", photographer: "Giorgio Trovato" },
  "margherita-flatbread": { photoId: "photo-1658478006307-525ab032ab26", page: "a-pizza-with-basil-CkdP20by5CE", photographer: "Cici Hung" },
  "meatballs-in-tomato-sauce": { photoId: "photo-1515516969-d4008cc6241a", page: "meta-balls-with-noodles-served-on-white-ceramic-bowl-AUAuEgUxg5Q", photographer: "Jason Leung" },
  "minestrone": { photoId: "photo-1725483990685-820291c0fca1", page: "a-pot-of-vegetable-soup-sitting-on-a-stove-top-TDKvBUSkcTs", photographer: "fuseviews" },
  "mushroom-risotto": { photoId: "photo-1791409287840-f56f8611bc84", page: "mushroom-risotto-with-garlic-and-arugula-noaP9Z9Ta2Y", photographer: "Zoshua Colah" },
  "mushroom-soup": { photoId: "photo-1771089278772-7ad0d9c03f2f", page: "bowl-of-creamy-mushroom-soup-with-garnish-on-table-GjwUs-RRzYk", photographer: "David Todd McCarty" },
  "no-bake-cheesecake": { photoId: "photo-1708175313856-8573b2bf8a3a", page: "a-piece-of-cheesecake-on-a-white-plate-hszGPnZGB3A", photographer: "Med Wael Laraiedh" },
  "oatmeal-raisin-cookies": { photoId: "photo-1757451628318-af04456154e7", page: "oatmeal-cookies-with-salt-and-dried-fruit-pjLdSZRnnFo", photographer: "sheri silver" },
  "overnight-oats": { photoId: "photo-1552842016-443bcee0667b", page: "oats-with-cream-and-strawberries-UNavhaEHzaA", photographer: "Heather Barnes" },
  "pasta-primavera": { photoId: "photo-1655349201068-df8ff56f8a40", page: "a-plate-of-pasta-and-vegetables-PoTVI-MUpj4", photographer: "Jude Limage" },
  "peanut-butter-banana-toast": { photoId: "photo-1676976197477-766884b9fb53", page: "a-peanut-butter-and-banana-sandwich-on-a-blue-surface-ZpLI1QFNHU8", photographer: "Kashish Lamba" },
  "pesto-pasta-with-peas": { photoId: "photo-1743352388509-835796029c79", page: "delicious-pesto-pasta-with-fresh-basil-2TMqlO-zqNY", photographer: "Helen Van" },
  "pork-stir-fry-noodles": { photoId: "photo-1705088295609-3ce7befbe8ee", page: "a-plate-of-noodles-with-meat-and-vegetables-C8PDfB2dhxc", photographer: "Gourmet Lenz" },
  "potato-leek-soup": { photoId: "photo-1642463002619-f6e168821c56", page: "three-bowls-of-soup-on-a-green-cloth-rDTTH5vDTOA", photographer: "Thembi Johnson" },
  "potato-salad": { photoId: "photo-1757715375767-35ddb5ca9118", page: "creamy-potato-salad-with-herbs-and-spices-y_jQbVClNPE", photographer: "Zayed Ahmed Zadu" },
  "pumpkin-soup": { photoId: "photo-1757489345059-31d51e241a3e", page: "creamy-pumpkin-soup-with-parsley-and-bread-JELuDsF96tA", photographer: "Elena Leya" },
  "red-lentil-soup": { photoId: "photo-1741026079032-7cb660e44bad", page: "lentil-soup-with-accompaniments-is-ready-to-eat-BIRp2p8vR8k", photographer: "Markus Winkler" },
  "sausage-and-mash": { photoId: "photo-1658925111653-2c08083c08ff", page: "a-plate-of-food-on-a-table-4rWrcTdacbU", photographer: "Dmitry Dreyer" },
  "shakshuka": { photoId: "photo-1757972367524-5272633a75df", page: "fried-eggs-with-tomatoes-and-herbs-in-a-pan-hYPzhjvTZE4", photographer: "Nafsika G." },
  "shrimp-fried-rice": { photoId: "photo-1551326844-4df70f78d0e9", page: "fry-rice-with-prawn-dish-dTNNDTbZr8I", photographer: "Mae Mu" },
  "simple-crepes": { photoId: "photo-1771250248306-3da13dac0a50", page: "stack-of-crepes-topped-with-blueberries-on-a-white-plate-br0KeWZEBWs", photographer: "Sergej *****" },
  "spaghetti-aglio-e-olio": { photoId: "photo-1576698961137-6832c546e321", page: "pasta-food-Nx3OCfnRit8", photographer: "Christine Sandu" },
  "spaghetti-bolognese": { photoId: "photo-1761545832779-bc0b4290fc5e", page: "spaghetti-bolognese-served-on-a-teal-plate-with-garnishes-rQCBC9EgoDE", photographer: "Zayed Ahmed Zadu" },
  "spinach-dal": { photoId: "photo-1756821753226-c0fc88056cf7", page: "dal-bhat-with-greens-and-lentil-curry-EvxE8j6lfyY", photographer: "Frederick Shaw" },
  "spinach-feta-quiche": { photoId: "photo-1633205772834-c0b9943c5a54", page: "a-slice-of-spinach-and-cheese-quiche-on-a-plate-_RHzESzFTH8", photographer: "Emma Shappley" },
  "spinach-ricotta-pasta": { photoId: "photo-1689793606723-d303f50cc50c", page: "a-white-plate-topped-with-pasta-and-spinach-Y_gRBGPpKuk", photographer: "Oscar Ramirez" },
  "spinach-strawberry-salad": { photoId: "photo-1574782170993-b8a906205e01", page: "vegetable-salad-topped-with-sliced-strawberries-co-l1q-vmGY", photographer: "Spencer Davis" },
  "strawberry-shortcake-cups": { photoId: "photo-1488477181946-6428a0291777", page: "sliced-strawberries-in-clear-glass-jar-with-cream-lK1Q5RyD6tc", photographer: "Karly Gomez" },
  "stuffed-bell-peppers": { photoId: "photo-1673646960062-9aeb2188335f", page: "a-white-plate-topped-with-stuffed-bell-peppers-myfDbaJr6vA", photographer: "Natalia Gusakova" },
  "sweet-potato-soup": { photoId: "photo-1764015939059-2c5dee249315", page: "bowl-of-creamy-orange-soup-with-swirl-and-herb-garnish-6EYlAbV2F3M", photographer: "Rob Wingate" },
  "teriyaki-chicken": { photoId: "photo-1791386804677-815379da3e2e", page: "teriyaki-chicken-bowl-with-rice-vtTqQJ0hfZc", photographer: "Travis Palma" },
  "tomato-basil-penne": { photoId: "photo-1676300184847-4ee4030409c0", page: "a-white-plate-topped-with-pasta-covered-in-sauce-w0GyGNyGo6Y", photographer: "Orkun Orcan" },
  "tomato-soup": { photoId: "photo-1673021889619-0677506b56ac", page: "a-bowl-of-tomato-soup-with-croutons-and-spinach-8q13bAl89uQ", photographer: "Kasia Derenda" },
  "vanilla-rice-pudding": { photoId: "photo-1777613112969-d7511ddfbe15", page: "a-bowl-of-creamy-rice-pudding-with-marigold-garland-9Gm-wNAaWzg", photographer: "Adil Murshed" },
  "vegetable-fried-rice": { photoId: "photo-1788603907419-c4cac479edc0", page: "fried-rice-with-vegetables-dinner-aLRcLRJdro4", photographer: "Zoshua Colah" },
  "vegetable-lasagna": { photoId: "photo-1633436374961-09b92742047b", page: "a-white-plate-topped-with-lasagna-covered-in-spinach-YGEne25RWPI", photographer: "Parnis Azimi" },
  "vegetable-stir-fry-tofu": { photoId: "photo-1787732089211-69941bf91603", page: "sizzling-tofu-skillet-dinner-BE0-pX6-J04", photographer: "Kuali Nenek" },
  "veggie-omelette": { photoId: "photo-1677844592730-ce9c936d8f1a", page: "a-white-plate-topped-with-an-omelet-and-greens-SCZP5rvZINk", photographer: "Bakd&Raw by Karolin Baitinger" },
  "veggie-quesadillas": { photoId: "photo-1673990349292-ed2dfa7988c9", page: "a-plate-topped-with-a-quesadilla-cut-in-half-_BW-YmENFcM", photographer: "Benjamin Guardia" },
  "zucchini-fritters": { photoId: "photo-1741791415742-61aa540b4d86", page: "savory-fritters-served-with-creamy-dip-xXutv2UaidI", photographer: "Yoav Aziz" },
};

export const UNSPLASH_IMAGE_HOST = "images.unsplash.com";

/** Base image URL stored in Recipe.imageUrl (size/format params are added when rendering). */
export function photoUrl(photo: RecipePhoto): string {
  return `https://${UNSPLASH_IMAGE_HOST}/${photo.photoId}`;
}

export function photoPageUrl(photo: RecipePhoto): string {
  return `https://unsplash.com/photos/${photo.page}`;
}
