import React, { useState } from "react";
import { Send, Clock, Loader2, Bus, MapPin, AlertCircle, Calendar, UserCircle, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUpdate } from "@/hooks/useUpdate";
import { useGet } from "@/hooks/useGet";
import { THEME } from "@/utils/theme";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import ConfirmCheckOutDialog from "../../components/custom/ConfirmCheckOutDialog";
import CheckOutDetailsDialog from "../../components/custom/CheckOutDetailsDialog";

const CheckOutForm = () => {
  const [confirmItem, setConfirmItem] = useState(null);
  const [detailsItem, setDetailsItem] = useState(null);
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'ar' ? 'ar-EG' : 'en-GB';
  const isRtl = i18n.language === 'ar';

  const { data: activeCheckIns, isLoading } = useGet(
    ["activeCheckIns"],
    "/api/user/security/check-ins/active"
  );

  const checkOutMutation = useUpdate(
    "/api/user/security/check-out",
    ["activeCheckIns"],
    t('confirm_departure_title')
  );

  const handleFinalConfirm = () => {
    if (!confirmItem) return;
    checkOutMutation.mutate({
      id: confirmItem.id,
      updatedData: {
        checkOutTime: new Date().toISOString(),
        notes: "Quick check-out via security dashboard"
      }
    }, {
      onSuccess: () => setConfirmItem(null)
    });
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center p-20 space-y-4">
      <Loader2 className="w-10 h-10 animate-spin text-[#003366]" />
      <p className="text-slate-500 font-bold tracking-widest text-xs">{t('scanning_garage')}</p>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Stat */}
      <div className="flex items-center justify-between px-4">
        <h3 className={cn("text-lg font-black flex items-center gap-2 uppercase tracking-tighter", THEME.colors.accent)}>
          <MapPin size={20} className="text-[#FFCC00]" />
          {t('inside_garage')}
          <span className="bg-[#003366] text-[#FFCC00] text-[10px] px-3 py-1 rounded-full border border-blue-900/50">
            {activeCheckIns?.data?.length || 0} {t('units_label')}
          </span>
        </h3>
      </div>

      {/* List of Buses */}
      <div className="grid grid-cols-1 gap-4">
        {activeCheckIns?.data?.length > 0 ? (
          activeCheckIns.data.map((item) => (
            <div key={item.id} className="bg-white border-2 border-slate-50 rounded-[2rem] p-6 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-[#003366] group-hover:bg-[#003366] group-hover:text-white transition-colors duration-500">
                  <Bus size={32} />
                </div>
                <div>
                  <h4 className="font-black text-xl text-slate-800 uppercase leading-none mb-2">
                    {item.bus?.busNumber || item.busNumber || t('unknown_bus')}
                  </h4>
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="flex items-center gap-1.5 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">
                      <Calendar size={14} className="text-[#003366]" />
                      {new Intl.DateTimeFormat(locale, { day: '2-digit', month: 'short' }).format(new Date(item.checkInTime))}
                    </span>
                    <span className="flex items-center gap-1.5 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">
                      <Clock size={14} className="text-[#FFCC00]" />
                      {new Date(item.checkInTime).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {item.driver?.name && (
                      <button
                        onClick={() => setDetailsItem(item)}
                        title={t('view_details')}
                        className="flex items-center gap-2 text-[11px] font-extrabold text-[#003366] bg-blue-50/80 hover:bg-blue-100/80 px-3 py-1.5 rounded-full transition-all uppercase tracking-widest active:scale-95 border border-blue-100 shadow-sm"
                      >
                        <UserCircle size={14} className="text-[#003366]/50" />
                        <span className="truncate max-w-[120px]">{item.driver.name}</span>
                        <span className="bg-[#003366] text-white text-[9px] px-2 py-0.5 rounded-full lowercase tracking-normal flex items-center gap-1 shadow-md shadow-blue-900/20">
                          <Eye size={10} />
                          {t('view_details')}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {item.description && (
                  <div className="hidden lg:flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-xl border border-amber-100 italic text-xs font-bold">
                    <AlertCircle size={14} /> {t('note_attached')}
                  </div>
                )}
                <Button
                  onClick={() => setConfirmItem(item)}
                  className={cn("h-14 px-10 rounded-[1.2rem] font-black text-xs uppercase tracking-widest text-white transition-all shadow-lg active:scale-95", THEME.colors.primary)}
                >
                  <Send size={18} className="mr-2" /> {t('confirm_exit_button')}
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-slate-100/50 rounded-[3rem] p-20 text-center border-4 border-dashed border-white">
            <Bus className="text-slate-200 mx-auto mb-4 opacity-50" size={64} />
            <p className="text-slate-400 font-black uppercase tracking-widest text-sm">{t('garage_clear')}</p>
          </div>
        )}
      </div>

      {/* Confirm Dialog */}
      <ConfirmCheckOutDialog
        item={confirmItem}
        onClose={() => setConfirmItem(null)}
        onConfirm={handleFinalConfirm}
        isPending={checkOutMutation.isPending}
      />

      {/* Details Dialog */}
      <CheckOutDetailsDialog
        item={detailsItem}
        onClose={() => setDetailsItem(null)}
        locale={locale}
        isRtl={isRtl}
      />

    </div>
  );
};

export default CheckOutForm;