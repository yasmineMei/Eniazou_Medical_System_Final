import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_appointments/clinic-tarif')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_appointments/clinic-tarif"!</div>
}
