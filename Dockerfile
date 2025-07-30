# ┌─[ Base Image ]────────────────────────────
FROM node:lts-buster

# ┌─[ System Dependencies ]──────────────────
RUN apt-get update && \
  apt-get install -y ffmpeg imagemagick webp && \
  apt-get upgrade -y && \
  npm i pm2 -g && \
  rm -rf /var/lib/apt/lists/*

# ┌─[ Clone the 𝐃𝐀𝐕𝐄-𝐗𝐌𝐃 Repo ]─────────────
RUN git clone https://github.com/giftedsession/DAVE-XMD /root/DAVE-XMD

# ┌─[ Set Working Directory ]────────────────
WORKDIR /root/DAVE-XMD

# ┌─[ Install Dependencies ]─────────────────
COPY package.json .        # not strictly needed after clone, but safe
RUN npm install --legacy-peer-deps

# ┌─[ Copy Remaining Files ]─────────────────
COPY . .

# ┌─[ Expose Port ]──────────────────────────
EXPOSE 5000

# ┌─[ Start the Bot Using dave.js ]──────────
CMD ["npm", "run" , "dave.js"]
