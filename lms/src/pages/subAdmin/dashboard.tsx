import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import DashboardOverview from "@/components/Dashboard/DashboardOverview";
import SidebarMenu from "@/components/Dashboard/SidebarMenu";
import { useStoreState, useStoreActions } from "easy-peasy";
import { useRouter } from "next/router";

export default function SubAdminDashboard() {
  const router = useRouter();
  const user = useStoreState((state: any) => state.auth.user);
  const setUser = useStoreActions((actions: any) => actions.auth.setUser);

  return (
    <DashboardLayout
      sider={
        <SidebarMenu
          selectedKey="1"
          onSelect={(key) => {
            if (key === "1") router.push("/admin/dashboard");
            if (key === "2") router.push("/admin/courses");
            if (key === "3") router.push("/admin/users");
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

