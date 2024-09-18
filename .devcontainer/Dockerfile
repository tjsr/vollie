FROM mcr.microsoft.com/devcontainers/typescript-node:1-20-bookworm

ENV TZ=Etc/UTC
ENV DOCKER_HOST=unix:///var/run/user/1000/docker.sock

ARG USERNAME=devcontainer
ARG USER_UID=1020
ARG USER_GID=$USER_UID

RUN --mount=type=cache,mode=0777,target=/var/cache/apt/archives/ \
  apt-get update && apt-get install -y \
  apt-utils \
  locales \
  locales-all \
  ca-certificates \
  curl \
  git \
  openssh-client \
  sudo \
  zsh

# change default shell from bash to zsh
RUN sed -i -e "s/bin\/ash/bin\/zsh/" /etc/passwd

# Create the user
RUN addgroup --gid $USER_GID $USERNAME \
  && adduser --gecos GECOS --disabled-password --uid $USER_UID --gid $USER_GID --shell /bin/zsh $USERNAME
# add user to sudoer
RUN echo "$USERNAME ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers

RUN npm install -g npm@latest

# change user
USER $USERNAME

# install oh-my-zsh
RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
# install zsh plugins auto suggestions and syntax highlighting
RUN git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions

COPY config/zshrc /home/$USERNAME/.zshrc

COPY config/gitconfig /home/$USERNAME/.gitconfig

ENV PATH="/home/$USERNAME/.npm-global/bin:./node_modules/.bin:${PATH}"

VOLUME [ "/workspaces/vollie" ]

WORKDIR /workspaces/vollie

