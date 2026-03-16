-- ============================================
-- SwaRa Wedding Planner - Supabase Schema
-- ============================================
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor)

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========== EVENTS (Ritual Timeline) ==========
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  name_kannada TEXT,
  name_telugu TEXT,
  phase TEXT NOT NULL CHECK (phase IN ('pre-wedding', 'wedding-day', 'post-wedding')),
  event_date DATE,
  event_time TIME,
  location TEXT,
  description TEXT,
  is_completed BOOLEAN DEFAULT FALSE,
  sort_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========== TASKS (Shopping, Cards, Prep) ==========
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('shopping', 'card-distribution', 'vendor', 'ritual-prep', 'logistics', 'general')),
  assignee TEXT NOT NULL,
  due_date DATE NOT NULL,
  location TEXT,
  attendees TEXT[],
  is_completed BOOLEAN DEFAULT FALSE,
  priority TEXT NOT NULL CHECK (priority IN ('high', 'medium', 'low')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========== GUESTS ==========
CREATE TABLE guests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_name TEXT NOT NULL,
  head_of_family TEXT NOT NULL,
  members INTEGER NOT NULL DEFAULT 1,
  side TEXT NOT NULL CHECK (side IN ('vadhuvu', 'varudu', 'mutual')),
  phone TEXT,
  city TEXT,
  gift_tier TEXT NOT NULL CHECK (gift_tier IN ('close-family', 'beegaru', 'regular', 'vip')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========== RSVPs (Per-event tracking) ==========
CREATE TABLE rsvps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guest_id UUID REFERENCES guests(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'declined', 'maybe')),
  attending_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(guest_id, event_id)
);

-- ========== BUDGET CATEGORIES ==========
CREATE TABLE budget_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  name_local TEXT,
  allocated DECIMAL(12,2) NOT NULL DEFAULT 0,
  spent DECIMAL(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========== EXPENSES ==========
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES budget_categories(id) ON DELETE SET NULL,
  description TEXT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  expense_date DATE NOT NULL,
  vendor TEXT,
  payment_status TEXT NOT NULL CHECK (payment_status IN ('pending', 'advance-paid', 'paid', 'overdue')),
  receipt_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========== VENDORS ==========
CREATE TABLE vendors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  amount DECIMAL(12,2),
  payment_status TEXT NOT NULL CHECK (payment_status IN ('pending', 'advance-paid', 'paid', 'overdue')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========== THAMBOOLAM ITEMS ==========
CREATE TABLE thamboolam_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  name_local TEXT,
  category TEXT NOT NULL,
  total_required INTEGER NOT NULL,
  current_stock INTEGER NOT NULL DEFAULT 0,
  unit TEXT NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('close-family', 'beegaru', 'regular', 'vip')),
  cost_per_unit DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========== ACCOMMODATIONS ==========
CREATE TABLE accommodations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guest_id UUID REFERENCES guests(id) ON DELETE CASCADE,
  room_type TEXT NOT NULL,
  location TEXT NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========== INVITATION ASSIGNMENTS ==========
CREATE TABLE invitation_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guest_id UUID REFERENCES guests(id) ON DELETE CASCADE,
  assignee TEXT NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('in-person', 'courier', 'whatsapp', 'phone')),
  planned_date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'scheduled', 'completed')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========== DAY-OF CHECKLIST ==========
CREATE TABLE day_of_checklist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task TEXT NOT NULL,
  category TEXT NOT NULL,
  assignee TEXT,
  task_time TIME,
  is_completed BOOLEAN DEFAULT FALSE,
  sort_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========== OPEN ACCESS (Family App - No Auth Required) ==========
-- Disable RLS for simple family sharing without login

ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE thamboolam_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE accommodations ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitation_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE day_of_checklist ENABLE ROW LEVEL SECURITY;

-- Allow anonymous (no login) full access for family use
CREATE POLICY "Open access" ON events FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Open access" ON tasks FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Open access" ON guests FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Open access" ON rsvps FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Open access" ON budget_categories FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Open access" ON expenses FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Open access" ON vendors FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Open access" ON thamboolam_items FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Open access" ON accommodations FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Open access" ON invitation_assignments FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Open access" ON day_of_checklist FOR ALL TO anon USING (true) WITH CHECK (true);

-- Also allow authenticated access (if you add auth later)
CREATE POLICY "Auth access" ON events FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth access" ON tasks FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth access" ON guests FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth access" ON rsvps FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth access" ON budget_categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth access" ON expenses FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth access" ON vendors FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth access" ON thamboolam_items FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth access" ON accommodations FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth access" ON invitation_assignments FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth access" ON day_of_checklist FOR ALL TO authenticated USING (true) WITH CHECK (true);
