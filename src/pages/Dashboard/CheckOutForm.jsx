import React, { useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Send, Clock, Loader2, Bus, MapPin, AlertCircle, Calendar, X, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUpdate } from "@/hooks/useUpdate";
import { useGet } from "@/hooks/useGet";
import { THEME } from "@/utils/theme";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

const CheckOutForm = () => {
  const [confirmItem, setConfirmItem] = useState(null);
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'ar' ? 'ar-EG' : 'en-GB';

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
                    {item.busId.split('-')[0]}
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
      <DialogPrimitive.Root open={!!confirmItem} onOpenChange={() => setConfirmItem(null)}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-[200] bg-blue-950/40 backdrop-blur-md animate-in fade-in duration-300" />
          <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-[201] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] bg-white rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden border-none outline-none">

            <div className={cn("h-3 w-full", THEME.colors.primary)} />

            <div className="p-8 md:p-10 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-blue-50 text-[#003366] rounded-[2rem] flex items-center justify-center mb-6 rotate-12">
                <ShieldCheck size={40} />
              </div>

              <DialogPrimitive.Title className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-2">
                {t('confirm_departure_title')}
              </DialogPrimitive.Title>

              <DialogPrimitive.Description className="text-slate-500 font-semibold leading-relaxed mb-8">
                {t('confirm_departure_desc')} <span className="text-[#003366] font-black underline decoration-[#FFCC00] decoration-2 underline-offset-4">#{confirmItem?.busId.split('-')[0]}</span>?
              </DialogPrimitive.Description>

              <div className="flex w-full gap-3">
                <DialogPrimitive.Close asChild>
                  <Button variant="ghost" className="flex-1 h-14 rounded-2xl font-bold text-slate-400">
                    {t('cancel')}
                  </Button>
                </DialogPrimitive.Close>
                <Button
                  onClick={handleFinalConfirm}
                  disabled={checkOutMutation.isPending}
                  className={cn("flex-[2] h-14 rounded-2xl font-black text-white uppercase tracking-widest shadow-xl", THEME.colors.primary)}
                >
                  {checkOutMutation.isPending ? <Loader2 className="animate-spin" /> : t('authorize_exit')}
                </Button>
              </div>
            </div>

            <DialogPrimitive.Close className="absolute top-6 right-6 text-slate-300 hover:text-slate-600 transition-colors">
              <X size={24} />
            </DialogPrimitive.Close>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </div>
  );
};

export default CheckOutForm;