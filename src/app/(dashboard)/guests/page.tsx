"use client";

import { useState } from "react";
import { useWeddingStore } from "@/store/wedding-store";
import type { Guest, GuestSide, GiftTier, RSVPStatus } from "@/types";

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
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import {
  Users,
  UserPlus,
  Plus,
  Trash2,
  Phone,
  MapPin,
  Crown,
  Heart,
} from "lucide-react";

const SIDE_LABELS: Record<GuestSide, string> = {
  vadhuvu: "Vadhuvu (Bride)",
  varudu: "Varudu (Groom)",
  mutual: "Mutual",
};

const GIFT_TIER_LABELS: Record<GiftTier, string> = {
  "close-family": "Close Family",
  beegaru: "Beegaru",
  regular: "Regular",
  vip: "VIP",
};

const RSVP_STATUS_LABELS: Record<RSVPStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  declined: "Declined",
  maybe: "Maybe",
};

function sideBadgeClass(side: GuestSide): string {
  switch (side) {
    case "vadhuvu":
      return "bg-vermillion text-white";
    case "varudu":
      return "bg-blue-600 text-white";
    case "mutual":
      return "bg-gold text-maroon";
  }
}

function giftTierBadgeClass(tier: GiftTier): string {
  switch (tier) {
    case "close-family":
      return "bg-maroon text-white";
    case "beegaru":
      return "bg-turmeric text-maroon";
    case "regular":
      return "bg-cream text-maroon border border-maroon/20";
    case "vip":
      return "bg-gold text-maroon";
  }
}

function rsvpBadgeClass(status: RSVPStatus): string {
  switch (status) {
    case "confirmed":
      return "bg-green-600 text-white";
    case "pending":
      return "bg-yellow-500 text-white";
    case "declined":
      return "bg-red-600 text-white";
    case "maybe":
      return "bg-blue-500 text-white";
  }
}

function getGuestRSVPStatus(
  guestId: string,
  rsvps: { guestId: string; status: RSVPStatus }[]
): RSVPStatus {
  const guestRsvp = rsvps.find((r) => r.guestId === guestId);
  return guestRsvp?.status ?? "pending";
}

export default function GuestsPage() {
  const { guests, rsvps, addGuest, deleteGuest } = useWeddingStore();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    familyName: "",
    headOfFamily: "",
    members: 1,
    side: "vadhuvu" as GuestSide,
    phone: "",
    city: "",
    giftTier: "regular" as GiftTier,
  });

  const totalMembers = guests.reduce((sum, g) => sum + g.members, 0);
  const totalFamilies = guests.length;

  const confirmedRSVPs = rsvps
    .filter((r) => r.status === "confirmed")
    .reduce((sum, r) => sum + r.attendingCount, 0);

  const pendingRSVPs = rsvps.filter((r) => r.status === "pending").length;

  function handleAddGuest() {
    if (!formData.familyName.trim() || !formData.headOfFamily.trim()) return;

    const newGuest: Guest = {
      id: `g-${Date.now()}`,
      familyName: formData.familyName.trim(),
      headOfFamily: formData.headOfFamily.trim(),
      members: formData.members,
      side: formData.side,
      phone: formData.phone.trim() || undefined,
      city: formData.city.trim() || undefined,
      giftTier: formData.giftTier,
    };

    addGuest(newGuest);
    setFormData({
      familyName: "",
      headOfFamily: "",
      members: 1,
      side: "vadhuvu",
      phone: "",
      city: "",
      giftTier: "regular",
    });
    setDialogOpen(false);
  }

  function renderGuestTable(filteredGuests: Guest[]) {
    if (filteredGuests.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <Users className="mb-3 size-10 opacity-40" />
          <p className="text-sm">No guests found in this category.</p>
        </div>
      );
    }

    return (
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="bg-cream/50">
              <TableHead>Family Name</TableHead>
              <TableHead>Head of Family</TableHead>
              <TableHead className="text-center">Members</TableHead>
              <TableHead>Side</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Gift Tier</TableHead>
              <TableHead>RSVP Status</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGuests.map((guest) => {
              const status = getGuestRSVPStatus(guest.id, rsvps);
              return (
                <TableRow key={guest.id} className="hover:bg-cream/30">
                  <TableCell className="font-medium">
                    {guest.familyName}
                  </TableCell>
                  <TableCell>{guest.headOfFamily}</TableCell>
                  <TableCell className="text-center">{guest.members}</TableCell>
                  <TableCell>
                    <Badge className={sideBadgeClass(guest.side)}>
                      {SIDE_LABELS[guest.side]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {guest.city ? (
                      <span className="inline-flex items-center gap-1 text-muted-foreground">
                        <MapPin className="size-3" />
                        {guest.city}
                      </span>
                    ) : (
                      <span className="text-muted-foreground/50">--</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={giftTierBadgeClass(guest.giftTier)}>
                      {GIFT_TIER_LABELS[guest.giftTier]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={rsvpBadgeClass(status)}>
                      {RSVP_STATUS_LABELS[status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => deleteGuest(guest.id)}
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  }

  const vadhuvuGuests = guests.filter((g) => g.side === "vadhuvu");
  const varuduGuests = guests.filter((g) => g.side === "varudu");
  const mutualGuests = guests.filter((g) => g.side === "mutual");

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-vermillion">
            <Heart className="size-6" />
            Guest List &amp; RSVP
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {totalFamilies} families &middot; {totalMembers} total guests
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger
            render={
              <Button className="bg-vermillion text-white hover:bg-maroon" />
            }
          >
            <Plus className="mr-1 size-4" />
            Add Guest Family
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-vermillion">
                <UserPlus className="size-5" />
                Add New Guest Family
              </DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-2">
              <div className="grid gap-1.5">
                <Label htmlFor="familyName">Family Name</Label>
                <Input
                  id="familyName"
                  placeholder="e.g. Sharma Family"
                  value={formData.familyName}
                  onChange={(e) =>
                    setFormData({ ...formData, familyName: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="headOfFamily">Head of Family</Label>
                <Input
                  id="headOfFamily"
                  placeholder="e.g. Sri Ramachandra Sharma"
                  value={formData.headOfFamily}
                  onChange={(e) =>
                    setFormData({ ...formData, headOfFamily: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1.5">
                  <Label htmlFor="members">Members</Label>
                  <Input
                    id="members"
                    type="number"
                    min={1}
                    value={formData.members}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        members: parseInt(e.target.value, 10) || 1,
                      })
                    }
                  />
                </div>

                <div className="grid gap-1.5">
                  <Label>Side</Label>
                  <Select
                    value={formData.side}
                    onValueChange={(val) =>
                      setFormData({ ...formData, side: val as GuestSide })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select side" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vadhuvu">Vadhuvu (Bride)</SelectItem>
                      <SelectItem value="varudu">Varudu (Groom)</SelectItem>
                      <SelectItem value="mutual">Mutual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1.5">
                  <Label htmlFor="phone">
                    <Phone className="mr-1 inline size-3" />
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    placeholder="Optional"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="city">
                    <MapPin className="mr-1 inline size-3" />
                    City
                  </Label>
                  <Input
                    id="city"
                    placeholder="Optional"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid gap-1.5">
                <Label>
                  <Crown className="mr-1 inline size-3" />
                  Gift Tier
                </Label>
                <Select
                  value={formData.giftTier}
                  onValueChange={(val) =>
                    setFormData({ ...formData, giftTier: val as GiftTier })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select gift tier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="close-family">Close Family</SelectItem>
                    <SelectItem value="beegaru">Beegaru</SelectItem>
                    <SelectItem value="regular">Regular</SelectItem>
                    <SelectItem value="vip">VIP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handleAddGuest}
              className="w-full bg-vermillion text-white hover:bg-maroon"
            >
              <Plus className="mr-1 size-4" />
              Add Guest Family
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-turmeric/30 bg-cream/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Families
            </CardTitle>
            <Users className="size-4 text-vermillion" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-maroon">
              {totalFamilies}
            </div>
          </CardContent>
        </Card>

        <Card className="border-turmeric/30 bg-cream/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Guest Count
            </CardTitle>
            <Heart className="size-4 text-vermillion" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-maroon">
              {totalMembers}
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Confirmed RSVPs
            </CardTitle>
            <UserPlus className="size-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">
              {confirmedRSVPs}
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-yellow-50/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending RSVPs
            </CardTitle>
            <Crown className="size-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-700">
              {pendingRSVPs}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs + Guest Table */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="vadhuvu">Vadhuvu Side (Bride)</TabsTrigger>
          <TabsTrigger value="varudu">Varudu Side (Groom)</TabsTrigger>
          <TabsTrigger value="mutual">Mutual</TabsTrigger>
        </TabsList>

        <TabsContent value="all">{renderGuestTable(guests)}</TabsContent>
        <TabsContent value="vadhuvu">
          {renderGuestTable(vadhuvuGuests)}
        </TabsContent>
        <TabsContent value="varudu">
          {renderGuestTable(varuduGuests)}
        </TabsContent>
        <TabsContent value="mutual">
          {renderGuestTable(mutualGuests)}
        </TabsContent>
      </Tabs>
    </div>
  );
}
