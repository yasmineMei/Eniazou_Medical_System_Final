import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_ipd/payment')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_home/InPatient/payment"!</div>
}
