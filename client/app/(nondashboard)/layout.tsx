
import Navbar from "@/components/Navbar";
import { getAuthUser } from "@/lib/actions/user";
import { NAVBAR_HEIGHT } from "@/lib/constants";
// import { usePathname, useRouter } from "next/navigation";
// import React, { useEffect, useState } from "react";

const Layout = async ({ children }: { children: React.ReactNode }) => {
    const authUser = await getAuthUser()

    //   const router = useRouter();
    //   const pathname = usePathname();
    //   const [isLoading, setIsLoading] = useState(true);
    // console.log(authUser)
    //   useEffect(() => {
    //     if (authUser) {
    //       const userRole = authUser.userRole?.toLowerCase();
    //       if (
    //         (userRole === "manager" && pathname.startsWith("/search")) ||
    //         (userRole === "manager" && pathname === "/")
    //       ) {
    //         router.push("/managers/properties", { scroll: false });
    //       } else {
    //         setIsLoading(false);
    //       }
    //     }
    //   }, [authUser, router, pathname]);

    //   if (authLoading || isLoading) return <>Loading...</>;

    return (
        <div className="h-full w-full">
            <Navbar authUser={authUser?.data} />
            <main
                className={`h-full flex w-full flex-col`}
                style={{ paddingTop: `${NAVBAR_HEIGHT}px` }}
            >
                {children}
            </main>
        </div>
    );
};

export default Layout;