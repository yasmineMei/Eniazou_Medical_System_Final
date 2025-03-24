import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_doctor/setting-doctor')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_doctor/setting-doctor"!</div>
}
