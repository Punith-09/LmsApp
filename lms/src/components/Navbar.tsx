"use client";

import React, { useState, useEffect } from "react";
import { useStoreState, useStoreActions } from "easy-peasy";
import {Layout,Menu,Dropdown,Button,Input,Badge,Space,Drawer,} from "antd";
import {UserOutlined,SearchOutlined,BellOutlined,ShoppingCartOutlined,LogoutOutlined,MenuOutlined,} from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "@/styles/Navbar.module.scss";
import { toast } from "react-toastify";

const { Header } = Layout;

const Navbar = () => {
  const user = useStoreState((state: any) => state.auth.user);
  const setUser = useStoreActions((actions: any) => actions.auth.setUser);
  const setLoading = useStoreActions((actions: any) => actions.loading.setLoading);
  const router = useRouter();

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false); 
  const cartItems = useStoreState((state: any) => state.cart.items);
const cartCount = cartItems.length;


  const handleLogout = async () => {
    setLoading(true);
    try {
      setUser(null);
      localStorage.removeItem("token");
      setTimeout(() => {
        router.push("/");
      }, 800);
      toast.success("Logged Out successfully!");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const profileMenu = (
    <Menu className={styles.menu1}>
      <Menu.Item key="profile" className={styles.menu}>
        <Link href="">
          <UserOutlined style={{ paddingRight: "5px", fontSize: "13px" }} />
          Profile
        </Link>
      </Menu.Item>
      <Menu.Item key="logout" onClick={handleLogout} className={styles.menu}>
        <LogoutOutlined style={{ paddingRight: "5px", fontSize: "13px" }} /> Logout
      </Menu.Item>
    </Menu>
  );

  const myLearningMenu = (
    <Menu>
      <Menu.Item key="profile" className={styles.navCard}>
        <Link href="/">AI/ML</Link>
      </Menu.Item>
    </Menu>
  );

  const isAdminType = ["admin", "subadmin", "instructor"].includes(user?.role);

  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize(); 
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const NavLinks = (
    <>
      <Link className={styles.link} href="/">Home</Link>
      <Link className={styles.link} href="/user/courses">Courses</Link>
      <Link className={styles.link} href="/">About</Link>
      <Link className={styles.link} href="/">Contact</Link>
      {user && (
        // <Dropdown overlay={myLearningMenu} trigger={["hover"]}>
          <Link className={styles.link} href="/user/myLearnings">My Learnings</Link>
        // </Dropdown>
      )}
    </>
  );
console.log("hello");
  return (
    <>
      {isAdminType ? (
        <div className={styles.adminNav}>
          <h2>
            {user?.role === "admin"
              ? "Admin"
              : user?.role === "subadmin"
              ? "Sub Admin"
              : "Instructor"}
          </h2>
          <Space size="large">
            <Badge size="default" count={3} style={{ backgroundColor: "#9600aaff" }}>
              <BellOutlined style={{ fontSize: "18px", color: "#555" }} />
            </Badge>
            <Dropdown overlay={profileMenu} trigger={["hover"]}>
              <Button
                size="large"
                shape="circle"
                icon={<UserOutlined />}
                style={{ marginLeft: "10px" }}
              />
            </Dropdown>
            <span>{user?.name}</span>
          </Space>
        </div>
      ) : (
        <Header className={styles.navbar}>
          <div className={styles.logo}>LMS</div>

         
          {!isMobile ? (
            <div className={styles.links}>{NavLinks}</div>
          ) : (
            <div style={{ display: "flex", marginLeft: "auto", gap: "15px" }}>
             
              {user && (
                <SearchOutlined
                  onClick={() => setSearchVisible((prev) => !prev)}
                  style={{ fontSize: 22, color: "#fff", cursor: "pointer" }}
                />
              )}
              <MenuOutlined
                onClick={() => setDrawerVisible(true)}
                style={{ fontSize: 24, color: "#fff" }}
              />
            </div>
          )}

          {!isMobile && user && (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: 400,
                  border: "1px solid #d9d9d9",
                  backgroundColor: "rgba(255, 255, 255, 0.027)",
                  borderRadius: 20,
                  padding: "4px 8px",
                  marginLeft: 20,
                }}
              >
                <Input
                  placeholder="Search courses"
                  variant="borderless"
                  style={{ flex: 1, color: "white" }}
                  className="custom-placeholder"
                />
                <SearchOutlined
                  style={{
                    fontSize: 20,
                    color: "#ffffffff",
                    cursor: "pointer",
                    padding: "4px",
                  }}
                />
              </div>

              <Space size="large">
                <Badge size="default" count={cartCount} style={{ backgroundColor: "#9600aaff"}}>
                  <ShoppingCartOutlined
                    style={{ fontSize: "20px", color: "#ffffffff", marginLeft: "10px" }}
                    onClick={() => router.push("/user/cart")}
                  />
                </Badge>

                <Badge size="default" count={3} style={{ backgroundColor: "#9600aaff" }}>
                  <BellOutlined
                    style={{ fontSize: "20px", color: "#ffffffff", marginLeft: "10px" }}
                    onClick={() => router.push("/userCart")}
                  />
                </Badge>
                <Dropdown overlay={profileMenu} trigger={["hover"]}>
                  <Button shape="circle" icon={<UserOutlined />} />
                </Dropdown>
              </Space>
            </>
          )}

          {!user && !isMobile && (
            <div className={styles.navButtons}>
              <button className={styles.buttons} onClick={() => router.push("/signup")}>
                SignUp
              </button>
              <button className={styles.buttons} onClick={() => router.push("/login")}>
                Login
              </button>
            </div>
          )}
        </Header>
      )}

      {isMobile && searchVisible && (
        <div
          style={{
            padding: "10px 16px",
            background: "rgba(255,255,255,0.05)",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Input
            placeholder="Search courses"
            style={{
              width: "100%",
              maxWidth: "500px",
              borderRadius: "20px",
              border: "1px solid #ccc",
              padding: "8px 16px",
              marginTop:'90px',
            }}
          />
        </div>
      )}

      <Drawer
        title="Menu"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
      >
        
        <div className={styles.mobileLinks}>
          {NavLinks}
          {!user && (
            <>
              <Button type="link" onClick={() => router.push("/signup")}>Sign Up</Button>
              <Button type="link" onClick={() => router.push("/login")}>Login</Button>
            </>
          )}
          {user && (
            <Dropdown overlay={profileMenu} trigger={["click"]}>
              <Button type="link">Account</Button>
            </Dropdown>
          )}
        </div>
      </Drawer>
    </>
  );
};

export default Navbar;
