"use client";
import React from "react";
import { Spin } from "antd";
import { useStoreState } from "easy-peasy";

const Loader = () => {
  const isLoading = useStoreState((state: any) => state.loading.isLoading);

  if (!isLoading) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "rgba(255, 255, 255, 0.6)",
        zIndex: 9999,
      }}
    >
      <Spin size="large" tip="Loading..." />
    </div>
  );
};

export default Loader;
