---
title: "Ssh Push Error"
date: 2021-11-26T14:32:57+08:00
draft: true
---

### 问题

`git shell` 中连接`coding`服务器一直连接不上

```sh
$  ssh -v git@e.coding.net
OpenSSH_8.8p1, OpenSSL 1.1.1l  24 Aug 2021
debug1: Reading configuration data /c/Users/ihaiking/.ssh/config
debug1: /c/Users/ihaiking/.ssh/config line 6: Applying options for e.coding.net
debug1: Reading configuration data /etc/ssh/ssh_config
debug1: Connecting to e.coding.net [81.69.155.167] port 22.
debug1: Connection established.
debug1: identity file /c/Users/ihaiking/.ssh/id_rsa_coding type 0
debug1: identity file /c/Users/ihaiking/.ssh/id_rsa_coding-cert type -1
debug1: Local version string SSH-2.0-OpenSSH_8.8
debug1: Remote protocol version 2.0, remote software version Go-CodingGit
debug1: compat_banner: no match: Go-CodingGit
debug1: Authenticating to e.coding.net:22 as 'git'
debug1: load_hostkeys: fopen /c/Users/ihaiking/.ssh/known_hosts2: No such file or directory
debug1: load_hostkeys: fopen /etc/ssh/ssh_known_hosts: No such file or directory
debug1: load_hostkeys: fopen /etc/ssh/ssh_known_hosts2: No such file or directory
debug1: SSH2_MSG_KEXINIT sent
debug1: SSH2_MSG_KEXINIT received
debug1: kex: algorithm: curve25519-sha256@libssh.org
debug1: kex: host key algorithm: rsa-sha2-512
debug1: kex: server->client cipher: chacha20-poly1305@openssh.com MAC: <implicit> compression: none
debug1: kex: client->server cipher: chacha20-poly1305@openssh.com MAC: <implicit> compression: none
debug1: expecting SSH2_MSG_KEX_ECDH_REPLY
debug1: SSH2_MSG_KEX_ECDH_REPLY received
debug1: Server host key: ssh-rsa SHA256:jok3FH7q5LJ6qvE7iPNehBgXRw51ErE77S0Dn+Vg/Ik
debug1: load_hostkeys: fopen /c/Users/ihaiking/.ssh/known_hosts2: No such file or directory
debug1: load_hostkeys: fopen /etc/ssh/ssh_known_hosts: No such file or directory
debug1: load_hostkeys: fopen /etc/ssh/ssh_known_hosts2: No such file or directory
debug1: Host 'e.coding.net' is known and matches the RSA host key.
debug1: Found key in /c/Users/ihaiking/.ssh/known_hosts:4
debug1: rekey out after 134217728 blocks
debug1: SSH2_MSG_NEWKEYS sent
debug1: expecting SSH2_MSG_NEWKEYS
debug1: SSH2_MSG_NEWKEYS received
debug1: rekey in after 134217728 blocks
debug1: Will attempt key: /c/Users/ihaiking/.ssh/id_rsa_coding RSA SHA256:kK2YX0nksJ729lDq74VXuKF/LP7zfOzfO8fCRnUpJOo explicit
debug1: SSH2_MSG_SERVICE_ACCEPT received
debug1: Authentications that can continue: publickey
debug1: Next authentication method: publickey
debug1: Offering public key: /c/Users/ihaiking/.ssh/id_rsa_coding RSA SHA256:kK2YX0nksJ729lDq74VXuKF/LP7zfOzfO8fCRnUpJOo explicit
debug1: send_pubkey_test: no mutual signature algorithm
debug1: No more authentication methods to try.
git@e.coding.net: Permission denied (publickey).
```

### 解决方案

- 1、参考链接，添加 PubkeyAcceptedKeyTypes +ssh-rsa 配置即可
- 2、更换秘钥生成算法，使用 ed25519 算法生成 
`ssh-keygen -t ed25519 -C "your email"`
- 3、降低 OpenSSH版本