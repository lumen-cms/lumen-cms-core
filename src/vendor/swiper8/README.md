# Swiper 8 React declarations

`react.d.ts` is copied from the MIT-licensed Swiper 8.4.7 package. The import of
`../types` uses the exported `swiper/types` entry instead. Runtime code still
comes from the installed Swiper package.

Swiper 8's export map omits its React declaration entry. Keep this type bridge
portable when lumen-cms-core is packed and dependencies are hoisted; a relative
`../../node_modules` import only works in the core source checkout. Remove this
copy when the Swiper upgrade provides an appropriate types export.
