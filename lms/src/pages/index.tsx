"use client";

import { Layout, Button } from "antd";
import { useRouter } from "next/router";
import styles from "@/styles/Home.module.scss";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Logos from "@/components/Logos";
import ExploreCourses from "@/components/ExploreCourses";

const { Content } = Layout;

export default function Home() {
  // const router = useRouter();

  return (
    <Layout className={styles.containerr}>
      <Navbar />

      <Content className={styles.content}>
        <div className={styles.content1}>
            <span className={styles.titleprimary}>Grow Your Skills to Advance</span>
            <span className={styles.titlesecondary}> Your Career path</span>
        </div>
        <div className={styles.spacing}>.</div>
      </Content>
      <Logos />
      <ExploreCourses />
      <Footer />
    </Layout>
  );
  
}
