import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_ipd/registration')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_home/InPatient/registration"!</div>
}
