import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_appointments/machine-appointment')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_appointments/machine-appointement"!</div>
}
