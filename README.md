# lattice-design

> ⚠️ **Development Status**: This package is currently under active development and testing. We welcome contributions, feedback, and bug reports from the community!

A lightweight state management library for React that simplifies state management with Singletons and a centralized Nexus for app-wide context. Use Singletons for scoped state or call Nexus to build an app-wide Lattice. Tap into the Lattice with `loadHook` or create your own localized state with custom hooks. No prop drilling, just simple hooks for state subscription and synced state.

Lattice Design eliminates boilerplate code to simplify state management in a clean and sleek way. It provides you with readiness so you can focus on your app's architecture for simple to medium projects. You could try it out on large-scale projects as well, but it requires that you manage your states consciously and responsibly with a component-driven focus to delegate responsibilities directly to components on how to read and manage new states. 

## Features
- **Singleton**: Scoped state hooks, syncable via export.
- **Nexus**: Singleton factory to build an app-wide Lattice, callable once in entry files and referenced in any file.
- **loadHook**: Access the Lattice by tapping into it with a clean hook API.

## Installation
```bash
npm install lattice-design
```

## 🚀 [Live Demo](https://lattice-design.vercel.app/)

See Lattice Design in action with interactive examples!

## Usage

### App-Wide State with Nexus

First, initialize your app-wide state lattice in your entry file (e.g., `_app.jsx`, `main.jsx`):

```jsx
// In app.jsx or main.jsx
import { Nexus, Singleton } from "lattice-design";

Nexus({
    useTitle: Singleton("Lattice Design"),
});
```

Then access the state from any component using `loadHook`:

```jsx
import { loadHook } from "lattice-design";
import { useEffect } from "react";

function MyComponent() {
    const [title, setTitle] = loadHook("useTitle");

    useEffect(() => {
        setTitle("Lattice Design is awesome!");
    }, []);

    return <h1>{title}</h1>;
}
```

### Scoped State with Singleton

Create file-scoped state that can be shared across components:

```jsx
import { Singleton } from "lattice-design";

const useLocalToggle = Singleton(false);

const MyStateReader = () => {
    const [toggle] = useLocalToggle();
    return <h1>{toggle ? "On" : "Off"}</h1>;
};

const MyStateWriter = () => {
    const [toggle, setToggle] = useLocalToggle();
    return (
        <button onClick={() => setToggle(!toggle)}>
            {`Switch ${toggle ? "Off" : "On"}`}
        </button>
    );
};
```

### Exporting Singletons

Export your Singleton to use across multiple files:

```jsx
// hooks/useLocalToggle.js
import { Singleton } from "lattice-design";
export const useLocalToggle = Singleton(false);

// components/MyComponent.jsx
import { useLocalToggle } from "../hooks/useLocalToggle";

const MyNewStateReader = () => {
    const [toggle] = useLocalToggle();
    return <h1>{toggle ? "On" : "Off"}</h1>;
};
```

## API Reference

### `Singleton(initialState)`
Creates a scoped state hook that can be shared across components.
- **initialState**: The initial value for the state
- **Returns**: A hook function that returns `[state, setState]`

### `Nexus(config)`
Initializes app-wide state lattice. Should be called once in your entry file.
- **config**: Object mapping hook names to Singleton instances
- **Returns**: Nothing (void) - just initializes the lattice

### `loadHook(hookName)`
Access hooks from the app-wide lattice.
- **hookName**: String name of the hook defined in Nexus
- **Returns**: `[state, setState]` tuple for the requested hook

### `reset()` Method
Each Singleton hook has a `reset()` method to restore the state to its initial value.

```jsx
const useCounter = Singleton(0);

// Later in your code
useCounter.reset(); // Resets counter back to 0
```

- **Usage**: Call `hookName.reset()` on any Singleton hook
- **Effect**: Restores state to the initial value and notifies all listeners

**Tip**: We recommend setting up a file with initial values so you have a reference in your app of the values you can reset your states to.

```jsx
// constants/initialStates.js
export const INITIAL_STATES = {
    counter: 0,
    user: null,
    theme: 'light'
};

// hooks/useCounter.js
import { Singleton } from "lattice-design";
import { INITIAL_STATES } from "../constants/initialStates";

export const useCounter = Singleton(INITIAL_STATES.counter);
```

## Why Choose Lattice Design?

- ✅ **Zero boilerplate** - No providers, contexts, or reducers
- ✅ **Tiny footprint** - Lightweight with no external dependencies
- ✅ **React-first** - Built specifically for React hooks
- ✅ **Type-safe ready** - Works great with TypeScript
- ✅ **Flexible** - Use globally with Nexus or locally with Singletons
- ✅ **Simple API** - Just 3 functions to learn

## Contributing

We'd love your help making Lattice Design better! This project is in active development and we welcome:

- 🐛 **Bug reports** - Found an issue? [Open an issue](https://github.com/mezacanul/lattice-design/issues)
- 💡 **Feature suggestions** - Have ideas? We'd love to hear them!
- 🔧 **Code contributions** - Submit a [Pull Request](https://github.com/mezacanul/lattice-design/pulls)
- 📖 **Documentation improvements** - Help make our docs clearer
- 🧪 **Testing** - Try it in your projects and share feedback

### Ways to contribute:
1. **Star the repo** ⭐ to show support
2. **Try it out** in your projects and report issues
3. **Share feedback** on the API design
4. **Suggest improvements** for performance or developer experience
5. **Help with documentation** and examples

## Links

- 🌐 [Live Demo](https://lattice-design.vercel.app/)
- 📦 [npm Package](https://www.npmjs.com/package/lattice-design)
- 📖 [GitHub Repository](https://github.com/mezacanul/lattice-design)
- 🐛 [Report Issues](https://github.com/mezacanul/lattice-design/issues)
- 🔧 [Contribute](https://github.com/mezacanul/lattice-design/pulls)

## License

LGPL-3.0 - See [LICENSE](LICENSE) file for details.