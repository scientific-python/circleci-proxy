# CircleCI Proxy

CircleCI is a useful service for previewing document builds. However,
by default their artifact server behaves differently from a standard
static pages server, in that it does not render `foo/bar` from
`foo/bar/index.html`.

This CloudFlare Worker proxy fixes that, by fetching missing `foo/bar`
pages from `foo/bar/index.html`. It also tries `foo/bar.html`, just in
case (e.g., this is useful for static page builds in older versions of
the `mystmd` document engine, which did not yet provide `index.html`
pages).

## Usage

Build artifacts are served at a URL of the form:

https://output.circle-artifacts.com/output/job/fdfc47bf-4b9c-47a7-84cc-f494620a6004/artifacts/0/docs/_build/html/index.html

You can use the [CircleCI Artifacts Redirector
Action](https://github.com/scientific-python/circleci-artifacts-redirector-action)
to automatically provide that link in the status of your GH preview
build.

If you replace `output.circle-artifacts.com` with
`circle.scientific-python.dev`, the requests will go through this
proxy (see `worker.js`), and will render pages correctly, as described above.

**TODO:** Update `circleci-artifact-redirector-action` to accept a different base domain.
