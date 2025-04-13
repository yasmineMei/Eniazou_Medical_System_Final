"use client";

import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Check,
  X,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type StaffMember = {
  id: string;
  name: string;
  position: string;
  department: string;
};

type LeaveRequest = {
  id: string;
  staffId: string;
  staffName: string;
  position: string;
  startDate: Date;
  endDate: Date;
  reason: string;
  status: "pending" | "approved" | "rejected";
  replacementId?: string;
  replacementName?: string;
  notes?: string;
};

export const Route = createFileRoute("/_appointments/doctor-leave")({
  component: LeaveManagementPage,
});

function LeaveManagementPage() {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<LeaveRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<Partial<LeaveRequest>>(
    {}
  );
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const requestsPerPage = 8;

  useEffect(() => {
    const demoStaff: StaffMember[] = [
      {
        id: "1",
        name: "Dr. Kengani",
        position: "Ophtalmologue",
        department: "Ophtalmologie",
      },
      {
        id: "2",
        name: "Dr. Diallo",
        position: "Gynécologue",
        department: "Maternité",
      },
      {
        id: "3",
        name: "Inf. Diop",
        position: "Infirmier",
        department: "Urgences",
      },
      {
        id: "4",
        name: "Lab. Fall",
        position: "Laborantin",
        department: "Laboratoire",
      },
      {
        id: "5",
        name: "Dr. Sow",
        position: "Radiologue",
        department: "Radiologie",
      },
    ];

    const demoRequests: LeaveRequest[] = [
      {
        id: "1",
        staffId: "1",
        staffName: "Dr. Kengani",
        position: "Ophtalmologue",
        startDate: new Date(2023, 5, 10),
        endDate: new Date(2023, 5, 15),
        reason: "Formation professionnelle",
        status: "approved",
        replacementId: "5",
        replacementName: "Dr. Sow",
      },
      {
        id: "2",
        staffId: "3",
        staffName: "Inf. Diop",
        position: "Infirmier",
        startDate: new Date(2023, 5, 20),
        endDate: new Date(2023, 5, 25),
        reason: "Congé maladie",
        status: "pending",
      },
    ];

    setStaffMembers(demoStaff);
    setLeaveRequests(demoRequests);
    setFilteredRequests(demoRequests);
  }, []);

  useEffect(() => {
    const filtered = leaveRequests.filter(
      (request) =>
        request.staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.reason.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRequests(filtered);
    setCurrentPage(1);
  }, [searchTerm, leaveRequests]);

  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = filteredRequests.slice(
    indexOfFirstRequest,
    indexOfLastRequest
  );
  const totalPages = Math.ceil(filteredRequests.length / requestsPerPage);

  const getStatusClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const leaveReasons = [
    "Congé maladie",
    "Congé annuel",
    "Formation professionnelle",
    "Mission",
    "Raison personnelle",
    "Autre",
  ];

  const openNewRequestDialog = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    setCurrentRequest({
      status: "pending",
      startDate: today,
      endDate: tomorrow,
      replacementId: undefined,
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (request: LeaveRequest) => {
    setCurrentRequest({ ...request });
    setIsDialogOpen(true);
  };

  const saveRequest = () => {
    if (
      !currentRequest.staffId ||
      !currentRequest.startDate ||
      !currentRequest.endDate
    ) {
      alert(
        "Veuillez sélectionner un membre du personnel et spécifier les dates de congé"
      );
      return;
    }

    const staffMember = staffMembers.find(
      (m) => m.id === currentRequest.staffId
    );
    const replacement =
      currentRequest.replacementId && currentRequest.replacementId !== "none"
        ? staffMembers.find((m) => m.id === currentRequest.replacementId)
        : undefined;

    const updatedRequest: LeaveRequest = {
      id: currentRequest.id || `req-${Date.now()}`,
      staffId: currentRequest.staffId,
      staffName: staffMember?.name || "",
      position: staffMember?.position || "",
      startDate: currentRequest.startDate,
      endDate: currentRequest.endDate,
      reason: currentRequest.reason || "",
      status: currentRequest.status || "pending",
      replacementId: replacement?.id,
      replacementName: replacement?.name,
      notes: currentRequest.notes,
    };

    if (currentRequest.id) {
      setLeaveRequests(
        leaveRequests.map((req) =>
          req.id === currentRequest.id ? updatedRequest : req
        )
      );
    } else {
      setLeaveRequests([...leaveRequests, updatedRequest]);
    }

    setIsDialogOpen(false);
    setCurrentRequest({});
  };

  const updateRequestStatus = (id: string, status: "approved" | "rejected") => {
    setLeaveRequests(
      leaveRequests.map((request) =>
        request.id === id ? { ...request, status } : request
      )
    );
  };

  const deleteRequest = (id: string) => {
    if (
      confirm("Êtes-vous sûr de vouloir supprimer cette demande de congé ?")
    ) {
      setLeaveRequests(leaveRequests.filter((request) => request.id !== id));
    }
  };

  const renderCalendar = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    return (
      <div className="grid grid-cols-7 gap-1">
        {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day) => (
          <div
            key={day}
            className="font-medium text-center py-2 bg-gray-100 rounded"
          >
            {day}
          </div>
        ))}

        {Array.from({ length: adjustedFirstDay }).map((_, index) => (
          <div key={`empty-${index}`} className="p-2 min-h-24"></div>
        ))}

        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const currentDate = new Date(currentYear, currentMonth, day);

          const requestsOnDate = leaveRequests.filter(
            (request) =>
              request.startDate <= currentDate && request.endDate >= currentDate
          );

          return (
            <div
              key={day}
              className={`border p-2 min-h-24 ${currentDate.getMonth() !== currentMonth ? "bg-gray-50" : ""}`}
            >
              <div
                className={`text-sm font-medium ${day === today.getDate() && currentMonth === today.getMonth() ? "text-[#018787] font-bold" : ""}`}
              >
                {day}
              </div>
              <div className="mt-1 space-y-1">
                {requestsOnDate.map((request) => (
                  <div
                    key={request.id}
                    className={`text-xs p-1 rounded truncate ${getStatusClass(request.status)}`}
                    title={`${request.staffName} - ${request.reason}`}
                  >
                    {request.staffName.split(" ")[0]}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-[#018787]">
          Gestion des Congés Médicaux
        </h1>

        <div className="flex items-center gap-4">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Button onClick={openNewRequestDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle demande
          </Button>
        </div>
      </div>

      <div className="flex justify-end mb-4">
        <div className="inline-flex rounded-md shadow-sm">
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            onClick={() => setViewMode("list")}
          >
            Liste
          </Button>
          <Button
            variant={viewMode === "calendar" ? "default" : "outline"}
            onClick={() => setViewMode("calendar")}
          >
            Calendrier
          </Button>
        </div>
      </div>

      {viewMode === "list" ? (
        <>
          <div className="rounded-md border shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-[#018787]">
                <TableRow>
                  <TableHead className="text-white">Personnel</TableHead>
                  <TableHead className="text-white">Poste</TableHead>
                  <TableHead className="text-white">Période</TableHead>
                  <TableHead className="text-white">Motif</TableHead>
                  <TableHead className="text-white">Remplaçant</TableHead>
                  <TableHead className="text-white">Statut</TableHead>
                  <TableHead className="text-white">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentRequests.length > 0 ? (
                  currentRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>{request.staffName}</TableCell>
                      <TableCell>{request.position}</TableCell>
                      <TableCell>
                        {format(request.startDate, "dd/MM/yyyy", {
                          locale: fr,
                        })}{" "}
                        -{" "}
                        {format(request.endDate, "dd/MM/yyyy", { locale: fr })}
                      </TableCell>
                      <TableCell>{request.reason}</TableCell>
                      <TableCell>
                        {request.replacementName || "Aucun"}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(request.status)}`}
                        >
                          {request.status === "pending" && "En attente"}
                          {request.status === "approved" && "Approuvé"}
                          {request.status === "rejected" && "Rejeté"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {request.status === "pending" && (
                            <>
                              <Button
                                variant="outline"
                                size="icon"
                                className="text-green-600 hover:text-green-700"
                                onClick={() =>
                                  updateRequestStatus(request.id, "approved")
                                }
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className="text-red-600 hover:text-red-700"
                                onClick={() =>
                                  updateRequestStatus(request.id, "rejected")
                                }
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => openEditDialog(request)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => deleteRequest(request.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-muted-foreground"
                    >
                      Aucune demande de congé trouvée
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {filteredRequests.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Affichage de {indexOfFirstRequest + 1} à{" "}
                {Math.min(indexOfLastRequest, filteredRequests.length)} sur{" "}
                {filteredRequests.length} demandes
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium">
                  Page {currentPage} sur {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="rounded-md border shadow-sm p-4">
          <h2 className="text-xl font-semibold mb-4">
            Calendrier des Absences -{" "}
            {format(new Date(), "MMMM yyyy", { locale: fr })}
          </h2>
          {renderCalendar()}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {currentRequest.id
                ? "Modifier la demande"
                : "Nouvelle demande de congé"}
            </DialogTitle>
            <DialogDescription>
              Remplissez les détails de la demande de congé médical
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="staffId" className="text-right">
                Personnel
              </Label>
              <Select
                value={currentRequest.staffId || ""}
                onValueChange={(value) =>
                  setCurrentRequest({ ...currentRequest, staffId: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionner un membre du personnel" />
                </SelectTrigger>
                <SelectContent>
                  {staffMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name} ({member.position})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Période</Label>
              <div className="col-span-3 flex items-center gap-2">
                <CalendarComponent
                  mode="single"
                  selected={currentRequest.startDate}
                  onSelect={(date) =>
                    setCurrentRequest({ ...currentRequest, startDate: date })
                  }
                  className="rounded-md border"
                  fromDate={new Date()}
                />
                <span>au</span>
                <CalendarComponent
                  mode="single"
                  selected={currentRequest.endDate}
                  onSelect={(date) =>
                    setCurrentRequest({ ...currentRequest, endDate: date })
                  }
                  className="rounded-md border"
                  fromDate={currentRequest.startDate || new Date()}
                />
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reason" className="text-right">
                Motif
              </Label>
              <Select
                value={currentRequest.reason || ""}
                onValueChange={(value) =>
                  setCurrentRequest({ ...currentRequest, reason: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionner un motif" />
                </SelectTrigger>
                <SelectContent>
                  {leaveReasons.map((reason) => (
                    <SelectItem key={reason} value={reason}>
                      {reason}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="replacementId" className="text-right">
                Remplaçant
              </Label>
              <Select
                value={currentRequest.replacementId || "none"}
                onValueChange={(value) =>
                  setCurrentRequest({
                    ...currentRequest,
                    replacementId: value === "none" ? undefined : value,
                  })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionner un remplaçant" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucun remplaçant</SelectItem>
                  {staffMembers
                    .filter((member) => member.id !== currentRequest.staffId)
                    .map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name} ({member.position})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
              <Textarea
                id="notes"
                value={currentRequest.notes || ""}
                onChange={(e) =>
                  setCurrentRequest({
                    ...currentRequest,
                    notes: e.target.value,
                  })
                }
                className="col-span-3"
                placeholder="Informations complémentaires..."
              />
            </div>

            {currentRequest.id && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Statut
                </Label>
                <Select
                  value={currentRequest.status}
                  onValueChange={(value) =>
                    setCurrentRequest({
                      ...currentRequest,
                      status: value as "pending" | "approved" | "rejected",
                    })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="approved">Approuvé</SelectItem>
                    <SelectItem value="rejected">Rejeté</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" onClick={saveRequest}>
              {currentRequest.id ? "Enregistrer" : "Créer la demande"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
