
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { ThemeToggle } from "./theme-toggle";
import { Bell, Settings } from "lucide-react";

export default  function DashboardNav() {
   
    return (
      

<nav className="w-full  flex justify-center  h-16">
<div className="w-full  flex justify-between items-center p-3 px-5 text-sm">
  <div className="flex gap-5 items-center font-semibold">
    <div className="flex items-center justify-between ">
        <div>
          <h2 className="text-large md:text-3xl font-bold tracking-tight">Welcome, Admin !</h2>
          <p className="text-xs md:text-based text-muted-foreground hidden md:block">Manage your auto repair business efficiently.</p>
        </div>
      
      </div>
   
  </div>
    <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="rounded-full relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
              4
            </span>
          </Button>
          <ThemeToggle />
          <Button variant="outline" size="icon" className="rounded-full">
            <Settings className="h-5 w-5" />
          </Button>
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
            AD
          </div>
        </div>
 
</div>
</nav>)}