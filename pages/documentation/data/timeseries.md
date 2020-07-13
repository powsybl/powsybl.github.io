---
layout: default
---

# Time series

## Time series modeling

In Powsybl, time series are modeled by:
- A name to uniquely identify a time series inside a store.
- A data type which is either `double` or `String`.
- A time index to define a list of instants for which data exists. Three different implementations of the time index are available
in the framework, depending on the need:
    - Regular index: the time step size is constant
    - [Irregular index](https://en.wikipedia.org/wiki/Unevenly_spaced_time_series): the time step size varies
    - Infinite index: the time series contains only two points, one at instant 0 and another at instant `Long.MAX_VALUE`
- Metadata: a list of key/value string data
- Data chunks: an ordered list of data that will be associated to instants of the time index. The data chunks may be compressed or uncompressed.

An uncompressed JSON data chunk looks like:
```json
{
  "offset" : 0,
  "values" : [ 1.0, 1.0, 1.0, 3.0 ]
}
```
We can see that an uncompressed data chunk is modeled with a double (or String) array and an offset. 
It defines values associated to instants of the time index from `offset` to `offset + values.length`.

It is possible to compress the data chunks, using for example the [RLE](https://fr.wikipedia.org/wiki/Run-length_encoding).
The JSON serialization of compressed data chunks looks like:
Output:
```json
{
  "offset" : 0,
  "uncompressedLength" : 4,
  "stepValues" : [ 1.0, 3.0 ],
  "stepLengths" : [ 3, 1 ]
}
```

Time series can be imported from CSV data.

## Calculated time series

Starting from a double time series, it is possible to create calculated time series using a [Groovy](http://groovy-lang.org/)
script.

For instance, let us consider the the following example.
Let's say we have created a first double time series named `dts` in a script, it is then possible to create new time series `a` and `b` by writing:
```groovy
ts['a'] = ts['dts'] + 1
ts['b'] = ts['a'] * 2
```
The time series `a` and `b`, serialized in JSON format, then look like:
```json
[ {
  "name" : "a",
  "expr" : {
    "binaryOp" : {
      "op" : "PLUS",
      "timeSeriesName" : "dts",
      "integer" : 1
    }
  }
}, {
  "name" : "b",
  "expr" : {
    "binaryOp" : {
      "op" : "MULTIPLY",
      "binaryOp" : {
        "op" : "PLUS",
        "timeSeriesName" : "dts",
        "integer" : 1
      },
      "integer" : 2
    }
  }
} ]
```
Indeed, the calculated time series are evaluated on the fly during array conversion or iteration (through iterators or streams): only the arithmetic expression is stored.

Here is the list of supported vector operations:

| Operator | Purpose | Example |
| -------- | ------- | ------- |
| + | addition | ts['a'] + ts['b'] |
| - | substraction | ts['a'] - ts['b'] |
| * | multiplication | ts['a'] * ts['b'] |
| / | division | ts['a'] / ts['b'] |
| == | 1 if equals, 0 otherwise | ts['a'] == ts['b'] |
| != | 1 if not equals, 0 otherwise | ts['a'] != ts['b'] |
| < | 1 if less than, 0 otherwise | ts['a'] < ts['b'] |
| <= | 1 if less than or equals to, 0 otherwise | ts['a'] <= ts['b'] |
| > | 1 if greater, 0 otherwise | ts['a'] > ts['b'] |
| >= | 1 if greater than or equals to, 0 otherwise | ts['a'] >= ts['b'] |
| - | negation | -ts['a'] |
| abs | absolute value | ts['a'].abs() |
| time | convert to time index vector ([epoch](https://en.wikipedia.org/wiki/Unix_time)) | ts['a'].time() |
| min | min value | ts['a'].min(10) |
| max | max value | ts['a'].max(10) |

About the Groovy DSL syntax, both `timeSeries['a']` and `ts['a']` are supported and are equivalent.

To compare a time index vector to a literal date, the `time('2018-01-01T00:00:01Z')` function is available. For instance, the
following code create a time series of 0 and 1 values:
```groovy
a = ts['dts'].time() < time('2018-01-01T00:00:01Z')
```

