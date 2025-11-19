import * as React from "react"
import {
  IconConfetti,
  IconTheater,
  IconDashboard,
  IconMicrophone2,
  IconInnerShadowTop,
  IconMusic,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: IconDashboard,
    },
    {
      title: "Festivals",
      url: "/festivals",
      icon: IconConfetti,
    },
    {
      title: "Stages",
      url: "#",
      icon: IconTheater,
    },
    {
      title: "Performers",
      url: "#",
      icon: IconMicrophone2,
    },
    {
      title: "Shows",
      url: "#",
      icon: IconMusic,
    },
  ]
}

export function AppSidebar({
  onLogin,
  loggedIn,
  ...props
}) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} onLogin={onLogin}  />
      </SidebarFooter>
    </Sidebar>
  );
}
