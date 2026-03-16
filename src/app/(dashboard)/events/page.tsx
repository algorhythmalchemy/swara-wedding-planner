"use client";

import { useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { useWeddingStore } from "@/store/wedding-store";
import type { EventPhase, WeddingEvent } from "@/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Clock,
  CheckCircle2,
  Circle,
  Sparkles,
  Sun,
  Moon,
  Star,
} from "lucide-react";

const PHASE_LABELS: Record<EventPhase, string> = {
  "pre-wedding": "Pre-Wedding",
  "wedding-day": "Wedding Day",
  "post-wedding": "Post-Wedding",
};

const PHASE_ICONS: Record<EventPhase, React.ReactNode> = {
  "pre-wedding": <Moon className="size-4" />,
  "wedding-day": <Sun className="size-4" />,
  "post-wedding": <Star className="size-4" />,
};

type TabFilter = "all" | EventPhase;

function formatEventDate(dateStr?: string): string | null {
  if (!dateStr) return null;
  try {
    return format(parseISO(dateStr), "EEEE, MMMM d, yyyy");
  } catch {
    return dateStr;
  }
}

function formatEventTime(timeStr?: string): string | null {
  if (!timeStr) return null;
  try {
    const today = new Date().toISOString().split("T")[0];
    return format(parseISO(`${today}T${timeStr}`), "h:mm a");
  } catch {
    return timeStr;
  }
}

function EventCard({
  event,
  onToggle,
}: {
  event: WeddingEvent;
  onToggle: (id: string) => void;
}) {
  const isWeddingDay = event.phase === "wedding-day";
  const formattedDate = formatEventDate(event.date);
  const formattedTime = formatEventTime(event.time);

  return (
    <div className="relative flex gap-4 pb-8 last:pb-0 group">
      {/* Timeline connector line */}
      <div className="flex flex-col items-center">
        <div
          className={`mt-1 flex size-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
            event.isCompleted
              ? "border-green-600 bg-green-50"
              : isWeddingDay
                ? "border-gold bg-turmeric/20"
                : "border-vermillion/40 bg-cream"
          }`}
        >
          {event.isCompleted ? (
            <CheckCircle2 className="size-4 text-green-600" />
          ) : isWeddingDay ? (
            <Sparkles className="size-4 text-gold" />
          ) : (
            <Circle className="size-4 text-vermillion/50" />
          )}
        </div>
        {/* Vertical line to next event */}
        <div className="w-0.5 flex-1 bg-border group-last:hidden" />
      </div>

      {/* Event card */}
      <Card
        className={`flex-1 transition-all ${
          event.isCompleted
            ? "opacity-60"
            : isWeddingDay
              ? "ring-2 ring-gold/50 shadow-md shadow-turmeric/10"
              : ""
        }`}
      >
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <CardTitle
                  className={
                    event.isCompleted ? "line-through text-muted-foreground" : ""
                  }
                >
                  {event.name}
                </CardTitle>
                {isWeddingDay && !event.isCompleted && (
                  <Badge className="bg-turmeric text-maroon border-gold/30">
                    <Sparkles className="size-3" />
                    Wedding Day
                  </Badge>
                )}
                <Badge
                  variant="outline"
                  className={event.isCompleted ? "text-green-600 border-green-200" : ""}
                >
                  {PHASE_ICONS[event.phase]}
                  {PHASE_LABELS[event.phase]}
                </Badge>
              </div>

              {/* Kannada / Telugu names */}
              {(event.nameKannada || event.nameTelugu) && (
                <p className="text-sm text-muted-foreground">
                  {event.nameKannada && (
                    <span className="mr-3">{event.nameKannada}</span>
                  )}
                  {event.nameTelugu && <span>{event.nameTelugu}</span>}
                </p>
              )}
            </div>

            {/* Completion checkbox */}
            <div className="flex items-center gap-2 pt-0.5">
              <Checkbox
                checked={event.isCompleted}
                onCheckedChange={() => onToggle(event.id)}
                aria-label={`Mark ${event.name} as ${event.isCompleted ? "incomplete" : "complete"}`}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Date and time row */}
          {(formattedDate || formattedTime) && (
            <div className="flex flex-wrap items-center gap-4 text-sm">
              {formattedDate && (
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Sun className="size-3.5 text-turmeric" />
                  {formattedDate}
                </span>
              )}
              {formattedTime && (
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="size-3.5 text-vermillion" />
                  {formattedTime}
                </span>
              )}
            </div>
          )}

          {/* Location */}
          {event.location && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-3.5 text-maroon" />
              {event.location}
            </div>
          )}

          {/* Description */}
          {event.description && (
            <>
              <Separator />
              <p
                className={`text-sm leading-relaxed ${
                  event.isCompleted ? "text-muted-foreground" : "text-foreground/80"
                }`}
              >
                {event.description}
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function EventsPage() {
  const events = useWeddingStore((s) => s.events);
  const toggleEventComplete = useWeddingStore((s) => s.toggleEventComplete);

  const [activeTab, setActiveTab] = useState<TabFilter>("all");

  const sortedEvents = useMemo(
    () => [...events].sort((a, b) => a.order - b.order),
    [events]
  );

  const filteredEvents = useMemo(
    () =>
      activeTab === "all"
        ? sortedEvents
        : sortedEvents.filter((e) => e.phase === activeTab),
    [sortedEvents, activeTab]
  );

  const phaseCount = useMemo(() => {
    const counts: Record<string, number> = { all: sortedEvents.length };
    for (const e of sortedEvents) {
      counts[e.phase] = (counts[e.phase] || 0) + 1;
    }
    return counts;
  }, [sortedEvents]);

  const completedCount = filteredEvents.filter((e) => e.isCompleted).length;

  const tabs: { value: TabFilter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "pre-wedding", label: "Pre-Wedding" },
    { value: "wedding-day", label: "Wedding Day" },
    { value: "post-wedding", label: "Post-Wedding" },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-vermillion">
          Ritual Timeline
        </h1>
        <p className="mt-1 text-lg text-turmeric font-medium">
          Shubha Vivaha Karyakrama
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {completedCount} of {filteredEvents.length} rituals completed
        </p>
      </div>

      {/* Phase tabs */}
      <Tabs defaultValue={0}>
        <TabsList className="h-auto flex-wrap">
          {tabs.map((tab, idx) => (
            <TabsTrigger
              key={tab.value}
              value={idx}
              onClick={() => setActiveTab(tab.value)}
              className={
                activeTab === tab.value && tab.value === "wedding-day"
                  ? "data-active:bg-turmeric/20 data-active:text-maroon"
                  : ""
              }
            >
              {tab.label}
              {phaseCount[tab.value] != null && (
                <span className="ml-1.5 text-xs text-muted-foreground">
                  ({phaseCount[tab.value]})
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* All tab panels render the same filtered timeline. We use the tab
            click handler with local state rather than separate TabsContent
            panels so the timeline stays in a single scrollable view. */}
        {tabs.map((tab, idx) => (
          <TabsContent key={tab.value} value={idx}>
            {filteredEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-cream/30 py-16 text-center">
                <Star className="size-10 text-turmeric/50 mb-3" />
                <p className="text-muted-foreground font-medium">
                  No events in this phase yet.
                </p>
              </div>
            ) : (
              <div className="mt-2">
                {filteredEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onToggle={toggleEventComplete}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
