# AGENTS.md - Developer Guide for notifme-sdk

Unified notification SDK for Node.js supporting Email, SMS, Push, WebPush, Voice, Slack, and WhatsApp.

## Build, Lint & Test Commands

```bash
yarn build          # Build project (clean + babel + flow types)
yarn lint           # Run Flow + Standard.js linting
yarn lint-fix       # Auto-fix linting issues
yarn test           # Run lint + tests
yarn testonly       # Run tests only (no linting)
yarn demo           # Run demo with notification catcher
yarn dev            # Dev mode with nodemon
```

### Running a Single Test

```bash
# Run specific test file
yarn testonly __tests__/providers/email/index.js

# Run tests by name pattern
yarn testonly --testNamePattern="email custom provider"

# Run tests by path pattern
yarn testonly --testPathPattern="providers/email"

# With coverage
yarn testonly __tests__/providers/email/ses.js --coverage
```

## Code Style

### Flow Types
- All source files MUST have `/* @flow */` at the top
- Use `import type` for types, `export type` for exported types
- Use exact object types (`{| |}`) for configuration options

```javascript
/* @flow */
import type { EmailRequestType } from './models/notification-request'

export type OptionsType = {|
  channels?: { email?: { providers: EmailProviderType[] } }
|}
```

### Naming
- **Classes**: `UpperCamelCase` (e.g., `EmailSesProvider`)
- **Functions/variables**: `camelCase`
- **Files**: `kebab-case.js`

### Imports
Group in order: 1) External deps, 2) Internal modules, 3) Types (`import type`)

```javascript
/* @flow */
import nodemailer from 'nodemailer'
import fetch from '../../util/request'
import type { EmailRequestType } from '../../models/notification-request'
```

### Error Handling
- Use descriptive error messages
- Throw synchronously: `throw new Error('message')`
- Validate inputs at start of functions

```javascript
if (!request.to) {
  throw new Error('Email "to" field is required')
}
```

### Async/Await
- Use `async/await` for async operations
- Return promises correctly

```javascript
async send(request: EmailRequestType): Promise<string> {
  const response = await fetch(url, options)
  return response.id
}
```

### Testing
- Tests in `__tests__/` mirroring `src/` structure
- Use Jest's `test` function (not `it`)
- Mock external deps

```javascript
/* @flow */
/* global jest, test, expect */
jest.mock('../../src/util/logger', () => ({ info: jest.fn(), warn: jest.fn() }))

test('should send notification', async () => {
  const provider = new MyProvider(config)
  const result = await provider.send(request)
  expect(result).toBe('expected-id')
})
```

### Linting (Standard.js)
- No semicolons, single quotes, 2-space indentation
- Arrow functions with params need parentheses: `(request) =>`

### Coverage Requirements
- **100% coverage required** for branches, functions, lines, statements
- Excluded: `src/providers/push/**`, `src/util/**`

## Provider Pattern

```javascript
/* @flow */
export default class MyProvider {
  id: string = 'my-provider'

  constructor(config: Object) { this.config = config }

  async send(request: RequestType): Promise<string> {
    return messageId
  }
}
```

### Factory Pattern

```javascript
export default function factory ({ type, ...config }: Object): ProviderType {
  switch (type) {
    case 'myprovider': return new MyProvider(config)
    case 'custom': return config
    default: throw new Error(`Unknown provider "${type}".`)
  }
}
```

## Project Structure

```
src/
├── index.js, sender.js
├── providers/   (email/, sms/, push/, webpush/, voice/, slack/, whatsapp/)
├── models/      (notification-request.js, provider-*.js)
├── strategies/  (providers/fallback.js, roundrobin.js, no-fallback.js)
└── util/        (request.js, logger.js, ...)
__tests__/       (mirrors src/ structure)
```

## Adding a New Provider

1. Create `src/providers/<channel>/<provider>.js`
2. Add to factory in `src/providers/<channel>/index.js`
3. Add types in `src/models/provider-<channel>.js`
4. Create test in `__tests__/providers/<channel>/<provider>.js`
5. Run `yarn test`

## Notes

- Uses Semantic Release for versioning
- Build output: `lib/`
- Use `notification-catcher` for local testing
