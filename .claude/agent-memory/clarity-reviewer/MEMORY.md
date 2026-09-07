# Clarity Reviewer - Agent Memory

This file maintains persistent memory for the clarity-reviewer agent across sessions.

## Purpose
Track patterns, decisions, and learnings related to code clarity and readability across the project.

---

## Framework Code Quality Standards

**Note:** These standards are also defined in the global `.claude/CLAUDE.md` file. They are duplicated here for the clarity-reviewer agent's reference during code reviews.

### General Principles
- **Readable first**, optimized second
- Prefer explicit over implicit — make intent clear in code itself
- Do not refactor code outside the scope of the current task
- Prefer small, targeted changes over large rewrites

### Naming Conventions
**Standards:**
- ✅ Use descriptive, intention-revealing names
- ✅ Avoid single-letter variables (except standard loop indexes like `i`, `j`)
- ✅ Make names searchable and pronounceable
- ❌ Ambiguous names like `flag`, `check`, `data`, `temp`

**Examples:**
- Good: `userAuthenticationToken`, `maxRetryAttempts`, `isEmailValid`
- Bad: `token`, `max`, `flag`, `x`, `temp`

### Structure Standards
**Functions:**
- ✅ Functions should do one thing
- ✅ Keep functions under ~40 lines
- ✅ Extract complex logic into named helper functions
- ❌ Functions that do multiple unrelated things

**Files:**
- ✅ Keep files under ~400 lines
- ✅ One primary responsibility per file
- ✅ Group related functionality

**Dead Code:**
- ❌ No commented-out code blocks
- ❌ No unused imports or variables
- ❌ No unreachable branches
- ✅ Delete unused code, don't comment it out

### Linting & Formatting
- ✅ Follow the project's existing linter config (ESLint, Prettier, Black, Pylint)
- ✅ Maintain consistency with the codebase
- ❌ Do not invent a style when none exists (suggest a linter instead)

---

## Project-Specific Standards

### Naming Conventions Observed
<!-- Document project-specific naming patterns -->
<!-- Example: API endpoints use kebab-case, internal functions use camelCase -->

### Structural Patterns
<!-- Note preferred code organization patterns -->
<!-- Example: Feature-based folder structure under /src/features/ -->

### Complexity Preferences
<!-- Document team's tolerance for complexity in different contexts -->
<!-- Example: Business logic functions can be longer if well-documented -->

### Documentation Standards
<!-- Track documentation expectations and examples -->
<!-- Example: All public APIs require JSDoc comments -->

### Past Reviews
<!-- High-level notes from previous clarity reviews -->

### Common Clarity Issues
<!-- Recurring issues to watch for in this project -->
<!-- Example: Team tends to use abbreviations that aren't well-known -->

---

## Seres Migratorios — semillas de `/personalize` (2026-09-07)

- Identificadores en ESPAÑOL son la norma (`rutaLocalizada`, `clasesEnvoltorio`, `fraseManuscrita`): no señalar como inconsistencia. Comentarios y JSDoc en INGLÉS.
- Nombres canónicos de componentes fijos por design system (`BloqueFicha`, `TitularPartido`, `FotoPegada`…): nunca proponer renombrar ni traducir. Helpers ajenos al DS van en `components/internos/`.
- Cada componente abre con un JSDoc extenso que cita la sección del DS y el ticket `SM-NNN`: es el patrón esperado, no verbosidad a recortar.
- Los bloques `OBSERVACIÓN:` documentan un desvío entre spec y diseño que se decidió NO arreglar unilateralmente. Son deliberados; no son deuda a limpiar.
- Props tipadas siempre con `interface Props` literal (no `ComponentProps<typeof X>`), camelCase en español.
- Imports relativos con extensión `.ts` (`../i18n/utils.ts`). Sin alias `src/`.
