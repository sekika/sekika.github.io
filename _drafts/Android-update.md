---
layout: post
title: アンドロイドアプリの更新方法
tags:
- android
- flutter
---
Flutter で[ナンプレアプリ](https://sekika.github.io/kaidoku/sudoku/)を作って公開している。モバイルアプリは、定期的に新しい開発環境でアプリを作成し直す必要がある。[iOS版](https://apps.apple.com/app/sudoku-kaidoku/id6450177207)ではXcodeとFlutterのバージョンアップをすれば良いが、[Android版](https://play.google.com/store/apps/details?id=io.github.sekika.sudoku)では様々なバージョンアップが必要なため、この記事でまとめる。

## Android Studio のアップデート
Android Studio を開き、メニューの Android Studio から Check for updates とする。Android Studio そのもののアップデートをした場合には、さらにもう一度 Check for updates として、コンポーネントをアップデートする。Check for updates としたときに "You already have the latest version of Android Studio and plugins installed." と出ればアップデート完了となる。

## SDK と NDK のアップデート
[Android API Levels](https://apilevels.com/)を参考に、SDKの最新バージョンを使う。Android Studio の Tools メニューから SDK Manager を起動し、Languages & Farameworks > Android SDK を選ぶ。そして、
- SDK Platforms のタブから、最新版の Android SDK Platform package をチェックする。
- SDK Tools のタブから、Show package details でパッケージを表示して、最新版の Android SDK Build-Tools と NDK (Side by side) をチェックする。NDK のバージョン番号 (27.0.01207793 のような番号) は「build.gradle の設定」の項で使う。
- OK ボタンを押すことで、最新版の SDK と NDK がインストールされる。

## Java のアップデート
私の場合は Mac で Homebrew を使っている。[openjdk](https://openjdk.org/) を最新バージョンにする。

`java -version` でバージョンを確認する。最新バージョンになっていない場合、[Homebrew openjdk](https://formulae.brew.sh/formula/openjdk) によると、 macOS >= 10.15 では以下のコマンドを実行する必要がある。
```
sudo ln -sfn $(brew --prefix)/opt/openjdk/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk.jdk
```

## build.gradle の設定

SDKとNDKとJavaのバージョンが定まったら、`android/app/build.gradle` を設定する。以下は、このファイルの中で関係のあるところのみを示す。

```
def localProperties = new Properties()
def localPropertiesFile = rootProject.file('local.properties')
if (localPropertiesFile.exists()) {
    localPropertiesFile.withReader('UTF-8') { reader ->
        localProperties.load(reader)
    }
}

def flutterVersionCode = localProperties.getProperty('flutter.versionCode')
def flutterVersionName = localProperties.getProperty('flutter.versionName')
def ndkVersionName = localProperties.getProperty('ndk.version')
def javaVersion = localProperties.getProperty('javaVersion')

android {
    namespace "io.github.sekika.sudoku"
    compileSdk flutter.targetSdkVersion
    ndkVersion ndkVersionName

    compileOptions {
        sourceCompatibility JavaVersion.toVersion(javaVersion)
        targetCompatibility JavaVersion.toVersion(javaVersion)
    }

    kotlinOptions {
        jvmTarget = javaVersion.toString()
    }

    java {
        toolchain {
            languageVersion.set(JavaLanguageVersion.of(javaVersion))
        }
    }

    defaultConfig {
        applicationId "io.github.sekika.sudoku"
        minSdkVersion flutter.minSdkVersion
        targetSdkVersion flutter.targetSdkVersion
        versionCode flutterVersionCode.toInteger()
        versionName flutterVersionName
    }
}

```

これは、必要な設定を `android/local.properties` から読み込んでいる。`local.properties` には、たとえば次のように記述する。

```
sdk.dir=/Users/seki/Library/Android/sdk
flutter.sdk=/opt/homebrew/Caskroom/flutter/3.22.2/flutter
flutter.buildMode=release
flutter.versionName=1.0.1
flutter.versionCode=9
flutter.minSdkVersion = 21
flutter.targetSdkVersion = 35
ndk.version=27.0.12077973
javaVersion = 22⏎ 
```

ここで、flutter.versionCode の行までは Flutter が自動的に設定する。flutter.minSdkVersion は対応する最小 SDK バージョンで、flutter.targetSdkVersion は最新のSDKバージョンである（compile と target で別の値にすることもできるが、ここでは同じ値を使うようにしている）。flutter.ndkVersion は NDK のバージョンで、javaVersion は Java のバージョンである。flutter.targetSdkVersion と ndk.Version は「SDK と NDK のアップデート」でインストールしたバージョンである。

## Gradle のアップデート
- Gradle のバージョンについては、[Gradle のリリース](https://gradle.org/releases/)と[Java との互換性](https://docs.gradle.org/current/userguide/compatibility.html)を確認して、適切なバージョンを選ぶ。
- Gradle が入っていない場合はインストールする。Homebrew の場合は `brew install gradle`
- Gradle wrapper が入っていない場合（`android/gradlew` がない場合）には、android ディレクトリで `gradle wrapper` とすることで入れる。
- `android/gradle/wrapper/gradle-wrapper.properties` に、以下のように記述する。ここで 8.9 は Gradle のバージョンである。
```
distributionUrl=https\://services.gradle.org/distributions/gradle-8.9-all.zip
```

## プラグインのアップデート
`android/settings.gradle` には、以下のようなプラグインの設定がある。

```
plugins {
    id "dev.flutter.flutter-plugin-loader" version "1.0.0"
    id "com.android.application" version "8.5.1" apply false
    id "org.jetbrains.kotlin.android" version "2.0.0" apply false
}
```

ここで、"com.android.application" は AGP (Android Gradle Plugin) であり、"org.jetbrains.kotlin.android" は Kotlin である。それぞれ、以下から最新版を確認してバージョン番号を更新する。

- [AGP のリリース](https://mvnrepository.com/artifact/com.android.tools.build/gradle) / [リリースノート](https://developer.android.com/build/releases/gradle-plugin?hl=ja)
- [Kotlin のリリース](https://github.com/JetBrains/kotlin/releases)

## Flutter のアップデート
- `flutter upgrade` で　Flutter をアップデートする。
- `flutter pub upgrade` で Flutter のパッケージをアップデートする。

## パッケージの作成
android ディレクトリで `./gradlew clean build` としてアプリをビルドする。ここで、ビルド時に NewerVersionAvailable というエラーが出ることがある。たとえば、`/Users/seki/.pub-cache/hosted/pub.dev/url_launcher_android-6.3.5/android/build.gradle:71: Error: A newer version of org.mockito:mockito-core than 5.1.1 is available: 5.12.0 [NewerVersionAvailable]` というようなエラーである。この場合には、エラーで表示されたファイルを直接編集する。たとえば、この場合には  /Users/seki/.pub-cache/hosted/pub.dev/url_launcher_android-6.3.5/android/build.gradle というファイルの71行目を

```
    testImplementation 'org.mockito:mockito-core:5.12.0'
```
と書き換えることで、エラーを回避することができる。

`flutter build appbundle --release` でリリースパッケージ `build/app/outputs/bundle/release/app-release.aab` を作成する。
