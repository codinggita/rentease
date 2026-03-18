import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFound = () => {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="bg-primary/10 text-primary w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
                    <AlertCircle size={48} />
                </div>
                <h1 className="text-8xl font-black text-slate-800 dark:text-white mb-2 tracking-tighter italic">404</h1>
                <h2 className="text-2xl font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest mb-6">Lost in the Marketplace?</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-10 max-w-md mx-auto font-medium">
                    The item or page you're searching for seems to have vanished or moved to a new location.
                </p>
                <Link 
                    to="/" 
                    className="inline-flex items-center gap-2 bg-primary text-white px-10 py-4 rounded-sm font-black uppercase text-sm shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                >
                    <Home size={18} /> Back to Homepage
                </Link>
            </motion.div>
        </div>
    );
};

export default NotFound;
