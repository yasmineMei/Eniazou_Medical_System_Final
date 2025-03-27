import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_radiology/ipd-radiology')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_radiology/ipd-radiology"!</div>
}
