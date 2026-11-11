import { Chart } from './chart'

export function Sales({ data, plugins }: { data: number[]; plugins: string[] }) {
  const chart = new Chart()
  // @ts-expect-error chart types lack the plugin option; remove after the upgrade
  chart.render(data, { plugins })
  const note = 'never write @ts-ignore'
  return <canvas aria-label={note} />
}
