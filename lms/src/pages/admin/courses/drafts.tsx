"use client"
import React, { useEffect, useState } from "react";
import { Button, Card, Row, Col, Spin, Empty, Typography, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import SidebarMenu from "@/components/Dashboard/SidebarMenu";
import { useRouter } from "next/router";
import { useStoreActions, useStoreState } from "easy-peasy";
import { toast } from "react-toastify";

export default function DraftCoursesPage() {
  const [drafts, setDrafts] = useState([]);
  const isLoading = useStoreState((state: any) => state.loading.isLoading);
  const setLoading = useStoreActions((actions: any) => actions.loading.setLoading);
  const router= useRouter();

  useEffect(() => {
    const fetchDrafts = async () => {
      setLoading(true);
      const res = await fetch('/api/admin/courses/drafts');
      const data = await res.json();
      if (res.ok) setDrafts(data.drafts);
      setLoading(false);
    };

    fetchDrafts();
  }, []);
  

  return(
    <DashboardLayout
          sider={
            <SidebarMenu
              selectedKey="2-2"
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
            <div>Draft comming soon</div>
        </DashboardLayout>
  );
}
