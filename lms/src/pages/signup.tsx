
import React from 'react';
import { Button, Input, Form, Typography, Select, Card } from 'antd';
import { Controller, useForm } from 'react-hook-form';
// import styles from "@/styles/Home.module.scss";
import styles from "@/styles/Auth.module.scss"
import { useRouter } from 'next/router';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterInput, registerSchema } from '@/forms/resolvers/userSchema';
import { useStoreActions } from "easy-peasy";
import { toast } from 'react-toastify';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const { Title } = Typography;
const { Option } = Select;

export default function SignUp() {
  const router = useRouter();
  const setUser = useStoreActions((actions: any) => actions.auth.setUser);
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'user' }, 
  });

   useGSAP(() => {
      gsap.from('h1', {
        x: 200,
        opacity:0,
        duration: 1.5,
        delay:1,
        stagger: 1,
        ease: 'power1.inOut',
      });
    });
  const onSubmit = async (data: RegisterInput) => {
    console.log(data.role);
    try {
      console.log(data);
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({...data,role: "user"}),
      });

      const json = await res.json();
      if (!res.ok) {
        toast.error(json?.error || 'Registration failed');
        return;
      }


      setUser(json.user); 
      localStorage.setItem("user", JSON.stringify(json.user));

      toast.success('Registered successfully');
       router.push("/");
      console.log(json.user.role);

    } catch (err) {
      console.error(err);
      toast.error('An unexpected error occurred');
    }
  };

  return (
    <div className={styles.container}>
          <div className={styles.regContent}>
            <h1>Your Future<br/> Starts Today</h1>
            <h1 style={{fontSize:'29px', fontWeight:'lighter'}}>Let's Build It Together.</h1>
          </div>
          <div className={styles.logcontainer}>
            <Card className={styles.card}>
        <Title level={3}>Register</Title>
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <Form.Item label="Full name" validateStatus={errors.name ? 'error' : ''} help={errors.name?.message}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Your full name" />}
            />
          </Form.Item>

          <Form.Item label="Email" validateStatus={errors.email ? 'error' : ''} help={errors.email?.message}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Your email" />}
            />
          </Form.Item>

          <Form.Item label="Password" validateStatus={errors.password ? 'error' : ''} help={errors.password?.message}>
            <Controller
              name="password"
              control={control}
              render={({ field }) => <Input.Password {...field} placeholder="Password" />}
            />
          </Form.Item>

          <Form.Item label="Confirm Password" validateStatus={errors.confirmPassword ? 'error' : ''} help={errors.confirmPassword?.message}>
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => <Input.Password {...field} placeholder="Confirm password" />}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={isSubmitting}>SignUp</Button>
          </Form.Item>
        </Form>
      </Card>
          </div>
          
        </div>
  );
}