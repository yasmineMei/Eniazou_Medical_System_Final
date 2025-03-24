import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_radiology/radiology')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_radiology/radiology"!</div>
}
