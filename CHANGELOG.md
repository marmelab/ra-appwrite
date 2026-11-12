# Changelog

## v2.0.0

-   Prepare Demo to be used as Sites template
-   Fix doc links and build
-   Fix login page layout
-   Bump linkifyjs from 4.3.1 to 4.3.2
-   Publish modern ESM and CommonJS package exports ([#8](https://github.com/marmelab/ra-appwrite/pull/8))

### Breaking Changes

`ra-appwrite` now publishes its ES modules and CommonJS builds in `dist/`, behind an [`exports`](https://nodejs.org/api/packages.html#package-entry-points) map. Only the package root can be imported, so these undocumented paths no longer resolve:

-   the old build folders: `ra-appwrite/lib/*` and `ra-appwrite/esm/*`
-   the sources: `ra-appwrite/src/*`, even though they are still published
-   the manifest: `ra-appwrite/package.json`

## v1.1.0

- Bump react-admin minimal version to 5.6
- Deprecate LoginForm to use react-admin's LoginWithEmail

## v1.0.0

Initial release
