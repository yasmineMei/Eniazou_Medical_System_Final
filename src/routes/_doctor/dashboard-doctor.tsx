import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_doctor/dashboard-doctor')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_doctor/doctor"!</div>
}
