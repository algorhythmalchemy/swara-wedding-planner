"use client";

import { useMemo } from "react";
import { differenceInDays, parseISO, format, isAfter } from "date-fns";
import { useWeddingStore } from "@/store/wedding-store";
import type { RSVPStatus, TaskCategory } from "@/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  IndianRupee,
  Users,
  CheckCircle2,
  Clock,
  TrendingUp,
  Heart,
  MapPin,
  ShoppingBag,
  Mail,
  Wrench,
  Package,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const categoryIcons: Record<TaskCategory, React.ElementType> = {
  shopping: ShoppingBag,
  "card-distribution": Mail,
  vendor: Wrench,
  "ritual-prep": Heart,
  logistics: Package,
  general: CheckCircle2,
};

const priorityConfig: Record<
  "high" | "medium" | "low",
  { label: string; className: string }
> = {
  high: {
    label: "High",
    className: "bg-vermillion/15 text-vermillion border-vermillion/30",
  },
  medium: {
    label: "Medium",
    className: "bg-turmeric/15 text-amber-800 border-turmeric/30",
  },
  low: {
    label: "Low",
    className: "bg-green-100 text-green-800 border-green-300",
  },
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function DashboardPage() {
  const {
    weddingDate,
    brideName,
    groomName,
    events,
    tasks,
    guests,
    rsvps,
    budgetCategories,
  } = useWeddingStore();

  // -- Countdown --
  const daysRemaining = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return differenceInDays(parseISO(weddingDate), today);
  }, [weddingDate]);

  // -- Budget --
  const budgetTotals = useMemo(() => {
    const allocated = budgetCategories.reduce((s, c) => s + c.allocated, 0);
    const spent = budgetCategories.reduce((s, c) => s + c.spent, 0);
    return { allocated, spent, pct: allocated > 0 ? (spent / allocated) * 100 : 0 };
  }, [budgetCategories]);

  // -- Guests --
  const totalGuests = useMemo(
    () => guests.reduce((s, g) => s + g.members, 0),
    [guests],
  );

  // -- RSVPs --
  const rsvpCounts = useMemo(() => {
    const counts: Record<RSVPStatus, number> = {
      confirmed: 0,
      pending: 0,
      declined: 0,
      maybe: 0,
    };
    for (const r of rsvps) {
      counts[r.status] += r.attendingCount;
    }
    return { ...counts, total: rsvps.length };
  }, [rsvps]);

  // -- Tasks --
  const taskStats = useMemo(() => {
    const completed = tasks.filter((t) => t.isCompleted).length;
    return { completed, total: tasks.length };
  }, [tasks]);

  const upcomingTasks = useMemo(() => {
    return tasks
      .filter((t) => !t.isCompleted)
      .sort((a, b) => parseISO(a.dueDate).getTime() - parseISO(b.dueDate).getTime())
      .slice(0, 5);
  }, [tasks]);

  // -- Top 5 budget categories by allocated --
  const topBudgetCategories = useMemo(() => {
    return [...budgetCategories]
      .sort((a, b) => b.allocated - a.allocated)
      .slice(0, 5);
  }, [budgetCategories]);

  // =========================================================================
  // Render
  // =========================================================================

  return (
    <div className="space-y-6">
      {/* ----------------------------------------------------------------- */}
      {/* 1. Hero Countdown Card                                            */}
      {/* ----------------------------------------------------------------- */}
      <Card className="overflow-hidden border-0 ring-0">
        <div className="bg-gradient-to-r from-vermillion to-maroon px-6 py-8 md:px-10 md:py-10 text-white relative">
          {/* Decorative element */}
          <div className="absolute top-4 right-6 opacity-10">
            <Heart className="h-28 w-28" strokeWidth={1} />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="text-white/70 text-sm font-medium tracking-wide uppercase mb-1">
                Muhurtham Countdown
              </p>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                {brideName} & {groomName}
              </h1>
              <div className="flex items-center gap-2 mt-2 text-white/80 text-sm">
                <Calendar className="h-4 w-4" />
                <span>
                  {format(parseISO(weddingDate), "EEEE, MMMM d, yyyy")}
                </span>
              </div>
            </div>

            <div className="flex items-baseline gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4">
              <span className="text-5xl md:text-6xl font-bold tabular-nums leading-none">
                {daysRemaining}
              </span>
              <span className="text-lg text-white/80 font-medium">
                {daysRemaining === 1 ? "day" : "days"} to go
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* ----------------------------------------------------------------- */}
      {/* 2. Quick Stats Row                                                */}
      {/* ----------------------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Budget */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Budget
              </CardTitle>
              <div className="h-8 w-8 rounded-lg bg-turmeric/15 flex items-center justify-center">
                <IndianRupee className="h-4 w-4 text-turmeric" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold">
                {formatCurrency(budgetTotals.spent)}
              </span>
              <span className="text-sm text-muted-foreground">
                / {formatCurrency(budgetTotals.allocated)}
              </span>
            </div>
            <Progress value={budgetTotals.pct} />
          </CardContent>
        </Card>

        {/* Total Guests */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Guests
              </CardTitle>
              <div className="h-8 w-8 rounded-lg bg-turmeric/15 flex items-center justify-center">
                <Users className="h-4 w-4 text-turmeric" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{totalGuests}</span>
              <span className="text-sm text-muted-foreground">
                across {guests.length} families
              </span>
            </div>
          </CardContent>
        </Card>

        {/* RSVP Status */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                RSVPs Confirmed
              </CardTitle>
              <div className="h-8 w-8 rounded-lg bg-turmeric/15 flex items-center justify-center">
                <Mail className="h-4 w-4 text-turmeric" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{rsvpCounts.confirmed}</span>
              <span className="text-sm text-muted-foreground">
                / {rsvpCounts.total} RSVPs
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Tasks */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Tasks Completed
              </CardTitle>
              <div className="h-8 w-8 rounded-lg bg-turmeric/15 flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4 text-turmeric" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{taskStats.completed}</span>
              <span className="text-sm text-muted-foreground">
                / {taskStats.total} tasks
              </span>
            </div>
            <Progress
              value={
                taskStats.total > 0
                  ? (taskStats.completed / taskStats.total) * 100
                  : 0
              }
            />
          </CardContent>
        </Card>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* 3 & 4. Upcoming Tasks + RSVP Summary                              */}
      {/* ----------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Upcoming Tasks (span 2) */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-vermillion" />
              <CardTitle>Upcoming Tasks</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {upcomingTasks.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4 text-center">
                All tasks completed — well done!
              </p>
            ) : (
              <div className="space-y-1">
                {upcomingTasks.map((task, idx) => {
                  const CategoryIcon = categoryIcons[task.category];
                  const prio = priorityConfig[task.priority];
                  const isOverdue = isAfter(new Date(), parseISO(task.dueDate));

                  return (
                    <div key={task.id}>
                      {idx > 0 && <Separator className="my-2" />}
                      <div className="flex items-start gap-3 py-1">
                        <div className="mt-0.5 h-7 w-7 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                          <CategoryIcon className="h-3.5 w-3.5 text-muted-foreground" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-sm truncate">
                              {task.title}
                            </span>
                            <Badge
                              variant="outline"
                              className={prio.className}
                            >
                              {prio.label}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {task.assignee}
                            </span>
                            <span
                              className={`flex items-center gap-1 ${
                                isOverdue ? "text-vermillion font-medium" : ""
                              }`}
                            >
                              <Calendar className="h-3 w-3" />
                              {format(parseISO(task.dueDate), "MMM d")}
                              {isOverdue && " (overdue)"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* RSVP Summary */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-vermillion" />
              <CardTitle>RSVP Summary</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(
                [
                  {
                    status: "confirmed" as const,
                    label: "Confirmed",
                    color: "bg-green-500",
                  },
                  {
                    status: "pending" as const,
                    label: "Pending",
                    color: "bg-turmeric",
                  },
                  {
                    status: "maybe" as const,
                    label: "Maybe",
                    color: "bg-amber-400",
                  },
                  {
                    status: "declined" as const,
                    label: "Declined",
                    color: "bg-muted-foreground",
                  },
                ] as const
              ).map(({ status, label, color }) => {
                const count = rsvpCounts[status];
                const pct =
                  rsvpCounts.total > 0
                    ? (count / rsvpCounts.total) * 100
                    : 0;
                return (
                  <div key={status} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-semibold tabular-nums">{count}</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full ${color} transition-all`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* 5. Budget Overview                                                */}
      {/* ----------------------------------------------------------------- */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <IndianRupee className="h-4 w-4 text-vermillion" />
            <CardTitle>Budget Overview</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            {topBudgetCategories.map((cat) => {
              const pct =
                cat.allocated > 0
                  ? Math.min((cat.spent / cat.allocated) * 100, 100)
                  : 0;
              const isOver = cat.spent > cat.allocated;

              return (
                <div key={cat.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{cat.name}</span>
                    <span className="text-muted-foreground tabular-nums">
                      {formatCurrency(cat.spent)}{" "}
                      <span className="text-muted-foreground/60">
                        / {formatCurrency(cat.allocated)}
                      </span>
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isOver ? "bg-vermillion" : "bg-turmeric"
                      }`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
