# stack-convert
stackconvert is a CLI tool to convert folded event stacks to a JSON hierarchical data structure that can be consumed by [d3-flame-graph](https://github.com/spiermar/d3-flame-graph).

## Getting Started

stackconvert is available from [npm](https://www.npmjs.com/) and can be installed using the following command.

```
$ npm install stack-convert -g
```

Once the tool is installed, it can be used in the CLI.

```
$ stackconvert out.perf-folded -o out.json
```

Where:

```
out.perf-folded is the folded event stack you want to convert
-o out.json is the output file
```

## Examples

Input and Output examples can be found in the [examples](https://github.com/spiermar/node-stack-convert/tree/master/examples) directory.

## Issues

For bugs, questions and discussions please use the [GitHub Issues](https://github.com/spiermar/d3-flame-graph/issues).

## Contributing

We love contributions! But in order to avoid total chaos, we have a few guidelines.

If you found a bug, have questions or feature requests, don't hesitate to open an [issue](https://github.com/spiermar/node-stack-convert/issues).

If you're working on an issue, please comment on it so we can assign you to it.

If you have code to submit, follow the general pull request format. Fork the repo, make your changes, and submit a [pull request](https://github.com/spiermar/node-stack-convert/pulls).

## License

Copyright 2015 Martin Spier. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an “AS IS” BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
