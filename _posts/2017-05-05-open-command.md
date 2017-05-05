---
layout: post-en
title: How to open a file from a terminal emulator
date: 2017-05-05 04:29:05 +0000
tags:
- english
- mac
- linux
- windows
---
This article describes how to open a file from a [terminal emulator](https://en.wikipedia.org/wiki/Terminal_emulator) in Mac, Linux, and Windows.

## Mac (macOS)
Use  ```open``` command in [Terminal](https://en.wikipedia.org/wiki/Terminal_(macOS)). By running

~~~
open Readme.txt
~~~

Readme.txt opens with an application associated with Readme.txt. URL can be specified. For example,

~~~
open http://google.com
~~~

opens Google website with your default web browzer. A directory can also be specified. For example,

~~~
open .
~~~

opens current directly in Finder.

Sometimes you may want to open a file with a program which is different from the associated one, for example, when you want to edit html file with a text editor. By using ```-t``` option, you can open a file with a default text editor.

~~~
open -t filename
~~~

You can also open a file with a specified application by using ```-a``` option.

You can make a shell script to open a file with your favorite text editor. For example, to open a file with [Brackets](http://brackets.io/), make a text file ```br``` like this,

~~~
#!/bin/sh
open $1 -a /Applications/Brackets.app
~~~

make it executable (```chmod +x br```) and put in your path (check it by ```echo $PATH```). Then you can use the ```br``` command as

~~~
br filename
~~~

Following help is shown by ```open --help```.

~~~
Usage: open [-e] [-t] [-f] [-W] [-R] [-n] [-g] [-h] [-s <partial SDK name>][-b <bundle identifier>] [-a <application>] [filenames] [--args arguments]
Help: Open opens files from a shell.
      By default, opens each file using the default application for that file.  
      If the file is in the form of a URL, the file will be opened as a URL.
Options: 
      -a                Opens with the specified application.
      -b                Opens with the specified application bundle identifier.
      -e                Opens with TextEdit.
      -t                Opens with default text editor.
      -f                Reads input from standard input and opens with TextEdit.
      -F  --fresh       Launches the app fresh, that is, without restoring windows. Saved persistent state is lost, excluding Untitled documents.
      -R, --reveal      Selects in the Finder instead of opening.
      -W, --wait-apps   Blocks until the used applications are closed (even if they were already running).
          --args        All remaining arguments are passed in argv to the application's main() function instead of opened.
      -n, --new         Open a new instance of the application even if one is already running.
      -j, --hide        Launches the app hidden.
      -g, --background  Does not bring the application to the foreground.
      -h, --header      Searches header file locations for headers matching the given filenames, and opens them.
      -s                For -h, the SDK to use; if supplied, only SDKs whose names contain the argument value are searched.
                        Otherwise the highest versioned SDK in each platform is used.
~~~

With [cdto](https://github.com/jbtule/cdto) you can add a toolbar in the Finder to open the current directory in the Terminal.

## Linux

```xdg-open``` can be used to open a file with default applications. xdg-open is a part of [xdg-utils](https://wiki.archlinux.org/index.php/default_applications#xdg-utils).

- [xdg-open(1) - Linux man page](http://linux.die.net/man/1/xdg-open)

This command is a little bit too long to type, and therefore you may want to create alias such as

~~~
alias open=xdg-open
~~~

in ```.bashrc```. In Gnome, ```gnome-open``` is also available.

- [gnome-open](http://manpages.ubuntu.com/manpages/xenial/en/man1/gnome-open.1.html) - manual page at Ubuntu xenial

## Windows

```start``` command can be executed from [command prompt](https://en.wikipedia.org/wiki/Cmd.exe), and ```Invoke-Item``` command is used for [PowerShell](https://en.wikipedia.org/wiki/PowerShell). See following documents by Microsoft for detail.

- [start](https://technet.microsoft.com/en-us/library/bb491005.aspx)
- [Invoke-Item](https://msdn.microsoft.com/en-us/powershell/reference/5.1/microsoft.powershell.management/invoke-item)

[Japanese version of this post](/2015/10/27/open-command/)
