import { useRouter } from "next/router";
import Meta from "../components/Meta";
import Navbar from "../components/Navbar";

const hideNavPages = ["/success", "/login"];
export default function AppLayout({ children }) {
  const router = useRouter();
  const hideNav = hideNavPages.includes(router.asPath);
  return (
    <>
      <Meta />
      {hideNav ? null : <Navbar />}
      {children}
    </>
  );
}
