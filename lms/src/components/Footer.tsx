import React from "react";
import { useRouter } from "next/router";
import styles from "../styles/Footer.module.scss";
const Footer= () => {
  const router = useRouter();
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        
        <div className={styles.logoSection}>
          <div className={styles.logo}>LMS</div>
          <h2 className={styles.title}>Virtual Courses</h2>
          <p className={styles.description}>
            A learning platform to help you grow smarter. Learn anything, anytime, anywhere.
          </p>
        </div>
        
        <div className={styles.linksSection}>
          <h3 className={styles.heading}>Quick Links</h3>
          <ul className={styles.list}>
            <li onClick={() => router.push("/")} className={styles.listItem}>Home</li>
            <li onClick={() => router.push("/")} className={styles.listItem}>Courses</li>
            <li onClick={() => router.push("/login")} className={styles.listItem}>Login</li>
            <li onClick={() => router.push("/")} className={styles.listItem}>My Profile</li>
          </ul>
        </div>
        
        <div className={styles.linksSection}>
          <h3 className={styles.heading}>Explore Categories</h3>
          <ul className={styles.list}>
            <li className={styles.listItem}>Web Development</li>
            <li className={styles.listItem}>AI/ML</li>
            <li className={styles.listItem}>Data Science</li>
            <li className={styles.listItem}>UI/UX Design</li>
          </ul>
        </div>
      </div>
      
      <div className={styles.bottomBar}>
        © {new Date().getFullYear()} LearnAI. All rights reserved.
      </div>
    </footer>
   
  );
};
export default Footer;