import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import DashboardOverview from "@/components/Dashboard/DashboardOverview";
import SidebarMenu from "@/components/Dashboard/SidebarMenu";
import { useStoreState, useStoreActions } from "easy-peasy";
import { useRouter } from "next/router";

export default function InstructorDashboard() {
  const router = useRouter();
  const user = useStoreState((state: any) => state.auth.user);
  const setUser = useStoreActions((actions: any) => actions.auth.setUser);

  return (
    <DashboardLayout
      sider={
        <SidebarMenu
          selectedKey="1"
          onSelect={(key) => {
            if (key === "1") router.push("/instructor/dashboard");
            if (key === "2-1") router.push("/instructor/courses/courses");
            if (key === "2-2") router.push("/instructor/courses/drafts");
            if (key === "3") router.push("/instructor/users");
            if (key === "4") router.push("/admin/settings");
          }}
          collapsed={false}
          setCollapsed={() => {}}
        />
      }
    >
      <DashboardOverview user={user} />
    </DashboardLayout>
  );
}

/* =======================================
   FIX FOR VERCEL BUILD
   DISABLE SSG → FORCE SSR
======================================= */
export const getServerSideProps = async () => {
  return { props: {} };
};


