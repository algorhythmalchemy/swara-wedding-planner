import { supabase } from "./supabase";
import type {
  WeddingEvent,
  Task,
  Guest,
  RSVP,
  BudgetCategory,
  Expense,
  Vendor,
  TamboolamItem,
  InvitationAssignment,
  DayOfChecklistItem,
} from "@/types";

// ============================================
// Row <-> App type mappers (snake_case <-> camelCase)
// ============================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toEvent = (r: any): WeddingEvent => ({
  id: r.id,
  name: r.name,
  nameKannada: r.name_kannada,
  nameTelugu: r.name_telugu,
  phase: r.phase,
  date: r.event_date,
  time: r.event_time,
  location: r.location,
  description: r.description,
  isCompleted: r.is_completed,
  order: r.sort_order,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toTask = (r: any): Task => ({
  id: r.id,
  title: r.title,
  description: r.description,
  category: r.category,
  assignee: r.assignee,
  dueDate: r.due_date,
  location: r.location,
  attendees: r.attendees,
  isCompleted: r.is_completed,
  priority: r.priority,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toGuest = (r: any): Guest => ({
  id: r.id,
  familyName: r.family_name,
  headOfFamily: r.head_of_family,
  members: r.members,
  side: r.side,
  phone: r.phone,
  city: r.city,
  giftTier: r.gift_tier,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toRSVP = (r: any): RSVP => ({
  id: r.id,
  guestId: r.guest_id,
  eventId: r.event_id,
  status: r.status,
  attendingCount: r.attending_count,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toBudgetCategory = (r: any): BudgetCategory => ({
  id: r.id,
  name: r.name,
  nameLocal: r.name_local,
  allocated: Number(r.allocated),
  spent: Number(r.spent),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toExpense = (r: any): Expense => ({
  id: r.id,
  categoryId: r.category_id,
  description: r.description,
  amount: Number(r.amount),
  date: r.expense_date,
  vendor: r.vendor,
  paymentStatus: r.payment_status,
  receiptUrl: r.receipt_url,
  notes: r.notes,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toVendor = (r: any): Vendor => ({
  id: r.id,
  name: r.name,
  role: r.role,
  phone: r.phone,
  email: r.email,
  amount: r.amount ? Number(r.amount) : undefined,
  paymentStatus: r.payment_status,
  notes: r.notes,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toTamboolamItem = (r: any): TamboolamItem => ({
  id: r.id,
  name: r.name,
  nameLocal: r.name_local,
  category: r.category,
  totalRequired: r.total_required,
  currentStock: r.current_stock,
  unit: r.unit,
  tier: r.tier,
  costPerUnit: r.cost_per_unit ? Number(r.cost_per_unit) : undefined,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toInvitationAssignment = (r: any): InvitationAssignment => ({
  id: r.id,
  guestId: r.guest_id,
  assignee: r.assignee,
  mode: r.mode,
  plannedDate: r.planned_date,
  status: r.status,
  notes: r.notes,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toDayOfChecklistItem = (r: any): DayOfChecklistItem => ({
  id: r.id,
  task: r.task,
  category: r.category,
  assignee: r.assignee,
  time: r.task_time,
  isCompleted: r.is_completed,
  order: r.sort_order,
});

// ============================================
// Fetch all data
// ============================================

export async function fetchAllData() {
  if (!supabase) throw new Error("Supabase not configured");

  const [
    eventsRes,
    tasksRes,
    guestsRes,
    rsvpsRes,
    budgetCategoriesRes,
    expensesRes,
    vendorsRes,
    tamboolamRes,
    invitationsRes,
    checklistRes,
  ] = await Promise.all([
    supabase.from("events").select("*").order("sort_order"),
    supabase.from("tasks").select("*").order("created_at"),
    supabase.from("guests").select("*").order("created_at"),
    supabase.from("rsvps").select("*"),
    supabase.from("budget_categories").select("*").order("created_at"),
    supabase.from("expenses").select("*").order("expense_date", { ascending: false }),
    supabase.from("vendors").select("*").order("created_at"),
    supabase.from("thamboolam_items").select("*").order("created_at"),
    supabase.from("invitation_assignments").select("*").order("planned_date"),
    supabase.from("day_of_checklist").select("*").order("sort_order"),
  ]);

  return {
    events: (eventsRes.data ?? []).map(toEvent),
    tasks: (tasksRes.data ?? []).map(toTask),
    guests: (guestsRes.data ?? []).map(toGuest),
    rsvps: (rsvpsRes.data ?? []).map(toRSVP),
    budgetCategories: (budgetCategoriesRes.data ?? []).map(toBudgetCategory),
    expenses: (expensesRes.data ?? []).map(toExpense),
    vendors: (vendorsRes.data ?? []).map(toVendor),
    tamboolamItems: (tamboolamRes.data ?? []).map(toTamboolamItem),
    invitationAssignments: (invitationsRes.data ?? []).map(toInvitationAssignment),
    dayOfChecklist: (checklistRes.data ?? []).map(toDayOfChecklistItem),
  };
}

// ============================================
// Mutations
// ============================================

// --- Events ---
export async function dbToggleEventComplete(id: string, isCompleted: boolean) {
  if (!supabase) return;
  await supabase.from("events").update({ is_completed: isCompleted }).eq("id", id);
}

export async function dbAddEvent(event: WeddingEvent) {
  if (!supabase) return null;
  const { data } = await supabase.from("events").insert({
    name: event.name,
    name_kannada: event.nameKannada,
    name_telugu: event.nameTelugu,
    phase: event.phase,
    event_date: event.date,
    event_time: event.time,
    location: event.location,
    description: event.description,
    is_completed: event.isCompleted,
    sort_order: event.order,
  }).select().single();
  return data ? toEvent(data) : null;
}

// --- Tasks ---
export async function dbAddTask(task: Task) {
  if (!supabase) return null;
  const { data } = await supabase.from("tasks").insert({
    title: task.title,
    description: task.description,
    category: task.category,
    assignee: task.assignee,
    due_date: task.dueDate,
    location: task.location,
    attendees: task.attendees,
    is_completed: task.isCompleted,
    priority: task.priority,
  }).select().single();
  return data ? toTask(data) : null;
}

export async function dbToggleTaskComplete(id: string, isCompleted: boolean) {
  if (!supabase) return;
  await supabase.from("tasks").update({ is_completed: isCompleted }).eq("id", id);
}

export async function dbDeleteTask(id: string) {
  if (!supabase) return;
  await supabase.from("tasks").delete().eq("id", id);
}

// --- Guests ---
export async function dbAddGuest(guest: Guest) {
  if (!supabase) return null;
  const { data } = await supabase.from("guests").insert({
    family_name: guest.familyName,
    head_of_family: guest.headOfFamily,
    members: guest.members,
    side: guest.side,
    phone: guest.phone,
    city: guest.city,
    gift_tier: guest.giftTier,
  }).select().single();
  return data ? toGuest(data) : null;
}

export async function dbUpdateGuest(id: string, guest: Partial<Guest>) {
  if (!supabase) return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updates: any = {};
  if (guest.familyName !== undefined) updates.family_name = guest.familyName;
  if (guest.headOfFamily !== undefined) updates.head_of_family = guest.headOfFamily;
  if (guest.members !== undefined) updates.members = guest.members;
  if (guest.side !== undefined) updates.side = guest.side;
  if (guest.phone !== undefined) updates.phone = guest.phone;
  if (guest.city !== undefined) updates.city = guest.city;
  if (guest.giftTier !== undefined) updates.gift_tier = guest.giftTier;
  await supabase.from("guests").update(updates).eq("id", id);
}

export async function dbDeleteGuest(id: string) {
  if (!supabase) return;
  await supabase.from("guests").delete().eq("id", id);
}

// --- RSVPs ---
export async function dbUpdateRSVP(id: string, rsvp: Partial<RSVP>) {
  if (!supabase) return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updates: any = {};
  if (rsvp.status !== undefined) updates.status = rsvp.status;
  if (rsvp.attendingCount !== undefined) updates.attending_count = rsvp.attendingCount;
  await supabase.from("rsvps").update(updates).eq("id", id);
}

// --- Expenses ---
export async function dbAddBudgetCategory(category: BudgetCategory) {
  if (!supabase) return null;
  const { data } = await supabase.from("budget_categories").insert({
    name: category.name,
    name_local: category.nameLocal,
    allocated: category.allocated,
    spent: category.spent,
  }).select().single();
  return data ? toBudgetCategory(data) : null;
}

export async function dbAddExpense(expense: Expense) {
  if (!supabase) return null;
  const { data } = await supabase.from("expenses").insert({
    category_id: expense.categoryId,
    description: expense.description,
    amount: expense.amount,
    expense_date: expense.date,
    vendor: expense.vendor,
    payment_status: expense.paymentStatus,
    receipt_url: expense.receiptUrl,
    notes: expense.notes,
  }).select().single();
  return data ? toExpense(data) : null;
}

export async function dbDeleteExpense(id: string) {
  if (!supabase) return;
  await supabase.from("expenses").delete().eq("id", id);
}

export async function dbUpdateBudgetCategorySpent(id: string, spent: number) {
  if (!supabase) return;
  await supabase.from("budget_categories").update({ spent }).eq("id", id);
}

// --- Vendors ---
export async function dbAddVendor(vendor: Vendor) {
  if (!supabase) return null;
  const { data } = await supabase.from("vendors").insert({
    name: vendor.name,
    role: vendor.role,
    phone: vendor.phone,
    email: vendor.email,
    amount: vendor.amount,
    payment_status: vendor.paymentStatus,
    notes: vendor.notes,
  }).select().single();
  return data ? toVendor(data) : null;
}

export async function dbUpdateVendor(id: string, vendor: Partial<Vendor>) {
  if (!supabase) return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updates: any = {};
  if (vendor.name !== undefined) updates.name = vendor.name;
  if (vendor.role !== undefined) updates.role = vendor.role;
  if (vendor.phone !== undefined) updates.phone = vendor.phone;
  if (vendor.email !== undefined) updates.email = vendor.email;
  if (vendor.amount !== undefined) updates.amount = vendor.amount;
  if (vendor.paymentStatus !== undefined) updates.payment_status = vendor.paymentStatus;
  if (vendor.notes !== undefined) updates.notes = vendor.notes;
  await supabase.from("vendors").update(updates).eq("id", id);
}

// --- Thamboolam ---
export async function dbUpdateTamboolamStock(id: string, currentStock: number) {
  if (!supabase) return;
  await supabase.from("thamboolam_items").update({ current_stock: currentStock }).eq("id", id);
}

// --- Invitations ---
export async function dbUpdateInvitationStatus(id: string, assignment: Partial<InvitationAssignment>) {
  if (!supabase) return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updates: any = {};
  if (assignment.status !== undefined) updates.status = assignment.status;
  if (assignment.mode !== undefined) updates.mode = assignment.mode;
  if (assignment.plannedDate !== undefined) updates.planned_date = assignment.plannedDate;
  if (assignment.notes !== undefined) updates.notes = assignment.notes;
  await supabase.from("invitation_assignments").update(updates).eq("id", id);
}

// --- Day-of Checklist ---
export async function dbToggleChecklistItem(id: string, isCompleted: boolean) {
  if (!supabase) return;
  await supabase.from("day_of_checklist").update({ is_completed: isCompleted }).eq("id", id);
}
