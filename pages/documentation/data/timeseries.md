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

## Aggregating time series

It is possible to aggregate the requested data with aggregators and groupers from KairosDB. The available aggregators are described in the following table.  

| Aggregation | Description | Key word |
| --- | --- | --- |
| Minimum | Returns the minimum value of the series | min |
| Maximum | Returns the maximum value of the series | max |
| Sum | Returns the sum of the values of the series | sum |
| Average | Returns the average of the values of the series | avg |
| Standard deviation | Returns the standard deviation of the series | dev |
| Count | Returns the number of records of the series | count |
| Last | Returns the last record of the series | last |
| First | Returns the first record of the series | first |

A time unit can be defined to specify a range over which the aggregation should apply. The time range available are:
MILLISECONDS, "SECONDS","MINUTES", "HOURS", "DAYS", "WEEKS", "MONTHS" and "YEARS".

The results can be grouped using groupers. There are two types of groupers: time and value.

| Group by | Description | Key word |
| --- | --- | --- |
| Time | Groups the values by time units | time |
| Value | Groups the values by data range | value |

### Examples

#### Aggregators
We have a time series of 365 points all with a value of 1. It represents one data point per day, so we have data over one year.
To get the sum aggregation per month, we will use the request as follows.
```
{
"versionIds": 123
"aggregators": [{"type":"sum", "timeUnit":"MONTHS", "quantity":1}],
"groupers":[]
}
```
The "quantity" parameters indicates how many of the time units we want to use for each group.
Here, we are grouping by month, but we could use ```"quantity":6``` and we would be grouping by semesters.

For this request the result will be:
```
{
"dataType":"FetchQueryMixedResult",
"data":[[31,28,31,30,31,30,31,31,30,31,30,31]]
}
```
We get the sum for each month.

Several aggregators can be used one after the other. We only need to add them in the "aggregators" variable.
For instance, we can retrieve the average per week of the maximum values per day with:
```
{
"versionIds": 123
"aggregators": [{"type":"max", "timeUnit":"DAYS", "quantity":1}, {"type":"avg", "timeUnit":"WEEKS", "quantity":1}],
"groupers":[]
}
```

You can find more information on aggregators in the [KairosDB documentation](https://kairosdb.github.io/docs/build/html/restapi/Aggregators.html).

#### Groupers

Now, we will see how both aggregators and groupers can be used simultaneously.

1. Grouping by time

Let's say we have a time series containing four weeks of data, one data point per hour.
We can get the average value for each day, and group the results by days (one group for mondays, one group for tuesdays, and so on...) with the following request.

```
{
"versionIds": 123
"aggregators": [{"type":"avg", "timeUnit":"DAYS", "quantity":1}],
"groupers":[{"type":"time","timeValue":1,"timeUnit":"DAYS","timeCount":7}]
}
```
The result will be:
```
{
"dataType":"FetchQueryMixedResult",
"data":[[10,65,32,84],[32,64,91,31],[45,65,12,98],[87,1,64,99],[21,44,57,52.5],[33,98,61,75],[71.5,72.5,54,8]]
}
```
[10,65,32,84] is the group of the 4 average values of the 4 mondays in the sample, 
[32,64,91,31] is the group of the 4 average values of the 4 tuesdays in the sample, and so on.

You can find more information on groupers in the KairosDB documentation on [grouping by time](https://kairosdb.github.io/docs/build/html/restapi/TimeGrouping.html?highlight=groupers).

2. Grouping by value

Considering the same time series as the one in "Grouping by time" part, we can create groups based on a range value as described in the following request.

```
{
"versionIds": 123
"aggregators": [{"type":"avg", "timeUnit":"DAYS", "quantity":1}],
"groupers":[{"type":"value","rangeValue":30}]" +
}
```
This request will create groups as follows : [0,29],[30,59], etc.
The result will be:
```
{
"dataType":"FetchQueryMixedResult",
"data":[[10,12,1,21],[32,32,31,44,57,45,52.5,33,54,8],[65,84,64,91,65,98,87,64,99,98,61,75,71.5,72.5]]
}
```

You can find more information on groupers in the KairosDB documentation on [grouping by value](https://kairosdb.github.io/docs/build/html/restapi/ValueGrouping.html?highlight=groupers).
