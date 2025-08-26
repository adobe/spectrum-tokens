# Component Schema Diff Generator

A tool for generating diff reports between Spectrum component schema versions, with intelligent breaking change detection.

## Features

- 🔍 **Smart Diff Analysis**: Detects component schema changes with semantic understanding
- ⚠️ **Breaking Change Detection**: Automatically identifies API-breaking changes vs. safe updates
- 📊 **Multiple Output Formats**: CLI, JSON, and Markdown outputs for different use cases
- 🛠️ **Shared Architecture**: Built on `@adobe/spectrum-diff-core` for consistency with token diff generator
- 🧪 **Thoroughly Tested**: Comprehensive test suite with 100% coverage

## Installation

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test
```

## Usage

### CLI

```bash
# Compare component schemas between versions (GitHub tags)
sdiff report --osv v1.0.0 --nsv v1.1.0 --format markdown --output report.md

# Compare between branches
sdiff report --osb main --nsb feature/new-components

# Compare remote version to local
sdiff report --osv v1.0.0 --local packages/component-schemas

# Show only breaking changes
sdiff report --osv v1.0.0 --nsv v1.1.0 --breaking-only

# Output formats
sdiff report --osv v1.0.0 --nsv v1.1.0 --format json        # JSON output
sdiff report --osv v1.0.0 --nsv v1.1.0 --format markdown    # Markdown output
sdiff report --osv v1.0.0 --nsv v1.1.0 --format cli         # CLI output (default)
```

### CLI Options

- `--osv, --old-schema-version <version>` - Old component schema version (GitHub tag)
- `--nsv, --new-schema-version <version>` - New component schema version (GitHub tag)
- `--osb, --old-schema-branch <branch>` - Old component schema branch
- `--nsb, --new-schema-branch <branch>` - New component schema branch
- `--local <dir>` - Local component schemas directory (default: packages/component-schemas)
- `--repo <repo>` - Repository in owner/repo format
- `--format <format>` - Output format: cli, markdown, json (default: cli)
- `--output <file>` - Output file path
- `--breaking-only` - Show only breaking changes
- `--github-token <token>` - GitHub API token for private repos

### Programmatic API

```javascript
import {
  componentDiff,
  ComponentLoader,
} from "@adobe/spectrum-component-diff-generator";

// Load schemas
const loader = new ComponentLoader();
const original = await loader.loadLocalComponents("./schemas-v1");
const updated = await loader.loadLocalComponents("./schemas-v2");

// Generate diff
const result = componentDiff(original, updated);

console.log(result.summary.hasBreakingChanges); // true/false
console.log(result.summary.breakingChanges); // number of breaking changes
```

## Breaking Change Detection

The tool automatically detects breaking changes according to JSON Schema best practices:

### ❌ Breaking Changes

- **Deleting components**: Any removed component schema
- **Removing properties**: Deleting any property from a component
- **Adding required fields**: New required properties break existing implementations
- **Restricting enums**: Removing values from enum fields
- **Type changes**: Changing property types
- **Schema metadata changes**: Changes to `$schema`, `title`, etc.

### ✅ Non-Breaking Changes

- **Adding components**: New component schemas are always safe
- **Adding optional properties**: New optional fields don't break existing usage
- **Expanding enums**: Adding new enum values is backward compatible
- **Documentation updates**: Changes to descriptions, examples, etc.

## Output Examples

### CLI Output

```
🚨 BREAKING CHANGES DETECTED

Component Schema Diff Report
Breaking Changes: 2
Non-Breaking Changes: 3

❌ Deleted Components (BREAKING):
  - legacy-button

💥 Breaking Updates:
  - button

📦 Added Components:
  + new-toggle

🔄 Non-Breaking Updates:
  ~ avatar
  ~ badge
```

### JSON Output

```json
{
  "summary": {
    "hasBreakingChanges": true,
    "totalComponents": {
      "added": 1,
      "deleted": 1,
      "updated": 3
    },
    "breakingChanges": 2,
    "nonBreakingChanges": 3
  },
  "changes": {
    "added": { "new-toggle": { "type": "added", "schema": {...} } },
    "deleted": { "legacy-button": { "type": "deleted", "schema": {...} } },
    "updated": {
      "breaking": { "button": { "type": "updated", "changes": {...} } },
      "nonBreaking": { "avatar": { "type": "updated", "changes": {...} } }
    }
  }
}
```

## Architecture

This tool is built on the shared `@adobe/spectrum-diff-core` library, providing:

- **Consistent APIs**: Same patterns as token diff generator
- **Shared utilities**: Common diff, file loading, and formatting logic
- **Template system**: Reusable Handlebars templates
- **Extensible design**: Easy to add new output formats and analysis rules

## Future Enhancements

- Remote schema loading (GitHub API support)
- Advanced breaking change rules (semantic versioning alignment)
- Integration with PR workflows
- Custom rule configuration
- Detailed change descriptions with migration guidance

---

Built with ❤️ for the Adobe Spectrum Design System
