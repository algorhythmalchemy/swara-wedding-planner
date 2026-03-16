"use client";

import { useState } from "react";
import { useWeddingStore } from "@/store/wedding-store";
import type { GiftTier, TamboolamItem } from "@/types";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

import {
  Gift,
  Package,
  ShoppingCart,
  Plus,
  Minus,
  CheckCircle2,
  AlertCircle,
  IndianRupee,
  Candy,
} from "lucide-react";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const tierConfig: Record<GiftTier, { label: string; className: string }> = {
  "close-family": { label: "Close Family", className: "bg-gold text-maroon" },
  beegaru: { label: "Beegaru", className: "bg-vermillion text-cream" },
  regular: { label: "Regular", className: "bg-gray-200 text-gray-700" },
  vip: { label: "VIP", className: "bg-purple-600 text-white" },
};

function getProgressColorClass(percentage: number): string {
  if (percentage >= 75) return "bg-green-500";
  if (percentage >= 25) return "bg-yellow-500";
  return "bg-red-500";
}

function InventoryCard({
  item,
  onStockUpdate,
}: {
  item: TamboolamItem;
  onStockUpdate: (id: string, newStock: number) => void;
}) {
  const percentage =
    item.totalRequired > 0
      ? (item.currentStock / item.totalRequired) * 100
      : 0;
  const progressColor = getProgressColorClass(percentage);
  const tier = tierConfig[item.tier];
  const estimatedTotal =
    item.costPerUnit != null ? item.costPerUnit * item.totalRequired : null;

  const handleStockChange = (value: number) => {
    const clamped = Math.max(0, value);
    onStockUpdate(item.id, clamped);
  };

  return (
    <Card className="bg-cream">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <CardTitle className="text-maroon">{item.name}</CardTitle>
            {item.nameLocal && (
              <p className="mt-0.5 text-xs text-muted-foreground">
                {item.nameLocal}
              </p>
            )}
          </div>
          <div className="flex shrink-0 gap-1.5">
            <Badge variant="secondary" className="text-xs">
              {item.category}
            </Badge>
            <Badge className={`text-xs ${tier.className}`}>{tier.label}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress */}
        <div className="space-y-1.5">
          <Progress
            value={Math.min(percentage, 100)}
            className={`[&_[data-slot=progress-indicator]]:${progressColor}`}
          />
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">
              {item.currentStock}
            </span>{" "}
            / {item.totalRequired} {item.unit}
          </p>
        </div>

        {/* Cost Info */}
        {item.costPerUnit != null && (
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <IndianRupee className="size-3" />
              <span>Cost per unit: {formatCurrency(item.costPerUnit)}</span>
            </div>
            {estimatedTotal != null && (
              <div className="flex items-center gap-1 font-medium text-vermillion">
                <IndianRupee className="size-3" />
                <span>Est. total: {formatCurrency(estimatedTotal)}</span>
              </div>
            )}
          </div>
        )}

        <Separator />

        {/* Inline Stock Update */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Update Stock</Label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => handleStockChange(item.currentStock - 1)}
              disabled={item.currentStock <= 0}
              className="shrink-0"
            >
              <Minus className="size-3.5" />
            </Button>
            <Input
              type="number"
              value={item.currentStock}
              onChange={(e) => handleStockChange(Number(e.target.value))}
              className="h-7 text-center"
              min={0}
            />
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => handleStockChange(item.currentStock + 1)}
              className="shrink-0"
            >
              <Plus className="size-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function InventoryGrid({ items, onStockUpdate }: {
  items: TamboolamItem[];
  onStockUpdate: (id: string, newStock: number) => void;
}) {
  if (items.length === 0) {
    return (
      <Card className="bg-cream">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Package className="mb-3 size-10 text-muted-foreground" />
          <p className="text-lg font-medium text-muted-foreground">
            No items in this category
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <InventoryCard
          key={item.id}
          item={item}
          onStockUpdate={onStockUpdate}
        />
      ))}
    </div>
  );
}

export default function TamboolamPage() {
  const { tamboolamItems, updateTamboolamStock } = useWeddingStore();
  const [activeTab, setActiveTab] = useState("All");

  const categories = ["All", "Thamboolam", "Sweets", "Return Gifts"];

  const filteredItems =
    activeTab === "All"
      ? tamboolamItems
      : tamboolamItems.filter((item) => item.category === activeTab);

  const totalItems = tamboolamItems.length;
  const fullyStocked = tamboolamItems.filter(
    (item) => item.currentStock >= item.totalRequired
  ).length;
  const needsPurchase = tamboolamItems.filter(
    (item) => item.currentStock < item.totalRequired
  ).length;

  const totalEstimatedCost = tamboolamItems.reduce((sum, item) => {
    if (item.costPerUnit != null) {
      return sum + item.costPerUnit * item.totalRequired;
    }
    return sum;
  }, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-maroon flex items-center gap-2">
          <Gift className="size-8 text-vermillion" />
          Thamboolam & Return Gifts
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Inventory Tracker</p>
      </div>

      {/* Summary Row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-l-4 border-l-turmeric bg-cream">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Package className="size-4" />
              Total Items Tracked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-maroon">{totalItems}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 bg-cream">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <CheckCircle2 className="size-4 text-green-600" />
              Fully Stocked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-700">{fullyStocked}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-vermillion bg-cream">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <AlertCircle className="size-4 text-vermillion" />
              Needs Purchase
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-vermillion">
              {needsPurchase}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Category Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as string)}
      >
        <TabsList className="bg-gold/20">
          {categories.map((cat) => {
            const icon =
              cat === "All" ? (
                <Package className="size-3.5" />
              ) : cat === "Thamboolam" ? (
                <Gift className="size-3.5" />
              ) : cat === "Sweets" ? (
                <Candy className="size-3.5" />
              ) : (
                <ShoppingCart className="size-3.5" />
              );

            return (
              <TabsTrigger key={cat} value={cat} className="gap-1.5">
                {icon}
                {cat}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {categories.map((cat) => {
          const items =
            cat === "All"
              ? tamboolamItems
              : tamboolamItems.filter((item) => item.category === cat);

          return (
            <TabsContent key={cat} value={cat}>
              <InventoryGrid
                items={items}
                onStockUpdate={updateTamboolamStock}
              />
            </TabsContent>
          );
        })}
      </Tabs>

      <Separator />

      {/* Total Estimated Cost */}
      <Card className="border-2 border-turmeric bg-cream">
        <CardContent className="flex items-center justify-between py-6">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-turmeric">
              <IndianRupee className="size-5 text-maroon" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Estimated Cost
              </p>
              <p className="text-xs text-muted-foreground">
                Sum of (cost per unit x total required) for all items
              </p>
            </div>
          </div>
          <p className="text-3xl font-bold text-maroon">
            {formatCurrency(totalEstimatedCost)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
