# TypeScript Guide for Beginners

This guide explains the TypeScript concepts used in this project in simple terms.

## What is TypeScript?

TypeScript is JavaScript with types. Types help us catch errors before running the code and make code easier to understand.

## Basic Concepts

### 1. Types

**String** - Text data
```typescript
const name: string = "John";
```

**Number** - Numbers
```typescript
const age: number = 25;
```

**Boolean** - True or false
```typescript
const isActive: boolean = true;
```

**Array** - List of items
```typescript
const items: string[] = ["apple", "banana"];
```

**Object** - Collection of properties
```typescript
const person: { name: string; age: number } = {
  name: "John",
  age: 25
};
```

### 2. Interfaces

Interfaces define the shape of an object. Think of it as a blueprint.

```typescript
interface Campaign {
  id: string;
  name: string;
  status: string;
  budget: number;
}
```

This means a Campaign must have:
- `id` (string)
- `name` (string)
- `status` (string)
- `budget` (number)

### 3. Function Types

**Simple function:**
```typescript
function greet(name: string): string {
  return `Hello, ${name}`;
}
```

**Arrow function:**
```typescript
const greet = (name: string): string => {
  return `Hello, ${name}`;
};
```

### 4. Optional Properties

Use `?` to make a property optional:

```typescript
interface User {
  name: string;
  email?: string; // Optional - may or may not exist
}
```

### 5. Union Types

Use `|` to allow multiple types:

```typescript
const status: string | null = null; // Can be string OR null
```

### 6. Type Assertions

Tell TypeScript what type something is:

```typescript
const data = response.insights as OverallInsights;
```

## Common Patterns in This Project

### 1. Component Props

```typescript
interface CampaignCardProps {
  campaign: Campaign; // Must pass a Campaign object
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
  // Component code
};
```

### 2. State with Types

```typescript
const [name, setName] = useState<string>(''); // State is a string
const [count, setCount] = useState<number>(0); // State is a number
const [campaign, setCampaign] = useState<Campaign | null>(null); // State can be Campaign or null
```

### 3. Async Functions

```typescript
const fetchData = async (): Promise<CampaignsResponse> => {
  const response = await axiosInstance.get('/campaigns');
  return response.data;
};
```

`Promise<CampaignsResponse>` means this function returns a Promise that resolves to a CampaignsResponse.

### 4. Redux Hooks

```typescript
// Get dispatch function (to send actions)
const dispatch = useAppDispatch();

// Get data from Redux store
const { campaigns, loading } = useAppSelector((state) => state.campaigns);
```

## Tips for Beginners

1. **Start Simple**: Don't worry about complex types at first. Use `any` if needed, then refine later.

2. **Read Error Messages**: TypeScript errors tell you exactly what's wrong. Read them carefully.

3. **Use Interfaces**: Define interfaces for your data structures. It makes code clearer.

4. **Type Everything Gradually**: You don't need to type everything at once. Start with the most important parts.

5. **Ask for Help**: If a type error is confusing, simplify it or ask for help.

## Common TypeScript Errors

**Error: "Property 'x' does not exist on type 'y'"**
- Solution: Check if the property name is spelled correctly or if the type is correct.

**Error: "Type 'x' is not assignable to type 'y'"**
- Solution: The types don't match. Check what type is expected vs what you're providing.

**Error: "Object is possibly 'null'"**
- Solution: Add a check: `if (object !== null) { ... }` or use optional chaining: `object?.property`

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript for JavaScript Programmers](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)

