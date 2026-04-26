import { db } from './firebase';
import { doc, writeBatch } from 'firebase/firestore';

export const seedDatabase = async () => {
    try {
        const batch = writeBatch(db);

        const INVENTORY = [
            { id: '1', name: 'Fresh Milk 1L', location: 'A1-01', stock: 45, minStock: 20, expiryDate: new Date(Date.now() + 86400000 * 5).toISOString(), category: 'Dairy', pickingFrequency: 85, barcode: '111' },
            { id: '2', name: 'Whole Wheat Bread', location: 'B2-04', stock: 12, minStock: 15, expiryDate: new Date(Date.now() + 86400000 * 3).toISOString(), category: 'Bakery', pickingFrequency: 70, barcode: '222' },
            { id: '3', name: 'Eggs (12 col)', location: 'A1-03', stock: 80, minStock: 30, expiryDate: new Date(Date.now() + 86400000 * 10).toISOString(), category: 'Dairy', pickingFrequency: 65, barcode: '333' },
            { id: '4', name: 'Almonds 500g', location: 'C3-11', stock: 5, minStock: 10, expiryDate: new Date(Date.now() + 86400000 * 180).toISOString(), category: 'Snacks', pickingFrequency: 30, barcode: '444' },
            { id: '5', name: 'Orange Juice 2L', location: 'A1-02', stock: 35, minStock: 15, expiryDate: new Date(Date.now() + 86400000 * 14).toISOString(), category: 'Beverages', pickingFrequency: 55, barcode: '555' },
            { id: '6', name: 'Chips (Salted)', location: 'D4-01', stock: 150, minStock: 50, expiryDate: new Date(Date.now() + 86400000 * 180).toISOString(), category: 'Snacks', pickingFrequency: 95, barcode: '666' },
            { id: '7', name: 'Apples (Red)', location: 'E5-02', stock: 60, minStock: 25, expiryDate: new Date(Date.now() + 86400000 * 7).toISOString(), category: 'Produce', pickingFrequency: 80, barcode: '777' }
        ];

        INVENTORY.forEach(item => {
            batch.set(doc(db, 'inventory', item.id), item);
        });

        const TICKETS = [
            { id: 'ticket-1', timestamp: new Date(), title: 'Spill in Zone A1', description: 'Milk carton broken on the floor in A1-01.', status: 'open', createdBy: 'Jane Doe', type: 'other' },
            { id: 'ticket-2', timestamp: new Date(Date.now() - 3600000), title: 'Scanner Battery Low', description: 'Scanner #4 won\'t hold charge.', status: 'in_progress', createdBy: 'John Smith', type: 'qr_unreadable' }
        ];
        
        TICKETS.forEach(ticket => batch.set(doc(db, 'tickets', ticket.id), ticket));

        const APPROVALS = [
            { id: 'app-1', timestamp: new Date(Date.now() - 86400000), type: 'emergency_complete', userId: 'jane-doe', userEmail: 'jane@pickpulse.com', orderId: '8921', status: 'pending', details: 'Missing item but customer agreed to skip' },
            { id: 'app-2', timestamp: new Date(Date.now() - 172800000), type: 'stock_adjustment', userId: 'john-smith', userEmail: 'john@pickpulse.com', itemId: '2', status: 'approved', details: 'Found 5 extra packs of bread' }
        ];

        APPROVALS.forEach(app => batch.set(doc(db, 'approvals', app.id), app));

        const PICKERS = [
            { id: 'admin-user', name: 'Admin User', status: 'Active', currentTask: 'Picking Order 1204', itemsPicked: 15, accuracy: 98 },
            { id: 'jane-doe', name: 'Jane Doe', status: 'Active', currentTask: 'Idle', itemsPicked: 40, accuracy: 99 },
            { id: 'john-smith', name: 'John Smith', status: 'Break', currentTask: 'n/a', itemsPicked: 10, accuracy: 100 }
        ];

        PICKERS.forEach(picker => batch.set(doc(db, 'pickers', picker.id), picker));

        const COMPLIANCE = [
            { id: 'comp-1', timestamp: new Date(Date.now() - 86400000), type: 'temperature', status: 'normal', checkType: 'Daily', location: 'Zone A', checkedBy: 'Admin User', notes: 'Temperature within range (1-4C)' },
            { id: 'comp-2', timestamp: new Date(Date.now() - 172800000), type: 'cleaning', status: 'critical', checkType: 'Hourly', location: 'Zone B', checkedBy: 'Jane Doe', notes: 'Spill not fully cleaned' }
        ];

        COMPLIANCE.forEach(comp => batch.set(doc(db, 'compliance', comp.id), comp));

        await batch.commit();
        console.log("Seeding completed.");
        return true;
    } catch (e) {
        console.error("Seeding failed: ", e);
        return false;
    }
}
