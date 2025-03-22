import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_home/appointments/appointments')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_home/appointments/appointments"!</div>
}
