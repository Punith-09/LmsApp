"use client";

import { Form, Input, Button, Typography, Card } from "antd";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "../forms/resolvers/userSchema";
import { useRouter } from "next/router";
import styles from "../styles/Auth.module.scss";
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Link from "next/link";
import { useStoreState,useStoreActions } from "easy-peasy";
import { toast } from 'react-toastify';

const { Title } = Typography;

export default function LoginPage() {
  const router = useRouter();
  const setUser = useStoreActions((actions: any) => actions.auth.setUser);
  const loading = useStoreState((state: any)=> state.loading.isLoading);
  const setLoading = useStoreActions((actions: any) => actions.loading.setLoading);

  const {control,handleSubmit,formState: {errors},} = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

   useGSAP(() => {
    gsap.from('h1', {
      x: 300,
      opacity:0,
      duration: 1.5,
      delay:1,
      stagger: 1,
      ease: 'power1.inOut',
    });
  });

const onSubmit = async (data: any) => {
  setLoading(true);
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const json = await res.json();
    if (!res.ok) {
      toast.error(json.message || "Login failed");
      return;
    }

    setUser(json.user);
    console.log("User from login response:", json.user);

    localStorage.setItem("user", JSON.stringify(json.user));
    localStorage.setItem("token", json.token);

   

    if (json.user.role === "admin") {
      router.push("/admin/dashboard");
    } else if(json.user.role === "subadmin"){
      router.push("/subAdmin/dashboard"); 
    }else if(json.user.role === "instructor"){
      router.push("/instructor/dashboard"); 
    }
    else{
      router.push("/user/courses");
    }
     toast.success("Login successful!");
  } catch (err) {
    console.error(err);
    toast.error("Something went wrong");
  }finally{
    setLoading(false);
  }
};
  return (
    <div className={styles.container}>
      <div className={styles.logcontent}>
        <h1>Unlock Your<br/>Potential</h1>
        <h1 style={{fontSize:'29px', fontWeight:'lighter'}}>Learn, Grow, Succeed</h1>
      </div>
      <div className={styles.logcontainer}>
        <Card className={styles.card}>
        <Title style={{fontSize: '1.5rem',fontWeight: 'bold',marginLeft:"40%"}} level={3}>Login</Title>
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <Form.Item label="Email" validateStatus={errors.email ? "error" : ""} help={errors.email?.message}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Enter your email" />}
            />
          </Form.Item>
          <Form.Item label="Password" validateStatus={errors.password ? "error" : ""} help={errors.password?.message}>
            <Controller
              name="password"
              control={control}
              render={({ field }) => <Input.Password {...field} placeholder="Enter your password" />}
            />
          </Form.Item>

          <Button loading={loading} type="primary" htmlType="submit" block> Login </Button>
          <p>Haven't SignedUp yet? <Link className={styles.link} href={"/signup"}>SignUp</Link></p>
        </Form>
      </Card>
      </div>
      
    </div>
  );
}
