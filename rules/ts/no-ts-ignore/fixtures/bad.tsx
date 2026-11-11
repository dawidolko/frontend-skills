// @ts-nocheck
import { Chart } from './chart'

export function Sales({ data }: { data: number[] }) {
  const chart = new Chart()
  // @ts-ignore
  chart.render(data)
  return <canvas />
}
