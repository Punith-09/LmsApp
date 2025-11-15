import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import DashboardOverview from "@/components/Dashboard/DashboardOverview";
import SidebarMenu from "@/components/Dashboard/SidebarMenu";
import { useStoreState, useStoreActions } from "easy-peasy";
import { useRouter } from "next/router";

export default function AdminDashboardPage() {
  const router = useRouter();
  const user = useStoreState((state: any) => state.auth.user);
  const setUser = useStoreActions((actions: any) => actions.auth.setUser);

  // const handleLogout = () => {
  //   setUser(null);
  //   localStorage.removeItem("token");
  //   router.push("/");
  // };

  return (
    <DashboardLayout
      sider={
        <SidebarMenu
          selectedKey="1"
          onSelect={(key) => {
            if (key === "1") router.push("/admin/dashboard");
            if (key === "2-1") router.push("/admin/courses/courses");
            if (key === "2-2") router.push("/admin/courses/drafts");
            if (key === "3") router.push("/admin/users");
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

