import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_home/radiology/radiology')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_home/radiology/radiology"!</div>
}
