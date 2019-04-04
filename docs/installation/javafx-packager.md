---
title: javafx-packager
layout: default
---

The [JavaFX Maven Plugin](https://github.com/javafx-maven-plugin/javafx-maven-plugin) provides a way to assemble
distribution bundles for JavaFX applications. The distribution bundle can be packaged as a Linux package (rpm, deb), a
Windows package (exe, msi) or a MacOS package (dmg, pkg).

The layout of such distribution is the following:
```
<app-name>
├── app
│   ├── config.yml
│   ├── <app-name>.cfg
│   ├── lib
│   │   ├── <jars>
│   └── <app-name>-<app-version>-jfx.jar
├── <app-name>
├── libpackager.so
└── runtime
    └── <JRE>
```

# Requirements
The Grid Study environment depends on JavaFX which is not packaged with the OpenJDK. It is necessary to install the
[OpenJFX](https://openjdk.java.net/projects/openjfx/) runtime and devel packages.
```bash
$> sudo yum install java-1.8.0-openjdk-openjfx java-1.8.0-openjdk-openjfx-devel
```

# Configuration

## Properties

### appName
The `appName` property defines the name of the application.

### nativeReleaseVersion
The `nativeReleaseVersion` property defines the application version.

### mainClass
The `mainClass` property defines the entry point of the application. To use the GSE demo, set this property to 
`com.powsybl.gse.demo.GseDemo` and add `powsybl-gse-demo` to the runtime dependencies of the maven project.

## JVM properties

### jvmProperties
Use the `<jvmProperties>` section to pass system properties to the JVM.

### javafx.preloader
Set the `javafx.preloader` property to `com.powsybl.gse.app.GsePreloader` to display powsybl splash screen at startup.

### powsybl.config.dirs
The `powsybl.config.dirs` property defines the configuration folder. 

## Example
```xml
<build>
    <plugins>
            <plugin>
                <groupId>com.zenjava</groupId>
                <artifactId>javafx-maven-plugin</artifactId>
                <version>${maven.javafx.version}</version>
                <configuration>
                    <vendor>PowSyBl</vendor>
                    <appName>gse-demo-2</appName>
                    <nativeReleaseVersion>${project.version}</nativeReleaseVersion>
                    <mainClass>com.powsybl.gse.demo.GseDemo</mainClass>
                    <skipJNLP>true</skipJNLP>
                    <jvmProperties>
                        <app.root>$APPDIR</app.root>
                        <powsybl.config.dirs>${user_home}/.powsybl:${app.root}/app</powsybl.config.dirs>
                        <javafx.preloader>com.powsybl.gse.app.GsePreloader</javafx.preloader>
                    </jvmProperties>
                </configuration>
                <executions>
                    <execution>
                        <!-- required before build-native -->
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
    </plugins>
</build>
```

# Usage
The plugin copies all the maven dependencies to the `app/lib` folder of the distribution. To enable a feature, add a runtime
dependency to the `pom.xml` file.

The `javafx-packager` demo gives the minimal configuration to package the Grid Study Environment with a minimal set of
dependencies.
```shell
$> git clone https://github.com/powsybl/powsybl-tutorials.git
$> cd powsybl-tutorials/javafx-packager
$> mvn package
$> cd target/jfx/native/gse-demo
$> ./gse-demo &
```
