import { Layout, Grid } from "antd";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import React from "react";

const { Sider, Content } = Layout;
const { useBreakpoint } = Grid;

const SIDEBAR_WIDTH = 200;
const COLLAPSED_WIDTH = 80;

interface DashboardLayoutProps {
  sider: React.ReactElement<{
    collapsed: boolean;
    setCollapsed: (val: boolean) => void;
    selectedKey: string;  
    onSelect: (key: string) => void;
    onLogout: () => void;
  }>;
  children: React.ReactNode;
}

export default function DashboardLayout({sider,children,}: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState<boolean>(()=>{
    const saved = localStorage.getItem("sidebarCollapsed");
    return saved === "true";
  });
  const screens = useBreakpoint();
  useEffect(() => {
  localStorage.setItem("sidebarCollapsed", String(collapsed));
}, [collapsed]);

  // useEffect(() => {
  //   if (!screens.md) {
  //     setCollapsed(true);
  //   }
  // }, [screens]);

  const currentSidebarWidth = collapsed ? COLLAPSED_WIDTH : SIDEBAR_WIDTH;

  return (
    <Layout style={{ minHeight: "100vh", overflow: "hidden" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        trigger={null}
        width={SIDEBAR_WIDTH}
        collapsedWidth={COLLAPSED_WIDTH}
        style={{
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          background: "#fff",
          zIndex: 100,
          transition: "all 0.3s ease",
          boxShadow: "2px 0 8px rgba(0, 0, 0, 0.05)",
        }}
      >
        {React.cloneElement(sider, {
          collapsed,
          setCollapsed,
        })}
      </Sider>

      <Layout
        style={{
          marginLeft: currentSidebarWidth,
          transition: "margin-left 0.3s ease",
          background: "#e2e2e2ff",
          padding: "24px",
          paddingTop: "5px",
        }}
      >
        <Navbar />
        <Content style={{ marginTop: 16 }}>{children}</Content>
      </Layout>
    </Layout>
  );
}
