// ============================================
// Kannada-Telugu Brahmin Wedding Planner Types
// ============================================

export type EventPhase = "pre-wedding" | "wedding-day" | "post-wedding";
export type RSVPStatus = "pending" | "confirmed" | "declined" | "maybe";
export type PaymentStatus = "pending" | "advance-paid" | "paid" | "overdue";
export type InviteMode = "in-person" | "courier" | "whatsapp" | "phone";
export type InviteStatus = "pending" | "scheduled" | "completed";
export type GuestSide = "vadhuvu" | "varudu" | "mutual";
export type GiftTier = "close-family" | "beegaru" | "regular" | "vip";
export type TaskCategory = "shopping" | "card-distribution" | "vendor" | "ritual-prep" | "logistics" | "general";

export interface WeddingEvent {
  id: string;
  name: string;
  nameKannada?: string;
  nameTelugu?: string;
  phase: EventPhase;
  date?: string;
  time?: string;
  location?: string;
  description?: string;
  isCompleted: boolean;
  order: number;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  assignee: string;
  dueDate: string;
  location?: string;
  attendees?: string[];
  isCompleted: boolean;
  priority: "high" | "medium" | "low";
}

export interface Guest {
  id: string;
  familyName: string;
  headOfFamily: string;
  members: number;
  side: GuestSide;
  phone?: string;
  city?: string;
  giftTier: GiftTier;
}

export interface RSVP {
  id: string;
  guestId: string;
  eventId: string;
  status: RSVPStatus;
  attendingCount: number;
}

export interface BudgetCategory {
  id: string;
  name: string;
  nameLocal?: string;
  allocated: number;
  spent: number;
  icon?: string;
}

export interface Expense {
  id: string;
  categoryId: string;
  description: string;
  amount: number;
  date: string;
  vendor?: string;
  paymentStatus: PaymentStatus;
  receiptUrl?: string;
  notes?: string;
}

export interface Vendor {
  id: string;
  name: string;
  role: string;
  phone: string;
  email?: string;
  amount?: number;
  paymentStatus: PaymentStatus;
  notes?: string;
}

export interface TamboolamItem {
  id: string;
  name: string;
  nameLocal?: string;
  category: string;
  totalRequired: number;
  currentStock: number;
  unit: string;
  tier: GiftTier;
  costPerUnit?: number;
}

export interface Accommodation {
  id: string;
  guestId: string;
  roomType: string;
  location: string;
  checkIn: string;
  checkOut: string;
  notes?: string;
}

export interface InvitationAssignment {
  id: string;
  guestId: string;
  assignee: string;
  mode: InviteMode;
  plannedDate: string;
  status: InviteStatus;
  notes?: string;
}

export interface DayOfChecklistItem {
  id: string;
  task: string;
  category: string;
  assignee?: string;
  time?: string;
  isCompleted: boolean;
  order: number;
}
