---
title: Time series
layout: default
---

# Getting started with time series

```xml
<dependency>
  <groupId>com.powsybl</groupId>
  <artifactId>powsybl-time-series-api</artifactId>
  <version>#VERSION#</version>
</dependency>
```

## Time series modeling

In PowSyBl time series are modelled by 

 - A name to uniquely identify the time series inside a store.
 - A type: double or string.
 - A time index to define an instant list to which data exists for this time series. Three differents implementation of time index are available in the framework depending of the need:
    - Regular index
    - Irregular index
    - Infinite index
 - Metadata: a list of key/value string data
 - Data chunks: an ordered list of data that will be associated to instant of the time index.

## Time index

### 1.  Irregular

To create [an irregular](https://en.wikipedia.org/wiki/Unevenly_spaced_time_series) time series index with 3 instants:

```javascript
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

### 2.  Regular

To create a regular time series with 3 instants equally spaced of 1 second:

```javascript
Instant start = Instant.parse("2018-01-01T00:00:00Z");
Instant end = start.plusSeconds(3);
Duration spacing = Duration.ofSeconds(1);
TimeSeriesIndex regularIndex = RegularTimeSeriesIndex.create(start, end, spacing);
```

As for irregular time index we can iterate over all instants:

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

### 3.  Infinite

Un infinite time series is a time series with only to point at instant 0 and Long.MAX_VALUE. To get an infinite tim series:

```javascript
InfiniteTimeSeriesIndex.INSTANCE;
```

## Time series

### 1. Double data

To create a double data time series based on time index `regularIndex`:

```javascript
StoredDoubleTimeSeries dts = TimeSeries.createDouble("dts", regularIndex);
```

We now have a time series with 3 instants but without any data.  By default the time series is filled with NaN values which means absent value.

```java
double[] values = dts.toArray();
System.out.println(Arrays.toString(values));
```

Output:

```
[NaN, NaN, NaN, NaN]
```

### 2. String data

Similarly to double time series, to create a string data time series based on time index `regularIndex`:

```java
StringTimeSeries sts = TimeSeries.createString("sts", regularIndex);
```

For string time series null or empty string is used to model an absent value.

```java
String[] values = sts.toArray();
System.out.println(Arrays.toString(values));
```

Output:

```
[null, null, null, null]
```



## Data chunks

In order to add data to the time series, we need to create data chunks: double data chunks for double time series and string data chunks for string time series.

### 1. Double data chunk

To create an uncompress data chunk and print its json representation:

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

We can see that an uncompress data chunk is juste a double array and an offset. It defines values associated to instant of the time index from offset to offset + values.length.

To compress the chunk using [RLE](https://fr.wikipedia.org/wiki/Run-length_encoding) compression:

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

`chunk.tryToCompress()`compute a compression factor by estimating the uncompressed and compressed data size of the data chunk. If compression factor is greater or equals to one, it returns itselfs otherwise it returns the compressed data chunk.

Compression factor could be accessed like this:

```java
System.out.println(compressedChunk.getCompressionFactor());
```

Output:

```
0.75
```

So here size of compressed data chunk is 0.75 smaller than uncompressed one.

To add a data chunk compressed or uncompressed to the time series:

```java
dts.addChunk(chunk); 
```

The time series now contains data. To print values:

```java
System.out.println(Arrays.toString(dts.toArray()));
```

Output:

```
[1.0, 1.0, 1.0, 3.0]
```

### 2. String data chunk

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

As for double time series, string data chunk can be added to string time series:

```java
sts.addChunk(chunk2); 
```

# CSV

Time series can be imported from CSV.

```java
String csv = String.join(System.lineSeparator(),
        "Time;Version;ts1;ts2",
        "1970-01-01T01:00:00.000+01:00;1;1.0;",
        "1970-01-01T02:00:00.000+01:00;1;;a",
        "1970-01-01T03:00:00.000+01:00;1;3.0;b") + System.lineSeparator();
Map<Integer, List<TimeSeries>> timeSeriesPerVersion = TimeSeries.parseCsv(csv, ';');
```

This CSV contains 2 time series, one double ts1 and one string ts2.

To print instants and values of these 2 time series:

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



