// src/pages/auth/LoginPage.jsx
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, ArrowRightCircle, Zap, Loader2, Globe } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/custom/FormInput";
import { usePost } from "@/hooks/usePost";
import { useTranslation } from "react-i18next";

const LoginPage = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const isRtl = i18n.language === 'ar';

    const toggleLanguage = () => {
        const newLang = i18n.language === "en" ? "ar" : "en";
        i18n.changeLanguage(newLang);
    };

    const loginSchema = z.object({
        identifier: z.string().min(1, t('identifier_label') + " is required"),
        password: z.string().min(1, t('password_label') + " is required"),
    });

    const loginMutation = usePost(
        "/api/user/auth/login",
        null,
        (data) => `${t('hello')} ${data.data?.user?.name || ''}, ${t('welcome_back')}`
    );

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            identifier: "",
            password: ""
        }
    });

    const onSubmit = (data) => {
        loginMutation.mutate(data, {
            onSuccess: (response) => {
                const resData = response.data || response;

                if (resData.token) {
                    localStorage.setItem("user_token", resData.token);
                    localStorage.setItem("user_info", JSON.stringify(resData.user));
                    navigate("/dashboard");
                } else {
                    console.error("Credentials missing in response", response);
                }
            }
        });
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#0a192f] p-4">

            {/* Background Shapes */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-yellow-500/10 rounded-full blur-[120px]" />

            {/* Language Switcher */}
            <button
                onClick={toggleLanguage}
                className="absolute top-5 right-5 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 text-white/70 hover:text-white hover:border-white/50 hover:bg-white/10 transition-all font-bold text-sm backdrop-blur-sm"
            >
                <Globe className="w-4 h-4" />
                <span>{i18n.language === "en" ? "AR" : "EN"}</span>
            </button>

            <div className="w-full max-w-[1000px] flex flex-col md:flex-row bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden relative">

                {/* Left Side: Branding */}
                <div className="hidden md:flex md:w-1/2 bg-blue-900/40 p-12 flex-col justify-between relative border-r border-white/5">
                    <div className="space-y-4 relative z-10">
                        <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-500/20">
                            <ShieldCheck size={35} className="text-blue-950" />
                        </div>
                        <h1 className="text-4xl font-black text-white leading-tight uppercase tracking-tighter">
                            SuperJet <br /> <span className="text-yellow-500">Security Gate</span>
                        </h1>
                        <div className="h-1 w-20 bg-yellow-500 rounded-full" />
                        <p className="text-blue-100/60 text-lg max-w-[280px]">
                            {t('login_brand_tagline')}
                        </p>
                    </div>
                </div>

                {/* Right Side: Login Form */}
                <div className="w-full md:w-1/2 p-8 pt-14 md:p-14 bg-white/95" dir={isRtl ? 'rtl' : 'ltr'}>
                    <div className="mb-10 text-center md:text-start">
                        <h2 className="text-3xl font-bold text-slate-900 flex items-center justify-center md:justify-start gap-2">
                            {t('login_title')} <Zap size={24} className="text-yellow-500 fill-yellow-500" />
                        </h2>
                        <p className="text-slate-500 mt-2 font-medium italic">{t('login_subtitle')}</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-5">
                            <FormInput
                                label={t('identifier_label')}
                                name="identifier"
                                register={register}
                                errors={errors}
                                placeholder={t('identifier_placeholder')}
                                className="bg-slate-100/50 border-slate-200 focus:bg-white transition-all text-lg rounded-xl"
                            />

                            <FormInput
                                label={t('password_label')}
                                name="password"
                                type="password"
                                register={register}
                                errors={errors}
                                placeholder={t('password_placeholder')}
                                className="bg-slate-100/50 border-slate-200 focus:bg-white transition-all text-lg rounded-xl"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={loginMutation.isPending}
                            className="w-full h-16 text-lg font-extrabold bg-[#003366] hover:bg-[#001122] text-white rounded-2xl shadow-xl shadow-blue-900/30 group active:scale-[0.98] transition-transform"
                        >
                            {loginMutation.isPending ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                <span className="flex items-center justify-center gap-2 group-hover:gap-4 transition-all">
                                    {t('login_button')} <ArrowRightCircle size={22} className="text-yellow-500" />
                                </span>
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;