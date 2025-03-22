import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_ipd/oT')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_home/InPatient/oT"!</div>
}
