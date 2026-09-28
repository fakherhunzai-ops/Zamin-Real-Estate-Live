export type AreaInfo = {
  id: string;
  name: string;
  tagline: string;
  propertyCount: number;
  image: string;
};

export const areas: AreaInfo[] = [
  {
    id: 'hunza',
    name: 'Hunza',
    tagline: 'Valley homes and orchard retreats',
    propertyCount: 42,
    image:
      'https://readdy.ai/api/search-image?query=Stunning%20Hunza%20Valley%20landscape%20with%20terraced%20green%20fields%2C%20traditional%20stone%20houses%20and%20snow%20capped%20Rakaposhi%20peaks%20in%20Gilgit-Baltistan%20Pakistan%2C%20golden%20hour%20light%2C%20travel%20editorial%20photography&width=800&height=600&seq=zamin-area-hunza&orientation=landscape',
  },
  {
    id: 'gilgit',
    name: 'Gilgit',
    tagline: 'The region’s commercial hub',
    propertyCount: 58,
    image:
      'https://readdy.ai/api/search-image?query=Gilgit%20city%20in%20Gilgit-Baltistan%20Pakistan%20nestled%20among%20dramatic%20mountain%20peaks%20with%20the%20river%20and%20greenery%2C%20clear%20blue%20sky%2C%20wide%20travel%20landscape%20photography&width=800&height=600&seq=zamin-area-gilgit&orientation=landscape',
  },
  {
    id: 'skardu',
    name: 'Skardu',
    tagline: 'Lakes, deserts and mountain views',
    propertyCount: 37,
    image:
      'https://readdy.ai/api/search-image?query=Beautiful%20Skardu%20valley%20with%20turquoise%20lake%20water%2C%20sandy%20shores%2C%20green%20greenery%20and%20snow%20capped%20Karakoram%20mountains%20in%20Pakistan%2C%20bright%20clear%20day%2C%20travel%20landscape%20photography&width=800&height=600&seq=zamin-area-skardu&orientation=landscape',
  },
  {
    id: 'nagar',
    name: 'Nagar',
    tagline: 'Authentic Balti villages',
    propertyCount: 21,
    image:
      'https://readdy.ai/api/search-image?query=Traditional%20Nagar%20Valley%20village%20with%20wooden%20houses%2C%20apricot%20trees%20and%20green%20fields%2C%20snowy%20peaks%20in%20the%20background%20in%20Gilgit-Baltistan%20Pakistan%2C%20soft%20daylight%2C%20travel%20photography&width=800&height=600&seq=zamin-area-nagar&orientation=landscape',
  },
  {
    id: 'ghizer',
    name: 'Ghizer',
    tagline: 'Open farmland and clear rivers',
    propertyCount: 18,
    image:
      'https://readdy.ai/api/search-image?query=Wide%20open%20green%20Ghizer%20valley%20with%20farmland%2C%20a%20clear%20river%20and%20poplar%20trees%2C%20mountains%20rising%20in%20the%20background%20in%20Gilgit-Baltistan%20Pakistan%2C%20bright%20day%2C%20landscape%20photography&width=800&height=600&seq=zamin-area-ghizer&orientation=landscape',
  },
  {
    id: 'chilas',
    name: 'Chilas',
    tagline: 'Gateway along the Karakoram Highway',
    propertyCount: 14,
    image:
      'https://readdy.ai/api/search-image?query=Chilas%20town%20along%20the%20Karakoram%20Highway%20with%20the%20Indus%20river%2C%20pale%20rocky%20mountains%20and%20green%20trees%20in%20Gilgit-Baltistan%20Pakistan%2C%20warm%20afternoon%20light%2C%20travel%20photography&width=800&height=600&seq=zamin-area-chilas&orientation=landscape',
  },
];