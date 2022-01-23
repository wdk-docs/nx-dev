# Configuring CI Using GitLab and Nx

Nx is a smart, fast and extensible build system, and it works really well with monorepos. Monorepos provide a lot of advantages:

- Everything at that current commit works together. Changes can be verified across all affected parts of the organization.
- Easy to split code into composable modules
- Easier dependency management
- One toolchain setup
- Code editors and IDEs are "workspace" aware
- Consistent developer experience
- And more ...

But they come with their own technical challenges. The more code you add into your repository, the slower the CI gets.

## Setting Gitlab CI/CD

Below is an example of a GitLab pipeline setup for an Nx workspace only building and testing what is affected.

```yaml
image: node:16-alpine
stages:
  - setup
  - test

install-dependencies:
  stage: setup
  interruptible: true
  only:
    - main
    - merge_requests
  cache:
    key:
      files:
        - yarn.lock
    paths:
      - node_modules
      - .yarn
  script:
    - yarn install --pure-lockfile --cache-folder .yarn
  artifacts:
    paths:
      - node_modules

.distributed:
  interruptible: true
  only:
    - main
    - merge_requests
  needs:
    - install-dependencies
  artifacts:
    paths:
      - node_modules/.cache/nx

build:
  stage: test
  extends: .distributed
  script:
    - yarn nx affected --base=HEAD~1 --target=build --parallel --max-parallel=3

test:
  stage: test
  extends: .distributed
  script:
    - yarn nx affected --base=HEAD~1 --target=test --parallel --max-parallel=2
```

The `build` and `test` jobs implement the CI workflow using `.distributed` as template to keep
CI configuration file clearly.

## Distributed CI with Nx Cloud

A computation cache is created on your local machine to make the developer experience faster. This allows you to not waste time re-building, re-testing, re-linting, or any number of other actions you might take on code that hasn't changed. Because the cache is stored locally, you are the only member of your team that can take advantage of these instant commands. You can manage and share this cache manually.

Nx Cloud allows this cache to be shared across your entire organization, meaning that any cacheable operation completed on your workspace only needs to be run once. Nx Cloud also allows you to distribute your CI across multiple machines to make sure the CI is fast even for very large repos.

Learn more about [configuring your CI](https://nx.app/docs/configuring-ci) environment using Nx Cloud with [Distributed Caching](https://nx.app/docs/distributed-caching) and [Distributed Task Execution](https://nx.app/docs/distributed-execution) in the Nx Cloud docs.
