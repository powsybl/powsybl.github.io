---
layout: default
---

# How to contribute

## Code of conduct
This project applies the [LF Energy Code of Conduct](https://wiki.lfenergy.org/display/HOME/Code+of+Conduct). By participating, you are expected to uphold this code. Please report unacceptable behavior to the project's Technical Steering Committee [powsybl-tsc@lists.lfenergy.org](mailto:powsybl-tsc@lists.lfenergy.org).

## License and Developer Certificate of Origin
PowSyBl is an open source framework licensed under the [Mozilla Public License 2.0](https://www.mozilla.org/en-US/MPL/2.0/). By contributing to PowSyBl, you accept and agree to the terms and conditions for your present and future contributions submitted to PowSyBl.

The project also uses a mechanism known as a [Developer Certificate of Origin (DCO)](https://developercertificate.org/) to manage the process of ensuring that we are legally allowed to distribute all the code and assets for the project. A DCO is a legally binding statement that asserts that you are the creator of your contribution, and that you wish to allow PowSyBl to use your work.

Contributors sign-off that they adhere to these requirements by adding a `Signed-off-by` line to commit messages. All commits of all repositories of the PowSyBl community have to be signed-off like this:
```
This is my commit message.

Signed-off-by: John Doe <john.doe@server.com>
```

You can write it manually but Git even has a -s command line option to append this automatically to your commit message:
```
$ git commit -s -m 'This is my commit message'
```

Note that a check will be performed during the continuous integration, indicating whether all commits in a Pull Request contain a valid `Signed-off-by` line.

The `Signed-off-by` line at the end of the commit message can be written automatically. You just have to configure the `.gitconfig` file with the following alias:
```
[alias]
    ci = commit -s
```
Then, use the following command to commit your changes:
```
$ git ci -m "This is my message"
```

Note that most IDEs can be configured in order to add a `Signed-off-by` line at the end of the commit message.

## Reporting Bugs
If you encounter a problem with PowSyBl, the first places to ask for help are the [user mailing list](https://lists.lfenergy.org/g/powsybl) and the `#issues` [Slack channel](https://app.slack.com/client/TG8ALA0TB/C02CG8Q0TS6).

If, after having asked for help, you suspect that you have found a bug in PowSyBl, you should report it by opening an issue in the appropriate [GitHub repository](../documentation/developer/repositories/index.md). Before creating a bug report, please **perform a [cursory search](https://github.com/search?q=+is%3Aissue+user%3Apowsybl)** to see if the problem has already been reported. Prefer to add a comment to an existing issue instead of opening a new one to avoid duplications and make the triage of issues more complex.

If there is no already existing issue for your problem, feel free to create a new issue. Please provide as many details as you can on your problem filling the issue template, and don't forget to indicate which version of PowSyBl you are running and on which environment.


## Suggesting Enhancements
If you are interested in a new feature to add in the PowSyBl framework, the first place to discuss it are the [developers mailing list](https://lists.lfenergy.org/g/powsybl).

You can also track your proposal by filling an issue in the appropriate [GitHub repository](../documentation/developer/repositories/index.md). Before creating a feature request, please **perform a [cursory search](https://github.com/search?q=+is%3Aissue+user%3Apowsybl)** to see if someone else has already asked for it. Prefer to complete an existing issue instead of opening a new one to avoid duplications and make the triage of issues more complex.

Please give us as many details as you can on your needs or use cases filling the issue template to help the development team to fulfill your needs.

## Contributing to the code or the documentation
Before contributing to the project, please be sure to have read and understood the [code of conduct](https://www.lfenergy.org/about/code-of-conduct/) and the [license and the Developer Certificate of Origin](#license-and-developer-certificate-of-origin) paragraph. Before you start coding, you have to agree with the [maintainers](../documentation/developer/repositories/index.md) about the technical solution you will implement, to be sure it will be aligned with the project guidelines.
If you are not part of the development team, please join our [Slack](https://join.slack.com/t/powsybl/shared_invite/zt-rzvbuzjk-nxi0boim1RKPS5PjieI0rA) and ask us on the `#first-time-contributors` channel to grant you developer rights in the PowSyBl organization.
Once you do, you will receive an invitation to the PowSyBl organization. Accept it and you will be able to clone the repository, create your own branch and commit your changes! 

Once the development is done, you have to create a [pull request](https://help.github.com/en/articles/about-pull-requests):
- Fill all the relevant sections of the template to give context to the reviewer
- Assign one or more reviewer, ideally the [maintainers](../documentation/developer/repositories) of the repository
- Add the `PR: waiting-for-review` and all other relevant labels
- Verify that all [status checks](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/about-status-checks) are OK, specially the Sonar analysis

The reviewer will review your proposal and:
- approves your changes: your contribution fits the project guidelines and will be merged
- approves with comments: your contribution is OK, but the reviewer suggests to make some improvements
- requests a change: your proposition is not accepted and cannont be merged. You have to fix it regarding the different comments made by the reviewer.

### Continuous integration
The continuous integration runs automatically when a pull request is opened, or a commit is pushed. The CI will help us to maintain the quality of the project with automatic checks:
- Code style: the code style will be analyzed by `maven-checkstyle-plugin`. The [configuration](https://github.com/powsybl/powsybl-parent/blob/main/powsybl-build-tools/src/main/resources/powsybl-build-tools/checkstyle.xml) is shared between all our repositories.
- Compilation: the code will be compiled using [Github Actions](https://github.com/features/actions) under Linux, Windows and MacOS, and the unit tests will be run.
- SonarCloud will report the code smells, duplications and the code coverage. You have to fix all the relevant code smells and add unit tests to reach at least 80%.

### English convention
The convention for all PowSyBl documents, including the website, is to write American English. A list of spelling differences between British and American English is available [here](https://www.britishcouncilfoundation.id/en/english/articles/british-and-american-english) for example.
