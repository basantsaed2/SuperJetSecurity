import React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Loader2, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { THEME } from "@/utils/theme";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

const ConfirmCheckOutDialog = ({ item, onClose, onConfirm, isPending }) => {
    const { t } = useTranslation();

    return (
        <DialogPrimitive.Root open={!!item} onOpenChange={(open) => !open && onClose()}>
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
                            {t('confirm_departure_desc')} <span className="text-[#003366] font-black underline decoration-[#FFCC00] decoration-2 underline-offset-4">#{item?.bus?.busNumber}</span>?
                        </DialogPrimitive.Description>

                        <div className="flex w-full gap-3">
                            <DialogPrimitive.Close asChild>
                                <Button variant="ghost" className="flex-1 h-14 rounded-2xl font-bold text-slate-400">
                                    {t('cancel')}
                                </Button>
                            </DialogPrimitive.Close>
                            <Button
                                onClick={onConfirm}
                                disabled={isPending}
                                className={cn("flex-[2] h-14 rounded-2xl font-black text-white uppercase tracking-widest shadow-xl", THEME.colors.primary)}
                            >
                                {isPending ? <Loader2 className="animate-spin" /> : t('authorize_exit')}
                            </Button>
                        </div>
                    </div>

                    <DialogPrimitive.Close className="absolute top-6 right-6 text-slate-300 hover:text-slate-600 transition-colors">
                        <X size={24} />
                    </DialogPrimitive.Close>
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
};

export default ConfirmCheckOutDialog;
