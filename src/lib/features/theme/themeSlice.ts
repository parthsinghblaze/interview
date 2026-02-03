import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ThemeState {
    mode: 'light' | 'dark';
}

const initialState: ThemeState = {
    mode: 'light', // Default to light, will be updated by client checks
};

export const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.mode = state.mode === 'light' ? 'dark' : 'light';
            if (typeof window !== 'undefined') {
                localStorage.setItem('theme', state.mode);
                if (state.mode === 'dark') {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            }
        },
        setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
            state.mode = action.payload;
            if (typeof window !== 'undefined') {
                localStorage.setItem('theme', state.mode);
                if (state.mode === 'dark') {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            }
        },
    },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
