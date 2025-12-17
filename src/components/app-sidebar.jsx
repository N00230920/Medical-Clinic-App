import * as React from "react";
import {
  IconConfetti,
  IconTheater,
  IconDashboard,
  IconInnerShadowTop,
  IconListCheck,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { useLocation } from "react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Home",
      url: "/",
      icon: IconDashboard,
      authRequired: true,
    },
    {
      title: "Doctors",
      url: "/doctors",
      icon: IconConfetti,
    },
    {
      title: "Patients",
      url: "/patients",
      icon: IconTheater,
    }
  ],
  examples: [
    {
      name: "Forms & Validation",
      url: "/forms",
      icon: IconListCheck,
    },
  ],
};

export function AppSidebar({ ...props }) {
  const location = useLocation();
  const { user, token } = useAuth();

  console.log(location);

  let message = location.state?.message;
  let type = location.state?.type;

  useEffect(() => {
    if (message) {
      if (type === 'error') {
        toast.error(message);
      }
      else if (type === 'success') {
        toast.success(message);
      } else {
        toast(message);
      }
    }
  }, [message]);

  const navItems = data.navMain.filter(
    (item) => !item.authRequired || token
  );

  return (
    <>
      <Toaster position="top-center" richColors />
      <Sidebar collapsible="offcanvas" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="data-[slot=sidebar-menu-button]:!p-1.5"
              >
                <a href="/">
                  <IconInnerShadowTop className="!size-5" />
                  <span className="text-base font-semibold">Acme Inc.</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={navItems} showQuickCreate={!!token} />
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={user || data.user} />
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
