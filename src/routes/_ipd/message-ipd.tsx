import { createFileRoute } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { Bell, Mail, MailCheck, MailWarning, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export const Route = createFileRoute("/_ipd/message-ipd")({
  component: RouteComponent,
});

function RouteComponent() {
  // Types pour les messages
  type Message = {
    id: number;
    sender: string;
    subject: string;
    text: string;
    timestamp: string;
    avatar: string;
    read: boolean;
    important: boolean;
    category: "medical" | "appointment" | "admin" | "other";
  };

  // Données fictives pour les messages
  const messages: Message[] = [
    {
      id: 1,
      sender: "Dr. Dupont",
      subject: "Résultats d'analyses",
      text: "Vos résultats sanguins sont disponibles. Tout semble normal.",
      timestamp: "10:00",
      avatar: "/avatars/doctor1.jpg",
      read: false,
      important: true,
      category: "medical",
    },
    {
      id: 2,
      sender: "Infirmière Marie",
      subject: "Confirmation de rendez-vous",
      text: "Votre rendez-vous du 15/06 est confirmé à 14h30.",
      timestamp: "09:45",
      avatar: "/avatars/nurse1.jpg",
      read: true,
      important: false,
      category: "appointment",
    },
    {
      id: 3,
      sender: "Administration",
      subject: "Mise à jour des documents",
      text: "Veuillez mettre à jour votre dossier médical avant le 30/06.",
      timestamp: "Hier",
      avatar: "/avatars/admin1.jpg",
      read: true,
      important: true,
      category: "admin",
    },
    {
      id: 4,
      sender: "Pharmacie Centrale",
      subject: "Commande prête",
      text: "Votre commande de médicaments est prête à être retirée.",
      timestamp: "Hier",
      avatar: "/avatars/pharmacy1.jpg",
      read: false,
      important: false,
      category: "other",
    },
    {
      id: 5,
      sender: "Dr. Martin",
      subject: "Suivi de traitement",
      text: "Je vous propose un suivi dans 2 semaines pour évaluer le traitement.",
      timestamp: "Lundi",
      avatar: "/avatars/doctor2.jpg",
      read: true,
      important: true,
      category: "medical",
    },
  ];

  // État pour le filtre, la recherche et le message sélectionné
  const [filter, setFilter] = useState<"all" | "unread" | "important">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  // Filtrer les messages
  const filteredMessages = messages.filter((message) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "unread" && !message.read) ||
      (filter === "important" && message.important);

    const matchesSearch =
      message.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.text.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // Marquer un message comme lu
  const markAsRead = (id: number) => {
    const message = messages.find((m) => m.id === id);
    if (message) {
      setSelectedMessage({ ...message, read: true });
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Barre latérale avec filtres */}
      <div className="w-64 bg-white border-r border-gray-200 p-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#018a8c] flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Messagerie
          </h2>
          <Badge variant="outline" className="bg-[#018a8c]/10 text-[#018a8c]">
            {messages.filter((m) => !m.read).length} non lus
          </Badge>
        </div>

        <div className="space-y-1 mb-6">
          <Button
            variant={filter === "all" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setFilter("all")}
          >
            <Mail className="h-4 w-4 mr-2" />
            Tous les messages
          </Button>
          <Button
            variant={filter === "unread" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setFilter("unread")}
          >
            <MailWarning className="h-4 w-4 mr-2" />
            Non lus
          </Button>
          <Button
            variant={filter === "important" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setFilter("important")}
          >
            <Bell className="h-4 w-4 mr-2" />
            Importants
          </Button>
        </div>

        <div className="space-y-1">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Catégories</h3>
          <Button variant="ghost" className="w-full justify-start">
            Médical
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            Rendez-vous
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            Administration
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            Autres
          </Button>
        </div>
      </div>

      {/* Zone principale */}
      <div className="flex-1 flex flex-col">
        {/* Barre de recherche */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher dans les messages..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Liste des messages */}
        <ScrollArea className="flex-1">
          {filteredMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <MailCheck className="h-12 w-12 mb-4" />
              <p>Aucun message trouvé</p>
            </div>
          ) : (
            filteredMessages.map((message) => (
              <motion.div
                key={message.id}
                whileHover={{ scale: 1.005 }}
                className={`border-b border-gray-200 p-4 cursor-pointer ${!message.read ? "bg-blue-50" : "bg-white"}`}
                onClick={() => {
                  setSelectedMessage(message);
                  markAsRead(message.id);
                }}
              >
                <div className="flex items-start">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={message.avatar} alt={message.sender} />
                    <AvatarFallback>{message.sender[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3
                        className={`font-medium truncate ${!message.read ? "text-gray-900" : "text-gray-600"}`}
                      >
                        {message.sender}
                      </h3>
                      <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                        {message.timestamp}
                      </span>
                    </div>
                    <h4
                      className={`text-sm ${!message.read ? "font-semibold text-gray-800" : "text-gray-600"}`}
                    >
                      {message.subject}
                    </h4>
                    <p className="text-sm text-gray-500 truncate">
                      {message.text}
                    </p>
                    {message.important && (
                      <Badge variant="destructive" className="mt-1">
                        Important
                      </Badge>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </ScrollArea>
      </div>

      {/* Fenêtre de lecture */}
      {selectedMessage && (
        <div className="w-1/2 border-l border-gray-200 bg-white flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-bold">{selectedMessage.subject}</h2>
            <div className="flex items-center mt-2">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage
                  src={selectedMessage.avatar}
                  alt={selectedMessage.sender}
                />
                <AvatarFallback>{selectedMessage.sender[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{selectedMessage.sender}</p>
                <p className="text-xs text-gray-500">
                  {selectedMessage.timestamp}
                </p>
              </div>
            </div>
          </div>
          <ScrollArea className="flex-1 p-4">
            <p className="whitespace-pre-line">{selectedMessage.text}</p>
          </ScrollArea>
          <div className="p-4 border-t border-gray-200">
            <Button variant="outline" className="mr-2">
              Répondre
            </Button>
            <Button variant="outline">Transférer</Button>
          </div>
        </div>
      )}
    </div>
  );
}
