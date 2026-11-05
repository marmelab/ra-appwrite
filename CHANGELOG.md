# Changelog

## Unreleased

-   Publish modern ESM and CommonJS package exports ([#8](https://github.com/marmelab/ra-appwrite/pull/8))

### Breaking Changes

`ra-appwrite` now publishes its ES modules and CommonJS builds in `dist/`, behind an [`exports`](https://nodejs.org/api/packages.html#package-entry-points) map. Only the package root can be imported, so these undocumented paths no longer resolve:

-   the old build folders: `ra-appwrite/lib/*` and `ra-appwrite/esm/*`
-   the sources: `ra-appwrite/src/*`, even though they are still published
-   the manifest: `ra-appwrite/package.json`
