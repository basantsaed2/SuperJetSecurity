import React from "react";
import { useForm } from "react-hook-form";
import { Bus, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/custom/FormInput";
import { useGet } from "@/hooks/useGet";
import { usePost } from "@/hooks/usePost";
import { THEME } from "@/utils/theme";
import { useTranslation } from "react-i18next";

const CheckInForm = ({ defaultTime }) => {
  const { t } = useTranslation();
  const { data: buses } = useGet(["buses"], "/api/user/security/buses");
  const { data: mainTypes } = useGet(["mainTypes"], "/api/user/security/maintenance-types");

  const { register, handleSubmit, watch, reset, setValue, formState: { errors } } = useForm({
    defaultValues: {
      checkInTime: defaultTime,
      maintenanceTypeIds: [],
      description: "",
      bus_id: ""
    }
  });

  const selectedBusId = watch("bus_id");

  const checkInMutation = usePost(
    `/api/user/security/check-in/${selectedBusId}`,
    ["buses"],
    t('register_entry_button')
  );

  const onSubmit = (data) => {
    const { bus_id, ...payload } = data;
    checkInMutation.mutate(payload, {
      onSuccess: () => reset({
        checkInTime: defaultTime,
        maintenanceTypeIds: [],
        description: "",
        bus_id: ""
      })
    });
  };

  return (
    <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden animate-in fade-in zoom-in-95">
      {/* Header */}
      <div className={`${THEME.colors.primary} p-4 md:p-8 text-white flex justify-between items-center`}>
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tight">{t('gate_entry_title')}</h2>
        </div>
        <Bus size={40} className="text-[#FFCC00]" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-4 md:p-8 space-y-6">
        <FormInput
          label={t('select_bus_label')}
          name="bus_id"
          type="select"
          register={register}
          errors={errors}
          options={buses?.data?.map(b => ({ label: `${b.busNumber}`, value: b.id })) || []}
          placeholder={t('select_bus_placeholder')}
        />

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
          className={`w-full h-16 ${THEME.colors.primary} hover:opacity-90 text-white text-lg font-bold rounded-2xl shadow-lg transition-all active:scale-[0.98]`}
        >
          {checkInMutation.isPending ? (
            <Loader2 className="animate-spin" />
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Save size={22} /> {t('register_entry_button')}
            </span>
          )}
        </Button>
      </form>
    </div>
  );
};

export default CheckInForm;