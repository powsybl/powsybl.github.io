---
layout: default
---

# Time series API

This page provides some examples of how to use the time series API.
Please check the [time series functional documentation](../../data/timeseries.md) to learn about the
time series modeling in PowSyBl.

## Handling the index type
### Create time series with irregular index

The following example shows how to create an [irregular](https://en.wikipedia.org/wiki/Unevenly_spaced_time_series) time
series index with 3 instants, and how to iterate over all instants of the time index.
```java
Instant t1 = Instant.parse("2018-01-01T00:00:00Z");
Instant t2 = t1.plusSeconds(1);
Instant t3 = t2.plusSeconds(2);
Instant t4 = t3.plusSeconds(3);
TimeSeriesIndex irregularIndex = IrregularTimeSeriesIndex.create(t1, t2, t3, t4);
```

To iterate over all instants of the time index:
```java
irregularIndex.stream().forEach(System.out::println);
```

Output:
```
2018-01-01T00:00:00Z
2018-01-01T00:00:01Z
2018-01-01T00:00:03Z
2018-01-01T00:00:06Z
```

### Create time series with regular index

The following example shows how to create a regular time series with 3 instants in steps of 1 second, and how to iterate
over all instants:
```java
Instant start = Instant.parse("2018-01-01T00:00:00Z");
Instant end = start.plusSeconds(3);
Duration spacing = Duration.ofSeconds(1);
TimeSeriesIndex regularIndex = RegularTimeSeriesIndex.create(start, end, spacing);
```

As with irregular time indexes, we can iterate over all instants:
```java
regularIndex.stream().forEach(System.out::println);
```

Output:
```
2018-01-01T00:00:00Z
2018-01-01T00:00:01Z
2018-01-01T00:00:02Z
2018-01-01T00:00:03Z
```

### Create time series with infinite index

An infinite time series is a time series with only two points: one at instant 0 and another at instant `Long.MAX_VALUE`.
To get an infinite time series:
```java
TimeSeriesIndex infiniteIndex = InfiniteTimeSeriesIndex.INSTANCE;
```

## Handling the data type
### Create double type time series

To create a double data time series based on time index `regularIndex`:
```java
StoredDoubleTimeSeries dts = TimeSeries.createDouble("dts", regularIndex);
```

We now have a time series with 3 instants but without any data. By default the time series is filled with `NaN` values
which means absent values.
```java
double[] values = dts.toArray();
System.out.println(Arrays.toString(values));
```

Output:
```
[NaN, NaN, NaN, NaN]
```

## Create string type time series

Similarly to double time series, to create a string data time series based on time index `regularIndex`:
```java
StringTimeSeries sts = TimeSeries.createString("sts", regularIndex);
```

For string time series `null` values or empty strings are used to model absent values.
```java
String[] values = sts.toArray();
System.out.println(Arrays.toString(values));
```

Output:
```
[null, null, null, null]
```

## Handle data chunks

In order to add data to a time series, we need to create data chunks: `DoubleDataChunk`s for double time series and
`StringDataChunk`s for string time series.

### Double data chunk

The following example shows how to create an uncompressed data chunk and print its JSON representation:
```java
DoubleDataChunk chunk = DataChunk.create(1d, 1d, 1d, 3d);
System.out.println(chunk.toJson());
```

Output:
```json
{
  "offset" : 0,
  "values" : [ 1.0, 1.0, 1.0, 3.0 ]
}
```

The following example shows how to compress the chunk using the [RLE](https://fr.wikipedia.org/wiki/Run-length_encoding)
compression algorithm:
```java
DoubleDataChunk compressedChunk = chunk.tryToCompress();
System.out.println(compressedChunk.toJson());
```

Output:
```json
{
  "offset" : 0,
  "uncompressedLength" : 4,
  "stepValues" : [ 1.0, 3.0 ],
  "stepLengths" : [ 3, 1 ]
}
```

The `chunk.tryToCompress()` method computes a compression factor by estimating the uncompressed and compressed data sizes
of the data chunk. If the compression factor is greater or equals to one, it returns the chunk itself otherwise it returns
a compressed data chunk.

The compression factor can be accessed using the `getCompressionFactor()` method:
```java
System.out.println(compressedChunk.getCompressionFactor());
```

Output:
```
0.75
```

In this example, the compressed data chunk's size is 25% smaller than the uncompressed one.

To add a compressed or uncompressed data chunk to a time series, use the `addChunk` method:
```java
dts.addChunk(chunk); 
```

The time series now contains data. The following example shows how to print contained values:
```java
System.out.println(Arrays.toString(dts.toArray()));
```

Output:
```
[1.0, 1.0, 1.0, 3.0]
```

### String data chunk

The following example shows how to create a `StringDataChunk` instance, and the JSON representation of both the compressed and
uncompressed version of this data chunk:
```java
StringDataChunk chunk2 = DataChunk.create("hello", "bye", "bye", "bye");
System.out.println(chunk2.toJson());
System.out.println(chunk2.tryToCompress().toJson());
```

Output:
```
{
  "offset" : 0,
  "values" : [ "hello", "bye", "bye", "bye" ]
}
{
  "offset" : 0,
  "uncompressedLength" : 4,
  "stepValues" : [ "hello", "bye" ],
  "stepLengths" : [ 1, 3 ]
}
```

As with double time series, string data chunks can be added to a string time series:
```java
sts.addChunk(chunk2); 
```

## Calculated time series

The following example creates a calculated time series from an existing time series:

```java
TimeSeriesIndex index = RegularTimeSeriesIndex.create(Interval.parse("2015-01-01T00:00:00Z/2015-07-20T00:00:00Z"), Duration.ofDays(200));
DoubleTimeSeries dts = TimeSeries.createDouble("dts", index, 1d, 2d);

List<DoubleTimeSeries> result = DoubleTimeSeries.fromTimeSeries(dts)
                                                .build("ts['a'] = ts['dts'] + 1",
                                                       "ts['b'] = ts['a'] * 2");
System.out.println(TimeSeries.toJson(result));
```

Output:

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

Calculated time series are evaluated on the fly during array conversion or iteration (through iterators or streams). Only
the arithmetic expression is stored.
```
System.out.println(Arrays.toString(result.get(0).toArray()));
System.out.println(Arrays.toString(result.get(1).toArray()));
```

Output:

```json
[2.0, 2.0, 2.0, 4.0]
[4.0, 4.0, 4.0, 8.0]
```

Check the [functional documentation](../../data/timeseries.md#calculated-time-series) for the list of supported vector operations.

## Handling CSV data

Time series can be imported from CSV:
```java
String csv = String.join(System.lineSeparator(),
        "Time;Version;ts1;ts2",
        "1970-01-01T01:00:00.000+01:00;1;1.0;",
        "1970-01-01T02:00:00.000+01:00;1;;a",
        "1970-01-01T03:00:00.000+01:00;1;3.0;b") + System.lineSeparator();
Map<Integer, List<TimeSeries>> timeSeriesPerVersion = TimeSeries.parseCsv(csv, ';');
```

This CSV contains 2 time series, a double time series `ts1` and a string time series `ts2`. The following example shows
how to print instants and values of these 2 time series:
```java
DoubleTimeSeries ts1 = (DoubleTimeSeries) timeSeriesPerVersion.get(1).get(0);
StringTimeSeries ts2 = (StringTimeSeries) timeSeriesPerVersion.get(1).get(1);
System.out.println("ts1 instants: " + Arrays.toString(ts1.getMetadata().getIndex().stream().toArray()));
System.out.println("ts1 values: " + Arrays.toString(ts1.toArray()));
System.out.println("ts2 instants: " + Arrays.toString(ts2.getMetadata().getIndex().stream().toArray()));
System.out.println("ts2 values: " + Arrays.toString(ts2.toArray()));
```

Output:
```
ts1 instants: [1970-01-01T00:00:00Z, 1970-01-01T01:00:00Z, 1970-01-01T02:00:00Z]
ts1 values: [1.0, NaN, 3.0]
ts2 instants: [1970-01-01T00:00:00Z, 1970-01-01T01:00:00Z, 1970-01-01T02:00:00Z]
ts2 values: [null, a, b]
```

