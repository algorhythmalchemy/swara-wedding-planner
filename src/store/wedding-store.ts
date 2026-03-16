import { create } from "zustand";
import {
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
import {
  fetchAllData,
  dbAddEvent,
  dbToggleEventComplete,
  dbAddTask,
  dbToggleTaskComplete,
  dbDeleteTask,
  dbAddGuest,
  dbUpdateGuest,
  dbDeleteGuest,
  dbUpdateRSVP,
  dbAddBudgetCategory,
  dbAddExpense,
  dbDeleteExpense,
  dbUpdateBudgetCategorySpent,
  dbAddVendor,
  dbUpdateVendor,
  dbUpdateTamboolamStock,
  dbUpdateInvitationStatus,
  dbToggleChecklistItem,
} from "@/lib/supabase-data";

interface WeddingStore {
  // Config
  weddingDate: string;
  brideName: string;
  groomName: string;

  // Loading state
  isLoading: boolean;
  isHydrated: boolean;

  // Data
  events: WeddingEvent[];
  tasks: Task[];
  guests: Guest[];
  rsvps: RSVP[];
  budgetCategories: BudgetCategory[];
  expenses: Expense[];
  vendors: Vendor[];
  tamboolamItems: TamboolamItem[];
  invitationAssignments: InvitationAssignment[];
  dayOfChecklist: DayOfChecklistItem[];

  // Hydration
  hydrate: () => Promise<void>;

  // Actions - Events
  addEvent: (event: WeddingEvent) => void;
  toggleEventComplete: (id: string) => void;

  // Actions - Tasks
  addTask: (task: Task) => void;
  toggleTaskComplete: (id: string) => void;
  deleteTask: (id: string) => void;

  // Actions - Guests
  addGuest: (guest: Guest) => void;
  updateGuest: (id: string, guest: Partial<Guest>) => void;
  deleteGuest: (id: string) => void;

  // Actions - RSVPs
  updateRSVP: (id: string, rsvp: Partial<RSVP>) => void;

  // Actions - Budget
  addBudgetCategory: (category: BudgetCategory) => void;
  addExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;

  // Actions - Vendors
  addVendor: (vendor: Vendor) => void;
  updateVendor: (id: string, vendor: Partial<Vendor>) => void;

  // Actions - Thamboolam
  updateTamboolamStock: (id: string, newStock: number) => void;

  // Actions - Invitations
  updateInvitationStatus: (id: string, assignment: Partial<InvitationAssignment>) => void;

  // Actions - Day-of
  toggleChecklistItem: (id: string) => void;
}

export const useWeddingStore = create<WeddingStore>((set, get) => ({
  weddingDate: "2026-04-30",
  brideName: "Rachana",
  groomName: "Aditya",

  isLoading: true,
  isHydrated: false,

  // Start empty — Supabase is the source of truth
  events: [],
  tasks: [],
  guests: [],
  rsvps: [],
  budgetCategories: [],
  expenses: [],
  vendors: [],
  tamboolamItems: [],
  invitationAssignments: [],
  dayOfChecklist: [],

  hydrate: async () => {
    if (get().isHydrated) return;
    set({ isLoading: true });
    try {
      const data = await fetchAllData();
      set({ ...data, isLoading: false, isHydrated: true });
    } catch (err) {
      console.error("Failed to hydrate from Supabase:", err);
      set({ isLoading: false, isHydrated: true });
    }
  },

  addEvent: (event) => {
    const tempId = event.id;
    set((state) => ({ events: [...state.events, event] }));
    dbAddEvent(event).then((saved) => {
      if (saved) {
        set((state) => ({
          events: state.events.map((e) => (e.id === tempId ? saved : e)),
        }));
      }
    });
  },

  toggleEventComplete: (id) => {
    const event = get().events.find((e) => e.id === id);
    if (!event) return;
    const newVal = !event.isCompleted;
    set((state) => ({
      events: state.events.map((e) =>
        e.id === id ? { ...e, isCompleted: newVal } : e
      ),
    }));
    dbToggleEventComplete(id, newVal);
  },

  addTask: (task) => {
    // Optimistic: add with temp id, then replace with Supabase id
    const tempId = task.id;
    set((state) => ({ tasks: [...state.tasks, task] }));
    dbAddTask(task).then((saved) => {
      if (saved) {
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === tempId ? saved : t)),
        }));
      }
    });
  },

  toggleTaskComplete: (id) => {
    const task = get().tasks.find((t) => t.id === id);
    if (!task) return;
    const newVal = !task.isCompleted;
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, isCompleted: newVal } : t
      ),
    }));
    dbToggleTaskComplete(id, newVal);
  },

  deleteTask: (id) => {
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));
    dbDeleteTask(id);
  },

  addGuest: (guest) => {
    const tempId = guest.id;
    set((state) => ({ guests: [...state.guests, guest] }));
    dbAddGuest(guest).then((saved) => {
      if (saved) {
        set((state) => ({
          guests: state.guests.map((g) => (g.id === tempId ? saved : g)),
        }));
      }
    });
  },

  updateGuest: (id, guest) => {
    set((state) => ({
      guests: state.guests.map((g) => (g.id === id ? { ...g, ...guest } : g)),
    }));
    dbUpdateGuest(id, guest);
  },

  deleteGuest: (id) => {
    set((state) => ({ guests: state.guests.filter((g) => g.id !== id) }));
    dbDeleteGuest(id);
  },

  updateRSVP: (id, rsvp) => {
    set((state) => ({
      rsvps: state.rsvps.map((r) => (r.id === id ? { ...r, ...rsvp } : r)),
    }));
    dbUpdateRSVP(id, rsvp);
  },

  addBudgetCategory: (category) => {
    const tempId = category.id;
    set((state) => ({ budgetCategories: [...state.budgetCategories, category] }));
    dbAddBudgetCategory(category).then((saved) => {
      if (saved) {
        set((state) => ({
          budgetCategories: state.budgetCategories.map((bc) =>
            bc.id === tempId ? saved : bc
          ),
        }));
      }
    });
  },

  addExpense: (expense) => {
    const tempId = expense.id;
    set((state) => ({
      expenses: [...state.expenses, expense],
      budgetCategories: state.budgetCategories.map((bc) =>
        bc.id === expense.categoryId
          ? { ...bc, spent: bc.spent + expense.amount }
          : bc
      ),
    }));
    // Update Supabase
    dbAddExpense(expense).then((saved) => {
      if (saved) {
        set((state) => ({
          expenses: state.expenses.map((e) => (e.id === tempId ? saved : e)),
        }));
      }
    });
    // Also update the budget category spent in DB
    const cat = get().budgetCategories.find((bc) => bc.id === expense.categoryId);
    if (cat) {
      dbUpdateBudgetCategorySpent(cat.id, cat.spent + expense.amount);
    }
  },

  deleteExpense: (id) => {
    const expense = get().expenses.find((e) => e.id === id);
    set((state) => ({
      expenses: state.expenses.filter((e) => e.id !== id),
      budgetCategories: expense
        ? state.budgetCategories.map((bc) =>
            bc.id === expense.categoryId
              ? { ...bc, spent: bc.spent - expense.amount }
              : bc
          )
        : state.budgetCategories,
    }));
    dbDeleteExpense(id);
    if (expense) {
      const cat = get().budgetCategories.find((bc) => bc.id === expense.categoryId);
      if (cat) {
        dbUpdateBudgetCategorySpent(cat.id, cat.spent - expense.amount);
      }
    }
  },

  addVendor: (vendor) => {
    const tempId = vendor.id;
    set((state) => ({ vendors: [...state.vendors, vendor] }));
    dbAddVendor(vendor).then((saved) => {
      if (saved) {
        set((state) => ({
          vendors: state.vendors.map((v) => (v.id === tempId ? saved : v)),
        }));
      }
    });
  },

  updateVendor: (id, vendor) => {
    set((state) => ({
      vendors: state.vendors.map((v) => (v.id === id ? { ...v, ...vendor } : v)),
    }));
    dbUpdateVendor(id, vendor);
  },

  updateTamboolamStock: (id, newStock) => {
    set((state) => ({
      tamboolamItems: state.tamboolamItems.map((t) =>
        t.id === id ? { ...t, currentStock: newStock } : t
      ),
    }));
    dbUpdateTamboolamStock(id, newStock);
  },

  updateInvitationStatus: (id, assignment) => {
    set((state) => ({
      invitationAssignments: state.invitationAssignments.map((ia) =>
        ia.id === id ? { ...ia, ...assignment } : ia
      ),
    }));
    dbUpdateInvitationStatus(id, assignment);
  },

  toggleChecklistItem: (id) => {
    const item = get().dayOfChecklist.find((dc) => dc.id === id);
    if (!item) return;
    const newVal = !item.isCompleted;
    set((state) => ({
      dayOfChecklist: state.dayOfChecklist.map((dc) =>
        dc.id === id ? { ...dc, isCompleted: newVal } : dc
      ),
    }));
    dbToggleChecklistItem(id, newVal);
  },
}));
