"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Search, UserRound, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface AgentOption {
  id: string;
  fullName: string;
  email: string;
}

interface AgentAssigneeSelectProps {
  agents: AgentOption[];
  defaultValue?: string;
}

export function AgentAssigneeSelect({
  agents,
  defaultValue = "",
}: AgentAssigneeSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(defaultValue);
  const rootRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedAgent = agents.find((agent) => agent.id === selectedId);
  const normalizedQuery = query.trim().toLocaleLowerCase("tr-TR");

  const filteredAgents = agents.filter((agent) => {
    if (!normalizedQuery) {
      return true;
    }

    return (
      agent.fullName.toLocaleLowerCase("tr-TR").includes(normalizedQuery) ||
      agent.email.toLocaleLowerCase("tr-TR").includes(normalizedQuery)
    );
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      searchInputRef.current?.focus();
    }
  }, [open]);

  function closeMenu() {
    setOpen(false);
    setQuery("");
  }

  return (
    <div ref={rootRef} className="relative z-30 space-y-3">
      <div className="space-y-1">
        <label className="text-sm font-semibold text-[#0F172A]">Atanan Danışman</label>
        <p className="text-xs text-[#64748B]">
          Birkaç harf yazarak danışman arayabilirsiniz.
        </p>
      </div>

      <input type="hidden" name="assignedAgentId" value={selectedId} />

      <div className="relative">
        <Button
          type="button"
          variant="outline"
          aria-expanded={open}
          onClick={() => {
            setOpen((current) => !current);
            if (open) {
              setQuery("");
            }
          }}
          className="h-11 w-full justify-between rounded-xl px-3 font-normal"
        >
          <span
            className={cn(
              "truncate text-left",
              !selectedAgent && "text-muted-foreground"
            )}
          >
            {selectedAgent ? selectedAgent.fullName : "Danışman seçin"}
          </span>
          <ChevronDown
            className={cn(
              "ml-2 h-4 w-4 shrink-0 text-[#64748B] transition-transform",
              open && "rotate-180"
            )}
          />
        </Button>

        {open && (
          <div className="absolute left-0 top-full z-50 mt-2 w-full overflow-hidden rounded-2xl border border-[#D7E0EA] bg-white shadow-[0_18px_48px_rgba(15,23,42,0.18)]">
            <div className="border-b border-[#E2E8F0] p-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  ref={searchInputRef}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Danışman ara..."
                  className="h-10 rounded-xl bg-white pl-9"
                />
              </div>
            </div>

            <div className="max-h-72 space-y-1 overflow-y-auto p-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedId("");
                  closeMenu();
                }}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition-colors hover:bg-[#F8FAFC]"
              >
                <span className="flex items-center gap-2 text-[#475569]">
                  <X className="h-4 w-4" />
                  Atamayı temizle
                </span>
                {!selectedId && <Check className="h-4 w-4 text-[#1D4ED8]" />}
              </button>

              {filteredAgents.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[#CBD5E1] px-3 py-6 text-center text-sm text-muted-foreground">
                  Aramanıza uygun danışman bulunamadı.
                </div>
              ) : (
                filteredAgents.map((agent) => (
                  <button
                    key={agent.id}
                    type="button"
                    onClick={() => {
                      setSelectedId(agent.id);
                      closeMenu();
                    }}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition-colors hover:bg-[#F8FAFC]"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-sm font-medium text-[#0F172A]">
                        <UserRound className="h-4 w-4 shrink-0 text-[#64748B]" />
                        <span className="truncate">{agent.fullName}</span>
                      </div>
                      <p className="truncate pl-6 text-xs text-muted-foreground">
                        {agent.email}
                      </p>
                    </div>
                    {selectedId === agent.id && (
                      <Check className="h-4 w-4 shrink-0 text-[#1D4ED8]" />
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
