---
layout: post-en
title: Uploading many files to GitHub repository
ja: /2016/06/03/github-many-files/
date: 2016-06-06 06:18:58 +0000
tags:
- english
- git
- github
---
As [GitHub introduced unlimited private repositories](https://github.com/blog/2164-introducing-unlimited-private-repositorie), I uploaded gigabytes of data to GitHub repository. Here is some technical notes for uploading many files to GitHub repository.

## Storage and bandwidth limit of large files

[Git Large File Storage (LFS)](https://git-lfs.github.com/) is required to push a file larger than 100 MB to GitHub repository. There is a storage and bandwidth limit for LFS, and if you exceed the limit you need to [buy extra storage and bandwidth](https://help.github.com/articles/billing-plans-for-git-large-file-storage/).

You may want to use LFS to handle the large files, or you may just want to ignore the large files. Both methods are written in this article.

## Create a repository

Sign in to [GitHub](https://github.com/) and create a repository with ```New reposiroty``` button (Don&apos;t check ```Initialize this repository with a README```). If there is no ```REAME.md```, create a tentative file with

~~~
echo "# test" >> README.md
~~~

and run the following commands to initialize the repository and add README.md (```Rewrite USER and REP```).

~~~
git init
git add README.md
git commit -m "First commit"
git remote add origin git@github.com:USER/REP.git
git push -u origin master
~~~

## Remove spaces from the file names

This command replace spaces &quot; &quot; into underscores &quot;_&quot; in the file names under the current directory.

~~~
for A in $(find . | grep " " | sed -e s/" "/x3Exe/g) ; do mv "$(echo $A | sed -e s/x3Exe/' '/g)" "$(echo $A | sed -e s/x3Exe/'_'/g)"; done
~~~

If there are spaces in the name of the directory, error may arise. Just repeat this command until no error is shown.

## Manage file with LFS

Skip this step when not using LFS. For using LFS, install [LFS](https://git-lfs.github.com/) first. Then setup LFS to Git by

~~~
git lfs install
~~~

Files larger than 100 MB can be listed with

~~~
find . -size +100M | xargs du -sh
~~~

Designate the file to manage with LFS from this list. For example, to track files of .psd extention:

~~~
git lfs track "*.psd"
~~~

## Ignore large files

When not using LFS, large files can be ignored with ```.gitignore``` file.

To add all the files larger than 100 MB to ```.gitignore```:

~~~
find . -size +100M | sed -e 's/^\.\///' >> .gitignore
~~~

## Increase the HTTP post buffer size

When pushing large files, error may arise

<blockquote>
packet_write_wait: Connection to 192.30.252.123: Broken pipe<br>
fatal: The remote end hung up unexpectedly<br>
error: failed to push some refs to 'git@github.com:USER/REP.git'
</blockquote>

To avoid this, [increasing the HTTP post buffer size](http://stackoverflow.com/questions/19120120/broken-pipe-when-pushing-to-git-repository) is recommended. To increase the buffer size to 50 MB,

~~~
git config http.postBuffer 52428800
~~~

## Adding files to repository

Standard way to adding all the files to repository is ```git add -A; git commit; git push```, but it does not succeed when trying to add gigabytes of files; ```fatal: The remote end hung up unexpectedly``` error arises even when the HTTP buffer size is increased. Therefore I made the following shell script, ```gitadd```, to add all the files in the current directory step by step.

{% gist 570495bd0627acff6c836de18e78f6fd %}

When you get error by ```git add -A; git commit; git push```, you can reset the commit and index by ```git reset HEAD~``` and run ```gitadd``` after that.
