import { ArrowLeft, RefreshCcw, ShieldCheck, Mail, AlertTriangle, PackageSearch } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Returns Policy | CrochetCraft",
  description: "Learn about our 7-day return and exchange policy for handmade crochet items.",
};

export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-linear-to-br from-rose-500/10 via-transparent to-transparent blur-3xl opacity-50 dark:opacity-30" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-linear-to-tr from-violet-500/10 via-transparent to-transparent blur-3xl opacity-50 dark:opacity-30" />
        <div className="noise-overlay" />
      </div>

      <div className="max-w-4xl mx-auto px-6 py-20 lg:py-28 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 animate-[fadeInDown_0.6s_ease-out]">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-8 group"
          >
            <div className="w-8 h-8 rounded-full bg-secondary/50 flex items-center justify-center group-hover:bg-secondary transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </div>
            Back to Home
          </Link>
          
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-rose-500 to-pink-600 shadow-lg shadow-rose-500/20 mb-6 text-white">
            <RefreshCcw className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Returns & Exchanges</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We pour our hearts into crafting your items. If something isn't quite right, here is everything you need to know about our return process.
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16 animate-[fadeInUp_0.8s_ease-out]">
          <div className="p-6 rounded-3xl glass-card flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 dark:bg-rose-500/20 flex items-center justify-center mb-4 text-rose-600 dark:text-rose-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold mb-2">7-Day Window</h3>
            <p className="text-sm text-muted-foreground">Request a return within 7 days of receiving your order.</p>
          </div>
          
          <div className="p-6 rounded-3xl glass-card flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-violet-500/10 dark:bg-violet-500/20 flex items-center justify-center mb-4 text-violet-600 dark:text-violet-400">
              <PackageSearch className="w-6 h-6" />
            </div>
            <h3 className="font-bold mb-2">Original Condition</h3>
            <p className="text-sm text-muted-foreground">Items must be unworn, unwashed, and in standard packaging.</p>
          </div>
          
          <div className="p-6 rounded-3xl glass-card flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center mb-4 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-bold mb-2">Exclusions</h3>
            <p className="text-sm text-muted-foreground">Custom orders and personalized items are non-refundable.</p>
          </div>
        </div>

        {/* Content Body */}
        <div className="glass-premium rounded-[2.5rem] p-8 md:p-12 shadow-xl animate-[fadeIn_1s_ease-out]">
          <article className="prose prose-slate dark:prose-invert max-w-none space-y-8">
            
            <section>
              <h2 className="text-2xl font-bold flex items-center gap-3 text-foreground border-b border-border/50 pb-4 mb-4">
                1. Standard Return Policy
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We accept returns for standard, non-customized crochet items within <strong>7 days</strong> of the delivery date. To be eligible for a return, the item must be unused, unwashed, and in the same condition that you received it. It must also be in the original packaging with all tags attached.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold flex items-center gap-3 text-foreground border-b border-border/50 pb-4 mb-4">
                2. Non-Returnable Items
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Due to the unique, handcrafted nature of our business, certain items cannot be returned:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Custom-made items or personalized commissions.</li>
                <li>Items bought during clearance or flash sales.</li>
                <li>Digital patterns or tutorials.</li>
                <li>Intimate items (e.g., crochet earrings or specific baby goods) due to hygiene reasons.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold flex items-center gap-3 text-foreground border-b border-border/50 pb-4 mb-4">
                3. The Return Process
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  To initiate a return, please send us a message via the <strong>Contact Chat</strong> or email us at <strong>support@crochetcraft.com</strong> with your order number and the reason for the return.
                </p>
                <div className="p-4 rounded-2xl bg-secondary/50 border border-border">
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Contact us within 7 days of delivery.</li>
                    <li>We will provide you with a return shipping address.</li>
                    <li>Securely pack the item and ship it back to us.</li>
                    <li>Once received and inspected, we will process your refund to the original payment method within 5-7 business days.</li>
                  </ol>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold flex items-center gap-3 text-foreground border-b border-border/50 pb-4 mb-4">
                4. Shipping Costs
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                You will be responsible for paying your own shipping costs for returning your item unless the item arrived damaged or defective. Original shipping costs are non-refundable. If you receive a refund, the cost of original shipping will be deducted from your refund.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold flex items-center gap-3 text-foreground border-b border-border/50 pb-4 mb-4">
                5. Damaged or Defective Items
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We stringently inspect every stitch before shipping, but if you receive a damaged or defective item, please contact us immediately! We will enthusiastically replace the item or offer a full refund, and we will cover the return shipping costs in these rare scenarios.
              </p>
            </section>
          </article>
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center animate-[fadeInUp_1.2s_ease-out]">
          <p className="text-muted-foreground mb-6">Still have questions about a return?</p>
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-white bg-linear-to-r from-rose-500 to-pink-600 hover:scale-105 hover:shadow-lg hover:shadow-rose-500/25 transition-all duration-300"
          >
            <Mail className="w-5 h-5" />
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
