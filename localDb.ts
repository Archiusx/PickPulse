import Dexie, { type Table } from 'dexie';

export interface InventoryItem {
  id: string;
  name: string;
  location: string;
  stock: number;
  threshold: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  image?: string;
  expiryDate?: string;
  category: string;
}

export interface InventoryHistory {
  id: string;
  itemId: string;
  timestamp: string;
  user: string;
  action: string;
  previousStock: number;
  newStock: number;
}

export interface ComplianceLog {
  id: string;
  timestamp: string;
  type: string;
  status: "Passed" | "Failed";
  checkedBy: string;
  notes: string;
  score?: number;
}

export interface PickerStatus {
  id: string;
  name: string;
  status: "Active" | "Break" | "Offline";
  currentTask: string;
  itemsPicked: number;
  accuracy: number;
}

export interface User {
  uid: string;
  email: string;
  role: 'Admin' | 'Picker' | 'Manager';
  displayName: string;
}

export interface Order {
  id: string;
  timestamp: string;
  status: 'pending' | 'picking' | 'packed' | 'completed';
  items: any[];
  pickerId?: string;
}

export interface Ticket {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved';
  createdBy: string;
  assignedTo?: string;
}

export interface Approval {
  id: string;
  timestamp: string;
  type: string;
  requestedBy: string;
  details: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface VendorMessage {
  id: string;
  timestamp: string;
  senderId: string;
  senderName: string;
  vendorId: string;
  vendorName: string;
  content: string;
}

export class PickPulseDatabase extends Dexie {
  inventory!: Table<InventoryItem, string>;
  inventoryHistory!: Table<InventoryHistory, string>;
  compliance!: Table<ComplianceLog, string>;
  pickers!: Table<PickerStatus, string>;
  users!: Table<User, string>;
  orders!: Table<Order, string>;
  tickets!: Table<Ticket, string>;
  approvals!: Table<Approval, string>;
  vendorMessages!: Table<VendorMessage, string>;

  constructor() {
    super('PickPulseDB');
    this.version(1).stores({
      inventory: 'id, name, location, status, category',
      inventoryHistory: 'id, itemId, timestamp, user, action',
      compliance: 'id, timestamp, type, status, checkedBy',
      pickers: 'id, name, status, currentTask',
      users: 'uid, email, role, displayName',
      orders: 'id, timestamp, status, pickerId',
      tickets: 'id, timestamp, status, createdBy',
      approvals: 'id, timestamp, type, status, requestedBy',
      vendorMessages: 'id, timestamp, senderId, vendorId'
    });
    
    this.on('populate', () => {
      this.inventory.bulkAdd([
        { id: '1', name: 'Fresh Milk 1L', location: 'A1-01', stock: 45, threshold: 20, status: 'In Stock', category: 'Dairy' },
        { id: '2', name: 'Whole Wheat Bread', location: 'B2-04', stock: 12, threshold: 15, status: 'Low Stock', category: 'Bakery' },
        { id: '3', name: 'Eggs (12 col)', location: 'A1-03', stock: 80, threshold: 30, status: 'In Stock', category: 'Dairy' },
        { id: '4', name: 'Almonds 500g', location: 'C3-11', stock: 5, threshold: 10, status: 'Low Stock', category: 'Pantry' }
      ]);
    });
  }
}

export const localDb = new PickPulseDatabase();
