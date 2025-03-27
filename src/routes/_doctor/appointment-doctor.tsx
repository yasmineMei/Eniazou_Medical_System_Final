import { createFileRoute } from "@tanstack/react-router";
import {
  Calendar as CalendarIcon,
  Clock,
  List,
  User,
  Check,
  X,
  Edit,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { format, isSameDay } from "date-fns";
import { fr } from "date-fns/locale";

export const Route = createFileRoute("/_doctor/appointment-doctor")({
  component: RouteComponent,
});

function RouteComponent() {
  // Données fictives
  const [allAppointments, setAllAppointments] = useState([
    {
      id: 1,
      patient: "Jean Dupont",
      time: "09:30 - 10:00",
      date: new Date(),
      status: "confirmé",
      urgent: false,
      notes: "Contrôle post-opératoire",
    },
    {
      id: 2,
      patient: "Marie Martin",
      time: "11:15 - 11:45",
      date: new Date(),
      status: "en attente",
      urgent: true,
      notes: "Douleurs aiguës",
    },
    {
      id: 3,
      patient: "Paul Durand",
      time: "14:00 - 14:30",
      date: new Date(),
      status: "confirmé",
      urgent: false,
      notes: "Consultation générale",
    },
    {
      id: 3,
      patient: "Yasmine Meite",
      time: "13:00 - 14:30",
      date: new Date(),
      status: "confirmé",
      urgent: false,
      notes: "Consultation générale",
    },
  ]);

  // États pour les filtres et la pagination
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [filterStatus, setFilterStatus] = useState<string>("tous");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  // État pour l'édition
  const [editingAppointment, setEditingAppointment] = useState<any>(null);
  const [editFormData, setEditFormData] = useState({
    time: "",
    status: "",
    notes: "",
    urgent: false,
  });

  // Styles pour les dates du calendrier
  const dateModifiers = {
    hasAppointment: allAppointments.map((appt) => new Date(appt.date)),
    urgent: allAppointments
      .filter((appt) => appt.urgent)
      .map((appt) => new Date(appt.date)),
  };

  const dateModifierStyles = {
    hasAppointment: {
      border: "2px solid #018787",
      borderRadius: "4px",
    },
    urgent: {
      backgroundColor: "rgba(255, 0, 0, 0.2)",
      border: "2px solid red",
      borderRadius: "4px",
    },
  };

  // Filtrer les rendez-vous
  const filteredAppointments = allAppointments.filter((appointment) => {
    const matchesDate = selectedDate
      ? isSameDay(new Date(appointment.date), selectedDate)
      : true;
    const matchesStatus =
      filterStatus !== "tous" ? appointment.status === filterStatus : true;
    const matchesSearch = searchQuery
      ? appointment.patient.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    return matchesDate && matchesStatus && matchesSearch;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAppointments = filteredAppointments.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);

  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Gestion des rendez-vous
  const handleConfirm = (id: number) => {
    setAllAppointments(
      allAppointments.map((appt) =>
        appt.id === id ? { ...appt, status: "confirmé" } : appt
      )
    );
  };

  const handleCancel = (id: number) => {
    setAllAppointments(
      allAppointments.map((appt) =>
        appt.id === id ? { ...appt, status: "annulé" } : appt
      )
    );
  };

  const handleEditClick = (appointment: any) => {
    setEditingAppointment(appointment);
    setEditFormData({
      time: appointment.time,
      status: appointment.status,
      notes: appointment.notes,
      urgent: appointment.urgent,
    });
  };

  const handleEditSubmit = () => {
    setAllAppointments(
      allAppointments.map((appt) =>
        appt.id === editingAppointment.id
          ? {
              ...appt,
              time: editFormData.time,
              status: editFormData.status,
              notes: editFormData.notes,
              urgent: editFormData.urgent,
            }
          : appt
      )
    );
    setEditingAppointment(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  const handleSelectChange = (value: string) => {
    setEditFormData({
      ...editFormData,
      status: value,
    });
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold text-[#018787]">Mes rendez-vous</h1>

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">
            <List className="mr-2 h-4 w-4" />
            Liste
          </TabsTrigger>
          <TabsTrigger value="calendar">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Calendrier
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <div className="space-y-4">
            {/* Barre de filtres */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un patient..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-8"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterStatus === "tous" ? "default" : "outline"}
                  onClick={() => {
                    setFilterStatus("tous");
                    setCurrentPage(1);
                  }}
                >
                  Tous
                </Button>
                <Button
                  variant={filterStatus === "confirmé" ? "default" : "outline"}
                  onClick={() => {
                    setFilterStatus("confirmé");
                    setCurrentPage(1);
                  }}
                >
                  Confirmés
                </Button>
                <Button
                  variant={
                    filterStatus === "en attente" ? "default" : "outline"
                  }
                  onClick={() => {
                    setFilterStatus("en attente");
                    setCurrentPage(1);
                  }}
                >
                  En attente
                </Button>
              </div>
            </div>

            {/* Liste des rendez-vous */}
            <div className="space-y-2">
              {currentAppointments.length > 0 ? (
                currentAppointments.map((appointment) => (
                  <Card
                    key={appointment.id}
                    className={
                      appointment.urgent
                        ? "border-red-200 bg-red-50"
                        : "border-border"
                    }
                  >
                    <CardContent className="p-4 flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span className="font-medium">
                            {appointment.patient}
                          </span>
                          {appointment.urgent && (
                            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                              Urgent
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-sm">
                          <Clock className="h-4 w-4" />
                          {appointment.time}
                        </div>
                        {appointment.notes && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {appointment.notes}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {appointment.status !== "confirmé" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleConfirm(appointment.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditClick(appointment)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {appointment.status !== "annulé" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCancel(appointment.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Aucun rendez-vous trouvé
                </p>
              )}
            </div>

            {/* Pagination */}
            {filteredAppointments.length > itemsPerPage && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => paginate(currentPage - 1)}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink
                        onClick={() => paginate(index + 1)}
                        isActive={currentPage === index + 1}
                        className="cursor-pointer"
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => paginate(currentPage + 1)}
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </TabsContent>

        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Calendrier des rendez-vous</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                {/* Calendrier */}
                <div className="w-full md:w-1/2">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      setSelectedDate(date);
                      setCurrentPage(1);
                    }}
                    modifiers={dateModifiers}
                    modifiersStyles={dateModifierStyles}
                    locale={fr}
                    className="rounded-md border p-2"
                  />
                </div>

                {/* Liste des RDV pour la date sélectionnée */}
                <div className="w-full md:w-1/2">
                  <h3 className="font-semibold mb-4">
                    {selectedDate
                      ? `Rendez-vous du ${format(selectedDate, "PPPP", {
                          locale: fr,
                        })}`
                      : "Tous les rendez-vous"}
                  </h3>

                  <div className="space-y-3">
                    {allAppointments
                      .filter((appt) =>
                        selectedDate
                          ? isSameDay(new Date(appt.date), selectedDate)
                          : true
                      )
                      .map((appointment) => (
                        <Card
                          key={appointment.id}
                          className={
                            appointment.urgent
                              ? "border-red-200 bg-red-50"
                              : "border-border"
                          }
                        >
                          <CardContent className="p-3 flex justify-between items-center">
                            <div>
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                <span className="font-medium">
                                  {appointment.patient}
                                </span>
                                {appointment.urgent && (
                                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                                    Urgent
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-1 text-sm">
                                <Clock className="h-4 w-4" />
                                {appointment.time}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {appointment.notes}
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditClick(appointment)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}

                    {allAppointments.filter((appt) =>
                      selectedDate
                        ? isSameDay(new Date(appt.date), selectedDate)
                        : true
                    ).length === 0 && (
                      <p className="text-center text-muted-foreground py-4">
                        Aucun rendez-vous ce jour
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal d'édition */}
      <Dialog
        open={!!editingAppointment}
        onOpenChange={(open) => !open && setEditingAppointment(null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Modifier le rendez-vous</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time" className="text-right">
                Heure
              </Label>
              <Input
                id="time"
                name="time"
                value={editFormData.time}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Statut
              </Label>
              <Select
                value={editFormData.status}
                onValueChange={handleSelectChange}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="confirmé">Confirmé</SelectItem>
                  <SelectItem value="en attente">En attente</SelectItem>
                  <SelectItem value="annulé">Annulé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
              <Textarea
                id="notes"
                name="notes"
                value={editFormData.notes}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="urgent" className="text-right">
                Urgent
              </Label>
              <input
                type="checkbox"
                id="urgent"
                checked={editFormData.urgent}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    urgent: e.target.checked,
                  })
                }
                className="h-4 w-4"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditingAppointment(null)}
            >
              Annuler
            </Button>
            <Button type="submit" onClick={handleEditSubmit}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
