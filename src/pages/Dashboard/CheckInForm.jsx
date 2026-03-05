// import React, { useState, useEffect, useRef } from "react";
// import { useForm } from "react-hook-form";
// import { Bus, Save, Loader2, QrCode, XCircle, CameraOff } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { FormInput } from "@/components/custom/FormInput";
// import { useGet } from "@/hooks/useGet";
// import { usePost } from "@/hooks/usePost";
// import { THEME } from "@/utils/theme";
// import { useTranslation } from "react-i18next";
// import { Html5Qrcode } from "html5-qrcode";
// import { cn } from "@/lib/utils";
// import { toast } from "sonner"; // تأكد من وجود Toaster في App.jsx

// const CheckInForm = ({ defaultTime }) => {
//   const { t, i18n } = useTranslation();
//   const isRtl = i18n.language === "ar";
//   const [isScanning, setIsScanning] = useState(false);
//   const html5QrCodeRef = useRef(null);

//   const { data: buses } = useGet(["buses"], "/api/user/security/buses");
//   const { data: mainTypes } = useGet(["mainTypes"], "/api/user/security/maintenance-types");

//   const { register, handleSubmit, watch, reset, setValue, formState: { errors } } = useForm({
//     defaultValues: {
//       checkInTime: defaultTime,
//       maintenanceTypeIds: [],
//       description: "",
//       bus_id: ""
//     }
//   });

//   const selectedBusId = watch("bus_id");

//   // دالة إيقاف الكاميرا
//   const stopScanner = async () => {
//     if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
//       try {
//         await html5QrCodeRef.current.stop();
//         setIsScanning(false);
//       } catch (err) {
//         console.error("Failed to stop scanner", err);
//         setIsScanning(false);
//       }
//     } else {
//       setIsScanning(false);
//     }
//   };

//   // تفعيل الكاميرا عند الضغط على زر Scan
//   useEffect(() => {
//     if (isScanning) {
//       const html5QrCode = new Html5Qrcode("reader");
//       html5QrCodeRef.current = html5QrCode;

//       const config = {
//         fps: 10,
//         qrbox: { width: 250, height: 250 },
//         aspectRatio: 1.0
//       };

//       html5QrCode.start(
//         { facingMode: "environment" }, // الكاميرا الخلفية مباشرة
//         config,
//         (decodedText) => {
//           // نجاح المسح
//           setValue("bus_id", decodedText);
//           toast.success(t("qr_scan_success") || "تم التعرف على الحافلة بنجاح");
//           stopScanner();
//         },
//         () => { /* خطأ صامت أثناء البحث عن كود */ }
//       ).catch((err) => {
//         // معالجة أخطاء الصلاحيات أو الكاميرا
//         console.error("Camera Error:", err);
//         setIsScanning(false);

//         if (err.includes("NotAllowedError") || err.includes("Permission denied")) {
//           toast.error("خطأ: يرجى السماح للمتصفح بالوصول للكاميرا من إعدادات الموقع");
//         } else if (err.includes("NotFoundError")) {
//           toast.error("عفواً: لم يتم العثور على كاميرا في هذا الجهاز");
//         } else {
//           toast.error("حدث خطأ غير متوقع في تشغيل الكاميرا");
//         }
//       });
//     }

//     return () => {
//       // تنظيف عند الخروج من المكون
//       if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
//         html5QrCodeRef.current.stop();
//       }
//     };
//   }, [isScanning, setValue, t]);

//   const checkInMutation = usePost(
//     `/api/user/security/check-in/${selectedBusId}`,
//     ["buses"],
//     t('register_entry_button')
//   );

//   const onSubmit = (data) => {
//     const { bus_id, ...payload } = data;
//     checkInMutation.mutate(payload, {
//       onSuccess: () => reset({
//         checkInTime: defaultTime,
//         maintenanceTypeIds: [],
//         description: "",
//         bus_id: ""
//       })
//     });
//   };

//   return (
//     <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden animate-in fade-in zoom-in-95">
//       {/* Header */}
//       <div className={cn(THEME.colors.primary, "p-4 md:p-8 text-white flex justify-between items-center")}>
//         <div>
//           <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight">{t('gate_entry_title')}</h2>
//         </div>
//         <Bus size={32} className="text-[#FFCC00] md:size-10" />
//       </div>

//       <div className="p-4 md:p-8 space-y-6">

//         {/* شاشة المسح (Scanner View) */}
//         {isScanning && (
//           <div className="relative border-4 border-dashed border-[#003366]/20 rounded-[2rem] overflow-hidden bg-slate-900 animate-in zoom-in-95 aspect-square max-h-[400px] mx-auto w-full">
//             <div id="reader" className="w-full h-full"></div>

//             {/* زر الإغلاق: مضبوط حسب لغة الواجهة */}
//             <button
//               type="button"
//               onClick={stopScanner}
//               className={cn(
//                 "absolute top-4 z-20 text-white/90 bg-black/50 backdrop-blur-xl rounded-full p-2 hover:bg-red-500 transition-colors",
//                 isRtl ? "left-4" : "right-4"
//               )}
//             >
//               <XCircle size={28} />
//             </button>

//             {/* دليل بصري للمستخدم */}
//             <div className="absolute inset-0 border-[60px] border-black/40 pointer-events-none flex items-center justify-center">
//               <div className="w-full h-full border-2 border-[#FFCC00] rounded-xl shadow-[0_0_20px_rgba(255,204,0,0.5)] animate-pulse"></div>
//             </div>

//             <div className="absolute bottom-6 w-full text-center z-10 px-4">
//               <span className="bg-[#FFCC00] text-[#003366] text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-lg">
//                 {t('scan_qr_placeholder') || "وجّه الكاميرا نحو الكود"}
//               </span>
//             </div>
//           </div>
//         )}

//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//           {/* اختيار الحافلة أو المسح */}
//           <div className="flex items-end gap-3">
//             <div className="flex-1">
//               <FormInput
//                 label={t('select_bus_label')}
//                 name="bus_id"
//                 type="select"
//                 register={register}
//                 errors={errors}
//                 options={buses?.data?.map(b => ({ label: `${b.busNumber}`, value: b.id })) || []}
//                 placeholder={t('select_bus_placeholder')}
//               />
//             </div>
//             <Button
//               type="button"
//               onClick={() => setIsScanning(true)}
//               className={cn(
//                 "h-14 w-14 rounded-2xl transition-all shadow-lg active:scale-90 shrink-0",
//                 isScanning ? "bg-red-500 text-white" : "bg-[#003366] text-white"
//               )}
//             >
//               <QrCode size={24} />
//             </Button>
//           </div>

//           <FormInput
//             label={t('maintenance_label')}
//             name="maintenanceTypeIds"
//             type="select"
//             multiple={true}
//             watch={watch}
//             setValue={setValue}
//             register={register}
//             errors={errors}
//             options={mainTypes?.data?.map(type => ({ label: type.name, value: type.id })) || []}
//             placeholder={t('maintenance_placeholder')}
//           />

//           <FormInput
//             label={t('description_label')}
//             name="description"
//             type="textarea"
//             register={register}
//             errors={errors}
//             placeholder={t('description_placeholder')}
//           />

//           <FormInput
//             label={t('entry_time_label')}
//             name="checkInTime"
//             type="datetime-local"
//             register={register}
//             errors={errors}
//           />

//           <Button
//             type="submit"
//             disabled={checkInMutation.isPending || !selectedBusId}
//             className={`w-full h-16 ${THEME.colors.primary} hover:opacity-90 text-white text-lg font-black rounded-2xl shadow-xl transition-all active:scale-[0.98] uppercase tracking-widest`}
//           >
//             {checkInMutation.isPending ? (
//               <Loader2 className="animate-spin" />
//             ) : (
//               <span className="flex items-center justify-center gap-2">
//                 <Save size={22} /> {t('register_entry_button')}
//               </span>
//             )}
//           </Button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CheckInForm;

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Bus, Save, Loader2, QrCode, XCircle, RefreshCw, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/custom/FormInput";
import { useGet } from "@/hooks/useGet";
import { usePost } from "@/hooks/usePost";
import { THEME } from "@/utils/theme";
import { useTranslation } from "react-i18next";
import { Html5Qrcode } from "html5-qrcode";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const CheckInForm = ({ defaultTime }) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const [isScanning, setIsScanning] = useState(false);
  const [scannedBusNumber, setScannedBusNumber] = useState(null); // تخزين رقم الحافلة الممسوح
  const html5QrCodeRef = useRef(null);

  const { data: buses } = useGet(["buses"], "/api/user/security/buses", { refetchOnWindowFocus: false });
  const { data: mainTypes } = useGet(["mainTypes"], "/api/user/security/maintenance-types", { refetchOnWindowFocus: false });

  const busesList = useMemo(() => buses?.data || [], [buses]);

  const { register, handleSubmit, watch, reset, setValue, formState: { errors } } = useForm({
    defaultValues: {
      checkInTime: defaultTime,
      maintenanceTypeIds: [],
      description: "",
      bus_id: ""
    }
  });

  const selectedBusId = watch("bus_id");

  const stopScanner = async () => {
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
      } catch (err) { console.error(err); }
    }
    setIsScanning(false);
  };

  useEffect(() => {
    if (isScanning) {
      const html5QrCode = new Html5Qrcode("reader");
      html5QrCodeRef.current = html5QrCode;
      html5QrCode.start(
        { facingMode: "environment" },
        { fps: 15, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          setValue("bus_id", decodedText);
          const foundBus = busesList.find(b => String(b.id) === String(decodedText));
          setScannedBusNumber(foundBus ? foundBus.busNumber : decodedText);
          toast.success(t("qr_scan_success") || "تم التعرف على الحافلة");
          stopScanner();
        }
      ).catch(() => setIsScanning(false));
    }
    return () => { if (html5QrCodeRef.current?.isScanning) html5QrCodeRef.current.stop(); };
  }, [isScanning, setValue, busesList]);

  const onSubmit = (data) => {
    const { bus_id, ...payload } = data;
    checkInMutation.mutate(payload, {
      onSuccess: () => {
        reset();
        setScannedBusNumber(null);
      }
    });
  };

  const checkInMutation = usePost(`/api/user/security/check-in/${selectedBusId}`, ["buses"], t('register_entry_button'));

  return (
    <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden animate-in fade-in zoom-in-95">
      <div className={cn(THEME.colors.primary, "p-4 md:p-8 text-white flex justify-between items-center")}>
        <div className="flex items-center gap-3">
          <Bus size={32} className="text-[#FFCC00]" />
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight">{t('gate_entry_title')}</h2>
        </div>
      </div>

      <div className="p-4 md:p-8 space-y-6">

        {/* شاشة الكاميرا */}
        {isScanning && (
          <div className="relative border-4 border-dashed border-[#003366]/20 rounded-[2rem] overflow-hidden bg-slate-900 aspect-square max-h-[400px] mx-auto w-full mb-6 shadow-2xl">
            <div id="reader" className="w-full h-full"></div>
            <button type="button" onClick={stopScanner} className={cn("absolute top-4 z-20 text-white bg-black/50 rounded-full p-2", isRtl ? "left-4" : "right-4")}>
              <XCircle size={28} />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* المنطقة الديناميكية: إما اختيار أو عرض النتيجة */}
          {!isScanning && (
            <div className="animate-in fade-in slide-in-from-top-2">
              {scannedBusNumber ? (
                /* بطاقة عرض الحافلة المختارة */
                <div className="bg-slate-50 border-2 border-[#003366] rounded-[2rem] p-6 flex items-center justify-between shadow-inner">
                  <div className="flex items-center gap-4">
                    <div className="bg-[#003366] p-3 rounded-2xl text-white shadow-lg">
                      <CheckCircle2 size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('selected_bus') || "الحافلة المختارة"}</p>
                      <h4 className="text-2xl font-black text-[#003366]">{scannedBusNumber}</h4>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setScannedBusNumber(null); setValue("bus_id", ""); }}
                    className="flex flex-col items-center gap-1 text-red-500 hover:bg-red-50 p-3 rounded-2xl transition-all active:scale-90"
                  >
                    <RefreshCw size={20} />
                    <span className="text-[10px] font-bold uppercase">{t('change') || "تغيير"}</span>
                  </button>
                </div>
              ) : (
                /* حقل الاختيار والمسح العادي */
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <FormInput
                      label={t('select_bus_label')}
                      name="bus_id"
                      type="select"
                      register={register}
                      errors={errors}
                      options={useMemo(() => busesList.map(b => ({ label: `${b.busNumber}`, value: b.id })), [busesList])}
                      placeholder={t('select_bus_placeholder')}
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={() => setIsScanning(true)}
                    className="h-14 w-14 rounded-2xl bg-[#003366] text-white shadow-lg active:scale-90 shrink-0"
                  >
                    <QrCode size={24} />
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* باقي الحقول تظهر دائماً */}
          <FormInput
            label={t('maintenance_label')}
            name="maintenanceTypeIds"
            type="select"
            multiple={true}
            watch={watch}
            setValue={setValue}
            register={register}
            errors={errors}
            options={mainTypes?.data?.map(type => ({ label: type.name, value: type.id })) || []}
            placeholder={t('maintenance_placeholder')}
          />

          <FormInput
            label={t('description_label')}
            name="description"
            type="textarea"
            register={register}
            errors={errors}
            placeholder={t('description_placeholder')}
          />

          <FormInput
            label={t('entry_time_label')}
            name="checkInTime"
            type="datetime-local"
            register={register}
            errors={errors}
          />

          <Button
            type="submit"
            disabled={checkInMutation.isPending || !selectedBusId}
            className={`w-full h-16 ${THEME.colors.primary} text-white text-lg font-black rounded-2xl shadow-xl active:scale-[0.98] uppercase`}
          >
            {checkInMutation.isPending ? <Loader2 className="animate-spin" /> : <span><Save size={22} className="inline mr-2" /> {t('register_entry_button')}</span>}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CheckInForm;