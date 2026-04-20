"use client";

import Link from "next/link";
import { LucideIcon, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type TableRowAction = {
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
  href?: string;
  isDestructive?: boolean;
  isMobileOnly?: boolean; // If true, only shows in the dropdown, not as an inline icon
};

interface TableRowActionsProps {
  actions: TableRowAction[];
}

export function TableRowActions({ actions }: TableRowActionsProps) {
  const inlineActions = actions.filter((a) => !a.isMobileOnly);

  return (
    <div className="flex items-center justify-end">
      {/* Desktop Inline Actions */}
      <div className="hidden md:flex items-center gap-1 mr-1">
        <TooltipProvider delayDuration={300}>
          {inlineActions.map((action, index) => {
            const Icon = action.icon;
            
            const buttonContent = (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={action.onClick}
                className={cn(
                  "h-8 w-8 transition-colors text-slate-500 hover:text-slate-900",
                  action.isDestructive && "hover:bg-rose-50 hover:text-rose-600 focus:ring-rose-200"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="sr-only">{action.label}</span>
              </Button>
            );

            return (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  {/* Tooltip trigger requires standard wrapper if link */}
                  {action.href ? (
                    <Link href={action.href} passHref>
                      {buttonContent}
                    </Link>
                  ) : (
                    buttonContent
                  )}
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="font-medium">{action.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </div>

      {/* Mobile Or Overflow Dropdown Menu */}
      <div className="flex md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-slate-100 h-8 w-8 text-[#475569]">
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {actions.map((action, index) => {
              const Icon = action.icon;
              
              if (action.href) {
                return (
                  <DropdownMenuItem 
                    key={index} 
                    render={<Link href={action.href} />}
                    className={cn(action.isDestructive && "text-destructive font-medium focus:text-destructive")}
                  >
                    <Icon className="mr-2 h-4 w-4" /> {action.label}
                  </DropdownMenuItem>
                );
              }

              return (
                <DropdownMenuItem 
                  key={index} 
                  onClick={action.onClick}
                  className={cn(action.isDestructive && "text-destructive font-medium focus:text-destructive cursor-pointer")}
                >
                  <Icon className="mr-2 h-4 w-4" /> {action.label}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
