import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_ipd/investigation')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_home/InPatient/investigation"!</div>
}
