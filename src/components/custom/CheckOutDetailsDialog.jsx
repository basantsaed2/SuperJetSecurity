import React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Bus, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { THEME } from "@/utils/theme";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

const CheckOutDetailsDialog = ({ item, onClose, locale, isRtl }) => {
    const { t } = useTranslation();

    return (
        <DialogPrimitive.Root open={!!item} onOpenChange={(open) => !open && onClose()}>
            <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay className="fixed inset-0 z-[200] bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-300" />
                <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-[201] w-[95vw] max-w-[700px] translate-x-[-50%] translate-y-[-50%] bg-white rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden border-none outline-none">

                    {/* Header */}
                    <div className={cn("px-6 py-5 text-white flex items-center gap-3", THEME.colors.primary)}>
                        <Bus size={24} className="text-[#FFCC00]" />
                        <DialogPrimitive.Title className="text-xl font-black uppercase tracking-tight m-0">
                            {t('view_details')}
                        </DialogPrimitive.Title>
                    </div>

                    <div className="p-6 md:p-8 space-y-6 bg-slate-50/50">
                        {/* Info Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {/* Bus Details */}
                            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">{t('bus_number')}</p>
                                <p className="font-extrabold text-slate-800 text-lg">{item?.bus?.busNumber || item?.busNumber || t('unknown_bus')}</p>
                            </div>
                            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">{t('plate_number')}</p>
                                <p className="font-extrabold text-slate-800 text-lg truncate" title={item?.bus?.plateNumber}>{item?.bus?.plateNumber || "-"}</p>
                            </div>

                            {/* Driver Details */}
                            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">{t('driver_name')}</p>
                                <p className="font-extrabold text-slate-800 text-lg truncate" title={item?.driver?.name}>{item?.driver?.name || "-"}</p>
                            </div>
                            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">{t('driver_phone')}</p>
                                <p className="font-extrabold text-slate-800 text-lg truncate" title={item?.driver?.phone}>{item?.driver?.phone || "-"}</p>
                            </div>

                            {/* Garage Details & Time */}
                            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">{t('garage_label')}</p>
                                <p className="font-extrabold text-slate-800 truncate" title={item?.garage?.name}>{item?.garage?.name || "-"}</p>
                            </div>
                            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">{t('garage_location')}</p>
                                <p className="font-extrabold text-slate-800 truncate" title={item?.garage?.location}>{item?.garage?.location || "-"}</p>
                            </div>
                            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">{t('entry_time_label')}</p>
                                <p className="font-extrabold text-slate-800">
                                    {item ? new Date(item.checkInTime).toLocaleString(locale, { dateStyle: 'short', timeStyle: 'short' }) : "-"}
                                </p>
                            </div>
                        </div>

                        {/* Description */}
                        {item?.description && (
                            <div className="bg-amber-50/50 border border-amber-100/50 p-4 rounded-2xl">
                                <p className="text-[10px] font-bold text-amber-600 uppercase tracking-tighter mb-1 flex items-center gap-1">
                                    <AlertCircle size={12} /> {t('description_label')}
                                </p>
                                <p className="text-sm font-semibold text-slate-700 leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        )}

                        {/* Action */}
                        <div className="pt-2">
                            <DialogPrimitive.Close asChild>
                                <Button className="w-full h-14 rounded-2xl font-bold bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors">
                                    {t('close')}
                                </Button>
                            </DialogPrimitive.Close>
                        </div>
                    </div>

                    <DialogPrimitive.Close className={cn(
                        "absolute top-5 text-white/50 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 active:scale-95",
                        isRtl ? "left-5" : "right-5"
                    )}>
                        <X size={24} />
                    </DialogPrimitive.Close>
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
};

export default CheckOutDetailsDialog;
