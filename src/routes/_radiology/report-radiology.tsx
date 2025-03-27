import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_radiology/report-radiology')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_radiology/report-radiology"!</div>
}
