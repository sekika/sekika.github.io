# https://hub.docker.com/_/debian
FROM debian:trixie-slim

# Setting
USER root

# Use Japanese mirror
RUN sed -i 's|http://deb.debian.org/debian$|http://ftp.jp.debian.org/debian|' /etc/apt/sources.list.d/debian.sources

# Basic system
RUN apt update && apt upgrade -y && apt full-upgrade -y && \
    apt install -y gcc make locate fish vim locales wget

# Additional packages & Gemini CLI Credentials Requirements (libsecret / gnome-keyring / dbus)
RUN apt update && apt install -y \
    python3-full python3-all python3-pip \
    python3-pandas \
    nodejs npm \
    ca-certificates curl \
    libsecret-1-0 gnome-keyring dbus-x11 \
    && apt -y autoremove && apt clean

# Install coding agents (global)
# Claude Code's npm package includes a platform-native executable.  Keep
# optional dependencies and run its installer explicitly so the executable is
# present even when npm configuration disables lifecycle scripts.
RUN npm install -g --include=optional --ignore-scripts=false \
        @anthropic-ai/claude-code@latest \
        @openai/codex@latest \
        @google/gemini-cli@latest && \
    claude_package_dir="$(npm root -g)/@anthropic-ai/claude-code" && \
    node "$claude_package_dir/install.cjs"

# Japanese
RUN sed -i '/ja_JP.UTF-8/s/^# //g' /etc/locale.gen && \
    locale-gen

ENV LANG=ja_JP.UTF-8
ENV LANGUAGE=ja_JP:ja
ENV LC_ALL=ja_JP.UTF-8

# Create user agent
ARG USER="agent"
ARG UID="1000"
ARG GROUP="agent"
ARG GID="1000"
ARG HOME_DIR="/home/agent"

RUN groupadd -g $GID $GROUP && \
    useradd -m -u $UID -g $GID -s /bin/bash $USER && \
    mkdir -p $HOME_DIR && \
    chown -R $UID:$GID $HOME_DIR

# Entry point
USER agent
ENV HOME=/home/agent

# Antigravity CLI is distributed as a native binary. Keep its user-local
# installation path explicit in gm rather than modifying the user's shell rc.
RUN curl -fsSL https://antigravity.google/cli/install.sh | bash -s -- --dir "$HOME/.local/bin"

ENTRYPOINT ["dbus-run-session", "--", "tail", "-F", "/dev/null"]
