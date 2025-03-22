import { createFileRoute, Link } from "@tanstack/react-router";

import logo from "@/images/logo.png";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import videoBackground from "@/videos/background.mp4";
import {
  Laptop,
  Stethoscope,
  Settings,
  /*Rocket,
  ShieldCheck,
  HeartPulse,*/
} from "lucide-react";
export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen text-center p-6 overflow-hidden">
      {/* Vidéo en arrière-plan */}
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src={videoBackground} type="video/mp4" />
        Votre navigateur ne supporte pas la vidéo.
      </video>

      {/* Overlay sombre pour améliorer la lisibilité */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/30 z-10"></div>

      {/* Contenu principal */}
      <div className="relative z-20">
        {/* Section Hero */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center justify-center space-y-6"
        >
          <img
            src={logo}
            alt="Eniazou Logo"
            className="h-60 w-60 animate-pulse"
          />
          <h1 className="text-4xl font-bold text-white max-w-2xl leading-tight">
            Bienvenue sur la plateforme de gestion médicale de la{" "}
            <span className="text-[#018a8cff]">Clinique Médicale Eniazou</span>
          </h1>
          <p className="text-lg text-gray-200 max-w-2xl">
            Optimisez vos processus médicaux avec notre solution tout-en-un.
          </p>
          <Link to="/login">
            <Button className="w-24 bg-[#018a8cff] hover:bg-[#016a6cff] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105">
              Commencer
            </Button>
          </Link>
        </motion.div>

        {/* Section Features */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="w-full max-w-6xl mt-16"
        >
          <div className="grid auto-rows-min gap-6 md:grid-cols-3">
            {/* Carte 1 : Espace Numérique */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex justify-center mb-4">
                <Laptop className="h-12 w-12 text-[#018a8cff]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Espace Numérique
              </h2>
              <p className="text-gray-600">
                Gestion centralisée et sécurisée de vos données médicales.
              </p>
            </motion.div>

            {/* Carte 2 : Excellence Médicale */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex justify-center mb-4">
                <Stethoscope className="h-12 w-12 text-[#018a8cff]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Excellence Médicale
              </h2>
              <p className="text-gray-600">
                Des outils conçus pour améliorer la qualité des soins.
              </p>
            </motion.div>

            {/* Carte 3 : Optimisation */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex justify-center mb-4">
                <Settings className="h-12 w-12 text-[#018a8cff]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Optimisation
              </h2>
              <p className="text-gray-600">
                Simplifiez vos processus et gagnez en efficacité.
              </p>
            </motion.div>
          </div>
        </motion.div>

       
      </div>
    </div>
  );
}
