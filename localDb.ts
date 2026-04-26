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
  role: 'Admin' | 'Picker' | 'Manager' | 'Staff';
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
    super('PickPulseDB_v3');
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
        { id: '4', name: 'Almonds 500g', location: 'C3-11', stock: 5, threshold: 10, status: 'Low Stock', category: 'Pantry' },
        { id: '5', name: 'Orange Juice 2L', location: 'A1-02', stock: 35, threshold: 15, status: 'In Stock', category: 'Beverages' },
        { id: '6', name: 'Chips (Salted)', location: 'D4-01', stock: 150, threshold: 50, status: 'In Stock', category: 'Snacks' },
        { id: '7', name: 'Apples (Red)', location: 'E5-02', stock: 60, threshold: 25, status: 'In Stock', category: 'Produce' }
      ]);
      
      this.tickets.bulkAdd([
        { id: 'ticket-1', timestamp: new Date().toISOString(), title: 'Spill in Zone A1', description: 'Milk carton broken on the floor in A1-01.', status: 'open', createdBy: 'Jane Doe' },
        { id: 'ticket-2', timestamp: new Date(Date.now() - 3600000).toISOString(), title: 'Scanner Battery Low', description: 'Scanner #4 won\'t hold charge.', status: 'in_progress', createdBy: 'John Smith' }
      ]);

      this.orders.bulkAdd([
        { id: 'order-1', timestamp: new Date(Date.now() - 7200000).toISOString(), status: 'pending', items: [{ id: '1', name: 'Fresh Milk 1L', qty: 2 }, { id: '6', name: 'Chips (Salted)', qty: 3 }] },
        { id: 'order-2', timestamp: new Date(Date.now() - 3600000).toISOString(), status: 'picking', items: [{ id: '7', name: 'Apples (Red)', qty: 6 }, { id: '2', name: 'Whole Wheat Bread', qty: 1 }], pickerId: 'admin-user' },
        { id: 'order-3', timestamp: new Date().toISOString(), status: 'completed', items: [{ id: '4', name: 'Almonds 500g', qty: 1 }], pickerId: 'john-smith' }
      ]);

      this.approvals.bulkAdd([
        { id: 'app-1', timestamp: new Date(Date.now() - 86400000).toISOString(), type: 'emergency_complete', requestedBy: 'Jane Doe', details: 'Order 8921 missing item but customer agreed to skip', status: 'pending' },
        { id: 'app-2', timestamp: new Date(Date.now() - 172800000).toISOString(), type: 'stock_adjustment', requestedBy: 'John Smith', details: 'Found 5 extra packs of bread', status: 'approved' }
      ]);

      this.users.bulkAdd([
        { uid: 'admin-user', email: 'adityadeshakar@gmail.com', role: 'Admin', displayName: 'Admin User' },
        { uid: 'jane-doe', email: 'jane@pickpulse.com', role: 'Picker', displayName: 'Jane Doe' },
        { uid: 'john-smith', email: 'john@pickpulse.com', role: 'Manager', displayName: 'John Smith' },
        { uid: 'staff-1', email: 'staff@pickpulse.com', role: 'Staff', displayName: 'Staff User' }
      ]);

      this.pickers.bulkAdd([
        { id: 'admin-user', name: 'Admin User', status: 'Active', currentTask: 'Picking Order 1204', itemsPicked: 15, accuracy: 98 },
        { id: 'jane-doe', name: 'Jane Doe', status: 'Active', currentTask: 'Idle', itemsPicked: 40, accuracy: 99 },
        { id: 'john-smith', name: 'John Smith', status: 'Break', currentTask: 'n/a', itemsPicked: 10, accuracy: 100 }
      ]);
      
      this.compliance.bulkAdd([
        { id: 'comp-1', timestamp: new Date(Date.now() - 86400000).toISOString(), type: 'temperature', status: 'Passed', checkedBy: 'Admin User', notes: 'Temperature within range (1-4C)' },
        { id: 'comp-2', timestamp: new Date(Date.now() - 172800000).toISOString(), type: 'cleaning', status: 'Failed', checkedBy: 'Jane Doe', notes: 'Spill not fully cleaned in aisle 4' }
      ]);

    });
  }
}

export const localDb = new PickPulseDatabase();
