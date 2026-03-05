import React, { useState } from "react";
import { ArrowDownCircle, ArrowUpCircle, LayoutDashboard, Bus, ShieldCheck } from "lucide-react";
import { THEME } from "@/utils/theme";
import CheckInForm from "./CheckInForm";
import CheckOutForm from "./CheckOutForm";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState(null);
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const getCurrentDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  return (
    <div className={`min-h-screen ${THEME.colors.grayLight} p-3 md:p-8 transition-all duration-500`} dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-4xl mx-auto">

        {/* Back Button */}
        {activeTab && (
          <header className="flex items-center gap-2 mb-4 px-1 animate-in slide-in-from-left-4 duration-300">
            <button
              onClick={() => setActiveTab(null)}
              className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-slate-500 active:scale-95 transition-all bg-white px-3 py-2 rounded-xl shadow-sm border border-slate-100"
            >
              <LayoutDashboard size={14} />
              {t('main_menu')}
            </button>
          </header>
        )}

        {/* Tabs */}
        {activeTab && (
          <div className="w-full mb-6 bg-white p-1.5 rounded-[2rem] shadow-md border flex gap-1 animate-in slide-in-from-top-4 duration-500">
            <button
              onClick={() => setActiveTab("check-in")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 md:py-4 rounded-[1.5rem] font-black text-[10px] md:text-sm uppercase tracking-tighter md:tracking-widest transition-all duration-300 ${activeTab === "check-in"
                ? `${THEME.colors.primary} text-white shadow-md`
                : "text-slate-400"
                }`}
            >
              <ArrowDownCircle size={18} /> {t('check_in')}
            </button>
            <button
              onClick={() => setActiveTab("check-out")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 md:py-4 rounded-[1.5rem] font-black text-[10px] md:text-sm uppercase tracking-tighter md:tracking-widest transition-all duration-300 ${activeTab === "check-out"
                ? `${THEME.colors.primary} text-white shadow-md`
                : "text-slate-400"
                }`}
            >
              <ArrowUpCircle size={18} /> {t('check_out')}
            </button>
          </div>
        )}

        <main className="w-full">
          {!activeTab ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 animate-in fade-in zoom-in-95 duration-500">
              {/* Check-In Card */}
              <button
                onClick={() => setActiveTab("check-in")}
                className="group relative bg-white p-6 md:p-10 rounded-[2.5rem] border-2 border-transparent md:hover:border-[#003366] active:border-[#003366] shadow-lg active:scale-[0.98] transition-all duration-300 text-start overflow-hidden"
              >
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mb-4 md:mb-6 text-white shadow-lg bg-[#003366]">
                  <Bus size={24} className="md:size-32" />
                </div>
                <h3 className="text-xl md:text-3xl font-black text-slate-800 uppercase mb-1 italic">{t('check_in')}</h3>
                <p className="text-slate-400 font-bold text-xs md:text-sm">{t('check_in_subtitle')}</p>
                <ArrowDownCircle
                  className={cn(
                    "absolute -bottom-2 md:bottom-8 text-slate-50 opacity-20 md:opacity-10 md:group-hover:text-[#003366] md:group-hover:opacity-20 transition-all",
                    isRtl ? "-left-2 md:left-8" : "-right-2 md:right-8"
                  )}
                  size={80}
                />
              </button>

              {/* Check-Out Card */}
              <button
                onClick={() => setActiveTab("check-out")}
                className="group relative bg-white p-6 md:p-10 rounded-[2.5rem] border-2 border-transparent md:hover:border-[#FFCC00] active:border-[#FFCC00] shadow-lg active:scale-[0.98] transition-all duration-300 text-start overflow-hidden"
              >
                <div className="w-12 h-12 md:w-16 md:h-16 bg-[#FFCC00] rounded-2xl flex items-center justify-center mb-4 md:mb-6 text-[#003366] shadow-lg">
                  <ShieldCheck size={24} className="md:size-32" />
                </div>
                <h3 className="text-xl md:text-3xl font-black text-slate-800 uppercase mb-1 italic">{t('check_out')}</h3>
                <p className="text-slate-400 font-bold text-xs md:text-sm">{t('check_out_subtitle')}</p>
                <ArrowUpCircle
                  className={cn(
                    "absolute -bottom-2 md:bottom-8 text-slate-50 opacity-20 md:opacity-10 md:group-hover:text-[#FFCC00] md:group-hover:opacity-20 transition-all",
                    isRtl ? "-left-2 md:left-8" : "-right-2 md:right-8"
                  )}
                  size={80}
                />
              </button>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {activeTab === "check-in" ? (
                <CheckInForm defaultTime={getCurrentDateTime()} />
              ) : (
                <CheckOutForm />
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;