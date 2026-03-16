"use client";

import { useState } from "react";
import { useWeddingStore } from "@/store/wedding-store";
import type { BudgetCategory, Expense, PaymentStatus } from "@/types";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

import {
  IndianRupee,
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  AlertCircle,
} from "lucide-react";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const paymentStatusConfig: Record<
  PaymentStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  pending: { label: "Pending", variant: "outline" },
  "advance-paid": { label: "Advance Paid", variant: "secondary" },
  paid: { label: "Paid", variant: "default" },
  overdue: { label: "Overdue", variant: "destructive" },
};

function getProgressColor(percentage: number): string {
  if (percentage > 90) return "bg-red-500";
  if (percentage >= 75) return "bg-yellow-500";
  return "bg-green-500";
}

export default function BudgetPage() {
  const { budgetCategories, expenses, addBudgetCategory, addExpense, deleteExpense } =
    useWeddingStore();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    nameLocal: "",
    allocated: "",
  });
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    categoryId: "",
    date: "",
    vendor: "",
    paymentStatus: "pending" as PaymentStatus,
    notes: "",
  });

  const totalBudget = budgetCategories.reduce(
    (sum, cat) => sum + cat.allocated,
    0
  );
  const totalSpent = budgetCategories.reduce((sum, cat) => sum + cat.spent, 0);
  const remaining = totalBudget - totalSpent;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.description || !formData.amount || !formData.categoryId || !formData.date) {
      return;
    }

    const expense: Expense = {
      id: `ex-${Date.now()}`,
      categoryId: formData.categoryId,
      description: formData.description,
      amount: Number(formData.amount),
      date: formData.date,
      vendor: formData.vendor || undefined,
      paymentStatus: formData.paymentStatus,
      notes: formData.notes || undefined,
    };

    addExpense(expense);
    setFormData({
      description: "",
      amount: "",
      categoryId: "",
      date: "",
      vendor: "",
      paymentStatus: "pending",
      notes: "",
    });
    setDialogOpen(false);
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name || !categoryForm.allocated) return;

    const category: BudgetCategory = {
      id: `bc-${Date.now()}`,
      name: categoryForm.name,
      nameLocal: categoryForm.nameLocal || undefined,
      allocated: Number(categoryForm.allocated),
      spent: 0,
    };

    addBudgetCategory(category);
    setCategoryForm({ name: "", nameLocal: "", allocated: "" });
    setCategoryDialogOpen(false);
  };

  const getCategoryName = (categoryId: string) => {
    const cat = budgetCategories.find((c) => c.id === categoryId);
    return cat?.name ?? "Unknown";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-maroon">Budget & Expenses</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track and manage your wedding expenses
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
        <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
          <DialogTrigger
            render={
              <Button variant="outline" className="border-vermillion text-vermillion hover:bg-vermillion/10">
                <Plus className="mr-1 size-4" />
                Add Budget Category
              </Button>
            }
          />
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Budget Category</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cat-name">Category Name *</Label>
                <Input
                  id="cat-name"
                  placeholder="e.g. Catering, Venue, Silk Sarees"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cat-local">Local Name (Kannada/Telugu)</Label>
                <Input
                  id="cat-local"
                  placeholder="e.g. ಊಟ / భోజనం"
                  value={categoryForm.nameLocal}
                  onChange={(e) => setCategoryForm({ ...categoryForm, nameLocal: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cat-allocated">Allocated Budget (INR) *</Label>
                <Input
                  id="cat-allocated"
                  type="number"
                  placeholder="e.g. 200000"
                  value={categoryForm.allocated}
                  onChange={(e) => setCategoryForm({ ...categoryForm, allocated: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-vermillion text-white hover:bg-vermillion/90">
                Add Category
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger
            render={
              <Button className="bg-turmeric text-maroon hover:bg-turmeric/90">
                <Plus className="mr-1 size-4" />
                Add Expense
              </Button>
            }
          />
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="e.g. Mandap decoration"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount in INR"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(val) =>
                    setFormData({ ...formData, categoryId: val as string })
                  }
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {budgetCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                        {cat.nameLocal ? ` (${cat.nameLocal})` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vendor">Vendor</Label>
                <Input
                  id="vendor"
                  placeholder="e.g. Sharma Caterers"
                  value={formData.vendor}
                  onChange={(e) =>
                    setFormData({ ...formData, vendor: e.target.value })
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
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
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
                Add Expense
              </Button>
            </form>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-l-4 border-l-green-500 bg-cream">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <IndianRupee className="size-4" />
              Total Budget
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-maroon">
              {formatCurrency(totalBudget)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-vermillion bg-cream">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <TrendingUp className="size-4" />
              Total Spent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-vermillion">
              {formatCurrency(totalSpent)}
            </p>
          </CardContent>
        </Card>

        <Card
          className={`border-l-4 bg-cream ${
            remaining >= 0 ? "border-l-green-500" : "border-l-red-500"
          }`}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              {remaining >= 0 ? (
                <TrendingDown className="size-4" />
              ) : (
                <AlertCircle className="size-4 text-red-500" />
              )}
              Remaining
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p
              className={`text-2xl font-bold ${
                remaining >= 0 ? "text-green-700" : "text-red-600"
              }`}
            >
              {formatCurrency(remaining)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Budget Overview Cards */}
      <div>
        <h2 className="mb-4 text-xl font-semibold text-maroon">
          Budget by Category
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {budgetCategories.map((category) => {
            const percentage =
              category.allocated > 0
                ? (category.spent / category.allocated) * 100
                : 0;
            const progressColor = getProgressColor(percentage);

            return (
              <Card key={category.id} className="bg-cream">
                <CardHeader>
                  <CardTitle className="text-maroon">
                    {category.name}
                    {category.nameLocal && (
                      <span className="ml-2 text-xs font-normal text-muted-foreground">
                        {category.nameLocal}
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Spent: {formatCurrency(category.spent)}
                    </span>
                    <span className="font-medium">
                      of {formatCurrency(category.allocated)}
                    </span>
                  </div>
                  <Progress
                    value={Math.min(percentage, 100)}
                    className={`[&_[data-slot=progress-indicator]]:${progressColor}`}
                  />
                  <p
                    className={`text-right text-xs font-medium ${
                      percentage > 90
                        ? "text-red-600"
                        : percentage >= 75
                          ? "text-yellow-600"
                          : "text-green-600"
                    }`}
                  >
                    {percentage.toFixed(0)}% used
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Separator />

      {/* Expense Table */}
      <div>
        <h2 className="mb-4 text-xl font-semibold text-maroon">
          All Expenses
        </h2>
        {expenses.length === 0 ? (
          <Card className="bg-cream">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <IndianRupee className="mb-3 size-10 text-muted-foreground" />
              <p className="text-lg font-medium text-muted-foreground">
                No expenses recorded yet
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Click &quot;Add Expense&quot; to start tracking
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-cream">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gold/20">
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.map((expense) => {
                    const statusConfig =
                      paymentStatusConfig[expense.paymentStatus];
                    return (
                      <TableRow key={expense.id}>
                        <TableCell className="font-medium">
                          {expense.description}
                        </TableCell>
                        <TableCell>
                          {getCategoryName(expense.categoryId)}
                        </TableCell>
                        <TableCell className="text-right font-medium text-vermillion">
                          {formatCurrency(expense.amount)}
                        </TableCell>
                        <TableCell>
                          {new Date(expense.date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </TableCell>
                        <TableCell>
                          {expense.vendor ?? <span className="text-muted-foreground">--</span>}
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusConfig.variant}>
                            {statusConfig.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => deleteExpense(expense.id)}
                            className="text-red-500 hover:bg-red-50 hover:text-red-700"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
