import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_ipd/discharge')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_home/InPatient/discharge"!</div>
}
