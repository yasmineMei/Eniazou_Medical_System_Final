import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_ipd/report-ipd')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_home/InPatient/report"!</div>
}
