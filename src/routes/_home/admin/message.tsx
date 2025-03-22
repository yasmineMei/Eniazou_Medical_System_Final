import { createFileRoute } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";

export const Route = createFileRoute("/_home/admin/message")({
  component: RouteComponent,
});

function RouteComponent() {
  // Données fictives pour les conversations et les messages
  const conversations = [
    {
      id: 1,
      name: "Dr. Dupont",
      lastMessage: "Bonjour, comment allez-vous ?",
      avatar: "/avatars/doctor1.jpg",
    },
    {
      id: 2,
      name: "Infirmière Marie",
      lastMessage: "Votre rendez-vous est confirmé.",
      avatar: "/avatars/nurse1.jpg",
    },
    {
      id: 3,
      name: "Patient Jean",
      lastMessage: "Merci pour votre aide !",
      avatar: "/avatars/patient1.jpg",
    },
  ];

  const messages = [
    {
      id: 1,
      sender: "Dr. Dupont",
      text: "Bonjour, comment allez-vous ?",
      timestamp: "10:00",
    },
    {
      id: 2,
      sender: "Vous",
      text: "Je vais bien, merci !",
      timestamp: "10:05",
    },
    {
      id: 3,
      sender: "Dr. Dupont",
      text: "Ravi de l'entendre.",
      timestamp: "10:10",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Barre latérale des conversations */}
      <div className="w-1/4 bg-white border-r border-gray-200 p-4">
        <h2 className="text-lg font-bold text-[#018a8c] mb-4">Conversations</h2>
        <ScrollArea className="h-[calc(100vh-100px)]">
          {conversations.map((conversation) => (
            <motion.div
              key={conversation.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center p-3 hover:bg-gray-100 rounded-lg cursor-pointer"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={conversation.avatar}
                  alt={conversation.name}
                />
                <AvatarFallback>{conversation.name[0]}</AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="font-semibold">{conversation.name}</p>
                <p className="text-sm text-gray-500">
                  {conversation.lastMessage}
                </p>
              </div>
            </motion.div>
          ))}
        </ScrollArea>
      </div>

      {/* Zone de discussion principale */}
      <div className="flex-1 flex flex-col">
        {/* En-tête de la conversation */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <h2 className="text-lg font-bold text-[#018a8c]">Dr. Dupont</h2>
          <p className="text-sm text-gray-500">En ligne</p>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4 bg-gray-50">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.sender === "Vous" ? "justify-end" : "justify-start"} mb-4`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg ${
                  message.sender === "Vous"
                    ? "bg-[#018a8c] text-white"
                    : "bg-white text-gray-800"
                }`}
              >
                <p>{message.text}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {message.timestamp}
                </p>
              </div>
            </motion.div>
          ))}
        </ScrollArea>

        {/* Zone de saisie de message */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex gap-2">
            <Input placeholder="Tapez votre message..." className="flex-1" />
            <Button className="bg-[#018a8c] hover:bg-[#016a6c]">Envoyer</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
