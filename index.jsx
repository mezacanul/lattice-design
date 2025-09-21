/*
 * Lattice Design - State Management Library
 * Copyright (C) 2025 Eduardo Meza
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library.
 * If not, see <https://www.gnu.org/licenses/>.
 */
/**
 * Lattice Design - A lightweight state management library for React
 * 
 * 🚧 This package is under active development and testing.
 * We welcome contributions, feedback, and bug reports!
 * 
 * GitHub: https://github.com/mezacanul/lattice-design
 * Issues: https://github.com/mezacanul/lattice-design/issues
 * 
 * @author José Eduardo Meza Canul
 * @license LGPL-3.0
 */

import { useState, useEffect } from "react";

let lattice_grid = {};
const allowedEntryFiles = [
    "_app.jsx",
    "main.jsx",
    "route-loader.js",
]; // Define allowed entry files

// MiniSingleton: Creates a mini context for shared state
function Singleton(initialState) {
    let sharedState = initialState;
    let listeners = [];

    const setSharedState = (newState) => {
        sharedState =
            typeof newState === "function"
                ? newState(sharedState)
                : newState;
        // console.log("MiniSingleton: State updated", sharedState);
        listeners.forEach((listener) =>
            listener(sharedState)
        );
    };

    function useSharedContext() {
        const [state, setState] = useState(sharedState);

        useEffect(() => {
            listeners.push(setState);
            setState(sharedState);
            return () => {
                listeners = listeners.filter(
                    (listener) => listener !== setState
                );
            };
        }, []);

        return [state, setSharedState];
    }

    useSharedContext.reset = () => {
        sharedState = initialState;
        listeners.forEach((listener) =>
            listener(sharedState)
        );
        // listeners = [];
        // Keep Listeners active because we are only resetting values
    };

    useSharedContext.initialState = initialState;
    return useSharedContext;
}

// Nexus: Initializes app-wide mini singletons
function Nexus(config) {
    if (lattice_grid.initialized) {
        throw new Error(
            "Nexus can only be initialized once. It should be called in an entry-level file like _app.jsx or main.jsx."
        );
    }

    const callerFile = detectCallerFile();
    console.log("Nexus initialized at ", callerFile);
    // if (!callerFile || !allowedEntryFiles.includes(callerFile)) {
    //     throw new Error(
    //         `Nexus can only be initialized in entry-level files: ${allowedEntryFiles.join(
    //             ", "
    //         )}. It was called from ${callerFile || "an unknown file"}.`
    //     );
    // }

    // Initialize lattice_grid
    Object.entries(config).forEach(([key, singleton]) => {
        lattice_grid[key] = {
            hook: singleton,
            initialState: singleton.initialState,
        };
    });

    lattice_grid.initialized = true;
    return lattice_grid;
}

// loadHook: Dynamically access mini singletons by name
function loadHook(hookName) {
    const hookEntry = lattice_grid[hookName];
    if (hookEntry) {
        return hookEntry.hook();
    }

    const initialState = hookEntry?.initialState;
    if (initialState === undefined) {
        return [undefined, () => {}];
    }
    return [initialState, () => {}];
}

// Helper: Detect caller file from stack trace
function detectCallerFile() {
    const stack = new Error().stack || "";
    const stackLines = stack.split("\n");
    let callerFile = null;

    for (const line of stackLines) {
        const match = line.match(
            /at .+?\(?(.+?\.(?:jsx|js|ts|tsx))(?:\?.*)?(?:\:\d+\:\d+)?\)?$/
        );
        if (match) {
            callerFile = match[1]
                .split("?")[0]
                .split("/")
                .pop();
        }
    }

    return callerFile;
}

export { Singleton, Nexus, loadHook };
