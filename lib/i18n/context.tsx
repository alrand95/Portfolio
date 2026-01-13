"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { translations, Language, dir } from './translations';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
    direction: 'ltr' | 'rtl';
    isLoaded: boolean; // To prevent flash of content
    hasSelectedLanguage: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>('en'); // Default to 'en' initially to match server
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasSelectedLanguage, setHasSelectedLanguage] = useState(false);

    useEffect(() => {
        // Check localStorage on mount
        const savedLang = localStorage.getItem('bunny-lang') as Language;
        if (savedLang && (savedLang === 'en' || savedLang === 'ar')) {
            setLanguageState(savedLang);
            setHasSelectedLanguage(true);
        }
        // If no saved lang, we stay at 'en' but 'isLoaded' will be true, 
        // letting the Modal (which we'll build) decide to show itself.
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        // Update document direction and lang attribute
        document.documentElement.lang = language;
        // User requested to keep layout LTR, so we disable RTL flipping
        // document.documentElement.dir = dir(language); w

        // Save to localStorage
        if (isLoaded && hasSelectedLanguage) { // Only save after initial load and explicit selection
            localStorage.setItem('bunny-lang', language);
        }
    }, [language, isLoaded, hasSelectedLanguage]);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        setHasSelectedLanguage(true);
    };

    const t = (key: string): string => {
        const keys = key.split('.');
        let value: any = translations[language];

        // Simple checks for flat keys in this first version, or specific known structure
        // Since our translations structure is flat-ish keys in a record, we can just look it up directly 
        // if we defined the keys that way, OR we can implement nested lookup.
        // For now, let's use the direct string key lookup from our defined type.

        return translations[language][key] || key;
    };

    const direction = dir(language);

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, direction, isLoaded, hasSelectedLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
}

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
