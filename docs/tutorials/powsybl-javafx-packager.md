---
title: How to use PowSyBl as a custom desktop application
layout: default
---

It is possible to use PowSyBl as a complete desktop application based on the [GSE](https://github.com/powsybl/powsybl-gse)
(Grid Study  Environment) project]. In order to write their own native application using PowSyBl, developers can based
their maven project on it using the adequate maven project template available on
[powsybl-tutorials](https://github.com/powsybl/powsybl-tutorials).

# Setting up your project from template

Start by cloning the `powsybl-tutorials` github project:
```
$ git clone https://github.com/powsybl/powsybl-tutorials.git
```

You will then be able to base your project on the `javafx-packager` maven module and extend it to your
needs.

# Setting up your project from scratch

If you want to start your maven project from scratch, you will have to use the `javafx-maven-plugin` to base your native
application on the PowSyBl GSE.

In order to do this, add this in your `pom.xml` within your build-plugin:
```xml
<plugin>
    <groupId>com.zenjava</groupId>
    <artifactId>javafx-maven-plugin</artifactId>
    <version>8.8.3</version>
    <configuration>
        <vendor>PowSyBl</vendor>
        <appName>gse-demo</appName>
        <nativeReleaseVersion>${project.version}</nativeReleaseVersion>
        <skipJNLP>true</skipJNLP>
        <jvmProperties>
            <app.root>$APPDIR</app.root>
            <powsybl.config.dirs>${user_home}/.powsybl:${app.root}/app</powsybl.config.dirs>
            <javafx.preloader>com.powsybl.gse.app.GsePreloader</javafx.preloader>
        </jvmProperties>
    </configuration>
    <executions>
        <execution>
            <id>create-jfxjar</id>
            <phase>package</phase>
            <goals>
                <goal>build-jar</goal>
            </goals>
        </execution>
        <execution>
            <id>create-native</id>
            <phase>package</phase>
            <goals>
                <goal>build-native</goal>
            </goals>
        </execution>
    </executions>
</plugin>
```

Also add the `powsybl-gse`, `powsybl-afs-local` and `powsybl-afs-mapdb` in your dependencies:
```xml
<dependencies>
    <dependency>
        <groupId>com.powsybl</groupId>
        <artifactId>powsybl-afs-local</artifactId>
        <version>${powsybl.core.version}</version>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>com.powsybl</groupId>
        <artifactId>powsybl-afs-mapdb</artifactId>
        <version>${powsybl.core.version}</version>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>com.powsybl</groupId>
        <artifactId>powsybl-gse-demo</artifactId>
        <version>${powsybl.gse.version}</version>
        <scope>runtime</scope>
    </dependency>
</dependencies>
```

# Configuration

To use this application, you will need to configure the `mapdb-app-file-system` module as explained 
[here](../configuration/modules/mapdb-app-file-system.md) since it uses a MapDB based file system. A default configuration
`config.yml` is available in the resources of the maven project template.

If you wish to run loadflow or security-analysis on your networks, you will also need to configure the used implementations
in the `componentDefaultConfig` module as explained [here](../configuration/modules/componentDefaultConfig.md).

# Deploying your project

The maven project can now be deployed:
``` 
$ cd javafx-packager/
$ mvn clean package
```
Please note that you will need a Java distribution supporting JavaFX in order to deploy the project.

It can then be installed as a native application on your machine:
``` 
$ sudo yum install target/jfx/native/gse-demo-1.0.0-1.x86_64.rpm
```
or directly run as a desktop application from your terminal:
``` 
$ ./target/jfx/native/gse-demo/gse-demo
```
