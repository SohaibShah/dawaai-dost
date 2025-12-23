import { vars } from "nativewind";

export const themes = {
    light: vars({
        "--background": "#F8FAFC",

        "--surface": "#FFFFFF",
        "--surface-highlight": "#F1F5F9",
        
        "--text-main": "#0F172A",
        "--text-muted": "#64748B",
        
        "--primary": "#0EA5E9",
        "--primary-fg": "#FFFFFF",
        
        "--secondary": "#6366F1",
        "--secondary-fg": "#FFFFFF",

        "--success": "#10B981",
        "--success-bg": "#ECFDF5",

        "--warning": "#F59E0B",
        "--warning-bg": "#FFFBEB",

        "--error": "#F43F5E",
        "--error-bg": "#FFF1F2",

        "--border": "#E2E8F0"
    }),
    dark: vars({
        "--background": "#0F172A",

        "--surface": "#1E293B",
        "--surface-highlight": "#334155",
        
        "--text-main": "#F1F5F9",
        "--text-muted": "#94A3B8",
        
        "--primary": "#38BDF8",
        "--primary-fg": "#0F172A",
        
        "--secondary": "#818CF8",
        "--secondary-fg": "#0F172A",

        "--success": "#34D399",
        "--success-bg": "#064E3B",

        "--warning": "#FBBF24",
        "--warning-bg": "#78350F",

        "--error": "#FB7185",
        "--error-bg": "#881337",

        "--border": "#334155"
    })
};