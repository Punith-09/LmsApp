import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Spin } from "antd";

export default function RouteChangeLoader() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  return loading ? (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9999,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        // backgroundColor:'white',
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Spin size="large" />
    </div>
  ) : null;
}
