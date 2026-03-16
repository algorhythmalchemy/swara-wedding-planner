"use client";

import { useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { useWeddingStore } from "@/store/wedding-store";
import type { InviteMode, InviteStatus, InvitationAssignment } from "@/types";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Send,
  Phone,
  MessageSquare,
  User,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MODE_CONFIG: Record<
  InviteMode,
  { label: string; icon: React.ElementType; className: string }
> = {
  "in-person": {
    label: "In-Person",
    icon: User,
    className: "bg-vermillion/15 text-vermillion border-vermillion/30",
  },
  courier: {
    label: "Courier",
    icon: Send,
    className: "bg-blue-100 text-blue-700 border-blue-300",
  },
  whatsapp: {
    label: "WhatsApp",
    icon: MessageSquare,
    className: "bg-green-100 text-green-700 border-green-300",
  },
  phone: {
    label: "Phone",
    icon: Phone,
    className: "bg-yellow-100 text-yellow-700 border-yellow-300",
  },
};

const STATUS_CONFIG: Record<
  InviteStatus,
  { label: string; icon: React.ElementType; className: string }
> = {
  pending: {
    label: "Pending",
    icon: AlertCircle,
    className: "bg-vermillion/15 text-vermillion border-vermillion/30",
  },
  scheduled: {
    label: "Scheduled",
    icon: Clock,
    className: "bg-turmeric/15 text-amber-800 border-turmeric/30",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    className: "bg-green-100 text-green-700 border-green-300",
  },
};

type TabFilter = "all" | InviteStatus;

const TABS: { value: TabFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "scheduled", label: "Scheduled" },
  { value: "completed", label: "Completed" },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatPlannedDate(dateStr: string): string {
  try {
    return format(parseISO(dateStr), "MMM d, yyyy");
  } catch {
    return dateStr;
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function InvitationsPage() {
  const invitationAssignments = useWeddingStore(
    (s) => s.invitationAssignments
  );
  const guests = useWeddingStore((s) => s.guests);
  const updateInvitationStatus = useWeddingStore(
    (s) => s.updateInvitationStatus
  );

  const [activeTab, setActiveTab] = useState<TabFilter>("all");

  // -- Guest lookup map --
  const guestMap = useMemo(() => {
    const map = new Map<string, (typeof guests)[number]>();
    for (const g of guests) {
      map.set(g.id, g);
    }
    return map;
  }, [guests]);

  // -- Counts --
  const counts = useMemo(() => {
    const result: Record<InviteStatus | "all", number> = {
      all: invitationAssignments.length,
      pending: 0,
      scheduled: 0,
      completed: 0,
    };
    for (const ia of invitationAssignments) {
      result[ia.status]++;
    }
    return result;
  }, [invitationAssignments]);

  // -- Filtered invitations --
  const filtered = useMemo(
    () =>
      activeTab === "all"
        ? invitationAssignments
        : invitationAssignments.filter((ia) => ia.status === activeTab),
    [invitationAssignments, activeTab]
  );

  // -- Grouped by assignee --
  const assigneeGroups = useMemo(() => {
    const groups: Record<
      string,
      { pending: number; scheduled: number; completed: number; total: number }
    > = {};

    for (const ia of invitationAssignments) {
      if (!groups[ia.assignee]) {
        groups[ia.assignee] = { pending: 0, scheduled: 0, completed: 0, total: 0 };
      }
      groups[ia.assignee][ia.status]++;
      groups[ia.assignee].total++;
    }

    return Object.entries(groups).sort((a, b) =>
      a[0].localeCompare(b[0])
    );
  }, [invitationAssignments]);

  // -- Handle status change --
  const handleStatusChange = (id: string, newStatus: string) => {
    updateInvitationStatus(id, {
      status: newStatus as InviteStatus,
    });
  };

  return (
    <div className="space-y-6">
      {/* ----------------------------------------------------------------- */}
      {/* Header                                                            */}
      {/* ----------------------------------------------------------------- */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-vermillion">
          Lagna Patrika Tracker
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Invitation Distribution Management
        </p>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Summary Cards                                                     */}
      {/* ----------------------------------------------------------------- */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-l-4 border-l-green-500 bg-cream">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <CheckCircle2 className="size-4 text-green-600" />
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-700">
              {counts.completed}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-turmeric bg-cream">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Clock className="size-4 text-turmeric" />
              Scheduled
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-amber-800">
              {counts.scheduled}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-vermillion bg-cream">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <AlertCircle className="size-4 text-vermillion" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-vermillion">
              {counts.pending}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Filter Tabs + Table                                               */}
      {/* ----------------------------------------------------------------- */}
      <Tabs defaultValue={0}>
        <TabsList className="h-auto flex-wrap">
          {TABS.map((tab, idx) => (
            <TabsTrigger
              key={tab.value}
              value={idx}
              onClick={() => setActiveTab(tab.value)}
            >
              {tab.label}
              <span className="ml-1.5 text-xs text-muted-foreground">
                ({counts[tab.value]})
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        {TABS.map((tab, idx) => (
          <TabsContent key={tab.value} value={idx}>
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-cream/30 py-16 text-center">
                <Mail className="size-10 text-turmeric/50 mb-3" />
                <p className="text-muted-foreground font-medium">
                  No invitations in this category.
                </p>
              </div>
            ) : (
              <Card className="bg-cream">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gold/20">
                        <TableHead>Family Name</TableHead>
                        <TableHead>City</TableHead>
                        <TableHead>Assignee</TableHead>
                        <TableHead>Mode</TableHead>
                        <TableHead>Planned Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.map((ia) => {
                        const guest = guestMap.get(ia.guestId);
                        const modeConfig = MODE_CONFIG[ia.mode];
                        const statusConfig = STATUS_CONFIG[ia.status];
                        const ModeIcon = modeConfig.icon;

                        return (
                          <TableRow key={ia.id}>
                            <TableCell className="font-medium">
                              {guest?.familyName ?? "Unknown"}
                            </TableCell>
                            <TableCell>
                              {guest?.city ? (
                                <span className="flex items-center gap-1 text-muted-foreground">
                                  <MapPin className="size-3" />
                                  {guest.city}
                                </span>
                              ) : (
                                <span className="text-muted-foreground">--</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <span className="flex items-center gap-1">
                                <User className="size-3 text-maroon" />
                                {ia.assignee}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={modeConfig.className}
                              >
                                <ModeIcon className="size-3" />
                                {modeConfig.label}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <span className="flex items-center gap-1 text-muted-foreground">
                                <Calendar className="size-3" />
                                {formatPlannedDate(ia.plannedDate)}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={statusConfig.className}
                              >
                                {statusConfig.label}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Select
                                value={ia.status}
                                onValueChange={(val) =>
                                  handleStatusChange(ia.id, val as string)
                                }
                              >
                                <SelectTrigger size="sm">
                                  <SelectValue placeholder="Change status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">
                                    Pending
                                  </SelectItem>
                                  <SelectItem value="scheduled">
                                    Scheduled
                                  </SelectItem>
                                  <SelectItem value="completed">
                                    Completed
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>

      <Separator />

      {/* ----------------------------------------------------------------- */}
      {/* Grouped by Assignee                                               */}
      {/* ----------------------------------------------------------------- */}
      <div>
        <h2 className="mb-4 text-xl font-semibold text-maroon">
          Distribution by Assignee
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {assigneeGroups.map(([assignee, stats]) => (
            <Card key={assignee} className="bg-cream">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-maroon">
                  <User className="size-4" />
                  {assignee}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <AlertCircle className="size-3 text-vermillion" />
                      Pending
                    </span>
                    <span className="font-semibold tabular-nums text-vermillion">
                      {stats.pending}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="size-3 text-turmeric" />
                      Scheduled
                    </span>
                    <span className="font-semibold tabular-nums text-amber-800">
                      {stats.scheduled}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <CheckCircle2 className="size-3 text-green-600" />
                      Completed
                    </span>
                    <span className="font-semibold tabular-nums text-green-700">
                      {stats.completed}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between text-sm font-medium">
                    <span className="text-maroon">Total</span>
                    <span className="tabular-nums text-maroon">
                      {stats.total}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
