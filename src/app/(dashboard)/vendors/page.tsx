"use client";

import { useMemo, useState } from "react";
import { useWeddingStore } from "@/store/wedding-store";
import type { Vendor, PaymentStatus, DayOfChecklistItem } from "@/types";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
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
import { Separator } from "@/components/ui/separator";

import {
  Phone,
  Mail,
  IndianRupee,
  Plus,
  User,
  Clock,
  CheckCircle2,
  Truck,
  ClipboardCheck,
  Wrench,
} from "lucide-react";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const paymentStatusConfig: Record<
  PaymentStatus,
  { label: string; color: string }
> = {
  paid: { label: "Paid", color: "bg-green-100 text-green-800 border-green-200" },
  "advance-paid": { label: "Advance Paid", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  pending: { label: "Pending", color: "bg-orange-100 text-orange-800 border-orange-200" },
  overdue: { label: "Overdue", color: "bg-red-100 text-red-800 border-red-200" },
};

const CHECKLIST_CATEGORIES = [
  "Setup",
  "Decor",
  "Catering",
  "Ritual",
  "Music",
  "Photography",
  "Preparation",
  "Distribution",
] as const;

function VendorCard({ vendor }: { vendor: Vendor }) {
  const statusConfig = paymentStatusConfig[vendor.paymentStatus];

  return (
    <Card className="bg-cream">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="text-lg text-maroon">{vendor.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{vendor.role}</p>
          </div>
          <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Phone className="size-4 text-vermillion" />
          <a
            href={`tel:${vendor.phone}`}
            className="text-maroon underline-offset-2 hover:underline"
          >
            {vendor.phone}
          </a>
        </div>

        {vendor.email && (
          <div className="flex items-center gap-2 text-sm">
            <Mail className="size-4 text-vermillion" />
            <span className="text-muted-foreground">{vendor.email}</span>
          </div>
        )}

        {vendor.amount != null && (
          <div className="flex items-center gap-2 text-sm">
            <IndianRupee className="size-4 text-vermillion" />
            <span className="font-medium text-maroon">
              {formatCurrency(vendor.amount)}
            </span>
          </div>
        )}

        {vendor.notes && (
          <>
            <Separator />
            <p className="text-sm text-muted-foreground">{vendor.notes}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function AddVendorDialog() {
  const addVendor = useWeddingStore((s) => s.addVendor);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    phone: "",
    email: "",
    amount: "",
    paymentStatus: "pending" as PaymentStatus,
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.role || !formData.phone) {
      return;
    }

    const vendor: Vendor = {
      id: `v-${Date.now()}`,
      name: formData.name,
      role: formData.role,
      phone: formData.phone,
      email: formData.email || undefined,
      amount: formData.amount ? Number(formData.amount) : undefined,
      paymentStatus: formData.paymentStatus,
      notes: formData.notes || undefined,
    };

    addVendor(vendor);
    setFormData({
      name: "",
      role: "",
      phone: "",
      email: "",
      amount: "",
      paymentStatus: "pending",
      notes: "",
    });
    setDialogOpen(false);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger
        render={
          <Button className="bg-turmeric text-maroon hover:bg-turmeric/90">
            <Plus className="mr-1 size-4" />
            Add Vendor
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Vendor</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vendor-name">Name</Label>
            <Input
              id="vendor-name"
              placeholder="e.g. Sharma Caterers"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vendor-role">Role</Label>
            <Input
              id="vendor-role"
              placeholder="e.g. Catering, Photography"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vendor-phone">Phone</Label>
            <Input
              id="vendor-phone"
              placeholder="e.g. +91 98765 43210"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vendor-email">Email</Label>
            <Input
              id="vendor-email"
              type="email"
              placeholder="e.g. vendor@email.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vendor-amount">Amount</Label>
            <Input
              id="vendor-amount"
              type="number"
              placeholder="Enter amount in INR"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Payment Status</Label>
            <Select
              value={formData.paymentStatus}
              onValueChange={(val) =>
                setFormData({
                  ...formData,
                  paymentStatus: val as PaymentStatus,
                })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="advance-paid">Advance Paid</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vendor-notes">Notes</Label>
            <Textarea
              id="vendor-notes"
              placeholder="Any additional notes..."
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-maroon text-cream hover:bg-maroon/90"
          >
            Add Vendor
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function VendorDirectoryTab() {
  const vendors = useWeddingStore((s) => s.vendors);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {vendors.length} vendor{vendors.length !== 1 ? "s" : ""} registered
        </p>
        <AddVendorDialog />
      </div>

      {vendors.length === 0 ? (
        <Card className="bg-cream">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Truck className="mb-3 size-10 text-muted-foreground" />
            <p className="text-lg font-medium text-muted-foreground">
              No vendors added yet
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Click &quot;Add Vendor&quot; to start building your directory
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {vendors.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))}
        </div>
      )}
    </div>
  );
}

function ChecklistItemRow({ item }: { item: DayOfChecklistItem }) {
  const toggleChecklistItem = useWeddingStore((s) => s.toggleChecklistItem);

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-cream px-4 py-3">
      <Checkbox
        checked={item.isCompleted}
        onCheckedChange={() => toggleChecklistItem(item.id)}
        aria-label={`Mark "${item.task}" as ${item.isCompleted ? "incomplete" : "complete"}`}
      />

      {item.time && (
        <span className="flex items-center gap-1 text-xs font-medium text-vermillion">
          <Clock className="size-3" />
          {item.time}
        </span>
      )}

      <span
        className={`flex-1 text-sm ${
          item.isCompleted
            ? "line-through text-muted-foreground"
            : "text-foreground"
        }`}
      >
        {item.task}
      </span>

      {item.assignee && (
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <User className="size-3" />
          {item.assignee}
        </span>
      )}
    </div>
  );
}

function DayOfChecklistTab() {
  const dayOfChecklist = useWeddingStore((s) => s.dayOfChecklist);

  const completedCount = dayOfChecklist.filter((item) => item.isCompleted).length;
  const totalCount = dayOfChecklist.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const groupedItems = useMemo(() => {
    const groups: Record<string, DayOfChecklistItem[]> = {};

    for (const category of CHECKLIST_CATEGORIES) {
      const items = dayOfChecklist
        .filter((item) => item.category === category)
        .sort((a, b) => a.order - b.order);

      if (items.length > 0) {
        groups[category] = items;
      }
    }

    return groups;
  }, [dayOfChecklist]);

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <Card className="bg-cream">
        <CardContent className="py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-5 text-green-600" />
              <span className="text-sm font-medium text-maroon">
                Day-Of Progress
              </span>
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              {completedCount} / {totalCount} tasks
            </span>
          </div>
          <Progress value={progressPercentage} />
        </CardContent>
      </Card>

      {/* Grouped checklist items */}
      {totalCount === 0 ? (
        <Card className="bg-cream">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <ClipboardCheck className="mb-3 size-10 text-muted-foreground" />
            <p className="text-lg font-medium text-muted-foreground">
              No checklist items yet
            </p>
          </CardContent>
        </Card>
      ) : (
        Object.entries(groupedItems).map(([category, items]) => (
          <div key={category} className="space-y-3">
            <div className="flex items-center gap-2">
              <Wrench className="size-4 text-vermillion" />
              <h3 className="text-base font-semibold text-maroon">
                {category}
              </h3>
              <Badge variant="outline" className="ml-auto text-xs">
                {items.filter((i) => i.isCompleted).length}/{items.length}
              </Badge>
            </div>
            <div className="space-y-2">
              {items.map((item) => (
                <ChecklistItemRow key={item.id} item={item} />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default function VendorsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-maroon">
          Vendors & Day-Of Execution
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage vendors and track day-of logistics
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue={0}>
        <TabsList className="h-auto flex-wrap">
          <TabsTrigger value={0}>
            <Truck className="size-4" />
            Vendor Directory
          </TabsTrigger>
          <TabsTrigger value={1}>
            <ClipboardCheck className="size-4" />
            Day-Of Checklist
          </TabsTrigger>
        </TabsList>

        <TabsContent value={0}>
          <VendorDirectoryTab />
        </TabsContent>

        <TabsContent value={1}>
          <DayOfChecklistTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
