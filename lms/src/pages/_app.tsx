import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import { StoreProvider, store } from '../store';
// import Loader from "@/components/Loader";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RouteChangeLoader from "@/components/RouteChangeLoader";

export default function App({ Component, pageProps }: AppProps) {
  return (
  <StoreProvider store={store}>
    <ToastContainer position="top-right" autoClose={3000} />
    {/* <Loader /> */}
    <RouteChangeLoader />
      <Component {...pageProps} />
    
  </StoreProvider>
);
}
