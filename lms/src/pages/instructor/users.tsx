import { useEffect, useState } from "react";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import UsersTable from "@/components/Dashboard/UsersTable";
import SidebarMenu from "@/components/Dashboard/SidebarMenu";
import { useRouter } from "next/router";
import { useStoreActions, useStoreState } from "easy-peasy";
import { message } from "antd";
import { toast } from "react-toastify";

export default function UsersPage() {
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const loading = useStoreState((state: any) => state.loading.isLoading);
  const setLoading = useStoreActions((actions: any) => actions.loading.setLoading);
  const setUser = useStoreActions((actions: any) => actions.auth.setUser);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      // const token = localStorage.getItem("token");
      let token: string | null = null;
         if (typeof window !== "undefined") {
        token = localStorage.getItem("token");
      }
      if (!token) {
        message.error("Unauthorized! Please log in again.");
        router.push("/login");
        return;
      }

      const res = await fetch("/api/instructor/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const json = await res.json();
        message.error(json.message || "Failed to fetch students");
        return;
      }

      const data = await res.json();
    const onlyUsers = data.filter((user: any) => user.role === "user");
        setStudents(onlyUsers);
    
      
    } catch (err) {
      console.error(err);
      message.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

const handleDelete = async (userId: string) => {
  setLoading(true);
  try {
    // const token = localStorage.getItem("token");
     let token: string | null = null;
      if (typeof window !== "undefined") {
        token = localStorage.getItem("token");
      }
    if (!token) {
      toast.error("Unauthorized! Please log in again.");
      router.push("/login");
      return;
    }

    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const json = await res.json();
      toast.error(json.message || "Failed to delete user");
      return;
    }

    toast.success("User deleted successfully");
    fetchStudents(); 
  } catch (err) {
    console.error(err);
    toast.error("Something went wrong");
  } finally {
    setLoading(false);
  }
};

 
  return (
    <DashboardLayout
      sider={
              <SidebarMenu
                selectedKey="3"
                onSelect={(key) => {
                  if (key === "1") router.push("/instructor/dashboard");
                  if (key === "2-1") router.push("/instructor/courses/courses");
                  if (key === "2-2") router.push("/admin/courses/drafts");
                  if (key === "3") router.push("/instructor/users");
                  if (key === "4") router.push("/admin/settings");
                }}
                collapsed={false}
                setCollapsed={() => {}}
              />
            }
    >

      <UsersTable loading={loading} data={students} onDelete={handleDelete}/>
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
