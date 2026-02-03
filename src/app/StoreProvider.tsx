'use client';

import { useRef, useEffect } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from '../lib/store';
import { setTheme } from '../lib/features/theme/themeSlice';

export default function StoreProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const storeRef = useRef<AppStore>(undefined);
    if (!storeRef.current) {
        // Create the store instance the first time this renders
        storeRef.current = makeStore();
    }

    useEffect(() => {
        if (storeRef.current) {
            // Check localStorage for theme
            const savedTheme = localStorage.getItem('theme');
            let initialTheme: 'light' | 'dark' = 'light';

            if (savedTheme === 'dark' || savedTheme === 'light') {
                initialTheme = savedTheme;
            } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                initialTheme = 'dark';
            }

            storeRef.current.dispatch(setTheme(initialTheme));

            // Sync with DOM
            if (initialTheme === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
    }, []);

    return <Provider store={storeRef.current}>{children}</Provider>;
}
