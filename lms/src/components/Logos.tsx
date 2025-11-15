import React, { JSX } from 'react';
import styles from '../styles/Logo.module.scss';
import { Row, Col, Card } from "antd";
import {BookOutlined,UnlockOutlined,DollarOutlined,CustomerServiceOutlined,TeamOutlined} from "@ant-design/icons";


interface LogoItem {
  icon: JSX.Element;
  text: string;
}
const features = [
  {
    icon: <BookOutlined className={styles.icon} />,
    text: "20k+ Online Courses",
  },
  {
    icon: <UnlockOutlined className={styles.icon} />,
    text: "Lifetime Access",
  },
  {
    icon: <DollarOutlined className={styles.icon} />,
    text: "Value For Money",
  },
  {
    icon: <CustomerServiceOutlined className={styles.icon} />,
    text: "Lifetime Support",
  },
  {
    icon: <TeamOutlined className={styles.icon} />,
    text: "Community Support",
  },
];

const Logos: React.FC = () => {
  return (
    <Row gutter={[16, 16]} justify="center" className={styles.featureRow}>
      {features.map((feature, index) => (
        <Col key={index}>
          <Card className={styles.featureCard}>
            {feature.icon}
            <p className={styles.text}>{feature.text}</p>
          </Card>
        </Col>
      ))}
    </Row>
  );
};
export default Logos;