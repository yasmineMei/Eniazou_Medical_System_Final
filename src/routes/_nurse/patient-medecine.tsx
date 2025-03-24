/**
 * Gestion des médicaments

Liste quotidienne des médicaments à administrer, par patient et par heure.

Validation manuelle (bouton "Administré" avec signature électronique ou commentaire).
 */

import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_nurse/patient-medecine')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_nurse/patient-medecine"!</div>
}
