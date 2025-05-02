import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_ipd/setting-ipd')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_ipd/setting-ipd"!</div>
}
