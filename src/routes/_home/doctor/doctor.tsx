import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_home/doctor/doctor')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_home/doctor/doctor"!</div>
}
