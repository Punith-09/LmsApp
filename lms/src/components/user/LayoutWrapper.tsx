"use client";

import { Layout } from "antd";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useStoreState } from "easy-peasy";

const { Content } = Layout;

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const user = useStoreState((state: any)=>state.auth.user);
  return (
    <>
    {user?.role !== 'admin'?(
      <Layout style={{ minHeight: "100vh" }}>
      <Navbar />
      <Content >{children}</Content>
      <Footer />
    </Layout>
    ):(
      <Content >{children}</Content>
    )}
    </>
    
  );
}
