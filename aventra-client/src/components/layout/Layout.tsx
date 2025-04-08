import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import NavbarComponent from "./Navbar";
import Footer from "./Footer";

const Layout = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {

  return (
    <div
      className={cn(
        "flex flex-col justify-between",
        className
      )}
    >
       <NavbarComponent />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;