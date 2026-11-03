# Legacy CMS Markdown grammar

This compatibility layer preserves selected Marked 4.2.4 behavior under its MIT license while the installed parser/renderer is Marked 18.1.2. The original license is retained alongside the code.

The three tokenizer routines (list, emphasis and link) and their regex rules are ported with TypeScript contracts. The list adapter converts legacy paragraph/checkbox tokens into Marked 18's token shape. Heading IDs preserve the existing slug rules and duplicate counters, using a Map. Everything else uses the current Marked parser and renderer. The adapter does not depend on an old installed Marked version or recorded CMS content.

This exists because real CMS documents rely on bare list markers, legacy Unicode emphasis and nested-link parsing; current CommonMark behavior visibly changes those documents. The compatibility contract is guarded by committed synthetic old-output fixtures and an opt-in corpus comparison against 1,891 real CMS documents. The corpus lives in ignored `.storyblok/markdown-audit` and is not distributed as source.

Do not remove these routines or replace the parser without a reviewed content/output migration. Raw HTML and the existing CMS link-rendering policy are preserved; this layer is not a new sanitizer. Marked itself does not sanitize HTML. Published CMS authors remain the existing trust boundary.
