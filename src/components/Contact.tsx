import React from "react";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";

const Contact: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Contact <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">ShopCircle</span> Support
          </h1>
          <p className="text-slate-400 text-sm">
            Have questions about an order or need assistance? We're available 24/7.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info Cards */}
          <div className="space-y-4">
            <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-start gap-4">
              <div className="p-3 rounded-xl bg-indigo-600/20 text-indigo-400">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Email Support</h3>
                <p className="text-xs text-slate-400 mt-0.5">support@shopcircle.com</p>
                <span className="text-[10px] text-emerald-400 font-semibold mt-1 block">Response within 2 hours</span>
              </div>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-start gap-4">
              <div className="p-3 rounded-xl bg-purple-600/20 text-purple-400">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Customer Care Line</h3>
                <p className="text-xs text-slate-400 mt-0.5">+1 (800) 555-CIRCLE</p>
                <span className="text-[10px] text-slate-400 mt-1 block">Toll-free 24/7 line</span>
              </div>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-start gap-4">
              <div className="p-3 rounded-xl bg-emerald-600/20 text-emerald-400">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Global Headquarters</h3>
                <p className="text-xs text-slate-400 mt-0.5">100 Circle Way, Tech Plaza, New York, NY 10001</p>
              </div>
            </div>
          </div>

          {/* Quick Message Form */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-400" /> Send Us a Message
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Your Full Name</label>
                <input
                  type="text"
                  placeholder="Alex Prince"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="alex@example.com"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Message / Inquiry</label>
                <textarea
                  rows={4}
                  placeholder="How can we help you today?"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 outline-none focus:border-indigo-500 resize-none"
                ></textarea>
              </div>

              <button
                type="button"
                onClick={() => alert("Message sent successfully! Our team will get back to you shortly.")}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs shadow-lg transition-all"
              >
                <span>Send Message</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;
