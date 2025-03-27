import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_radiology/opd-radiology')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_radiology/opd-radiology"!</div>
}
