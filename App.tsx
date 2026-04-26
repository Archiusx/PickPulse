import React, { useState, useEffect, Component } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Clock, 
  TrendingUp, 
  Map, 
  ShieldCheck, 
  AlertTriangle, 
  Search, 
  Plus, 
  ChevronRight,
  Zap,
  CheckCircle2,
  BarChart3,
  Smartphone,
  Info,
  Thermometer,
  Droplets,
  ClipboardCheck,
  User,
  LogOut,
  Camera,
  Bell,
  X,
  Minus,
  MessageSquare,
  Filter,
  CheckSquare,
  Square,
  Edit3,
  Trash2,
  Save,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Sun,
  Moon,
  Users,
  Shield,
  Activity,
  History as HistoryIcon,
  Calendar,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { getDemandForecast, getSlottingOptimization } from './geminiService';
import { db, auth } from './firebase';
import { 
  collection, 
  onSnapshot, 
  query, 
  updateDoc, 
  doc, 
  addDoc, 
  deleteDoc,
  writeBatch,
  serverTimestamp,
  orderBy,
  limit,
  setDoc,
  getDocs
} from 'firebase/firestore';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged,
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import { Scanner } from './Scanner';

// Types
type UserRole = 'Admin' | 'Picker' | 'Manager';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function SortableRow({ item, isSelected, isExpiringSoon, daysToExpiry, onSelect, onEdit, onUpdateStock, onViewHistory, onDelete }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 'auto',
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <tr 
      ref={setNodeRef}
      style={style}
      className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${isExpiringSoon ? 'bg-orange-50/50 dark:bg-orange-900/10' : ''} ${isSelected ? 'bg-yellow-50/30 dark:bg-yellow-900/10' : ''}`}
      onClick={() => onEdit(item)}
    >
      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2">
          <button 
            {...attributes} 
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500"
          >
            <LayoutDashboard size={14} />
          </button>
          <button 
            onClick={() => onSelect(item.id)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            {isSelected ? <CheckSquare size={20} className="text-yellow-500" /> : <Square size={20} />}
          </button>
        </div>
      </td>
      <td className="px-6 py-4 font-medium">
        <div className="flex items-center gap-2">
          <span className="dark:text-white">{item.name}</span>
          {isExpiringSoon && <AlertTriangle size={14} className="text-orange-500" />}
        </div>
      </td>
      <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{item.category}</td>
      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2">
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded overflow-hidden">
                <button 
                  onClick={() => onUpdateStock(item.id, Math.max(0, (item.editingStock ?? item.stock) - 1), false)}
                  className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 border-r border-slate-200 dark:border-slate-700"
                >
                  <Minus size={12} />
                </button>
                <input 
                  type="number"
                  value={item.editingStock ?? item.stock}
                  onChange={(e) => onUpdateStock(item.id, parseInt(e.target.value) || 0, false)}
                  className="w-12 p-1 text-center text-sm font-bold outline-none bg-transparent dark:text-white"
                />
                <button 
                  onClick={() => onUpdateStock(item.id, (item.editingStock ?? item.stock) + 1, false)}
                  className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 border-l border-slate-200 dark:border-slate-700"
                >
                  <Plus size={12} />
                </button>
              </div>
              {(item.editingStock !== undefined && item.editingStock !== item.stock) && (
                <button 
                  onClick={() => onUpdateStock(item.id, item.editingStock!, true)}
                  className="p-1.5 bg-green-500 text-white rounded hover:bg-green-600 transition-colors shadow-sm"
                  title="Save Stock"
                >
                  <CheckCircle2 size={14} />
                </button>
              )}
            </div>
            <span className="text-[10px] text-slate-400 mt-1">Min: {item.minStock}</span>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="text-slate-500 dark:text-slate-400">{item.expiryDate}</span>
          {isExpiringSoon && (
            <span className="text-[10px] font-bold text-orange-600 uppercase">
              {daysToExpiry <= 0 ? 'Expired' : `Expires in ${daysToExpiry}d`}
            </span>
          )}
        </div>
      </td>
      <td className="px-6 py-4 font-mono text-xs dark:text-slate-400">{item.location}</td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase w-fit ${
            item.stock <= item.minStock ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
          }`}>
            {item.stock <= item.minStock ? 'Low Stock' : 'Healthy'}
          </span>
          <div className="flex items-center gap-1">
            <button 
              onClick={(e) => { e.stopPropagation(); onViewHistory(item.id); }}
              className="p-1 text-slate-400 hover:text-yellow-500 transition-colors"
              title="View History"
            >
              <Clock size={14} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
              className="p-1 text-slate-400 hover:text-red-500 transition-colors"
              title="Delete Item"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </td>
    </tr>
  );
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface PickerStatus {
  id: string;
  name: string;
  status: 'picking' | 'idle' | 'break';
  currentZone: string;
  lastActive: Date;
}

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  expiryDate: string;
  location: string;
  pickingFrequency: number;
  barcode?: string;
  editingStock?: number; // For manual adjustment
  order?: number; // For manual reordering
}

interface StockHistory {
  id: string;
  itemId: string;
  previousStock: number;
  newStock: number;
  adjustment: number;
  timestamp: any;
  user: string;
  reason?: string;
}

interface Notification {
  id: string;
  type: 'low_stock' | 'expiry' | 'compliance' | 'approval';
  message: string;
  timestamp: Date;
  read: boolean;
}

interface ComplianceRecord {
  id: string;
  type: 'temperature' | 'cleaning' | 'regulatory';
  value: string;
  timestamp: any;
  status: 'normal' | 'warning' | 'critical';
}

interface Order {
  id: string;
  orderId: string;
  itemsPicked: number;
  totalItems: number;
  pickerName: string;
  pickerEmail: string;
  pickerId: string;
  startTime: any;
  endTime?: any;
  timeTakenMinutes?: number;
  status: 'picking' | 'completed' | 'emergency_completed' | 'pending_packing';
  issues?: string[];
}

interface Ticket {
  id: string;
  userId: string;
  userEmail: string;
  type: 'qr_not_visible' | 'product_not_found' | 'damaged' | 'other';
  description: string;
  status: 'open' | 'resolved' | 'closed';
  timestamp: any;
  itemId?: string;
  itemName?: string;
}

interface ApprovalRequest {
  id: string;
  userId: string;
  userEmail: string;
  type: 'emergency_complete' | 'new_stock' | 'price_change';
  details: any;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: any;
  orderId?: string;
}

interface VendorMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  text: string;
  timestamp: any;
  vendorId: string;
}

const INITIAL_INVENTORY: InventoryItem[] = [
  { id: '1', name: 'Amul Gold Milk 1L', category: 'Dairy', stock: 12, minStock: 20, expiryDate: '2026-04-09', location: 'A-12', pickingFrequency: 85 },
  { id: '2', name: 'Britannia Bread', category: 'Bakery', stock: 45, minStock: 30, expiryDate: '2026-04-10', location: 'B-04', pickingFrequency: 70 },
  { id: '3', name: 'Lays Classic 50g', category: 'Snacks', stock: 8, minStock: 15, expiryDate: '2026-10-15', location: 'C-02', pickingFrequency: 65 },
  { id: '4', name: 'Coca Cola 750ml', category: 'Beverages', stock: 24, minStock: 20, expiryDate: '2026-12-01', location: 'D-08', pickingFrequency: 55 },
  { id: '5', name: 'Organic Tomatoes 500g', category: 'Produce', stock: 5, minStock: 10, expiryDate: '2026-04-08', location: 'P-01', pickingFrequency: 90 },
];

// Error Boundary Component
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: any;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      let errorMessage = "Something went wrong. Please try refreshing the page.";
      try {
        const parsed = JSON.parse(this.state.error.message);
        if (parsed.error) {
          errorMessage = `Firestore Error: ${parsed.error} (${parsed.operationType} on ${parsed.path})`;
        }
      } catch (e) {
        // Not a JSON error
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
          <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-2xl text-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Application Error</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8">{errorMessage}</p>
            <button 
              onClick={() => window.location.reload()}
              className="w-full py-3 bg-slate-900 dark:bg-slate-700 text-white font-bold rounded-xl hover:bg-slate-800 transition-all"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <BlinkAIApp />
    </ErrorBoundary>
  );
}

function BlinkAIApp() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [compliance, setCompliance] = useState<ComplianceRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inventory' | 'picking' | 'ai' | 'compliance' | 'tickets' | 'approvals' | 'vendors' | 'history'>('dashboard');
  const [aiLoading, setAiLoading] = useState(false);
  const [forecast, setForecast] = useState<any>(null);
  const [optimizations, setOptimizations] = useState<any>(null);
  const [localContext, setLocalContext] = useState('IPL Match in Nagpur today - high demand for snacks and cold drinks.');
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [pickingOrder, setPickingOrder] = useState<InventoryItem[]>([
    { id: '1', name: 'Amul Gold Milk 1L', category: 'Dairy', stock: 12, minStock: 20, expiryDate: '2026-04-09', location: 'A-12', pickingFrequency: 85 },
    { id: '2', name: 'Britannia Bread', category: 'Bakery', stock: 45, minStock: 30, expiryDate: '2026-04-10', location: 'B-04', pickingFrequency: 70 },
    { id: '3', name: 'Lays Classic 50g', category: 'Snacks', stock: 8, minStock: 15, expiryDate: '2026-10-15', location: 'C-02', pickingFrequency: 65 },
    { id: '4', name: 'Coca Cola 750ml', category: 'Beverages', stock: 24, minStock: 20, expiryDate: '2026-12-01', location: 'D-08', pickingFrequency: 55 },
  ]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showComplianceForm, setShowComplianceForm] = useState(false);
  const [newCompliance, setNewCompliance] = useState({ type: 'temperature', value: '', status: 'normal' });
  const [isBatchScanning, setIsBatchScanning] = useState(false);
  const [batchScannedBarcodes, setBatchScannedBarcodes] = useState<string[]>([]);
  const [showBatchReview, setShowBatchReview] = useState(false);
  const [pickingTime, setPickingTime] = useState(0);
  
  // New State for Bulk Actions & Filtering
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');
  const [showConfirmStock, setShowConfirmStock] = useState(false);
  const [pendingStockUpdate, setPendingStockUpdate] = useState<{ id: string, newStock: number } | null>(null);
  const [bulkAdjustment, setBulkAdjustment] = useState(0);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'Dairy',
    stock: 0,
    minStock: 10,
    expiryDate: new Date().toISOString().split('T')[0],
    location: '',
    barcode: ''
  });

  const [sortConfig, setSortConfig] = useState<{ key: keyof InventoryItem, direction: 'asc' | 'desc' } | null>(null);
  const [itemHistory, setItemHistory] = useState<StockHistory[]>([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [bulkCategory, setBulkCategory] = useState('');
  const [isBulkEditing, setIsBulkEditing] = useState(false);
  
  // New States for Tickets, Approvals, and Vendor Chat
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [vendorMessages, setVendorMessages] = useState<VendorMessage[]>([]);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [newTicket, setNewTicket] = useState({ type: 'qr_not_visible', description: '', itemId: '' });
  const [vendorChatOpen, setVendorChatOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  
  // New States for Dark Mode, Roles, and Feedback
  const [darkMode, setDarkMode] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('Admin');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const isEmergencyPending = approvals.some(a => a.userId === user?.uid && a.type === 'emergency_complete' && a.status === 'pending' && a.orderId === '8921');
  const [activePickers, setActivePickers] = useState<PickerStatus[]>([]);

  useEffect(() => {
    const testConnection = async () => {
      try {
        const { getDocFromServer } = await import('firebase/firestore');
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    };
    if (user) testConnection();
  }, [user]);

  // Update picker status when switching tabs
  useEffect(() => {
    if (activeTab === 'picking') {
      updatePickerStatus('picking', 'Zone A');
    } else if (activeTab === 'dashboard') {
      updatePickerStatus('idle', 'Zone C');
    }
  }, [activeTab]);

  // Timer for picking session
  useEffect(() => {
    let interval: any;
    if (activeTab === 'picking' && pickingOrder.length > 0) {
      interval = setInterval(() => {
        setPickingTime(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [activeTab, pickingOrder.length]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setInventory((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Toast Helper
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(7);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const handleFirestoreError = (error: unknown, operationType: OperationType, path: string | null) => {
    const errInfo: FirestoreErrorInfo = {
      error: error instanceof Error ? error.message : String(error),
      authInfo: {
        userId: auth.currentUser?.uid,
        email: auth.currentUser?.email,
        emailVerified: auth.currentUser?.emailVerified,
        isAnonymous: auth.currentUser?.isAnonymous,
        tenantId: auth.currentUser?.tenantId,
        providerInfo: auth.currentUser?.providerData.map(provider => ({
          providerId: provider.providerId,
          displayName: provider.displayName,
          email: provider.email,
          photoUrl: provider.photoURL
        })) || []
      },
      operationType,
      path
    };
    console.error('Firestore Error: ', JSON.stringify(errInfo));
    // addToast(`Firestore Error: ${errInfo.error}`, 'error');
    throw new Error(JSON.stringify(errInfo));
  };

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // Real-time Inventory Listener
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'inventory'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as InventoryItem));
      setInventory(items);
      
      // Generate notifications for low stock
      const newNotifications: Notification[] = [];
      items.forEach(item => {
        if (item.stock <= item.minStock) {
          newNotifications.push({
            id: `low-${item.id}`,
            type: 'low_stock',
            message: `Low stock alert: ${item.name} (${item.stock} left)`,
            timestamp: new Date(),
            read: false
          });
        }
      });

      if (newNotifications.length > 0) {
        setNotifications(prev => {
          // Simple merge to avoid duplicates
          const existingIds = new Set(prev.map(n => n.id));
          const filteredNew = newNotifications.filter(n => !existingIds.has(n.id));
          return [...filteredNew, ...prev].slice(0, 20);
        });
      }

      // Seed initial data if empty
      if (items.length === 0 && user?.email === 'adityadeshakar@gmail.com') {
        INITIAL_INVENTORY.forEach(async (item) => {
          try {
            await setDoc(doc(db, 'inventory', item.id), item);
          } catch (e) {
            handleFirestoreError(e, OperationType.WRITE, `inventory/${item.id}`);
          }
        });
      }

      // Set picking order if empty (sorted by location for efficiency)
      setPickingOrder(prev => {
        if (prev.length === 0 && items.length > 0) {
          const sorted = [...items].sort((a, b) => a.location.localeCompare(b.location));
          return sorted.slice(0, 4); // Simulate a 4-item order
        }
        return prev;
      });
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'inventory');
    });
    return () => unsubscribe();
  }, [user]);

  // Real-time Compliance Listener
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'compliance'), orderBy('timestamp', 'desc'), limit(10));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const records = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ComplianceRecord));
      setCompliance(records);

      // Seed initial compliance data if empty
      if (records.length === 0 && user?.email === 'adityadeshakar@gmail.com') {
        const initialLogs: any[] = [
          { type: 'temperature', value: '18°C', status: 'normal', timestamp: serverTimestamp() },
          { type: 'cleaning', value: 'Zone A Cleaned', status: 'normal', timestamp: serverTimestamp() },
          { type: 'regulatory', value: 'FSSAI Audit Passed', status: 'normal', timestamp: serverTimestamp() },
        ];
        initialLogs.forEach(async (log) => {
          try {
            await addDoc(collection(db, 'compliance'), log);
          } catch (e) {
            handleFirestoreError(e, OperationType.WRITE, 'compliance');
          }
        });
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'compliance');
    });
    return () => unsubscribe();
  }, [user]);

  // Real-time Tickets Listener
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'tickets'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTickets(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ticket)));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'tickets');
    });
    return () => unsubscribe();
  }, [user]);

  // Real-time Approvals Listener
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'approvals'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newApprovals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ApprovalRequest));
      setApprovals(newApprovals);

      // Generate notifications
      const newNotifications: Notification[] = [];
      newApprovals.forEach(req => {
        // Notify Manager of new pending requests
        if ((userRole === 'Admin' || userRole === 'Manager') && req.status === 'pending') {
          newNotifications.push({
            id: `approval-req-${req.id}`,
            type: 'approval',
            message: `New ${req.type.replace('_', ' ')} request from ${req.userEmail}`,
            timestamp: new Date(),
            read: false
          });
        }
        // Notify Picker of their approved/rejected requests
        if (req.userId === user.uid && req.status !== 'pending') {
          newNotifications.push({
            id: `approval-res-${req.id}-${req.status}`,
            type: 'approval',
            message: `Your ${req.type.replace('_', ' ')} request was ${req.status}`,
            timestamp: new Date(),
            read: false
          });
        }
      });

      if (newNotifications.length > 0) {
        setNotifications(prev => {
          const existingIds = new Set(prev.map(n => n.id));
          const filteredNew = newNotifications.filter(n => !existingIds.has(n.id));
          return [...filteredNew, ...prev].slice(0, 20);
        });
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'approvals');
    });
    return () => unsubscribe();
  }, [user, userRole]);

  // Auto-complete order if emergency_complete is approved
  useEffect(() => {
    if (!user || pickingOrder.length === 0) return;
    
    const approvedEmergency = approvals.find(a => 
      a.userId === user.uid && 
      a.type === 'emergency_complete' && 
      a.status === 'approved' && 
      a.orderId === '8921'
    );

    if (approvedEmergency) {
      setPickingOrder([]);
      addToast('Emergency completion approved. Order finished.', 'success');
    }
  }, [approvals, user, pickingOrder.length]);

  // Real-time Vendor Messages Listener
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'vendor_messages'), orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setVendorMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as VendorMessage)));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'vendor_messages');
    });
    return () => unsubscribe();
  }, [user]);

  // Real-time Picker Status Listener
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'picker_status'), orderBy('lastActive', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const statuses = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          lastActive: data.lastActive?.toDate ? data.lastActive.toDate() : new Date(data.lastActive)
        } as PickerStatus;
      });
      setActivePickers(statuses);
      
      // Seed initial pickers if empty
      if (statuses.length === 0 && user?.email === 'adityadeshakar@gmail.com') {
        const initialPickers = [
          { name: 'Rahul S.', status: 'picking', currentZone: 'Zone A', lastActive: serverTimestamp() },
          { name: 'Priya K.', status: 'idle', currentZone: 'Zone C', lastActive: serverTimestamp() },
          { name: 'Amit V.', status: 'picking', currentZone: 'Zone P', lastActive: serverTimestamp() },
        ];
        initialPickers.forEach(async (p, i) => {
          try {
            await setDoc(doc(db, 'picker_status', `p${i+1}`), p);
          } catch (e) {
            handleFirestoreError(e, OperationType.WRITE, `picker_status/p${i+1}`);
          }
        });
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'picker_status');
    });
    return () => unsubscribe();
  }, [user]);

  // Real-time Orders Listener
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'orders'), orderBy('startTime', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
      setOrderHistory(orders);
      
      // Find current user's active order
      const myActiveOrder = orders.find(o => o.pickerId === user.uid && (o.status === 'picking' || o.status === 'pending_packing'));
      setCurrentOrder(myActiveOrder || null);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'orders');
    });
    return () => unsubscribe();
  }, [user]);

  // User Profile & Role Sync
  useEffect(() => {
    if (!user) return;
    
    // Sync profile to Firestore
    const syncProfile = async () => {
      try {
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          role: user.email === 'adityadeshakar@gmail.com' ? 'Admin' : 'Picker' // Default role
        }, { merge: true });
      } catch (e) {
        handleFirestoreError(e, OperationType.WRITE, `users/${user.uid}`);
      }
    };
    syncProfile();

    // Listen for role changes
    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (doc) => {
      if (doc.exists()) {
        setUserRole(doc.data().role as UserRole);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
    });
    return () => unsubscribe();
  }, [user]);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleLogout = () => signOut(auth);

  const updateStock = async (itemId: string, newStock: number, isFinal: boolean = true) => {
    if (!isFinal) {
      setInventory(prev => prev.map(i => i.id === itemId ? { ...i, editingStock: newStock } : i));
      return;
    }
    setPendingStockUpdate({ id: itemId, newStock });
    setShowConfirmStock(true);
  };

  const logStockHistory = async (itemId: string, previousStock: number, newStock: number, reason: string = 'Manual Adjustment') => {
    try {
      await addDoc(collection(db, 'inventory', itemId, 'history'), {
        itemId,
        previousStock,
        newStock,
        adjustment: newStock - previousStock,
        timestamp: serverTimestamp(),
        user: user?.email || 'System',
        reason
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `inventory/${itemId}/history`);
    }
  };

  const fetchItemHistory = async (itemId: string) => {
    try {
      const q = query(collection(db, 'inventory', itemId, 'history'), orderBy('timestamp', 'desc'), limit(50));
      const snapshot = await getDocs(q);
      const history = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StockHistory));
      setItemHistory(history);
      setShowHistoryModal(true);
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `inventory/${itemId}/history`);
      addToast('Failed to fetch stock history', 'error');
    }
  };

  const deleteItem = async (itemId: string) => {
    try {
      await deleteDoc(doc(db, 'inventory', itemId));
      setEditingItem(null);
      addToast('Item deleted successfully', 'success');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `inventory/${itemId}`);
      addToast('Failed to delete item', 'error');
    }
  };

  const exportToCSV = () => {
    const headers = ['SKU Name', 'Category', 'Stock', 'Min Stock', 'Expiry', 'Location'];
    const rows = sortedAndFilteredInventory.map(item => [
      `"${item.name}"`,
      `"${item.category}"`,
      item.stock,
      item.minStock,
      item.expiryDate,
      `"${item.location}"`
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `inventory_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Inventory exported to CSV', 'success');
  };

  const confirmStockUpdate = async () => {
    if (!pendingStockUpdate) return;
    try {
      const item = inventory.find(i => i.id === pendingStockUpdate.id);
      if (item) {
        await updateDoc(doc(db, 'inventory', pendingStockUpdate.id), { stock: pendingStockUpdate.newStock });
        await logStockHistory(pendingStockUpdate.id, item.stock, pendingStockUpdate.newStock);
      }
      setShowConfirmStock(false);
      setPendingStockUpdate(null);
      addToast('Stock updated successfully', 'success');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `inventory/${pendingStockUpdate.id}`);
      addToast('Failed to update stock', 'error');
    }
  };

  const handleBulkUpdate = async (adjustment: number) => {
    try {
      const batch = writeBatch(db);
      selectedItems.forEach((id) => {
        const item = inventory.find(i => i.id === id);
        if (item) {
          const newStock = Math.max(0, item.stock + adjustment);
          batch.update(doc(db, 'inventory', id), { stock: newStock });
          logStockHistory(id, item.stock, newStock, 'Bulk Adjustment');
        }
      });
      await batch.commit();
      setSelectedItems([]);
      setBulkAdjustment(0);
      addToast(`Bulk update of ${selectedItems.length} items complete`, 'success');
    } catch (error) {
      console.error("Bulk update failed", error);
      addToast('Bulk update failed', 'error');
    }
  };

  const handleBulkCategoryChange = async (newCategory: string) => {
    if (!newCategory) return;
    try {
      const batch = writeBatch(db);
      selectedItems.forEach((id) => {
        batch.update(doc(db, 'inventory', id), { category: newCategory });
      });
      await batch.commit();
      setSelectedItems([]);
      setBulkCategory('');
      setIsBulkEditing(false);
      addToast(`Updated category for ${selectedItems.length} items`, 'success');
    } catch (error) {
      console.error("Bulk category update failed", error);
      addToast('Bulk category update failed', 'error');
    }
  };

  const uniqueLocations = ['All', ...new Set(inventory.map(item => item.location.split('-')[0]))];

  const filteredInventory = inventory.filter(item => {
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    
    const daysToExpiry = Math.ceil((new Date(item.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    const isExpiringSoon = daysToExpiry <= 3;
    const isLowStock = item.stock <= item.minStock;

    const matchesStatus = statusFilter === 'All' || 
      (statusFilter === 'Low Stock' && isLowStock) ||
      (statusFilter === 'Expiring Soon' && isExpiringSoon);

    const matchesLocation = locationFilter === 'All' || item.location.startsWith(locationFilter);

    return matchesCategory && matchesStatus && matchesLocation;
  });

  const sortedAndFilteredInventory = [...filteredInventory].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    if (a[key]! < b[key]!) return direction === 'asc' ? -1 : 1;
    if (a[key]! > b[key]!) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (key: keyof InventoryItem) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const categories = ['All', ...new Set(inventory.map(i => i.category))];
  const categoryOptions = categories.filter(c => c !== 'All');

  const handleAddItem = async () => {
    if (!newItem.name || !newItem.location) return;
    try {
      await addDoc(collection(db, 'inventory'), {
        ...newItem,
        pickingFrequency: 50, // Default frequency
        stock: Number(newItem.stock),
        minStock: Number(newItem.minStock)
      });
      setShowAddItemModal(false);
      setNewItem({
        name: '',
        category: 'Dairy',
        stock: 0,
        minStock: 10,
        expiryDate: new Date().toISOString().split('T')[0],
        location: '',
        barcode: ''
      });
      addToast('New item added to inventory', 'success');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'inventory');
      addToast('Failed to add item', 'error');
    }
  };

  const addComplianceLog = async (type: 'temperature' | 'cleaning' | 'regulatory', value: string, status: 'normal' | 'warning' | 'critical') => {
    try {
      await addDoc(collection(db, 'compliance'), {
        type,
        value,
        status,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'compliance');
    }
  };

  const updatePickerStatus = async (status: 'picking' | 'idle' | 'break', zone: string) => {
    if (!user) return;
    try {
      await setDoc(doc(db, 'picker_status', user.uid), {
        name: user.displayName || 'Picker',
        status,
        currentZone: zone,
        lastActive: serverTimestamp()
      }, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `picker_status/${user.uid}`);
    }
  };

  const completeOrder = async () => {
    if (!user) return;
    
    const orderData: any = {
      orderId: `ORD-${Math.floor(Math.random() * 10000)}`,
      itemsPicked: 4,
      totalItems: 4,
      pickerName: user.displayName || 'Picker',
      pickerEmail: user.email || '',
      pickerId: user.uid,
      startTime: serverTimestamp(),
      endTime: serverTimestamp(),
      timeTakenMinutes: Math.max(1, Math.ceil(pickingTime / 60)),
      status: 'completed',
      issues: []
    };

    try {
      await addDoc(collection(db, 'orders'), orderData);
      addToast('Order completed and saved to history', 'success');
      
      // Reset picking order for next one - pick 4 random items with stock
      const itemsWithStock = inventory.filter(i => i.stock > 0);
      const shuffled = [...itemsWithStock].sort(() => 0.5 - Math.random());
      const nextOrder = shuffled.slice(0, 4).sort((a, b) => a.location.localeCompare(b.location));
      
      setPickingOrder(nextOrder); 
      
      // Reset scanning states
      setIsScanning(false);
      setIsBatchScanning(false);
      setShowBatchReview(false);
      setBatchScannedBarcodes([]);
      setPickingTime(0);
      
      // Update status to picking (since they are starting a new one)
      await updatePickerStatus('picking', nextOrder[0]?.location.split('-')[0] || 'Zone A');
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'orders');
    }
  };

  const createTicket = async (type: string, description: string, itemId?: string) => {
    try {
      await addDoc(collection(db, 'tickets'), {
        userId: user?.uid,
        userEmail: user?.email,
        type,
        description,
        status: 'open',
        timestamp: serverTimestamp(),
        itemId: itemId || null,
        itemName: itemId ? inventory.find(i => i.id === itemId)?.name : null
      });
      addToast('Ticket submitted successfully', 'success');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'tickets');
      addToast('Failed to submit ticket', 'error');
    }
  };

  const requestApproval = async (type: string, details: any, orderId?: string) => {
    try {
      await addDoc(collection(db, 'approvals'), {
        userId: user?.uid,
        userEmail: user?.email,
        type,
        details,
        status: 'pending',
        timestamp: serverTimestamp(),
        orderId: orderId || null
      });
      addToast('Approval request sent to manager', 'info');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'approvals');
      addToast('Failed to send approval request', 'error');
    }
  };

  const updateApprovalStatus = async (approvalId: string, status: 'approved' | 'rejected') => {
    try {
      await updateDoc(doc(db, 'approvals', approvalId), { status });
      addToast(`Request ${status}`, 'success');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `approvals/${approvalId}`);
      addToast('Failed to update approval', 'error');
    }
  };

  const sendVendorMessage = async (text: string) => {
    if (!text.trim()) return;
    try {
      await addDoc(collection(db, 'vendor_messages'), {
        senderId: user?.uid,
        senderName: user?.displayName || user?.email,
        senderRole: userRole,
        text,
        timestamp: serverTimestamp(),
        vendorId: 'v1' // Mock vendor ID
      });
      setNewMessage('');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'vendor_messages');
      addToast('Failed to send message', 'error');
    }
  };

  const updateItemDetails = async (itemId: string, updates: Partial<InventoryItem>) => {
    try {
      await updateDoc(doc(db, 'inventory', itemId), updates);
      addToast('Item details updated', 'success');
      setEditingItem(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `inventory/${itemId}`);
      addToast('Failed to update item details', 'error');
    }
  };

  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Zap className="text-yellow-400 mx-auto mb-4" size={48} />
          <h1 className="text-2xl font-bold text-white">BlinkAI Loading...</h1>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
        <div className="max-w-md w-full glass-panel p-8 text-center bg-white/10 border-white/20">
          <div className="w-16 h-16 blinkit-yellow rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Zap className="text-slate-900 fill-slate-900" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to BlinkAI</h1>
          <p className="text-slate-400 mb-8">Secure Dark Store Inventory Management System</p>
          <button 
            onClick={handleLogin}
            className="w-full py-4 bg-yellow-400 text-slate-900 font-bold rounded-xl hover:bg-yellow-300 transition-all flex items-center justify-center gap-3"
          >
            <User size={20} />
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  const lowStockItems = inventory.filter(i => i.stock <= i.minStock);
  const expiringSoon = inventory.filter(i => {
    const days = Math.ceil((new Date(i.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days <= 2;
  });

  const runAiForecast = async () => {
    setAiLoading(true);
    const result = await getDemandForecast(localContext, inventory);
    setForecast(result);
    setAiLoading(false);
  };

  const runSlottingOptimization = async () => {
    setAiLoading(true);
    const result = await getSlottingOptimization(inventory.map(i => ({ name: i.name, freq: i.pickingFrequency })));
    setOptimizations(result);
    setAiLoading(false);
  };

  return (
    <div className={`min-h-screen flex flex-col lg:flex-row ${darkMode ? 'dark bg-slate-950' : 'bg-slate-50'}`}>
      {/* Toast System */}
      <div className="fixed top-4 right-4 z-[200] flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`px-4 py-3 rounded-lg shadow-lg border flex items-center gap-3 min-w-[200px] ${
                t.type === 'success' ? 'bg-green-500 text-white border-green-600' :
                t.type === 'error' ? 'bg-red-500 text-white border-red-600' :
                'bg-blue-500 text-white border-blue-600'
              }`}
            >
              {t.type === 'success' && <CheckCircle2 size={18} />}
              {t.type === 'error' && <AlertTriangle size={18} />}
              {t.type === 'info' && <Info size={18} />}
              <span className="text-sm font-medium">{t.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {/* Sidebar */}
      <nav className="w-full lg:w-64 bg-slate-900 text-white p-6 flex flex-col gap-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 blinkit-yellow rounded-lg flex items-center justify-center">
            <Zap className="text-slate-900 fill-slate-900" size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight">BlinkAI</h1>
        </div>

        <div className="flex flex-col gap-2">
          <NavButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard size={20} />} label="Dashboard" />
          {(userRole === 'Admin' || userRole === 'Manager') && (
            <NavButton active={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} icon={<Package size={20} />} label="Inventory" />
          )}
          <NavButton active={activeTab === 'picking'} onClick={() => setActiveTab('picking')} icon={<Smartphone size={20} />} label="Picking App" />
          {(userRole === 'Admin' || userRole === 'Manager') && (
            <NavButton active={activeTab === 'approvals'} onClick={() => setActiveTab('approvals')} icon={<ClipboardCheck size={20} />} label="Approvals" />
          )}
          <NavButton active={activeTab === 'tickets'} onClick={() => setActiveTab('tickets')} icon={<MessageSquare size={20} />} label="Issue Tickets" />
          <NavButton active={activeTab === 'history'} onClick={() => setActiveTab('history')} icon={<HistoryIcon size={20} />} label="Order History" />
          <NavButton active={activeTab === 'vendors'} onClick={() => setActiveTab('vendors')} icon={<Users size={20} />} label="Vendors Chat" />
          <NavButton active={activeTab === 'compliance'} onClick={() => setActiveTab('compliance')} icon={<ShieldCheck size={20} />} label="Compliance" />
          {(userRole === 'Admin' || userRole === 'Manager') && (
            <NavButton active={activeTab === 'ai'} onClick={() => setActiveTab('ai')} icon={<TrendingUp size={20} />} label="AI Insights" />
          )}
        </div>

        <div className="mt-auto space-y-4">
          {/* Role Selector (Demo Only) */}
          <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 flex items-center gap-2">
              <Shield size={12} />
              Active Role
            </label>
            <select 
              value={userRole}
              onChange={(e) => {
                setUserRole(e.target.value as UserRole);
                addToast(`Switched to ${e.target.value} role`, 'info');
              }}
              className="w-full bg-transparent text-sm font-bold outline-none cursor-pointer"
            >
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Picker">Picker</option>
            </select>
          </div>
          <div className="p-4 bg-slate-800 rounded-xl border border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="text-green-400" size={16} />
              <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Compliance</span>
            </div>
            <p className="text-sm text-slate-300">Store Temp: 18°C</p>
            <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2">
              <div className="bg-green-400 h-full w-[92%] rounded-full"></div>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto transition-colors duration-300 max-w-[1600px] mx-auto w-full">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {activeTab === 'dashboard' && 'Store Overview'}
              {activeTab === 'inventory' && 'Inventory Management'}
              {activeTab === 'picking' && 'Mobile Picking Workflow'}
              {activeTab === 'ai' && 'Gemini AI Insights'}
              {activeTab === 'compliance' && 'Compliance & Regulatory'}
              {activeTab === 'tickets' && 'Issue Tickets'}
              {activeTab === 'approvals' && 'Approvals Desk'}
              {activeTab === 'vendors' && 'Vendor Communication'}
            </h2>
            <p className="text-slate-500 dark:text-slate-400">Dark Store #1842 - Nagpur North</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <button 
              onClick={() => {
                setDarkMode(!darkMode);
                addToast(`${!darkMode ? 'Dark' : 'Light'} mode enabled`, 'info');
              }}
              className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors relative text-slate-600 dark:text-slate-300"
              >
                <Bell size={20} />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-800"></span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute left-0 md:right-0 md:left-auto mt-2 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-900">
                      <h3 className="font-bold text-sm dark:text-white">Notifications</h3>
                      <button onClick={() => setShowNotifications(false)}><X size={16} className="text-slate-400" /></button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-slate-400 text-sm">No new notifications</div>
                      ) : (
                        notifications.map(n => (
                          <div key={n.id} className="p-4 border-b border-slate-50 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                            <div className="flex gap-3">
                              <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${n.type === 'low_stock' ? 'bg-red-500' : 'bg-blue-500'}`} />
                              <div>
                                <p className="text-sm text-slate-900 dark:text-slate-100 leading-tight">{n.message}</p>
                                <p className="text-[10px] text-slate-400 mt-1">{n.timestamp.toLocaleTimeString()}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search SKUs..." 
                className="pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 w-full md:w-64 dark:text-white"
              />
            </div>
            {(userRole === 'Admin' || userRole === 'Manager') && (
              <button 
                onClick={() => setShowAddItemModal(true)}
                className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300"
              >
                <Plus size={20} />
              </button>
            )}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 dark:text-white">{user.displayName || user.email}</p>
                <p className="text-[10px] font-bold text-yellow-600 uppercase tracking-wider">{userRole}</p>
              </div>
              <img 
                src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || user.email}&background=random`} 
                alt="Profile" 
                className="w-10 h-10 rounded-full border-2 border-yellow-400"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total SKUs" value="1,248" icon={<Package className="text-blue-500" />} trend="+12 today" />
                <StatCard title="Stockouts" value={lowStockItems.length.toString()} icon={<AlertTriangle className="text-red-500" />} trend="Critical" isAlert />
                <StatCard title="Expiring Soon" value={expiringSoon.length.toString()} icon={<Clock className="text-orange-500" />} trend="Next 48h" isAlert />
                <StatCard title="Avg. Picking Time" value="48s" icon={<Zap className="text-yellow-500" />} trend="-4s improvement" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass-panel p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-lg dark:text-white">Live Inventory Health</h3>
                    <BarChart3 size={20} className="text-slate-400" />
                  </div>
                  <div className="space-y-4">
                    {inventory.slice(0, 6).map(item => (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="w-24 text-sm font-medium text-slate-600 dark:text-slate-400 truncate">{item.name}</div>
                        <div className="flex-1 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${item.stock <= item.minStock ? 'bg-red-500' : 'bg-green-500'}`}
                            style={{ width: `${Math.min((item.stock / (item.minStock * 2)) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <div className="w-12 text-right text-sm font-bold dark:text-white">{item.stock}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-panel p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg dark:text-white">Active Pickers</h3>
                    <Activity size={18} className="text-green-500" />
                  </div>
                  <div className="space-y-4">
                    {activePickers.map(picker => (
                      <div key={picker.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center text-yellow-700 dark:text-yellow-400 font-bold text-xs">
                            {picker.name.split(' ')[0][0]}
                          </div>
                          <div>
                            <p className="text-sm font-bold dark:text-white">{picker.name}</p>
                            <div className="flex items-center gap-2">
                              <p className="text-[10px] text-slate-500">{picker.currentZone}</p>
                              <span className="text-[10px] text-slate-300">•</span>
                              <p className="text-[10px] text-slate-400">Active {new Date(picker.lastActive).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            picker.status === 'picking' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                            picker.status === 'idle' ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400' :
                            'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                          }`}>
                            {picker.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-panel p-6">
                  <h3 className="font-bold text-lg mb-4 dark:text-white">Quick Actions</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <ActionButton icon={<TrendingUp size={18} />} label="Run AI Forecast" onClick={() => setActiveTab('ai')} />
                    <ActionButton icon={<Smartphone size={18} />} label="Start Picking Session" onClick={() => setActiveTab('picking')} />
                    <ActionButton icon={<Map size={18} />} label="Optimize Layout" onClick={() => setActiveTab('ai')} />
                    <ActionButton icon={<ShieldCheck size={18} />} label="Compliance Audit" onClick={() => setActiveTab('compliance')} />
                  </div>
                </div>

                <div className="glass-panel p-6 bg-slate-900 text-white border-none">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-yellow-400 rounded-lg">
                      <Zap size={20} className="text-slate-900" />
                    </div>
                    <h3 className="font-bold text-lg">System Health</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">API Latency</span>
                      <span className="text-green-400 font-mono">24ms</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Database Sync</span>
                      <span className="text-green-400 font-mono">Real-time</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">AI Model Status</span>
                      <span className="text-yellow-400 font-mono">Ready</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'ai' && (
            <motion.div 
              key="ai"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              <div className="bg-slate-900 dark:bg-slate-900/50 text-white p-8 rounded-2xl relative overflow-hidden border border-slate-800">
                <div className="absolute top-0 right-0 p-12 opacity-10">
                  <Zap size={200} />
                </div>
                <div className="relative z-10 max-w-2xl">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="px-3 py-1 bg-yellow-400 text-slate-900 rounded-full text-xs font-bold uppercase">Powered by Gemini</div>
                  </div>
                  <h3 className="text-3xl font-bold mb-4">Hyperlocal Demand Forecasting</h3>
                  <p className="text-slate-400 mb-6">Gemini analyzes local events, weather, and historical data to predict SKU spikes before they happen.</p>
                  
                  <div className="flex flex-col gap-4">
                    <label className="text-sm font-medium text-slate-400">Current Local Context</label>
                    <textarea 
                      value={localContext}
                      onChange={(e) => setLocalContext(e.target.value)}
                      className="bg-slate-800 dark:bg-slate-950 border border-slate-700 dark:border-slate-800 rounded-xl p-4 text-white focus:ring-2 focus:ring-yellow-400 outline-none"
                      rows={3}
                    />
                    <button 
                      onClick={runAiForecast}
                      disabled={aiLoading}
                      className="w-fit px-6 py-3 blinkit-yellow text-slate-900 font-bold rounded-xl hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      {aiLoading ? 'Analyzing...' : 'Generate Forecast'}
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              </div>

              {forecast && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {forecast.predictions.map((p: any, idx: number) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      key={idx} 
                      className="glass-panel p-6 border-l-4 border-yellow-400"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-lg dark:text-white">{p.sku}</h4>
                        <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-[10px] font-bold rounded uppercase">{p.priority}</span>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{p.reason}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400">Suggested Increase</span>
                        <span className="text-lg font-bold text-green-600 dark:text-green-400">+{p.suggestedIncrease}%</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              <div className="glass-panel p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-bold">Slotting Optimization</h3>
                    <p className="text-slate-500">AI-driven shelf placement to reduce picking travel time.</p>
                  </div>
                  <button 
                    onClick={runSlottingOptimization}
                    disabled={aiLoading}
                    className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 font-medium"
                  >
                    {aiLoading ? 'Optimizing...' : 'Run Slotting AI'}
                  </button>
                </div>

                {optimizations ? (
                  <div className="space-y-4">
                    {optimizations.optimizations.map((opt: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex -space-x-2">
                          <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-blue-600 font-bold">A</div>
                          <div className="w-10 h-10 rounded-full bg-purple-100 border-2 border-white flex items-center justify-center text-purple-600 font-bold">B</div>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-slate-900">Move <span className="font-bold">{opt.itemA}</span> near <span className="font-bold">{opt.itemB}</span></p>
                          <p className="text-sm text-slate-500">{opt.reason}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-green-600 uppercase">Est. Saving</p>
                          <p className="text-lg font-bold">~12s</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-slate-400">
                    <BarChart3 size={48} className="mx-auto mb-4 opacity-20" />
                    <p>Run optimization to see layout suggestions</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'picking' && (
            <motion.div 
              key="picking"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="max-w-md mx-auto bg-white dark:bg-slate-900 rounded-[3rem] border-[8px] border-slate-900 dark:border-slate-800 shadow-2xl overflow-hidden h-[700px] flex flex-col"
            >
              <div className="bg-slate-900 text-white pt-12 pb-6 px-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium">Order #8921</span>
                  <div className="flex items-center gap-2">
                    <Zap size={14} className="text-yellow-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-yellow-400">AI Optimized Path</span>
                  </div>
                </div>

                {/* Picker Status Bar */}
                <div className="flex items-center justify-between mb-4 p-2 bg-slate-800/50 rounded-xl border border-slate-700">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-bold uppercase text-slate-300">Active: {user?.displayName || 'Picker'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400">Zone: A-12</span>
                    <div className="h-3 w-px bg-slate-700" />
                    <span className="text-[10px] text-slate-400">Status: Picking</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold">Picking List</h3>
                <div className="flex items-center justify-between">
                  <p className="text-slate-400 text-sm">{pickingOrder.length} items • Target: 60s</p>
                  <button 
                    onClick={() => {
                      setIsBatchScanning(true);
                      setBatchScannedBarcodes([]);
                    }}
                    className="px-3 py-1 bg-yellow-400 text-slate-900 text-[10px] font-bold rounded-full hover:bg-yellow-300 transition-all flex items-center gap-1"
                  >
                    <Camera size={12} />
                    Batch Scan
                  </button>
                </div>
                
                {/* Path Visualization */}
                <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {pickingOrder.map((item, idx) => (
                    <React.Fragment key={item.id}>
                      <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        idx === 0 ? 'bg-yellow-400 text-slate-900' : 'bg-slate-800 text-slate-500'
                      }`}>
                        {item.location.split('-')[0]}
                      </div>
                      {idx < pickingOrder.length - 1 && <div className="shrink-0 w-4 h-0.5 bg-slate-800" />}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4 dark:bg-slate-900">
                {pickingOrder.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center h-full">
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mb-4">
                      <Check size={40} />
                    </div>
                    <h4 className="text-xl font-bold mb-2 dark:text-white">Order Complete!</h4>
                    <p className="text-slate-500 dark:text-slate-400 mb-8">All items have been successfully picked and verified.</p>
                    <button 
                      onClick={completeOrder}
                      className="w-full py-4 bg-slate-900 dark:bg-slate-700 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all"
                    >
                      Finish & Start New Order
                    </button>
                  </div>
                ) : isBatchScanning ? (
                  <div className="space-y-4">
                    <Scanner 
                      onScanSuccess={(text) => {
                        if (!batchScannedBarcodes.includes(text)) {
                          setBatchScannedBarcodes(prev => [...prev, text]);
                        }
                      }}
                      onScanFailure={(err) => console.warn(err)}
                    />
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                      <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Scanned ({batchScannedBarcodes.length})</h4>
                      <div className="flex flex-wrap gap-2">
                        {batchScannedBarcodes.map((code, i) => (
                          <span key={i} className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[10px] font-mono dark:text-white">{code}</span>
                        ))}
                      </div>
                      <button 
                        onClick={() => {
                          setIsBatchScanning(false);
                          setShowBatchReview(true);
                        }}
                        className="w-full mt-4 py-2 bg-slate-900 dark:bg-slate-700 text-white text-xs font-bold rounded-lg"
                      >
                        Review Batch
                      </button>
                    </div>
                  </div>
                ) : showBatchReview ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 dark:text-white">Review Batch</h4>
                      <button onClick={() => setShowBatchReview(false)} className="text-slate-400"><X size={18} /></button>
                    </div>
                    {batchScannedBarcodes.map((code, idx) => {
                      const item = inventory.find(i => i.barcode === code || i.id === code);
                      return (
                        <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                          <div>
                            <p className="font-bold text-sm dark:text-white">{item?.name || 'Unknown Item'}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{code}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => setBatchScannedBarcodes(prev => prev.filter((_, i) => i !== idx))}
                              className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                    <button 
                      onClick={() => {
                        batchScannedBarcodes.forEach(code => {
                          const item = inventory.find(i => i.barcode === code || i.id === code);
                          if (item) {
                            updateStock(item.id, Math.max(0, item.stock - 1));
                            setPickingOrder(prev => prev.filter(p => p.id !== item.id));
                          }
                        });
                        setShowBatchReview(false);
                        setBatchScannedBarcodes([]);
                        addToast('Batch confirmed', 'success');
                      }}
                      className="w-full py-3 bg-green-500 text-white font-bold rounded-xl"
                    >
                      Confirm All Picks
                    </button>
                  </div>
                ) : isScanning ? (
                  <Scanner 
                    onScanSuccess={(text) => {
                      setScanResult(text);
                      setIsScanning(false);
                      const item = inventory.find(i => i.barcode === text || i.id === text);
                      if (item) {
                        updateStock(item.id, Math.max(0, item.stock - 1));
                        setPickingOrder(prev => prev.filter(p => p.id !== item.id));
                        addToast(`Picked ${item.name}`, 'success');
                      } else {
                        addToast('Item not found', 'error');
                      }
                    }}
                    onScanFailure={(err) => {
                      console.warn(err);
                      addToast('Scan failed', 'error');
                    }}
                  />
                ) : (
                  <>
                    {pickingOrder.map((item, idx) => (
                      <PickingItem 
                        key={item.id}
                        name={item.name} 
                        location={item.location} 
                        qty={1} 
                        status={idx === 0 ? 'active' : 'pending'} 
                        onScan={() => setIsScanning(true)} 
                        onSkip={(reason) => {
                          console.log(`Skipped ${item.name} due to ${reason}`);
                          setPickingOrder(prev => prev.filter(p => p.id !== item.id));
                          addComplianceLog('regulatory', `Item skipped: ${item.name} (${reason})`, 'warning');
                          addToast(`Skipped ${item.name}`, 'info');
                        }}
                        onQtyChange={(newQty) => {
                          console.log(`Adjusted qty for ${item.name} to ${newQty}`);
                        }}
                      />
                    ))}
                  </>
                )}
              </div>

              <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Clock size={16} />
                    <span className="text-sm font-mono">
                      {Math.floor(pickingTime / 60).toString().padStart(2, '0')}:
                      {(pickingTime % 60).toString().padStart(2, '0')}s
                    </span>
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    {4 - pickingOrder.length}/4 Picked
                  </div>
                </div>
                
                <div className="flex gap-2 mb-3">
                  <button 
                    onClick={() => {
                      if (isEmergencyPending) return;
                      requestApproval('emergency_complete', { orderId: '8921', itemsLeft: pickingOrder.length }, '8921');
                    }}
                    disabled={isEmergencyPending}
                    className={`flex-1 py-3 border font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 ${
                      isEmergencyPending 
                        ? 'bg-yellow-50 border-yellow-200 text-yellow-600 cursor-not-allowed' 
                        : 'border-red-200 text-red-500 hover:bg-red-50'
                    }`}
                  >
                    {isEmergencyPending ? (
                      <>
                        <Clock size={14} className="animate-pulse" />
                        Awaiting Approval
                      </>
                    ) : (
                      'Emergency Complete'
                    )}
                  </button>
                  <button 
                    onClick={() => setShowTicketModal(true)}
                    className="flex-1 py-3 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-xl text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                  >
                    Report Issue
                  </button>
                </div>

                <button 
                  disabled={pickingOrder.length > 0}
                  className="w-full py-4 bg-slate-900 dark:bg-slate-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <CheckCircle2 size={20} />
                  Complete Order
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'compliance' && (
            <motion.div 
              key="compliance"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-6 flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <Thermometer size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400">Store Temperature</h4>
                    <p className="text-2xl font-bold dark:text-white">18.4°C</p>
                  </div>
                </div>
                <div className="glass-panel p-6 flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400">
                    <Droplets size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400">Humidity Level</h4>
                    <p className="text-2xl font-bold dark:text-white">42%</p>
                  </div>
                </div>
                <div className="glass-panel p-6 flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400">
                    <ClipboardCheck size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400">Last Audit Score</h4>
                    <p className="text-2xl font-bold dark:text-white">98/100</p>
                  </div>
                </div>
              </div>

              <div className="glass-panel p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold dark:text-white">Compliance Logs</h3>
                  <button 
                    onClick={() => setShowComplianceForm(true)}
                    className="px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white text-sm font-bold rounded-lg hover:opacity-90 transition-all"
                  >
                    Log New Record
                  </button>
                </div>

                <AnimatePresence>
                  {showComplianceForm && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-8 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold dark:text-white">New Compliance Entry</h4>
                        <button onClick={() => setShowComplianceForm(false)}><X size={18} className="text-slate-400" /></button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Type</label>
                          <select 
                            value={newCompliance.type}
                            onChange={(e) => setNewCompliance({...newCompliance, type: e.target.value as any})}
                            className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 dark:text-white"
                          >
                            <option value="temperature">Temperature</option>
                            <option value="cleaning">Cleaning</option>
                            <option value="regulatory">Regulatory</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Value / Detail</label>
                          <input 
                            type="text"
                            value={newCompliance.value}
                            onChange={(e) => setNewCompliance({...newCompliance, value: e.target.value})}
                            placeholder="e.g. 18.2°C or Zone A"
                            className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Status</label>
                          <select 
                            value={newCompliance.status}
                            onChange={(e) => setNewCompliance({...newCompliance, status: e.target.value as any})}
                            className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 dark:text-white"
                          >
                            <option value="normal">Normal</option>
                            <option value="warning">Warning</option>
                            <option value="critical">Critical</option>
                          </select>
                        </div>
                      </div>
                      <button 
                        onClick={async () => {
                          if (!newCompliance.value) return;
                          await addComplianceLog(newCompliance.type as any, newCompliance.value, newCompliance.status as any);
                          setNewCompliance({ type: 'temperature', value: '', status: 'normal' });
                          setShowComplianceForm(false);
                          addToast('Compliance log added', 'success');
                        }}
                        className="w-full py-3 blinkit-yellow text-slate-900 font-bold rounded-xl"
                      >
                        Submit Record
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-4">
                  {compliance.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-4">
                        <div className={`w-2 h-2 rounded-full ${
                          log.status === 'normal' ? 'bg-green-500' : 
                          log.status === 'warning' ? 'bg-orange-500' : 'bg-red-500'
                        }`} />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white capitalize">{log.type}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{log.value}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-400">
                          {log.timestamp?.toDate ? log.timestamp.toDate().toLocaleString() : 'Just now'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'tickets' && (
            <motion.div 
              key="tickets"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold dark:text-white">Issue Tickets</h3>
                <button 
                  onClick={() => setShowTicketModal(true)}
                  className="px-4 py-2 blinkit-yellow text-slate-900 font-bold rounded-lg flex items-center gap-2"
                >
                  <Plus size={18} />
                  New Ticket
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {tickets.length === 0 ? (
                  <div className="glass-panel p-12 text-center">
                    <MessageSquare size={48} className="mx-auto text-slate-200 mb-4" />
                    <p className="text-slate-500">No active tickets.</p>
                  </div>
                ) : (
                  tickets.map(ticket => (
                    <div key={ticket.id} className="glass-panel p-6 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          ticket.status === 'open' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                        }`}>
                          <AlertTriangle size={24} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold dark:text-white uppercase text-xs tracking-wider">{ticket.type.replace('_', ' ')}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              ticket.status === 'open' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                            }`}>
                              {ticket.status}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-300">{ticket.description}</p>
                          <p className="text-[10px] text-slate-400 mt-1">
                            By {ticket.userEmail} • {ticket.timestamp?.toDate ? ticket.timestamp.toDate().toLocaleString() : 'Just now'}
                          </p>
                        </div>
                      </div>
                      {userRole !== 'Picker' && ticket.status === 'open' && (
                        <button 
                          onClick={async () => {
                            await updateDoc(doc(db, 'tickets', ticket.id), { status: 'resolved' });
                            addToast('Ticket marked as resolved', 'success');
                          }}
                          className="px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white text-xs font-bold rounded-lg"
                        >
                          Resolve
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'approvals' && (
            <motion.div 
              key="approvals"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h3 className="text-xl font-bold dark:text-white">Approvals Desk</h3>
              <div className="grid grid-cols-1 gap-4">
                {approvals.length === 0 ? (
                  <div className="glass-panel p-12 text-center">
                    <ClipboardCheck size={48} className="mx-auto text-slate-200 mb-4" />
                    <p className="text-slate-500">No pending approval requests.</p>
                  </div>
                ) : (
                  approvals.map(req => (
                    <div key={req.id} className="glass-panel p-6 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          req.status === 'pending' ? 'bg-yellow-100 text-yellow-600' : 
                          req.status === 'approved' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}>
                          <ShieldCheck size={24} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold dark:text-white uppercase text-xs tracking-wider">{req.type.replace('_', ' ')}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              req.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                              req.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {req.status}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-300">
                            {req.type === 'emergency_complete' 
                              ? `Emergency completion for Order #${req.orderId} (${req.details?.itemsLeft || 0} items remaining)` 
                              : 'New stock addition approval'}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-1">
                            Requested by {req.userEmail} • {req.timestamp?.toDate ? req.timestamp.toDate().toLocaleString() : 'Just now'}
                          </p>
                        </div>
                      </div>
                      {req.status === 'pending' && (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => updateApprovalStatus(req.id, 'approved')}
                            className="px-4 py-2 bg-green-500 text-white text-xs font-bold rounded-lg"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => updateApprovalStatus(req.id, 'rejected')}
                            className="px-4 py-2 bg-red-500 text-white text-xs font-bold rounded-lg"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div 
              key="history"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold dark:text-white">Order Picking History</h3>
                <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-sm text-slate-500">Total Orders:</span>
                  <span className="text-sm font-bold dark:text-white">{orderHistory.length}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {orderHistory.length === 0 ? (
                  <div className="glass-panel p-12 text-center">
                    <HistoryIcon size={48} className="mx-auto text-slate-200 mb-4" />
                    <p className="text-slate-500">No completed orders yet.</p>
                  </div>
                ) : (
                  orderHistory.map(order => (
                    <div key={order.id} className="glass-panel p-6 flex items-center justify-between hover:border-yellow-400/50 transition-all cursor-pointer group">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          order.status === 'emergency_completed' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                        }`}>
                          <Package size={24} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold dark:text-white uppercase text-xs tracking-wider">Order #{order.orderId}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              order.status === 'completed' ? 'bg-green-100 text-green-700' : 
                              order.status === 'emergency_completed' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {order.status.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-300">
                            Picked by <span className="font-bold">{order.pickerName}</span> • {order.itemsPicked}/{order.totalItems} items
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center gap-1 text-[10px] text-slate-400">
                              <Clock size={12} />
                              {order.timeTakenMinutes}m taken
                            </div>
                            <div className="flex items-center gap-1 text-[10px] text-slate-400">
                              <Calendar size={12} />
                              {order.startTime?.toDate ? order.startTime.toDate().toLocaleString() : 'Just now'}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {order.issues && order.issues.length > 0 && (
                          <div className="flex items-center gap-1 px-2 py-1 bg-orange-50 text-orange-600 rounded text-[10px] font-bold">
                            <AlertTriangle size={12} />
                            {order.issues.length} Issues
                          </div>
                        )}
                        <ChevronRight size={20} className="text-slate-300 group-hover:text-yellow-500 transition-colors" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'vendors' && (
            <motion.div 
              key="vendors"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel flex flex-col h-[600px] overflow-hidden"
            >
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-slate-900 font-bold">V</div>
                  <div>
                    <h4 className="font-bold dark:text-white">Nagpur Fresh Supplies</h4>
                    <p className="text-[10px] text-green-500 font-bold uppercase">Online</p>
                  </div>
                </div>
                <button className="p-2 text-slate-400 hover:text-slate-600"><Info size={20} /></button>
              </div>

              <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-950/50">
                {vendorMessages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.senderId === user?.uid ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] p-3 rounded-2xl ${
                      msg.senderId === user?.uid ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-100 dark:border-slate-700 rounded-tl-none'
                    }`}>
                      <p className="text-xs font-bold mb-1 opacity-70">{msg.senderName}</p>
                      <p className="text-sm">{msg.text}</p>
                      <p className="text-[10px] mt-1 opacity-50 text-right">
                        {msg.timestamp?.toDate ? msg.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendVendorMessage(newMessage);
                  }}
                  className="flex gap-2"
                >
                  <input 
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Ask about stocks, delivery info..."
                    className="flex-1 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-yellow-400 dark:text-white"
                  />
                  <button 
                    type="submit"
                    className="p-3 blinkit-yellow text-slate-900 rounded-xl hover:opacity-90 transition-all"
                  >
                    <ChevronRight size={24} />
                  </button>
                </form>
              </div>
            </motion.div>
          )}
          {activeTab === 'inventory' && (
            <motion.div 
              key="inventory"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Filters */}
              <div className="flex flex-wrap items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Filter size={18} className="text-slate-400" />
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Filters:</span>
                </div>
                <select 
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-yellow-400 dark:text-white"
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-yellow-400 dark:text-white"
                >
                  <option value="All">All Statuses</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Expiring Soon">Expiring Soon</option>
                </select>
                <select 
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-yellow-400 dark:text-white"
                >
                  {uniqueLocations.map(loc => <option key={loc} value={loc}>{loc === 'All' ? 'All Locations' : `Zone ${loc}`}</option>)}
                </select>

                <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-2" />

                <button 
                  onClick={exportToCSV}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-sm font-bold"
                >
                  <ArrowDown size={16} />
                  Export CSV
                </button>

                <button 
                  onClick={() => setShowAddItemModal(true)}
                  className="flex items-center gap-2 px-4 py-2 blinkit-yellow text-slate-900 rounded-lg hover:bg-yellow-300 transition-all text-sm font-bold ml-auto"
                >
                  <Plus size={16} />
                  Add Item
                </button>
                
                {selectedItems.length > 0 && (
                  <div className="ml-auto flex items-center gap-3 bg-yellow-50 dark:bg-yellow-900/10 px-4 py-2 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <span className="text-sm font-bold text-yellow-800 dark:text-yellow-400">{selectedItems.length} selected</span>
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        value={bulkAdjustment}
                        onChange={(e) => setBulkAdjustment(parseInt(e.target.value) || 0)}
                        className="w-16 px-2 py-1 border border-yellow-300 dark:border-yellow-700 rounded text-sm bg-white dark:bg-slate-800 dark:text-white"
                        placeholder="Qty"
                      />
                      <button 
                        onClick={() => handleBulkUpdate(bulkAdjustment)}
                        className="p-1 bg-yellow-400 text-slate-900 rounded hover:bg-yellow-500"
                        title="Add to stock"
                      >
                        <ArrowUp size={16} />
                      </button>
                      <button 
                        onClick={() => handleBulkUpdate(-bulkAdjustment)}
                        className="p-1 bg-slate-900 dark:bg-slate-700 text-white rounded hover:bg-slate-800"
                        title="Remove from stock"
                      >
                        <ArrowDown size={16} />
                      </button>
                    </div>
                    <div className="w-px h-6 bg-yellow-200 dark:bg-yellow-800 mx-1" />
                    <select 
                      value={bulkCategory}
                      onChange={(e) => handleBulkCategoryChange(e.target.value)}
                      className="px-2 py-1 bg-white dark:bg-slate-800 border border-yellow-300 dark:border-yellow-700 rounded text-xs outline-none dark:text-white"
                    >
                      <option value="">Change Category</option>
                      {categoryOptions.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    <button onClick={() => setSelectedItems([])} className="text-yellow-700 hover:text-yellow-900"><X size={16} /></button>
                  </div>
                )}
              </div>

              <div className="glass-panel overflow-hidden">
                <DndContext 
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                        <th className="px-6 py-4 w-10">
                          <button 
                            onClick={() => {
                              if (selectedItems.length === filteredInventory.length) setSelectedItems([]);
                              else setSelectedItems(filteredInventory.map(i => i.id));
                            }}
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                          >
                            {selectedItems.length === filteredInventory.length ? <CheckSquare size={20} className="text-yellow-500" /> : <Square size={20} />}
                          </button>
                        </th>
                        <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 dark:text-slate-400 cursor-pointer hover:text-slate-700 dark:hover:text-slate-200" onClick={() => handleSort('name')}>
                          <div className="flex items-center gap-1">
                            SKU Name
                            <ArrowUpDown size={12} className={sortConfig?.key === 'name' ? 'text-yellow-500' : 'text-slate-300'} />
                          </div>
                        </th>
                        <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 dark:text-slate-400 cursor-pointer hover:text-slate-700 dark:hover:text-slate-200" onClick={() => handleSort('category')}>
                          <div className="flex items-center gap-1">
                            Category
                            <ArrowUpDown size={12} className={sortConfig?.key === 'category' ? 'text-yellow-500' : 'text-slate-300'} />
                          </div>
                        </th>
                        <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 dark:text-slate-400 cursor-pointer hover:text-slate-700 dark:hover:text-slate-200" onClick={() => handleSort('stock')}>
                          <div className="flex items-center gap-1">
                            Stock
                            <ArrowUpDown size={12} className={sortConfig?.key === 'stock' ? 'text-yellow-500' : 'text-slate-300'} />
                          </div>
                        </th>
                        <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 dark:text-slate-400 cursor-pointer hover:text-slate-700 dark:hover:text-slate-200" onClick={() => handleSort('expiryDate')}>
                          <div className="flex items-center gap-1">
                            Expiry
                            <ArrowUpDown size={12} className={sortConfig?.key === 'expiryDate' ? 'text-yellow-500' : 'text-slate-300'} />
                          </div>
                        </th>
                        <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 dark:text-slate-400 cursor-pointer hover:text-slate-700 dark:hover:text-slate-200" onClick={() => handleSort('location')}>
                          <div className="flex items-center gap-1">
                            Location
                            <ArrowUpDown size={12} className={sortConfig?.key === 'location' ? 'text-yellow-500' : 'text-slate-300'} />
                          </div>
                        </th>
                        <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      <SortableContext 
                        items={sortedAndFilteredInventory.map(i => i.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        {sortedAndFilteredInventory.map(item => {
                          const daysToExpiry = Math.ceil((new Date(item.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                          const isExpiringSoon = daysToExpiry <= 3;
                          const isSelected = selectedItems.includes(item.id);
                          
                          return (
                            <SortableRow 
                              key={item.id}
                              item={item}
                              isSelected={isSelected}
                              isExpiringSoon={isExpiringSoon}
                              daysToExpiry={daysToExpiry}
                              onSelect={(id: string) => {
                                if (isSelected) setSelectedItems(prev => prev.filter(i => i !== id));
                                else setSelectedItems(prev => [...prev, id]);
                              }}
                              onEdit={setEditingItem}
                              onUpdateStock={updateStock}
                              onViewHistory={fetchItemHistory}
                              onDelete={deleteItem}
                            />
                          );
                        })}
                      </SortableContext>
                    </tbody>
                  </table>
                </DndContext>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {editingItem && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{editingItem.name}</h3>
                  <p className="text-slate-500 dark:text-slate-400">SKU Details & Management</p>
                </div>
                <button onClick={() => setEditingItem(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                  <X size={24} className="text-slate-400" />
                </button>
              </div>
              
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Basic Info</label>
                    <div className="space-y-3">
                      <div className="flex flex-col gap-1 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                        <span className="text-xs text-slate-500">Name</span>
                        <input 
                          type="text"
                          value={editingItem.name}
                          onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                          className="text-sm font-bold bg-transparent outline-none dark:text-white"
                        />
                      </div>
                      <div className="flex flex-col gap-1 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                        <span className="text-xs text-slate-500">Category</span>
                        <select 
                          value={editingItem.category}
                          onChange={(e) => setEditingItem({...editingItem, category: e.target.value})}
                          className="text-sm font-bold bg-transparent outline-none dark:text-white"
                        >
                          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                      </div>
                      <div className="flex flex-col gap-1 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                        <span className="text-xs text-slate-500">Location</span>
                        <input 
                          type="text"
                          value={editingItem.location}
                          onChange={(e) => setEditingItem({...editingItem, location: e.target.value})}
                          className="text-sm font-bold font-mono bg-transparent outline-none dark:text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Performance</label>
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-xl border border-yellow-100 dark:border-yellow-900/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-yellow-800 dark:text-yellow-400">Picking Frequency</span>
                        <span className="text-lg font-bold text-yellow-900 dark:text-yellow-200">{editingItem.pickingFrequency}%</span>
                      </div>
                      <div className="w-full bg-yellow-200 dark:bg-yellow-900/30 h-2 rounded-full overflow-hidden">
                        <div className="bg-yellow-500 h-full" style={{ width: `${editingItem.pickingFrequency}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Inventory Status</label>
                    <div className="space-y-3">
                      <div className="flex flex-col gap-1 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                        <span className="text-xs text-slate-500">Current Stock</span>
                        <input 
                          type="number"
                          value={editingItem.stock}
                          onChange={(e) => setEditingItem({...editingItem, stock: parseInt(e.target.value) || 0})}
                          className="text-sm font-bold bg-transparent outline-none dark:text-white"
                        />
                      </div>
                      <div className="flex flex-col gap-1 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                        <span className="text-xs text-slate-500">Minimum Threshold</span>
                        <input 
                          type="number"
                          value={editingItem.minStock}
                          onChange={(e) => setEditingItem({...editingItem, minStock: parseInt(e.target.value) || 0})}
                          className="text-sm font-bold bg-transparent outline-none dark:text-white"
                        />
                      </div>
                      <div className="flex flex-col gap-1 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                        <span className="text-xs text-slate-500">Expiry Date</span>
                        <input 
                          type="date"
                          value={editingItem.expiryDate}
                          onChange={(e) => setEditingItem({...editingItem, expiryDate: e.target.value})}
                          className="text-sm font-bold bg-transparent outline-none dark:text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button 
                      onClick={() => updateItemDetails(editingItem.id, editingItem)}
                      className="flex-1 py-3 bg-slate-900 dark:bg-slate-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-all"
                    >
                      <Save size={18} />
                      Save Changes
                    </button>
                    <button 
                      onClick={() => deleteItem(editingItem.id)}
                      className="px-4 py-3 border border-red-200 text-red-500 rounded-xl hover:bg-red-50 transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {showConfirmStock && pendingStockUpdate && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2 dark:text-white">Confirm Stock Update</h3>
              <p className="text-slate-500 mb-8">
                Are you sure you want to update the stock for <span className="font-bold text-slate-900 dark:text-white">
                  {inventory.find(i => i.id === pendingStockUpdate.id)?.name}
                </span> to <span className="font-bold text-slate-900 dark:text-white">{pendingStockUpdate.newStock}</span>?
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowConfirmStock(false)}
                  className="flex-1 py-3 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmStockUpdate}
                  className="flex-1 py-3 bg-slate-900 dark:bg-slate-700 text-white rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-slate-600"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {showHistoryModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[130] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Stock History</h3>
                  <p className="text-sm text-slate-500">Tracking adjustments for this item</p>
                </div>
                <button onClick={() => setShowHistoryModal(false)}><X size={20} className="text-slate-400" /></button>
              </div>
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                {itemHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock size={48} className="mx-auto text-slate-200 mb-4" />
                    <p className="text-slate-500">No history found for this item.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {itemHistory.map((log, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            log.adjustment > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                          }`}>
                            {log.adjustment > 0 ? <ArrowUp size={20} /> : <ArrowDown size={20} />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold dark:text-white">{log.adjustment > 0 ? '+' : ''}{log.adjustment} units</span>
                              <span className="text-xs text-slate-400">({log.previousStock} → {log.newStock})</span>
                            </div>
                            <p className="text-xs text-slate-500">{log.reason || 'Manual adjustment'}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium dark:text-slate-300">{log.user}</p>
                          <p className="text-[10px] text-slate-400">
                            {log.timestamp?.toDate ? log.timestamp.toDate().toLocaleString() : 'Just now'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                <button 
                  onClick={() => setShowHistoryModal(false)}
                  className="w-full py-3 bg-slate-900 dark:bg-slate-700 text-white font-bold rounded-xl"
                >
                  Close History
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {showAddItemModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[120] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">Add New Inventory Item</h3>
                <button onClick={() => setShowAddItemModal(false)}><X size={20} className="text-slate-400" /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Item Name</label>
                    <input 
                      type="text"
                      value={newItem.name}
                      onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                      placeholder="e.g. Amul Milk 1L"
                      className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Category</label>
                    <select 
                      value={newItem.category}
                      onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                      className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-yellow-400"
                    >
                      {categoryOptions.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      <option value="Dairy">Dairy</option>
                      <option value="Bakery">Bakery</option>
                      <option value="Snacks">Snacks</option>
                      <option value="Beverages">Beverages</option>
                      <option value="Produce">Produce</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Location</label>
                    <input 
                      type="text"
                      value={newItem.location}
                      onChange={(e) => setNewItem({...newItem, location: e.target.value})}
                      placeholder="e.g. A-01"
                      className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Initial Stock</label>
                    <input 
                      type="number"
                      value={newItem.stock}
                      onChange={(e) => setNewItem({...newItem, stock: parseInt(e.target.value) || 0})}
                      className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Min. Stock</label>
                    <input 
                      type="number"
                      value={newItem.minStock}
                      onChange={(e) => setNewItem({...newItem, minStock: parseInt(e.target.value) || 0})}
                      className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Expiry Date</label>
                    <input 
                      type="date"
                      value={newItem.expiryDate}
                      onChange={(e) => setNewItem({...newItem, expiryDate: e.target.value})}
                      className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Barcode (Optional)</label>
                    <input 
                      type="text"
                      value={newItem.barcode}
                      onChange={(e) => setNewItem({...newItem, barcode: e.target.value})}
                      placeholder="Scan or type..."
                      className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                </div>
                <button 
                  onClick={handleAddItem}
                  disabled={!newItem.name || !newItem.location}
                  className="w-full py-3 blinkit-yellow text-slate-900 font-bold rounded-xl disabled:opacity-50"
                >
                  Add to Inventory
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {showTicketModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[130] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h3 className="text-xl font-bold dark:text-white">Report Issue</h3>
                <button onClick={() => setShowTicketModal(false)}><X size={20} className="text-slate-400" /></button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Issue Type</label>
                  <select 
                    value={newTicket.type}
                    onChange={(e) => setNewTicket({...newTicket, type: e.target.value as any})}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none dark:text-white"
                  >
                    <option value="qr_unreadable">QR Code Unreadable</option>
                    <option value="stock_discrepancy">Stock Discrepancy</option>
                    <option value="product_missing">Product Missing</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description</label>
                  <textarea 
                    value={newTicket.description}
                    onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                    placeholder="Describe the issue in detail..."
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none h-32 dark:text-white"
                  />
                </div>
                <button 
                  onClick={async () => {
                    await createTicket(newTicket.type, newTicket.description);
                    setShowTicketModal(false);
                    setNewTicket({ type: 'qr_unreadable', description: '', itemId: '' });
                  }}
                  className="w-full py-3 blinkit-yellow text-slate-900 font-bold rounded-xl"
                >
                  Submit Ticket
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Info Sidebar (Desktop) */}
      <aside className="hidden xl:block w-80 bg-white border-l border-slate-200 p-8">
        <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
          <Info size={20} className="text-blue-500" />
          Hackathon Solution
        </h3>
        <div className="space-y-6">
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
            <h4 className="text-sm font-bold text-blue-900 mb-1">Problem: Stockouts</h4>
            <p className="text-xs text-blue-700">BlinkAI uses Gemini to predict demand spikes based on local events, automating replenishment triggers before stock hits zero.</p>
          </div>
          <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
            <h4 className="text-sm font-bold text-orange-900 mb-1">Problem: Expiry Wastage</h4>
            <p className="text-xs text-orange-700">Automated FEFO tracking flags items expiring within 48h for proactive discounting or removal.</p>
          </div>
          <div className="p-4 bg-green-50 rounded-xl border border-green-100">
            <h4 className="text-sm font-bold text-green-900 mb-1">Problem: Picking Speed</h4>
            <p className="text-xs text-green-700">AI-optimized slotting suggestions reduce travel time for pickers, ensuring 10-minute delivery SLAs.</p>
          </div>
          
          <div className="pt-6 border-t border-slate-100">
            <h4 className="text-sm font-bold mb-4">Gemini Integration</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-xs text-slate-600">
                <CheckCircle2 size={14} className="text-green-500 mt-0.5 shrink-0" />
                <span>Context-aware demand forecasting (Weather/Events)</span>
              </li>
              <li className="flex items-start gap-2 text-xs text-slate-600">
                <CheckCircle2 size={14} className="text-green-500 mt-0.5 shrink-0" />
                <span>Picking log analysis for shelf optimization</span>
              </li>
              <li className="flex items-start gap-2 text-xs text-slate-600">
                <CheckCircle2 size={14} className="text-green-500 mt-0.5 shrink-0" />
                <span>Automated compliance & hygiene auditing</span>
              </li>
            </ul>
          </div>
        </div>
      </aside>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        active ? 'bg-yellow-400 text-slate-900 font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white dark:hover:bg-slate-800/50'
      }`}
    >
      {icon}
      <span>{label}</span>
      {active && <motion.div layoutId="activeNav" className="ml-auto w-1.5 h-1.5 bg-slate-900 rounded-full" />}
    </button>
  );
}

function StatCard({ title, value, icon, trend, isAlert }: { title: string, value: string, icon: React.ReactNode, trend: string, isAlert?: boolean }) {
  return (
    <div className="glass-panel p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">{icon}</div>
        <span className={`text-[10px] font-bold uppercase tracking-wider ${isAlert ? 'text-red-500' : 'text-slate-400 dark:text-slate-500'}`}>{trend}</span>
      </div>
      <h4 className="text-slate-500 dark:text-slate-400 text-sm font-medium">{title}</h4>
      <p className="text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}

function ActionButton({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl hover:bg-yellow-50 dark:hover:bg-yellow-900/20 hover:border-yellow-200 dark:hover:border-yellow-800 transition-all group"
    >
      <div className="flex items-center gap-3">
        <div className="text-slate-400 group-hover:text-yellow-600 dark:group-hover:text-yellow-400">{icon}</div>
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
      </div>
      <ChevronRight size={16} className="text-slate-300 group-hover:text-yellow-600 dark:group-hover:text-yellow-400" />
    </button>
  );
}

interface PickingItemProps {
  name: string;
  location: string;
  qty: number;
  status: 'ready' | 'active' | 'pending';
  onScan?: () => void;
  onSkip?: (reason: string) => void;
  onQtyChange?: (newQty: number) => void;
}

const PickingItem: React.FC<PickingItemProps> = ({ name, location, qty, status, onScan, onSkip, onQtyChange }) => {
  const [showSkipReason, setShowSkipReason] = useState(false);
  const [skipReason, setSkipReason] = useState('');
  const [localQty, setLocalQty] = useState(qty);

  return (
    <div className={`p-4 rounded-2xl border-2 transition-all ${
      status === 'active' ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/10' : 
      status === 'ready' ? 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 opacity-50' : 'border-slate-100 dark:border-slate-800'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 blinkit-yellow rounded-lg flex items-center justify-center font-black text-slate-900 text-xs">
            {location}
          </div>
          <span className="font-bold text-xs text-slate-500 uppercase tracking-widest">Shelf Location</span>
        </div>
        {status === 'ready' && <CheckCircle2 size={16} className="text-green-500" />}
      </div>
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white text-lg leading-tight">{name}</h4>
          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Scan Required</p>
        </div>
        <div className="flex items-center gap-2">
          {status === 'active' ? (
            <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
              <button 
                onClick={() => {
                  const n = Math.max(0, localQty - 1);
                  setLocalQty(n);
                  onQtyChange?.(n);
                }}
                className="p-1 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-500"
              >
                <Minus size={14} />
              </button>
              <span className="px-2 font-black text-sm dark:text-white">{localQty}</span>
              <button 
                onClick={() => {
                  const n = localQty + 1;
                  setLocalQty(n);
                  onQtyChange?.(n);
                }}
                className="p-1 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-500"
              >
                <Plus size={14} />
              </button>
            </div>
          ) : (
            <span className="text-lg font-black dark:text-white">x{qty}</span>
          )}
        </div>
      </div>

      {status === 'active' && (
        <div className="mt-4 space-y-3">
          <div className="flex gap-2">
            <button 
              onClick={onScan}
              className="flex-1 py-2 bg-slate-900 dark:bg-slate-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2"
            >
              <Camera size={14} />
              Scan Barcode
            </button>
            <button 
              onClick={() => setShowSkipReason(!showSkipReason)}
              className="px-3 py-2 border border-slate-200 dark:border-slate-700 text-xs font-bold rounded-lg hover:bg-white dark:hover:bg-slate-800 dark:text-slate-300"
            >
              Skip
            </button>
          </div>

          <AnimatePresence>
            {showSkipReason && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl space-y-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Reason for skipping</p>
                  <select 
                    value={skipReason}
                    onChange={(e) => setSkipReason(e.target.value)}
                    className="w-full p-2 text-xs border border-slate-100 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-900 outline-none dark:text-white"
                  >
                    <option value="">Select a reason...</option>
                    <option value="out_of_stock">Out of Stock</option>
                    <option value="damaged">Damaged Item</option>
                    <option value="wrong_location">Wrong Location</option>
                    <option value="expired">Expired</option>
                  </select>
                  <button 
                    disabled={!skipReason}
                    onClick={() => onSkip?.(skipReason)}
                    className="w-full py-2 bg-red-500 text-white text-[10px] font-bold rounded uppercase disabled:opacity-50"
                  >
                    Confirm Skip
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
