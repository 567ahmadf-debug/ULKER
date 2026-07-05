import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center" data-testid="page-not-found">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-8xl font-black text-primary/20 mb-4">404</h1>
        <h2 className="text-2xl font-black text-foreground mb-3">Page Not Found</h2>
        <p className="text-muted-foreground mb-8 max-w-sm">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link href="/" data-testid="link-back-home">
          <span className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors cursor-pointer">
            <ArrowLeft size={16} />
            Back to Home
          </span>
        </Link>
      </motion.div>
    </div>
  );
}
