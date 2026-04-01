
import Navbar from "@/components/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import Sidebar from "@/components/AppSidebar";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import { getAuthUser } from "@/lib/actions/user";

export const dynamic = 'force-dynamic';
const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {

    const authUser = await getAuthUser()

    //   useEffect(() => {
    //     if (authUser) {
    //       const userRole = authUser.userRole?.toLowerCase();
    //       if (
    //         (userRole === "manager" && pathname.startsWith("/tenants")) ||
    //         (userRole === "tenant" && pathname.startsWith("/managers"))
    //       ) {
    //         router.push(
    //           userRole === "manager"
    //             ? "/managers/properties"
    //             : "/tenants/favorites",
    //           { scroll: false }
    //         );
    //       } else {
    //         setIsLoading(false);
    //       }
    //     }
    //   }, [authUser, router, pathname]);


    return (
        <SidebarProvider>
            <div className="min-h-screen w-full bg-primary-100">
                <Navbar authUser={authUser?.data} />
                <div style={{ marginTop: `${NAVBAR_HEIGHT}px` }}>
                    <main className="flex">
                        <Sidebar userType={authUser?.data?.role?.toLowerCase()} />
                        <div className="grow transition-all duration-300 p-5">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
};

export default DashboardLayout;