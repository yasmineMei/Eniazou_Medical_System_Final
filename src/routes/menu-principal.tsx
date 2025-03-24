import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { motion } from "framer-motion";

export const Route = createFileRoute("/menu-principal")({
  component: RouteComponent,
});

const menuItems = [
  { title: "OPD", icon: "🏥", path: "/registration-opd" },
  { title: "IPD", icon: "🛏️", path: "/registration-ipd" },
  {
    title: "Rendez-vous",
    icon: "📅",
    path: "/dashboard-appointment",
  },
  { title: "Laboratoire", icon: "🔬", path: "/lab/lab" },
  { title: "Radiologie", icon: "📷", path: "/radiology/radiology" },
  { title: "Infirmier", icon: "💉", path: "/nurse/nurse" },
  { title: "Médecin", icon: "👨‍⚕️", path: "/dashboard-doctor" },
  { title: "Stock Médicale", icon: "💊", path: "/medical-stock/medical-stock" },
  { title: "Administrateur", icon: "👨‍💼", path: "/dashboard" },
] as const;

type MenuTitle = (typeof menuItems)[number]["title"];

function RouteComponent() {
  const role = localStorage.getItem("role") || "";
  if (!role || role === "") {
    // Rediriger vers la page de connexion si le rôle n'est pas autorisé
    return <Navigate to="/login" />;
  }

  let menu = [...menuItems];

  if (role === "doctor") {
    const toKeep: MenuTitle[] = ["Médecin", "Laboratoire", "Radiologie", "IPD"];
    menu = menu.filter((x) => toKeep.includes(x.title));
  } else if (role === "nurse") {
    const toKeep: MenuTitle[] = ["Infirmier", "Laboratoire", "IPD"];
    menu = menu.filter((x) => toKeep.includes(x.title));
  } else if (role === "receptionist") {
    const toKeep: MenuTitle[] = ["OPD", "Rendez-vous"];
    menu = menu.filter((x) => toKeep.includes(x.title));
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      {/* Titre du menu */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-4xl font-bold text-[#018a8cff] mb-8 text-center"
      >
        Menu Principal
      </motion.h1>

      {/* Grille des fonctionnalités */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl"
      >
        {menu.map((item, index) => (
          <Link to={item.path.toString()} key={index}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gray-50 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-100 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <div className="text-5xl mb-4 text-gray-700">{item.icon}</div>
              <h2 className="text-xl font-semibold text-[#018a8cff]">
                {item.title}
              </h2>
            </motion.div>
          </Link>
        ))}
      </motion.div>
    </div>
  );
}
