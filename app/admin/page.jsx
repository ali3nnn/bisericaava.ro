import { AdminPage } from "@/src/views/admin";

export const metadata = {
  title: "Administrare",
  robots: { index: false, follow: false },
};

export default function Admin() {
  return <AdminPage />;
}
