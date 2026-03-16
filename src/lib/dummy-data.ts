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

// ========== WEDDING DATE ==========
export const WEDDING_DATE = "2026-04-30";
export const BRIDE_NAME = "Rachana";
export const GROOM_NAME = "Aditya";

// ========== EVENTS TIMELINE ==========
export const dummyEvents: WeddingEvent[] = [
  // Pre-Wedding
  { id: "e1", name: "Pendlikoothuru / Madarangi", nameKannada: "ಮದರಂಗಿ", nameTelugu: "పెండ్లికూతురు", phase: "pre-wedding", date: "2026-04-23", time: "18:00", location: "Bride's Residence", description: "Haldi & Mehendi ceremony for the bride", isCompleted: false, order: 1 },
  { id: "e2", name: "Devara Samaradhane / Devatha Karyam", nameKannada: "ದೇವರ ಸಮಾರಾಧನೆ", nameTelugu: "దేవతా కార్యం", phase: "pre-wedding", date: "2026-04-24", time: "09:00", location: "Kalyana Mantapa", description: "Prayers to family deity and ancestors", isCompleted: false, order: 2 },
  { id: "e3", name: "Snathakam", nameKannada: "ಸ್ನಾತಕಂ", nameTelugu: "స్నాతకం", phase: "pre-wedding", date: "2026-04-25", time: "08:00", location: "Kalyana Mantapa - Groom's Hall", description: "Groom's graduation ceremony - symbolic completion of Brahmacharya", isCompleted: false, order: 3 },
  { id: "e4", name: "Kashi Yatra", nameKannada: "ಕಾಶೀ ಯಾತ್ರೆ", nameTelugu: "కాశీ యాత్ర", phase: "pre-wedding", date: "2026-04-25", time: "10:00", location: "Kalyana Mantapa", description: "Groom pretends to leave for Kashi, bride's father persuades him to marry", isCompleted: false, order: 4 },
  { id: "e5", name: "Edurukolu (Reception of Groom)", nameKannada: "ಎದುರುಕೊಳು", nameTelugu: "ఎదురుకోలు", phase: "pre-wedding", date: "2026-04-25", time: "16:00", location: "Kalyana Mantapa Entrance", description: "Formal welcome of groom's family by bride's family", isCompleted: false, order: 5 },
  { id: "e6", name: "Varapooja", nameKannada: "ವರಪೂಜೆ", nameTelugu: "వరపూజ", phase: "pre-wedding", date: "2026-04-25", time: "17:00", location: "Kalyana Mantapa - Main Hall", description: "Bride's parents honor the groom", isCompleted: false, order: 6 },

  // Wedding Day
  { id: "e7", name: "Mangala Snanam", nameKannada: "ಮಂಗಳ ಸ್ನಾನ", nameTelugu: "మంగళ స్నానం", phase: "wedding-day", date: "2026-04-26", time: "04:30", location: "Respective rooms", description: "Auspicious bath for bride and groom", isCompleted: false, order: 7 },
  { id: "e8", name: "Gowri Puja", nameKannada: "ಗೌರಿ ಪೂಜೆ", nameTelugu: "గౌరీ పూజ", phase: "wedding-day", date: "2026-04-26", time: "05:30", location: "Mantapa - Bride's side", description: "Bride worships Goddess Gowri for marital bliss", isCompleted: false, order: 8 },
  { id: "e9", name: "Madhuparkam & Attire Change", nameKannada: "ಮಧುಪರ್ಕಂ", nameTelugu: "మధుపర్కం", phase: "wedding-day", date: "2026-04-26", time: "06:00", location: "Mantapa", description: "Groom offered honey mixture, changes to Pancha/Dhoti", isCompleted: false, order: 9 },
  { id: "e10", name: "Jeelakarra Bellam (Muhurtham)", nameKannada: "ಜೀಲಕರ್ರ ಬೆಲ್ಲಂ", nameTelugu: "జీలకర్ర బెల్లం", phase: "wedding-day", date: "2026-04-26", time: "07:15", location: "Main Mandapam", description: "THE MUHURTHAM - Cumin & Jaggery paste on heads. The sacred moment!", isCompleted: false, order: 10 },
  { id: "e11", name: "Kanyadaanam / Dhare", nameKannada: "ಧಾರೆ", nameTelugu: "కన్యాదానం", phase: "wedding-day", date: "2026-04-26", time: "07:30", location: "Main Mandapam", description: "Father gives away the bride - pouring of sacred water", isCompleted: false, order: 11 },
  { id: "e12", name: "Mangalasutra Dharana", nameKannada: "ಮಂಗಳಸೂತ್ರ ಧಾರಣೆ", nameTelugu: "మంగళసూత్ర ధారణ", phase: "wedding-day", date: "2026-04-26", time: "07:45", location: "Main Mandapam", description: "Tying of the sacred Mangalasutra with three knots", isCompleted: false, order: 12 },
  { id: "e13", name: "Talambralu", nameKannada: "ತಲಂಬ್ರಾಳು", nameTelugu: "తలంబ్రాలు", phase: "wedding-day", date: "2026-04-26", time: "08:00", location: "Main Mandapam", description: "Bride & groom shower each other with rice mixed with turmeric", isCompleted: false, order: 13 },
  { id: "e14", name: "Saptapadi", nameKannada: "ಸಪ್ತಪದಿ", nameTelugu: "సప్తపది", phase: "wedding-day", date: "2026-04-26", time: "08:15", location: "Main Mandapam", description: "Seven steps around the sacred fire", isCompleted: false, order: 14 },
  { id: "e15", name: "Arundhati Darshanam", nameKannada: "ಅರುಂಧತೀ ದರ್ಶನಂ", nameTelugu: "అరుంధతీ దర్శనం", phase: "wedding-day", date: "2026-04-26", time: "08:30", location: "Main Mandapam", description: "Couple shown the Arundhati star - symbol of devotion", isCompleted: false, order: 15 },

  // Post-Wedding
  { id: "e16", name: "Grihapravesham", nameKannada: "ಗೃಹಪ್ರವೇಶಂ", nameTelugu: "గృహప్రవేశం", phase: "post-wedding", date: "2026-04-27", time: "10:00", location: "Groom's Residence", description: "Bride enters groom's home for the first time", isCompleted: false, order: 16 },
  { id: "e17", name: "Satyanarayana Swamy Vratam", nameKannada: "ಸತ್ಯನಾರಾಯಣ ಸ್ವಾಮಿ ವ್ರತಂ", nameTelugu: "సత్యనారాయణ స్వామి వ్రతం", phase: "post-wedding", date: "2026-04-27", time: "11:00", location: "Groom's Residence", description: "Puja performed by the newlywed couple", isCompleted: false, order: 17 },
  { id: "e18", name: "Beegara Oota / Reception", nameKannada: "ಬೀಗರ ಊಟ", nameTelugu: "రిసెప్షన్", phase: "post-wedding", date: "2026-04-28", time: "19:00", location: "Convention Hall", description: "Grand reception dinner - both families feast together", isCompleted: false, order: 18 },
];

// ========== TASKS ==========
export const dummyTasks: Task[] = [
  { id: "t1", title: "Distribute cards to Bangalore relatives", category: "card-distribution", assignee: "Bride's Father (Ramesh)", dueDate: "2026-03-20", location: "Jayanagar, Basavanagudi", attendees: ["Ramesh", "Suresh Mama"], isCompleted: false, priority: "high" },
  { id: "t2", title: "Pattu Cheera shopping - Bride's sarees", category: "shopping", assignee: "Bride's Mother (Lakshmi)", dueDate: "2026-03-22", location: "Chickpet, Bangalore", attendees: ["Lakshmi", "Ananya", "Shanta Atthe"], isCompleted: false, priority: "high" },
  { id: "t3", title: "Book Mangala Vadyam (Nadaswaram)", category: "vendor", assignee: "Groom's Father (Subrahmanyam)", dueDate: "2026-03-18", isCompleted: true, priority: "high" },
  { id: "t4", title: "Prepare Talambralu mix (Rice + Turmeric)", category: "ritual-prep", assignee: "Shanta Atthe", dueDate: "2026-04-24", isCompleted: false, priority: "medium" },
  { id: "t5", title: "Pooja Samagri shopping", category: "shopping", assignee: "Bride's Mother (Lakshmi)", dueDate: "2026-04-01", location: "Malleshwaram, Bangalore", attendees: ["Lakshmi", "Vedavathi Akka"], isCompleted: false, priority: "medium" },
  { id: "t6", title: "Distribute cards to Hyderabad relatives", category: "card-distribution", assignee: "Groom's Father (Subrahmanyam)", dueDate: "2026-03-25", location: "Somajiguda, Hyderabad", attendees: ["Subrahmanyam", "Venkat Mama"], isCompleted: false, priority: "high" },
  { id: "t7", title: "Groom's Pancha & Uttariya shopping", category: "shopping", assignee: "Groom's Mother (Saraswathi)", dueDate: "2026-03-28", location: "Sulthanpet, Hyderabad", attendees: ["Saraswathi", "Karthik"], isCompleted: false, priority: "medium" },
  { id: "t8", title: "Confirm catering menu & banana leaf arrangements", category: "vendor", assignee: "Bride's Father (Ramesh)", dueDate: "2026-04-10", isCompleted: false, priority: "high" },
  { id: "t9", title: "Order Dharmavaram silk sarees for Beegaru", category: "shopping", assignee: "Bride's Mother (Lakshmi)", dueDate: "2026-04-05", location: "Dharmavaram / Online", isCompleted: false, priority: "medium" },
  { id: "t10", title: "Book photographer & videographer", category: "vendor", assignee: "Karthik", dueDate: "2026-03-20", isCompleted: true, priority: "high" },
  { id: "t11", title: "Arrange transport for Hyderabad family", category: "logistics", assignee: "Groom's Father (Subrahmanyam)", dueDate: "2026-04-20", isCompleted: false, priority: "medium" },
  { id: "t12", title: "Prepare Pasupu-Kumkuma packets for guests", category: "ritual-prep", assignee: "Vedavathi Akka", dueDate: "2026-04-22", isCompleted: false, priority: "low" },
];

// ========== GUESTS ==========
export const dummyGuests: Guest[] = [
  { id: "g1", familyName: "Rao Family", headOfFamily: "Ramachandra Rao", members: 5, side: "vadhuvu", phone: "9876543210", city: "Bangalore", giftTier: "close-family" },
  { id: "g2", familyName: "Sharma Family", headOfFamily: "Vishwanath Sharma", members: 4, side: "varudu", phone: "9876543211", city: "Hyderabad", giftTier: "close-family" },
  { id: "g3", familyName: "Iyer Family", headOfFamily: "Sundaram Iyer", members: 3, side: "vadhuvu", phone: "9876543212", city: "Chennai", giftTier: "regular" },
  { id: "g4", familyName: "Murthy Family", headOfFamily: "Narasimha Murthy", members: 6, side: "varudu", phone: "9876543213", city: "Hyderabad", giftTier: "beegaru" },
  { id: "g5", familyName: "Bhat Family", headOfFamily: "Ganesh Bhat", members: 4, side: "vadhuvu", phone: "9876543214", city: "Udupi", giftTier: "regular" },
  { id: "g6", familyName: "Acharya Family", headOfFamily: "Raghavendra Acharya", members: 3, side: "mutual", phone: "9876543215", city: "Bangalore", giftTier: "vip" },
  { id: "g7", familyName: "Shastri Family", headOfFamily: "Keshava Shastri", members: 2, side: "vadhuvu", phone: "9876543216", city: "Mysore", giftTier: "regular" },
  { id: "g8", familyName: "Hegde Family", headOfFamily: "Suresh Hegde", members: 5, side: "varudu", phone: "9876543217", city: "Dharwad", giftTier: "regular" },
  { id: "g9", familyName: "Joshi Family", headOfFamily: "Mohan Joshi", members: 4, side: "vadhuvu", phone: "9876543218", city: "Hubli", giftTier: "close-family" },
  { id: "g10", familyName: "Kulkarni Family", headOfFamily: "Anand Kulkarni", members: 3, side: "varudu", phone: "9876543219", city: "Pune", giftTier: "regular" },
  { id: "g11", familyName: "Deshpande Family", headOfFamily: "Vinay Deshpande", members: 4, side: "mutual", phone: "9876543220", city: "Bangalore", giftTier: "vip" },
  { id: "g12", familyName: "Kamath Family", headOfFamily: "Rajesh Kamath", members: 3, side: "vadhuvu", phone: "9876543221", city: "Mangalore", giftTier: "regular" },
];

// ========== RSVPS ==========
export const dummyRSVPs: RSVP[] = [
  { id: "r1", guestId: "g1", eventId: "e10", status: "confirmed", attendingCount: 5 },
  { id: "r2", guestId: "g2", eventId: "e10", status: "confirmed", attendingCount: 4 },
  { id: "r3", guestId: "g3", eventId: "e10", status: "pending", attendingCount: 0 },
  { id: "r4", guestId: "g4", eventId: "e10", status: "confirmed", attendingCount: 6 },
  { id: "r5", guestId: "g5", eventId: "e10", status: "maybe", attendingCount: 2 },
  { id: "r6", guestId: "g6", eventId: "e10", status: "confirmed", attendingCount: 3 },
  { id: "r7", guestId: "g7", eventId: "e10", status: "declined", attendingCount: 0 },
  { id: "r8", guestId: "g8", eventId: "e10", status: "pending", attendingCount: 0 },
  { id: "r9", guestId: "g9", eventId: "e10", status: "confirmed", attendingCount: 4 },
  { id: "r10", guestId: "g10", eventId: "e10", status: "pending", attendingCount: 0 },
  { id: "r11", guestId: "g11", eventId: "e10", status: "confirmed", attendingCount: 4 },
  { id: "r12", guestId: "g12", eventId: "e18", status: "confirmed", attendingCount: 3 },
];

// ========== BUDGET CATEGORIES ==========
export const dummyBudgetCategories: BudgetCategory[] = [
  { id: "bc1", name: "Venue / Kalyana Mantapa", nameLocal: "ಕಲ್ಯಾಣ ಮಂಟಪ", allocated: 200000, spent: 150000 },
  { id: "bc2", name: "Catering (Oota/Bhojanam)", nameLocal: "ಊಟ / భోజనం", allocated: 350000, spent: 100000 },
  { id: "bc3", name: "Silk Sarees", nameLocal: "ಪಟ್ಟು ಸೀರೆ", allocated: 300000, spent: 180000 },
  { id: "bc4", name: "Jewelry", nameLocal: "ಒಡವೆ / నగలు", allocated: 500000, spent: 350000 },
  { id: "bc5", name: "Purohit Dakshina", nameLocal: "ಪುರೋಹಿತ ದಕ್ಷಿಣೆ", allocated: 50000, spent: 25000 },
  { id: "bc6", name: "Music (Mangala Vadyam)", nameLocal: "ಮಂಗಳ ವಾದ್ಯ", allocated: 30000, spent: 30000 },
  { id: "bc7", name: "Decor (Mandapam & Flowers)", nameLocal: "ಅಲಂಕಾರ", allocated: 150000, spent: 50000 },
  { id: "bc8", name: "Photography & Video", allocated: 80000, spent: 40000 },
  { id: "bc9", name: "Thamboolam & Return Gifts", nameLocal: "ತಾಂಬೂಲ", allocated: 100000, spent: 30000 },
  { id: "bc10", name: "Transport & Accommodation", allocated: 120000, spent: 20000 },
  { id: "bc11", name: "Miscellaneous", allocated: 120000, spent: 25000 },
];

// ========== EXPENSES ==========
export const dummyExpenses: Expense[] = [
  { id: "ex1", categoryId: "bc1", description: "Kalyana Mantapa advance - Sri Lakshmi Hall", amount: 150000, date: "2026-02-15", vendor: "Sri Lakshmi Convention", paymentStatus: "advance-paid", notes: "Balance ₹50,000 due by April 20" },
  { id: "ex2", categoryId: "bc3", description: "Kanjeevaram Pattu Cheera - Bride", amount: 85000, date: "2026-03-10", vendor: "Nalli Silks, Chickpet", paymentStatus: "paid" },
  { id: "ex3", categoryId: "bc3", description: "Dharmavaram Sarees - Beegaru set (5 sarees)", amount: 60000, date: "2026-03-12", vendor: "RmKV Silks", paymentStatus: "paid" },
  { id: "ex4", categoryId: "bc4", description: "Gold Mangalasutra", amount: 200000, date: "2026-03-01", vendor: "Joyalukkas", paymentStatus: "paid" },
  { id: "ex5", categoryId: "bc4", description: "Bride's Wedding Jewelry Set", amount: 150000, date: "2026-03-05", vendor: "Tanishq", paymentStatus: "advance-paid" },
  { id: "ex6", categoryId: "bc2", description: "Catering advance - Banana leaf meals", amount: 100000, date: "2026-03-08", vendor: "Sri Raghavendra Caterers", paymentStatus: "advance-paid", notes: "₹2,50,000 remaining" },
  { id: "ex7", categoryId: "bc5", description: "Purohit booking advance", amount: 25000, date: "2026-02-20", vendor: "Sharma Purohit", paymentStatus: "advance-paid" },
  { id: "ex8", categoryId: "bc6", description: "Nadaswaram & Tavil booking", amount: 30000, date: "2026-03-15", vendor: "Thyagarajan Vidwan", paymentStatus: "paid" },
  { id: "ex9", categoryId: "bc7", description: "Mandapam floral decoration advance", amount: 50000, date: "2026-03-14", vendor: "Pushpa Decorators", paymentStatus: "advance-paid" },
  { id: "ex10", categoryId: "bc8", description: "Photography + videography advance", amount: 40000, date: "2026-03-10", vendor: "Moments Studio", paymentStatus: "advance-paid" },
  { id: "ex11", categoryId: "bc3", description: "Groom's Pancha set", amount: 35000, date: "2026-03-14", vendor: "Pothys, Hyderabad", paymentStatus: "paid" },
  { id: "ex12", categoryId: "bc9", description: "Return gifts bulk order", amount: 30000, date: "2026-03-16", vendor: "Gift World", paymentStatus: "advance-paid" },
];

// ========== VENDORS ==========
export const dummyVendors: Vendor[] = [
  { id: "v1", name: "Sri Lakshmi Convention Hall", role: "Venue / Kalyana Mantapa", phone: "9845012345", amount: 200000, paymentStatus: "advance-paid", notes: "Includes halls, rooms, kitchen" },
  { id: "v2", name: "Sri Raghavendra Caterers", role: "Catering (Bale Eleyalli Oota)", phone: "9845012346", amount: 350000, paymentStatus: "advance-paid", notes: "Banana leaf meals, 3 events" },
  { id: "v3", name: "Sharma Purohit Ji", role: "Purohitaru", phone: "9845012347", amount: 50000, paymentStatus: "advance-paid" },
  { id: "v4", name: "Thyagarajan Vidwan", role: "Mangala Vadyam (Nadaswaram)", phone: "9845012348", amount: 30000, paymentStatus: "paid" },
  { id: "v5", name: "Pushpa Decorators", role: "Mandapam Decoration", phone: "9845012349", amount: 150000, paymentStatus: "advance-paid" },
  { id: "v6", name: "Moments Studio", role: "Photography & Videography", phone: "9845012350", email: "moments@studio.com", amount: 80000, paymentStatus: "advance-paid" },
  { id: "v7", name: "Smt. Kavitha", role: "Bride Makeup Artist", phone: "9845012351", amount: 25000, paymentStatus: "pending" },
  { id: "v8", name: "Raja Travels", role: "Transport & Cab Arrangements", phone: "9845012352", amount: 60000, paymentStatus: "pending" },
];

// ========== THAMBOOLAM ITEMS ==========
export const dummyTamboolamItems: TamboolamItem[] = [
  { id: "th1", name: "Coconuts", nameLocal: "ತೆಂಗಿನಕಾಯಿ / కొబ్బరికాయలు", category: "Thamboolam", totalRequired: 250, currentStock: 0, unit: "pieces", tier: "regular" },
  { id: "th2", name: "Betel Leaves (Vetrilai)", nameLocal: "ವೀಳ್ಯದೆಲೆ", category: "Thamboolam", totalRequired: 500, currentStock: 0, unit: "leaves", tier: "regular" },
  { id: "th3", name: "Betel Nuts (Pakku/Supari)", nameLocal: "ಅಡಿಕೆ / పోక", category: "Thamboolam", totalRequired: 500, currentStock: 100, unit: "pieces", tier: "regular" },
  { id: "th4", name: "Pasupu-Kumkuma packets", nameLocal: "ಅರಿಶಿನ-ಕುಂಕುಮ", category: "Thamboolam", totalRequired: 200, currentStock: 50, unit: "packets", tier: "regular" },
  { id: "th5", name: "Blouse Pieces", nameLocal: "ರವಕೆ ಬಟ್ಟೆ", category: "Thamboolam", totalRequired: 150, currentStock: 30, unit: "pieces", tier: "regular", costPerUnit: 200 },
  { id: "th6", name: "Mysore Pak", category: "Sweets", totalRequired: 100, currentStock: 0, unit: "boxes", tier: "regular", costPerUnit: 300 },
  { id: "th7", name: "Ariselu", nameLocal: "అరిసెలు", category: "Sweets", totalRequired: 100, currentStock: 0, unit: "boxes", tier: "regular", costPerUnit: 250 },
  { id: "th8", name: "Return Gift - Silver Coin", category: "Return Gifts", totalRequired: 25, currentStock: 10, unit: "pieces", tier: "close-family", costPerUnit: 1500 },
  { id: "th9", name: "Return Gift - Brass Diya Set", category: "Return Gifts", totalRequired: 50, currentStock: 20, unit: "sets", tier: "beegaru", costPerUnit: 500 },
  { id: "th10", name: "Return Gift - Dry Fruit Box", category: "Return Gifts", totalRequired: 150, currentStock: 0, unit: "boxes", tier: "regular", costPerUnit: 350 },
];

// ========== INVITATION ASSIGNMENTS ==========
export const dummyInvitationAssignments: InvitationAssignment[] = [
  { id: "ia1", guestId: "g1", assignee: "Bride's Father (Ramesh)", mode: "in-person", plannedDate: "2026-03-20", status: "scheduled", notes: "Jayanagar visit" },
  { id: "ia2", guestId: "g2", assignee: "Groom's Father (Subrahmanyam)", mode: "in-person", plannedDate: "2026-03-25", status: "scheduled", notes: "Hyderabad visit" },
  { id: "ia3", guestId: "g3", assignee: "Bride's Mother (Lakshmi)", mode: "courier", plannedDate: "2026-03-18", status: "completed" },
  { id: "ia4", guestId: "g4", assignee: "Groom's Father (Subrahmanyam)", mode: "in-person", plannedDate: "2026-03-25", status: "scheduled" },
  { id: "ia5", guestId: "g5", assignee: "Suresh Mama", mode: "courier", plannedDate: "2026-03-20", status: "pending" },
  { id: "ia6", guestId: "g6", assignee: "Bride's Father (Ramesh)", mode: "in-person", plannedDate: "2026-03-19", status: "completed" },
  { id: "ia7", guestId: "g7", assignee: "Bride's Father (Ramesh)", mode: "whatsapp", plannedDate: "2026-03-17", status: "completed" },
  { id: "ia8", guestId: "g8", assignee: "Groom's Father (Subrahmanyam)", mode: "courier", plannedDate: "2026-03-22", status: "pending" },
  { id: "ia9", guestId: "g9", assignee: "Suresh Mama", mode: "in-person", plannedDate: "2026-03-21", status: "pending" },
  { id: "ia10", guestId: "g10", assignee: "Venkat Mama", mode: "courier", plannedDate: "2026-03-23", status: "pending" },
  { id: "ia11", guestId: "g11", assignee: "Bride's Father (Ramesh)", mode: "in-person", plannedDate: "2026-03-19", status: "completed" },
  { id: "ia12", guestId: "g12", assignee: "Bride's Mother (Lakshmi)", mode: "phone", plannedDate: "2026-03-18", status: "completed" },
];

// ========== DAY-OF CHECKLIST ==========
export const dummyDayOfChecklist: DayOfChecklistItem[] = [
  { id: "dc1", task: "Is the Adda Tera (swing) set up?", category: "Setup", assignee: "Decorator", time: "03:00", isCompleted: false, order: 1 },
  { id: "dc2", task: "Is the Mantapam decorated with flowers?", category: "Decor", assignee: "Pushpa Decorators", time: "04:00", isCompleted: false, order: 2 },
  { id: "dc3", task: "Are the banana leaves ready for meals?", category: "Catering", assignee: "Sri Raghavendra Caterers", time: "05:00", isCompleted: false, order: 3 },
  { id: "dc4", task: "Is the Jeelakarra-Bellam paste prepared?", category: "Ritual", assignee: "Shanta Atthe", time: "05:30", isCompleted: false, order: 4 },
  { id: "dc5", task: "Are the Talambralu (turmeric rice) mixed & on stage?", category: "Ritual", assignee: "Vedavathi Akka", time: "06:00", isCompleted: false, order: 5 },
  { id: "dc6", task: "Is the Dhare coconut ready?", category: "Ritual", assignee: "Purohit Ji", time: "06:00", isCompleted: false, order: 6 },
  { id: "dc7", task: "Is the Mangalasutra box with the groom?", category: "Ritual", assignee: "Groom's Mother", time: "06:30", isCompleted: false, order: 7 },
  { id: "dc8", task: "Is the Nadaswaram team ready?", category: "Music", assignee: "Thyagarajan Vidwan", time: "06:00", isCompleted: false, order: 8 },
  { id: "dc9", task: "Is the photographer in position?", category: "Photography", assignee: "Moments Studio", time: "06:30", isCompleted: false, order: 9 },
  { id: "dc10", task: "Are the garlands (Maalai) ready?", category: "Decor", assignee: "Flower vendor", time: "06:00", isCompleted: false, order: 10 },
  { id: "dc11", task: "Is bride's makeup completed?", category: "Preparation", assignee: "Smt. Kavitha", time: "05:00", isCompleted: false, order: 11 },
  { id: "dc12", task: "Are the Thamboolam trays arranged?", category: "Distribution", assignee: "Vedavathi Akka", time: "07:00", isCompleted: false, order: 12 },
  { id: "dc13", task: "Is the Obbattu/Holige counter set up?", category: "Catering", assignee: "Caterer Team", time: "08:00", isCompleted: false, order: 13 },
  { id: "dc14", task: "Are return gifts arranged at exit?", category: "Distribution", assignee: "Gift committee", time: "07:00", isCompleted: false, order: 14 },
];
