import { IconCirclePlusFilled, IconMail } from "@tabler/icons-react";
import { useLocation } from 'react-router'
import { Link } from 'react-router';
import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Primary sidebar navigation with optional quick-create shortcut.
export function NavMain({
  items,
  showQuickCreate = true,
}) {

  let location = useLocation();

  const checkActive = (url) => {
    if(location.pathname === '/' && url === '/')
    {
      console.log("You are in dashboard")
      return true
    }
    else if(url !== '/' && location.pathname.includes(url)) {
      console.log("You are somwhere else")
      return true
    }

    return false
  };

  // console.log(location);

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        {showQuickCreate && (
          <SidebarMenu>
            <SidebarMenuItem className="flex items-center gap-2">
              <SidebarMenuButton
                tooltip="Create Appointment"
                asChild
                className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear">
                <Link to="/appointments">
                  <IconCirclePlusFilled />
                  <span>Create Appointment</span>
                </Link>
              </SidebarMenuButton>
              <Button
                size="icon"
                className="size-8 group-data-[collapsible=icon]:opacity-0"
                variant="outline">
                <IconMail />
                <span className="sr-only">Inbox</span>
              </Button>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild tooltip={item.title} isActive={checkActive(item.url)} >
                <Link to={item.url}  >
                   {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
