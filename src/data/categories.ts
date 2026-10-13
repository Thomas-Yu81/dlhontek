export const categoryIds = ['concentration', 'water-quality', 'flow', 'level'] as const;
export type CategoryId = (typeof categoryIds)[number];

export interface Category {
  id: CategoryId;
  name: { zh: string; en: string };
  desc: { zh: string; en: string };
  placeholder: string;
}

export const categories: Category[] = [
  {
    id: 'concentration',
    name: { zh: '浓度测量仪表', en: 'Concentration Meters' },
    desc: {
      zh: '超声波矿浆浓度计、超声波污泥浓度计',
      en: 'Ultrasonic slurry and sludge concentration meters',
    },
    placeholder: '/images/placeholders/concentration.svg',
  },
  {
    id: 'water-quality',
    name: { zh: '水质分析仪表', en: 'Water Quality Analyzers' },
    desc: {
      zh: 'pH/ORP、溶解氧、余氯、浊度/MLSS、泥水界面在线及便携式分析仪',
      en: 'Online and portable pH/ORP, DO, residual chlorine, turbidity/MLSS and sludge blanket analyzers',
    },
    placeholder: '/images/placeholders/water-quality.svg',
  },
  {
    id: 'flow',
    name: { zh: '流量测量仪表', en: 'Flow Meters' },
    desc: {
      zh: '超声波、电磁、涡街、涡轮流量计，明渠流量计及超声波热量计',
      en: 'Ultrasonic, electromagnetic, vortex and turbine flowmeters, open channel flowmeters and heat meters',
    },
    placeholder: '/images/placeholders/flow.svg',
  },
  {
    id: 'level',
    name: { zh: '液位测量仪表', en: 'Level Meters' },
    desc: {
      zh: '超声波液（物）位计、液位差计、高频雷达水位计',
      en: 'Ultrasonic level and level difference meters, high-frequency radar level meters',
    },
    placeholder: '/images/placeholders/level.svg',
  },
];

export const getCategory = (id: CategoryId): Category => {
  const c = categories.find((x) => x.id === id);
  if (!c) throw new Error(`Unknown category: ${id}`);
  return c;
};
