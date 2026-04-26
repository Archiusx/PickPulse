import fs from 'fs';
let content = fs.readFileSync('./App.tsx', 'utf-8');

const authScreen = `
  if (!user) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-slate-900 p-4">
        <div className="max-w-md w-full glass-panel p-8 text-center bg-white/10 border-white/20">
          <div className="w-16 h-16 brand-yellow rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Zap className="text-white fill-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to PickPulse</h1>
          <p className="text-slate-400 mb-8">Secure Dark Store Inventory Management System</p>
          <button 
            onClick={handleLogin}
            className="w-full py-4 brand-yellow text-white font-bold rounded-xl hover:bg-blue-400 transition-all flex items-center justify-center gap-3"
          >
            <User size={20} />
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

`;

content = content.replace(/  const lowStockItems = inventory.filter/, authScreen + '  const lowStockItems = inventory.filter');

fs.writeFileSync('./App.tsx', content);
console.log("done");
