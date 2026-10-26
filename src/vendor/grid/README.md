# CMS grid compatibility

This retains the MIT-licensed MUI 5.12.3 Grid2 layout algorithm, class names and responsive props. It uses the installed MUI 9 styled engine, theme and system utilities; it does not install MUI 5. The CMS schema and existing site styles rely on the original negative margins and child padding. MUI 9 Grid uses CSS gaps, so switching directly would change these layouts.

Adaptations: public MUI imports, React 19 element/ref typing, component identity for nested grids, and removal of runtime PropTypes (unsupported by React 19). Original source: https://github.com/mui/material-ui/tree/v5.12.3/packages/mui-system/src/Unstable_Grid

Keep layout changes separate from dependency upgrades and compare nested, responsive and vertical layouts before replacing this adapter.
