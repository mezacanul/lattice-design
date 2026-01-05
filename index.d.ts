/**
 * Lattice Design - TypeScript definitions
 * A lightweight state management library for React
 */

/**
 * Creates a scoped state hook that can be shared across components
 * @param initialState The initial value for the state
 * @returns A hook function with reset method and initialState property
 */
export declare function Singleton<T>(initialState: T): {
    (): [T, (newState: T | ((prev: T) => T)) => void];
    reset(): void;
    initialState: T;
};

/**
 * Initializes app-wide state lattice. Should be called once in your entry file.
 * @param config Object mapping hook names to Singleton instances
 */
export declare function CreateLattice(
    config: Record<
        string,
        ReturnType<typeof Singleton<any>>
    >
): void;

/**
 * Access hooks from the app-wide lattice
 * @param hookName String name of the hook defined in CreateLattice
 * @returns [state, setState] tuple for the requested hook
 */
export declare function fromLattice<T = any>(
    hookName: string
): [T, (newState: T | ((prev: T) => T)) => void];
