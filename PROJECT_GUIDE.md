# Interview Prep Project Guide

This document serves as the primary technical specification and implementation guide for the **Interview Prep** visualization platform. Use this guide to maintain consistency when adding new JavaScript or DSA topics.

## 🚀 Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS & Vanilla CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Code Highlighting**: `react-syntax-highlighter` (Prism atomDark)

---

## 🏗️ Project Architecture

### Core Directories
- `/src/app/javascript/`: JS concept pages (Closures, Promises, etc.)
- `/src/app/dsa/`: Data structures and algorithms (Array Rotation, Max Number, etc.)
- `/src/app/react/`: React-specific interview topics and hook deep-dives.
- `/src/app/nextjs/`: Next.js architectural patterns (SSR, SSG, App Router).
- `/src/app/components/`: Shared components (`Header`, `Footer`, `ThemeToggle`)
- `/public/`: Static assets (grids, SVG decorations)

---

## 🎨 Design System: The "Visualization Bro" Style

All new visualizers MUST follow the established premium full-screen layout.

### Layout Specs (Full-Screen)
- **Container**: `h-screen bg-slate-950 overflow-hidden flex flex-col`
- **Inner Wrapper**: `grid grid-cols-1 lg:grid-cols-[400px_1fr] h-full gap-6`

### Left Column: The Controller (400px)
1. **Header**: Title + Version badge.
2. **Input Card**: Interactive editing (e.g., changing input arrays or numbers).
3. **Playback Controls**: 
   - Reset (RotateCcw)
   - Previous (ChevronLeft)
   - Play/Pause (Play/Pause)
   - Next (ChevronRight)
4. **Progress Bar**: Calculated as `((currentStep + 1) / totalSteps) * 100`.
5. **Code Display**: Scrollable syntax highlighter synced with algorithm steps. Use `lineProps` to highlight the current line.

### Right Column: The Stage (Flexible)
1. **Step Narrator**: Centered badge at the top describing the current operation.
2. **Main Stage**: Centered area for Framer Motion animations. Use `layout` prop for smooth transitions.
3. **Stats Panel (Bottom)**: 3-column grid showing Complexity (Time/Space), Current Index/Value, and State.

---

## 🧠 Visualization Logic Template

Every visualizer follows a "Step-Based" state machine approach:

```tsx
// 1. Define Step Type
interface Step {
    description: string;
    array?: number[];
    highlighted?: number[];
    movingIndex?: number;
    jsLine: number;
    pyLine: number;
    // ... custom data
}

// 2. Generate Steps Function
const generateSteps = (input) => {
    const steps = [];
    // Push initial state
    // Loop through algorithm and push intermediate states
    // Push completion state
    return steps;
}

// 3. React State
const [steps, setSteps] = useState(generateSteps(initialInput));
const [currentStep, setCurrentStep] = useState(0);
const currentStepData = { ...steps[currentStep] };
```

---

## 🛠️ Checklist for Adding a New Topic

1. **Create Directory**: Create `/src/app/dsa/[new-topic]/page.tsx`.
2. **Implement Logic**: Use the Step-Based state machine described above.
3. **TypeScript Safety**: Use `(currentStepData as any).property` when accessing dynamic data in the UI to prevent inferred type lint errors.
4. **Interactive Controls**: Ensure `isPlaying` logic is handled via `useEffect` with `setInterval`.
5. **Register Topic**: 
   - For **JavaScript**: Update `concepts` array in `/src/app/javascript/page.tsx`.
   - For **DSA**: Update `algorithms` array in `/src/app/dsa/page.tsx`.
6. **Icons**: Use a relevant Lucide icon and maintain the color theme (Blue/Cyan for Easy, Amber/Orange for Medium, Rose/Red for Hard).
7. **Explanation Modal**: Implement the `DSAExplanationModal` component to provide deep-dive algorithm knowledge without cluttering the main UI.

---

## 📝 Coding Standards
- **Imports**: Always use absolute paths (e.g., `../../components/Header`).
- **Performance**: Use `AnimatePresence` for step transitions and `layout` for moving elements.
- **Micro-interactions**: Use `whileHover={{ scale: 1.05 }}` and `whileTap={{ scale: 0.95 }}` for buttons.
- **Glassmorphism**: Use `bg-slate-900/80 backdrop-blur-xl border border-white/10` for card containers.

---

*Last Updated: February 2026*
