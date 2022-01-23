# Distributed Builds and Distributed CI

Nx uses computation caching and code change analysis (`affected:*` commands) to limit the number of things that have to be rebuilt and retested. This can drastically reduce the average CI time.

But regardless of how smart Nx is, there will be some large changes affecting the whole codebase. The only way to keep those fast as your repository keeps growing is to build and test them using multiple machines/agents.

There are several ways to distribute your CI across multiple machines.

The easiest way is to use Nx Cloud. Learn more about [configuring your CI](https://nx.app/docs/configuring-ci) environment using Nx Cloud with [Distributed Caching](https://nx.app/docs/distributed-caching) and [Distributed Task Execution](https://nx.app/docs/distributed-execution) in the Nx Cloud docs.

But you can also set up distribution manually using the `print-affected` and `run-many` commands.

Please look at the following two examples:

- [Example of setting up distributed Azure build for Nx workspace](https://github.com/nrwl/nx-azure-build)
- [Example of setting up distributed Jenkins build for Nx workspace](https://github.com/nrwl/nx-jenkins-build)

The Azure example is very easy to port to other CI providers (e.g., CircleCI, GitLab).

Read [Distributing CI: Binning and Distributed Task Execution](https://blog.nrwl.io/distributing-ci-binning-and-distributed-task-execution-632fe31a8953?source=friends_link&sk=5120b7ff982730854ed22becfe7a640a) to learn about the two approaches.
