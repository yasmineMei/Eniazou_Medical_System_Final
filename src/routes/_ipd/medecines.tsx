import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_ipd/medecines')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_home/InPatient/medecines"!</div>
}
