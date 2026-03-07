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
  const html5QrCodeRef = useRef(null);

  // جلب البيانات
  const { data: buses } = useGet(["buses"], "/api/user/security/buses");
  const { data: mainTypes } = useGet(["mainTypes"], "/api/user/security/maintenance-types");
  const { data: drivers } = useGet(["drivers"], "/api/user/security/drivers");

  const busesList = useMemo(() => buses?.data || [], [buses]);
  const driversList = useMemo(() => drivers?.data || [], [drivers]);

  const { register, handleSubmit, watch, reset, setValue, formState: { errors } } = useForm({
    defaultValues: {
      checkInTime: defaultTime,
      maintenanceTypeIds: [],
      description: "",
      bus_id: "",
      driverId: ""
    }
  });

  // مراقبة القيمة المختارة للحافلة
  const selectedBusId = watch("bus_id");

  // الحصول على رقم الحافلة المختارة لعرضه في حالة الـ "Scanned"
  const selectedBusNumber = useMemo(() => {
    const bus = busesList.find(b => String(b.id) === String(selectedBusId));
    return bus ? bus.busNumber : null;
  }, [selectedBusId, busesList]);

  const stopScanner = async () => {
    if (html5QrCodeRef.current?.isScanning) {
      await html5QrCodeRef.current.stop();
      html5QrCodeRef.current.clear();
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
          // نفترض أن الـ QR يحتوي على الـ ID الخاص بالحافلة
          setValue("bus_id", decodedText, { shouldValidate: true, shouldDirty: true });
          toast.success(t("qr_scan_success"));
          stopScanner();
        }
      ).catch(() => setIsScanning(false));
    }
    return () => {
      if (html5QrCodeRef.current?.isScanning) html5QrCodeRef.current.stop();
    };
  }, [isScanning, setValue, t]);

  const checkInMutation = usePost(`/api/user/security/check-in/${selectedBusId}`, ["buses"]);

  const onSubmit = (data) => {
    const { bus_id, ...payload } = data;
    checkInMutation.mutate(payload, {
      onSuccess: () => {
        reset({
          checkInTime: defaultTime,
          maintenanceTypeIds: [],
          description: "",
          bus_id: "",
          driverId: ""
        });
        toast.success(t("check_in_success"));
      }
    });
  };

  return (
    <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden animate-in fade-in zoom-in-95 max-w-2xl mx-auto">
      {/* Header */}
      <div className={cn(THEME.colors.primary, "p-6 text-white flex justify-between items-center")}>
        <div className="flex items-center gap-3">
          <Bus size={28} className="text-[#FFCC00]" />
          <h2 className="text-xl font-black uppercase tracking-tight">{t('gate_entry_title')}</h2>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Scanner View */}
        {isScanning && (
          <div className="relative border-4 border-dashed border-[#003366]/20 rounded-[2rem] overflow-hidden bg-slate-900 aspect-square w-full mb-6">
            <div id="reader" className="w-full h-full"></div>
            <button
              type="button"
              onClick={stopScanner}
              className={cn("absolute top-4 z-20 text-white bg-black/50 p-2 rounded-full hover:bg-black/70", isRtl ? "left-4" : "right-4")}
            >
              <XCircle size={24} />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {!isScanning && (
            <div className="transition-all duration-500">
              {/* إذا تم اختيار حافلة (عبر الـ QR أو القائمة) يظهر تصميم "تم الاختيار" */}
              {selectedBusId && selectedBusNumber ? (
                <div className="bg-blue-50/50 border-2 border-[#003366] rounded-[2rem] p-5 flex items-center justify-between shadow-sm animate-in zoom-in-95">
                  <div className="flex items-center gap-4">
                    <div className="bg-[#003366] p-3 rounded-2xl text-white shadow-lg shadow-blue-900/20">
                      <CheckCircle2 size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{t('selected_bus')}</p>
                      <h4 className="text-xl font-black text-[#003366]">{selectedBusNumber}</h4>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setValue("bus_id", "", { shouldValidate: true })}
                    className="text-red-500 p-2 hover:bg-red-50 rounded-xl transition-all active:scale-90"
                  >
                    <RefreshCw size={20} />
                  </button>
                </div>
              ) : (
                <div className="flex items-end gap-3">
                  <FormInput
                    label={t('select_bus_label')}
                    name="bus_id"
                    type="select"
                    register={register}
                    errors={errors}
                    setValue={setValue}
                    watch={watch}
                    options={busesList.map(b => ({ label: b.busNumber, value: b.id }))}
                    placeholder={t('select_bus_placeholder')}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={() => setIsScanning(true)}
                    className="h-[48px] w-[48px] rounded-xl bg-[#003366] shrink-0 active:scale-95 shadow-lg shadow-blue-900/20"
                  >
                    <QrCode size={20} />
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Driver Selection */}
          <FormInput
            label={t('driver_label')}
            name="driverId"
            type="select"
            register={register}
            errors={errors}
            setValue={setValue}
            watch={watch}
            options={driversList.map(d => ({ label: d.name, value: d.id }))}
            placeholder={t('driver_placeholder')}
          />

          {/* Maintenance Types - Multi Select */}
          <FormInput
            label={t('maintenance_label')}
            name="maintenanceTypeIds"
            type="select"
            multiple
            setValue={setValue}
            watch={watch}
            register={register}
            errors={errors}
            options={mainTypes?.data?.map(mt => ({ label: mt.name, value: mt.id })) || []}
            placeholder={t('maintenance_placeholder')}
          />

          {/* Description */}
          <FormInput
            label={t('description_label')}
            name="description"
            type="textarea"
            register={register}
            errors={errors}
            placeholder={t('description_placeholder')}
          />

          {/* Entry Time */}
          <FormInput
            label={t('entry_time_label')}
            name="checkInTime"
            type="datetime-local"
            register={register}
            errors={errors}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={checkInMutation.isPending || !selectedBusId}
            className="w-full h-14 bg-[#003366] text-white font-black rounded-2xl shadow-xl hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale"
          >
            {checkInMutation.isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <div className="flex items-center gap-2">
                <Save size={20} />
                {t('register_entry_button')}
              </div>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CheckInForm;