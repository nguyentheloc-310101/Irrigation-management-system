import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import OverviewPage from "@/components/Dashboard/OverView";

export const metadata: Metadata = {
  title:
    "Irrigation System",
  description: "This is Next.js Irrigation System",
};

export default function Home() {
  return (
    <>
      <DefaultLayout>
        <OverviewPage />
      </DefaultLayout>
    </>
  );
}
