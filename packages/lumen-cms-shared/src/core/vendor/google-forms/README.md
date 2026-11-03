# Google Forms compatibility fork

Derived from francisconeves97/react-google-forms-hooks 1.2.4 (MIT).
This core only uses the form types and submission helper; it already has its own
server-side HTML parser and MUI renderer. Keeping those two pieces here removes
the package's obsolete React peer restriction without adding a service or an API
credential. Native fetch replaces isomorphic-unfetch. This is included in the
published core's src tree; it can later be extracted into a scoped package.

Submission encoding and GET/no-cors behavior are preserved. An opaque response
cannot confirm Google's acceptance; do not interpret it as server confirmation.
No real form submission is performed by the automated tests.
