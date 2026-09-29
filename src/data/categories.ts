export const categoryIds = ['water-quality', 'valves', 'flow', 'pressure-level'] as const;
export type CategoryId = (typeof categoryIds)[number];

export interface Category {
  id: CategoryId;
  name: { zh: string; en: string };
  desc: { zh: string; en: string };
  placeholder: string;
}

export const categories: Category[] = [
  {
    id: 'water-quality',
    name: { zh: '水质分析仪表', en: 'Water Quality Analyzers' },
    desc: {
      zh: 'pH/ORP、电导率、溶解氧、浊度、余氯、COD、氨氮等在线水质监测',
      en: 'Online monitoring of pH/ORP, conductivity, DO, turbidity, chlorine, COD, ammonia and more',
    },
    placeholder: '/images/placeholders/water-quality.svg',
  },
  {
    id: 'valves',
    name: { zh: '工业阀门', en: 'Industrial Valves' },
    desc: {
      zh: '电动/气动蝶阀、球阀、调节阀、电磁阀及执行器、定位器',
      en: 'Electric/pneumatic butterfly, ball and control valves, solenoid valves, actuators and positioners',
    },
    placeholder: '/images/placeholders/valves.svg',
  },
  {
    id: 'flow',
    name: { zh: '流量仪表', en: 'Flow Meters' },
    desc: {
      zh: '电磁、超声波、涡街、涡轮、质量流量计及明渠流量计',
      en: 'Electromagnetic, ultrasonic, vortex, turbine, Coriolis and open-channel flow meters',
    },
    placeholder: '/images/placeholders/flow.svg',
  },
  {
    id: 'pressure-level',
    name: { zh: '压力/液位/温度仪表', en: 'Pressure, Level & Temperature' },
    desc: {
      zh: '压力变送器、差压变送器、雷达/超声波/投入式液位计、温度变送器',
      en: 'Pressure & DP transmitters, radar/ultrasonic/submersible level meters, temperature transmitters',
    },
    placeholder: '/images/placeholders/pressure-level.svg',
  },
];

export const getCategory = (id: CategoryId): Category => {
  const c = categories.find((x) => x.id === id);
  if (!c) throw new Error(`Unknown category: ${id}`);
  return c;
};
