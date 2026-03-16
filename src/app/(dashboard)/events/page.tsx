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
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Clock,
  CheckCircle2,
  Circle,
  Sparkles,
  Sun,
  Moon,
  Star,
  Plus,
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
  const addEvent = useWeddingStore((s) => s.addEvent);
  const toggleEventComplete = useWeddingStore((s) => s.toggleEventComplete);

  const [activeTab, setActiveTab] = useState<TabFilter>("all");
  const [dialogOpen, setDialogOpen] = useState(false);

  // Add Event form state
  const [newName, setNewName] = useState("");
  const [newNameKannada, setNewNameKannada] = useState("");
  const [newNameTelugu, setNewNameTelugu] = useState("");
  const [newPhase, setNewPhase] = useState<EventPhase>("pre-wedding");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newDescription, setNewDescription] = useState("");

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

  function handleAddEvent(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;

    const maxOrder = events.reduce((max, ev) => Math.max(max, ev.order), 0);

    addEvent({
      id: `ev-${Date.now()}`,
      name: newName.trim(),
      nameKannada: newNameKannada.trim() || undefined,
      nameTelugu: newNameTelugu.trim() || undefined,
      phase: newPhase,
      date: newDate || undefined,
      time: newTime || undefined,
      location: newLocation.trim() || undefined,
      description: newDescription.trim() || undefined,
      isCompleted: false,
      order: maxOrder + 1,
    });

    // Reset form
    setNewName("");
    setNewNameKannada("");
    setNewNameTelugu("");
    setNewPhase("pre-wedding");
    setNewDate("");
    setNewTime("");
    setNewLocation("");
    setNewDescription("");
    setDialogOpen(false);
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
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

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger
            render={
              <Button className="bg-turmeric text-maroon hover:bg-turmeric/90">
                <Plus className="mr-1 size-4" />
                Add Ritual
              </Button>
            }
          />
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Ritual / Event</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddEvent} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ev-name">Ritual Name *</Label>
                <Input
                  id="ev-name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g., Mangala Snanam"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="ev-name-kn">Name (Kannada)</Label>
                  <Input
                    id="ev-name-kn"
                    value={newNameKannada}
                    onChange={(e) => setNewNameKannada(e.target.value)}
                    placeholder="ಕನ್ನಡ"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ev-name-te">Name (Telugu)</Label>
                  <Input
                    id="ev-name-te"
                    value={newNameTelugu}
                    onChange={(e) => setNewNameTelugu(e.target.value)}
                    placeholder="తెలుగు"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ev-phase">Phase</Label>
                <Select value={newPhase} onValueChange={(v) => setNewPhase(v as EventPhase)}>
                  <SelectTrigger id="ev-phase">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pre-wedding">Pre-Wedding</SelectItem>
                    <SelectItem value="wedding-day">Wedding Day</SelectItem>
                    <SelectItem value="post-wedding">Post-Wedding</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="ev-date">Date</Label>
                  <Input
                    id="ev-date"
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ev-time">Time</Label>
                  <Input
                    id="ev-time"
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ev-location">Location</Label>
                <Input
                  id="ev-location"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="e.g., Kalyana Mantapa"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ev-desc">Description</Label>
                <Textarea
                  id="ev-desc"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Brief description of the ritual..."
                  rows={3}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-vermillion text-white hover:bg-vermillion/90"
              >
                Add Ritual
              </Button>
            </form>
          </DialogContent>
        </Dialog>
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

        {tabs.map((tab, idx) => (
          <TabsContent key={tab.value} value={idx}>
            {filteredEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-cream/30 py-16 text-center">
                <Star className="size-10 text-turmeric/50 mb-3" />
                <p className="text-muted-foreground font-medium">
                  No events in this phase yet.
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Click &quot;Add Ritual&quot; to add one.
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
