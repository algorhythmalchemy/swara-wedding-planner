"use client";

import { useState } from "react";
import { useWeddingStore } from "@/store/wedding-store";
import type { Task, TaskCategory } from "@/types";
import { isBefore, format } from "date-fns";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import {
  ShoppingBag,
  Mail,
  Wrench,
  Sparkles,
  Truck,
  ClipboardList,
  Plus,
  Trash2,
  MapPin,
  Calendar,
  User,
  Clock,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const CATEGORY_CONFIG: Record<
  TaskCategory,
  { label: string; icon: typeof ShoppingBag }
> = {
  shopping: { label: "Shopping", icon: ShoppingBag },
  "card-distribution": { label: "Card Distribution", icon: Mail },
  vendor: { label: "Vendor", icon: Wrench },
  "ritual-prep": { label: "Ritual Prep", icon: Sparkles },
  logistics: { label: "Logistics", icon: Truck },
  general: { label: "General", icon: ClipboardList },
};

const PRIORITY_COLORS: Record<Task["priority"], string> = {
  high: "bg-red-100 text-red-700 border-red-200",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  low: "bg-green-100 text-green-700 border-green-200",
};

const PRIORITY_ORDER: Record<Task["priority"], number> = {
  high: 0,
  medium: 1,
  low: 2,
};

const FILTER_TABS: { value: string; label: string }[] = [
  { value: "all", label: "All" },
  { value: "shopping", label: "Shopping" },
  { value: "card-distribution", label: "Card Distribution" },
  { value: "vendor", label: "Vendor" },
  { value: "ritual-prep", label: "Ritual Prep" },
  { value: "logistics", label: "Logistics" },
];

function sortTasks(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    // Incomplete first
    if (a.isCompleted !== b.isCompleted) {
      return a.isCompleted ? 1 : -1;
    }
    // Then by priority
    const priorityDiff = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    if (priorityDiff !== 0) return priorityDiff;
    // Then by due date
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });
}

export default function SchedulePage() {
  const { tasks, addTask, toggleTaskComplete, deleteTask } = useWeddingStore();
  const [activeTab, setActiveTab] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCategory, setFormCategory] = useState<TaskCategory>("general");
  const [formAssignee, setFormAssignee] = useState("");
  const [formDueDate, setFormDueDate] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formPriority, setFormPriority] = useState<Task["priority"]>("medium");

  const now = new Date();

  const filteredTasks =
    activeTab === "all"
      ? tasks
      : tasks.filter((t) => t.category === activeTab);

  const sortedTasks = sortTasks(filteredTasks);

  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const overdueCount = tasks.filter(
    (t) => !t.isCompleted && isBefore(new Date(t.dueDate), now)
  ).length;

  function resetForm() {
    setFormTitle("");
    setFormDescription("");
    setFormCategory("general");
    setFormAssignee("");
    setFormDueDate("");
    setFormLocation("");
    setFormPriority("medium");
  }

  function handleAddTask() {
    if (!formTitle.trim() || !formAssignee.trim() || !formDueDate) return;

    const newTask: Task = {
      id: `t-${Date.now()}`,
      title: formTitle.trim(),
      description: formDescription.trim() || undefined,
      category: formCategory,
      assignee: formAssignee.trim(),
      dueDate: formDueDate,
      location: formLocation.trim() || undefined,
      isCompleted: false,
      priority: formPriority,
    };

    addTask(newTask);
    resetForm();
    setDialogOpen(false);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-vermillion">
            Schedule & Tasks
          </h1>
          <p className="text-sm text-muted-foreground">
            Shopping, Card Distribution & Delegation
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger
            render={
              <Button className="mt-2 bg-turmeric text-maroon hover:bg-gold sm:mt-0" />
            }
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Task
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label htmlFor="task-title">Title</Label>
                <Input
                  id="task-title"
                  placeholder="e.g. Buy Mangala Sutra set"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="task-description">Description</Label>
                <Textarea
                  id="task-description"
                  placeholder="Additional details..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Category</Label>
                  <Select
                    value={formCategory}
                    onValueChange={(val) =>
                      setFormCategory(val as TaskCategory)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
                        <SelectItem key={key} value={key}>
                          {cfg.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>Priority</Label>
                  <Select
                    value={formPriority}
                    onValueChange={(val) =>
                      setFormPriority(val as Task["priority"])
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="task-assignee">Assignee</Label>
                  <Input
                    id="task-assignee"
                    placeholder="e.g. Amma"
                    value={formAssignee}
                    onChange={(e) => setFormAssignee(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="task-due-date">Due Date</Label>
                  <Input
                    id="task-due-date"
                    type="date"
                    value={formDueDate}
                    onChange={(e) => setFormDueDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="task-location">Location (optional)</Label>
                <Input
                  id="task-location"
                  placeholder="e.g. Chickpet, Bangalore"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                />
              </div>

              <Separator />

              <Button
                onClick={handleAddTask}
                disabled={!formTitle.trim() || !formAssignee.trim() || !formDueDate}
                className="w-full bg-turmeric text-maroon hover:bg-gold"
              >
                <Plus className="mr-1 h-4 w-4" />
                Add Task
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Task Stats Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border-turmeric/30 bg-cream">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-turmeric/20">
              <ClipboardList className="h-5 w-5 text-turmeric" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Tasks</p>
              <p className="text-2xl font-bold text-maroon">{totalCount}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold text-green-700">
                {completedCount}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Overdue</p>
              <p className="text-2xl font-bold text-red-700">{overdueCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs + Task List */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex-wrap">
          {FILTER_TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Shared content for all tabs — filtering is done in JS */}
        {FILTER_TABS.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            {sortedTasks.length === 0 ? (
              <Card className="border-dashed border-turmeric/40">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <Calendar className="mb-3 h-10 w-10 text-turmeric/50" />
                  <p className="text-sm text-muted-foreground">
                    No tasks found in this category. Add one to get started!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-3">
                {sortedTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggle={() => toggleTaskComplete(task.id)}
                    onDelete={() => deleteTask(task.id)}
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

function TaskCard({
  task,
  onToggle,
  onDelete,
}: {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const CategoryIcon = CATEGORY_CONFIG[task.category].icon;
  const categoryLabel = CATEGORY_CONFIG[task.category].label;
  const isOverdue =
    !task.isCompleted && isBefore(new Date(task.dueDate), new Date());

  let formattedDate: string;
  try {
    formattedDate = format(new Date(task.dueDate), "MMM d, yyyy");
  } catch {
    formattedDate = task.dueDate;
  }

  return (
    <Card
      className={`transition-colors ${
        task.isCompleted
          ? "border-muted bg-muted/30 opacity-70"
          : isOverdue
            ? "border-red-300 bg-red-50/50"
            : "border-turmeric/20 bg-card"
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <div className="pt-0.5">
            <Checkbox
              checked={task.isCompleted}
              onCheckedChange={onToggle}
              className="border-turmeric data-[state=checked]:bg-turmeric"
            />
          </div>

          {/* Main Content */}
          <div className="min-w-0 flex-1 space-y-2">
            {/* Title Row */}
            <div className="flex flex-wrap items-start justify-between gap-2">
              <h3
                className={`text-sm font-semibold ${
                  task.isCompleted
                    ? "text-muted-foreground line-through"
                    : "text-foreground"
                }`}
              >
                {task.title}
              </h3>

              <div className="flex items-center gap-1.5">
                {/* Category badge */}
                <Badge variant="secondary" className="gap-1 text-xs">
                  <CategoryIcon className="h-3 w-3" />
                  {categoryLabel}
                </Badge>

                {/* Priority badge */}
                <Badge
                  variant="outline"
                  className={`text-xs capitalize ${PRIORITY_COLORS[task.priority]}`}
                >
                  {task.priority}
                </Badge>

                {/* Overdue indicator */}
                {isOverdue && (
                  <Badge variant="destructive" className="gap-1 text-xs">
                    <Clock className="h-3 w-3" />
                    Overdue
                  </Badge>
                )}
              </div>
            </div>

            {/* Description */}
            {task.description && (
              <p className="text-xs text-muted-foreground">
                {task.description}
              </p>
            )}

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {task.assignee}
              </span>

              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formattedDate}
              </span>

              {task.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {task.location}
                </span>
              )}
            </div>

            {/* Attendees */}
            {task.attendees && task.attendees.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {task.attendees.map((attendee) => (
                  <Badge
                    key={attendee}
                    variant="outline"
                    className="text-[10px]"
                  >
                    {attendee}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Delete button */}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onDelete}
            className="shrink-0 text-muted-foreground hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
