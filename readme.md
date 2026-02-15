# @tkeron/tools

Useful JavaScript utilities for Bun runtime - A collection of lightweight, type-safe utilities designed specifically for the Bun environment.

## 🚀 Installation

```bash
bun add @tkeron/tools
```

## 📋 Requirements

- **Bun** >= 1.0.0
- **TypeScript** ^5.7.3

## 📖 About

This package provides a growing collection of utility functions and data structures optimized for the Bun runtime. All utilities are written in TypeScript with full type safety and are designed to be lightweight, performant, and easy to use.

## 🔧 Usage

```typescript
// Import all utilities
import * as tools from "@tkeron/tools";

// Or import specific utilities
import { rng, getLIFO, getPaths } from "@tkeron/tools";
```

## 📚 Available Utilities

### Logger System

Generic logging abstraction for standardized logging across applications:

```typescript
import { Logger, logger, silentLogger, createTestLogger } from "@tkeron/tools";

// Default logger (uses console)
logger.log("Hello world");
logger.error("Error message");
logger.warn("Warning message");
logger.info("Info message");

// Silent logger (no output, useful for production or testing)
silentLogger.log("This won't appear");

// Test logger (captures logs in arrays for testing)
const { logger: testLog, logs, errors, warns, infos } = createTestLogger();
testLog.log("Test message");
console.log(logs); // ["Test message"]

// Inject logger in your functions
const myFunction = (data: string, log: Logger = logger) => {
  log.info("Processing:", data);
  // ... your logic
};
```

### File System Utilities

Glob pattern matching and path retrieval:

```typescript
import { getPaths, getFilePaths, getDirectoryPaths } from "@tkeron/tools";

// Get all files and directories
const allPaths = getPaths("/path/to/dir", "**/*", "yes");

// Get only files
const files = getFilePaths("/path/to/dir", "**/*.ts");

// Get only directories
const dirs = getDirectoryPaths("/path/to/dir", "**/");
```

### Data Structures

Stack implementations (LIFO/FIFO):

```typescript
import { getLIFO, getFIFO } from "@tkeron/tools";

const stack = getLIFO<string>();
stack.push("first");
stack.push("second");
console.log(stack.current); // "second"
console.log(stack.pop()); // "second"
```

### Random Number Generator

Seedable random number generator:

```typescript
import { rng } from "@tkeron/tools";

// Generate infinite sequence with seed
for (const num of rng(42)) {
  console.log(num);
}

// Generate limited sequence
for (const num of rng(42, 10)) {
  console.log(num); // Only 10 numbers
}
```

## 📚 Documentation

For detailed documentation and TypeScript definitions, refer to the source code. Each utility is fully typed with JSDoc comments for IDE support.

## 🧪 Testing

The project includes comprehensive tests for all utilities:

```bash
bun test
```

Built with ❤️ for the Bun ecosystem
