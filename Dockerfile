FROM ubuntu:jammy-20240808

# Uncomment the environment variables to non-interactive to avoid prompts during package installation
# ENV DEBIAN_FRONTEND=noninteractive
ENV NVM_DIR=/root/.nvm
ENV NODE_VERSION=22.8.0

RUN apt-get update && apt-get upgrade -y && apt-get install wget curl git vim tmux python3 python-is-python3 python3-pip -y

RUN pip install openai Pillow torch diffusers accelerate

WORKDIR /root
RUN git clone https://github.com/Visual-Intelligence-UMN/ML-PANCMAN.git

WORKDIR /root/ML-PANCMAN
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash


RUN . "$NVM_DIR/nvm.sh" && \
    nvm install $NODE_VERSION  && \
    nvm use $NODE_VERSION && \
    nvm alias default $NODE_VERSION && npm install

RUN apt autoremove -y \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

ENV PATH=$NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

EXPOSE 3000
# CMD ["npm", "start"]



