/**
 * Fiche patient

Informations basiques : nom, âge, médecin référent, allergies.

Traitements en cours (liste des médicaments avec posologie et horaires).

Historique des signes vitaux (saisie manuelle simplifiée : température, pouls, tension).
 */
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_nurse/fiche-patient')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_nurse/fiche-patient"!</div>
}
