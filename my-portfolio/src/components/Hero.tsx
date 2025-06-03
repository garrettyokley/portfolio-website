'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import ScrollAnimationWrapper from './ScrollAnimationWrapper';
import { Variants } from 'framer-motion';

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Define a type for the file system structure
interface FileSystemNode {
  type: 'file' | 'dir';
  content?: string; // For files
  children?: { [name: string]: FileSystemNode }; // For directories
  permissions?: string;
  owner?: string;
  group?: string;
  size?: number;
  modified?: Date;
}

interface Directory extends FileSystemNode {
  type: 'dir';
  children: { [name: string]: FileSystemNode };
}

// Editor states
interface EditorState {
  isOpen: boolean;
  editor: 'vim' | 'nano' | 'emacs' | null;
  filename: string;
  content: string;
  mode: 'normal' | 'insert' | 'command';
  cursorLine: number;
  cursorCol: number;
  message: string;
  path: string[]; // Store the path where the editor was opened
}

const initialFileSystem: Directory = {
  type: 'dir',
  permissions: 'drwxr-xr-x',
  owner: 'root',
  group: 'root',
  children: {
    'bin': {
      type: 'dir',
      permissions: 'drwxr-xr-x',
      owner: 'root',
      group: 'root',
      children: {
        'bash': { type: 'file', content: '', permissions: '-rwxr-xr-x', owner: 'root', group: 'root' },
        'ls': { type: 'file', content: '', permissions: '-rwxr-xr-x', owner: 'root', group: 'root' },
        'cat': { type: 'file', content: '', permissions: '-rwxr-xr-x', owner: 'root', group: 'root' },
        'echo': { type: 'file', content: '', permissions: '-rwxr-xr-x', owner: 'root', group: 'root' },
        'cd': { type: 'file', content: '', permissions: '-rwxr-xr-x', owner: 'root', group: 'root' },
        'pwd': { type: 'file', content: '', permissions: '-rwxr-xr-x', owner: 'root', group: 'root' },
        'clear': { type: 'file', content: '', permissions: '-rwxr-xr-x', owner: 'root', group: 'root' },
        'whoami': { type: 'file', content: '', permissions: '-rwxr-xr-x', owner: 'root', group: 'root' },
        'date': { type: 'file', content: '', permissions: '-rwxr-xr-x', owner: 'root', group: 'root' },
        'cp': { type: 'file', content: '', permissions: '-rwxr-xr-x', owner: 'root', group: 'root' },
        'mv': { type: 'file', content: '', permissions: '-rwxr-xr-x', owner: 'root', group: 'root' },
        'rm': { type: 'file', content: '', permissions: '-rwxr-xr-x', owner: 'root', group: 'root' },
        'mkdir': { type: 'file', content: '', permissions: '-rwxr-xr-x', owner: 'root', group: 'root' },
        'rmdir': { type: 'file', content: '', permissions: '-rwxr-xr-x', owner: 'root', group: 'root' },
        'chmod': { type: 'file', content: '', permissions: '-rwxr-xr-x', owner: 'root', group: 'root' },
        'chown': { type: 'file', content: '', permissions: '-rwxr-xr-x', owner: 'root', group: 'root' },
        'ps': { type: 'file', content: '', permissions: '-rwxr-xr-x', owner: 'root', group: 'root' },
        'grep': { type: 'file', content: '', permissions: '-rwxr-xr-x', owner: 'root', group: 'root' },
        'find': { type: 'file', content: '', permissions: '-rwxr-xr-x', owner: 'root', group: 'root' },
        'tar': { type: 'file', content: '', permissions: '-rwxr-xr-x', owner: 'root', group: 'root' },
        'gzip': { type: 'file', content: '', permissions: '-rwxr-xr-x', owner: 'root', group: 'root' },
        'gunzip': { type: 'file', content: '', permissions: '-rwxr-xr-x', owner: 'root', group: 'root' },
        'touch': { type: 'file', content: '', permissions: '-rwxr-xr-x', owner: 'root', group: 'root' },
        'kill': { type: 'file', content: '', permissions: '-rwxr-xr-x', owner: 'root', group: 'root' },
        'mount': { type: 'file', content: '', permissions: '-rwxr-xr-x', owner: 'root', group: 'root' },
        'umount': { type: 'file', content: '', permissions: '-rwxr-xr-x', owner: 'root', group: 'root' },
        'su': { type: 'file', content: '', permissions: '-rwsr-xr-x', owner: 'root', group: 'root' },
        'sudo': { type: 'file', content: '', permissions: '-rwsr-xr-x', owner: 'root', group: 'root' }
      }
    },
    'sbin': {
      type: 'dir',
      permissions: 'drwxr-xr-x',
      owner: 'root',
      group: 'root',
      children: {
        'init': { type: 'file', content: '', permissions: '-rwxr-xr-x', owner: 'root', group: 'root' },
        'fsck': { type: 'file', content: '', permissions: '-rwxr-xr-x', owner: 'root', group: 'root' },
        'fdisk': { type: 'file', content: '', permissions: '-rwxr-xr-x', owner: 'root', group: 'root' },
        'iptables': { type: 'file', content: '', permissions: '-rwxr-xr-x', owner: 'root', group: 'root' }
      }
    },
    'usr': {
      type: 'dir',
      permissions: 'drwxr-xr-x',
      owner: 'root',
      group: 'root',
      children: {
        'bin': {
          type: 'dir',
          permissions: 'drwxr-xr-x',
          owner: 'root',
          group: 'root',
          children: {
            'python3': { type: 'file', content: '', permissions: '-rwxr-xr-x', owner: 'root', group: 'root' },
            'node': { type: 'file', content: '', permissions: '-rwxr-xr-x', owner: 'root', group: 'root' },
            'npm': { type: 'file', content: '', permissions: '-rwxr-xr-x', owner: 'root', group: 'root' },
            'git': { type: 'file', content: '', permissions: '-rwxr-xr-x', owner: 'root', group: 'root' },
            'vim': { type: 'file', content: '', permissions: '-rwxr-xr-x', owner: 'root', group: 'root' },
            'nano': { type: 'file', content: '', permissions: '-rwxr-xr-x', owner: 'root', group: 'root' },
            'emacs': { type: 'file', content: '', permissions: '-rwxr-xr-x', owner: 'root', group: 'root' },
            'curl': { type: 'file', content: '', permissions: '-rwxr-xr-x', owner: 'root', group: 'root' },
            'wget': { type: 'file', content: '', permissions: '-rwxr-xr-x', owner: 'root', group: 'root' },
            'htop': { type: 'file', content: '', permissions: '-rwxr-xr-x', owner: 'root', group: 'root' },
            'top': { type: 'file', content: '', permissions: '-rwxr-xr-x', owner: 'root', group: 'root' }
          }
        },
        'sbin': { type: 'dir', permissions: 'drwxr-xr-x', owner: 'root', group: 'root', children: {} },
        'local': { 
          type: 'dir', 
          permissions: 'drwxr-xr-x',
          owner: 'root',
          group: 'root',
          children: {
            'bin': { type: 'dir', permissions: 'drwxr-xr-x', owner: 'root', group: 'root', children: {} },
            'lib': { type: 'dir', permissions: 'drwxr-xr-x', owner: 'root', group: 'root', children: {} },
            'share': { type: 'dir', permissions: 'drwxr-xr-x', owner: 'root', group: 'root', children: {} }
          }
        },
        'share': { 
          type: 'dir', 
          permissions: 'drwxr-xr-x',
          owner: 'root',
          group: 'root',
          children: {
            'doc': { type: 'dir', permissions: 'drwxr-xr-x', owner: 'root', group: 'root', children: {} },
            'man': { type: 'dir', permissions: 'drwxr-xr-x', owner: 'root', group: 'root', children: {} }
          }
        },
        'lib': { type: 'dir', permissions: 'drwxr-xr-x', owner: 'root', group: 'root', children: {} },
        'include': { type: 'dir', permissions: 'drwxr-xr-x', owner: 'root', group: 'root', children: {} }
      }
    },
    'etc': {
      type: 'dir',
      permissions: 'drwxr-xr-x',
      owner: 'root',
      group: 'root',
      children: {
        'passwd': { type: 'file', content: 'root:x:0:0:root:/root:/bin/bash\ngarrettyokley:x:1000:1000:Garrett Yokley,,,:/home/garrettyokley:/bin/bash', permissions: '-rw-r--r--', owner: 'root', group: 'root' },
        'group': { type: 'file', content: 'root:x:0:\nadm:x:4:garrettyokley\nsudo:x:27:garrettyokley', permissions: '-rw-r--r--', owner: 'root', group: 'root' },
        'shadow': { type: 'file', content: 'root:*:19621:0:99999:7:::\ngarrettyokley:$6$rounds=4096$...:19621:0:99999:7:::', permissions: '-rw-------', owner: 'root', group: 'shadow' },
        'motd': { type: 'file', content: `I started working in IT nearly two years ago. The plan was to pivot into software development once I had built a strong foundation.
I\'ve had some exposure to development, including brief work training Azure AI models, but the bulk of my experience has focused on systems administration, automation, and security, learning whatever was required to keep things running.
At a smaller company, I\'ve had the freedom to take initiative. Frustrated by repetitive tasks, I began building automation for deployments, workstation and server builds, vulnerability scanning, and patching. That turned into a growing interest in DevOps and systems engineering. But I\'m not fixed on one path. I try to stay curious, stay on top of emerging technologies, and build things that solve real problems.
I\'ve now built that strong foundation, and I\'m now setting out to prove it through certifications and personal projects.\n
Try cat README.md`, permissions: '-rw-r--r--', owner: 'root', group: 'root' },
        'hosts': { type: 'file', content: '127.0.0.1\tlocalhost\n127.0.1.1\tportfolio-site\n::1\t\tlocalhost ip6-localhost ip6-loopback', permissions: '-rw-r--r--', owner: 'root', group: 'root' },
        'hostname': { type: 'file', content: 'portfolio-site', permissions: '-rw-r--r--', owner: 'root', group: 'root' },
        'fstab': { type: 'file', content: '# /etc/fstab: static file system information.\nUUID=... / ext4 defaults 0 1', permissions: '-rw-r--r--', owner: 'root', group: 'root' },
        'resolv.conf': { type: 'file', content: 'nameserver 8.8.8.8\nnameserver 8.8.4.4', permissions: '-rw-r--r--', owner: 'root', group: 'root' },
        'os-release': { type: 'file', content: 'NAME="Ubuntu"\nVERSION="22.04.3 LTS (Jammy Jellyfish)"\nID=ubuntu\nID_LIKE=debian', permissions: '-rw-r--r--', owner: 'root', group: 'root' },
        'crontab': { type: 'file', content: '# System-wide crontab file', permissions: '-rw-r--r--', owner: 'root', group: 'root' },
        'ssh': {
          type: 'dir',
          permissions: 'drwxr-xr-x',
          owner: 'root',
          group: 'root',
          children: {
            'sshd_config': { type: 'file', content: 'Port 22\nPermitRootLogin no', permissions: '-rw-r--r--', owner: 'root', group: 'root' }
          }
        },
        'systemd': { type: 'dir', permissions: 'drwxr-xr-x', owner: 'root', group: 'root', children: {} },
        'apt': { 
          type: 'dir', 
          permissions: 'drwxr-xr-x',
          owner: 'root',
          group: 'root',
          children: {
            'sources.list': { type: 'file', content: 'deb http://archive.ubuntu.com/ubuntu/ jammy main restricted', permissions: '-rw-r--r--', owner: 'root', group: 'root' }
          } 
        }
      }
    },
    'home': {
      type: 'dir',
      permissions: 'drwxr-xr-x',
      owner: 'root',
      group: 'root',
      children: {
        'garrettyokley': {
          type: 'dir',
          permissions: 'drwxr-xr-x',
          owner: 'garrettyokley',
          group: 'garrettyokley',
          children: {
            'README.md': {
              type: 'file',
              content: `This is an interactive Ubuntu terminal. It will serve as the home of all of my future projects and certifications.\n
Use help to see what functionality is available.
Try opening my resume with 'cat ~/Documents/Garrett Yokley.pdf or 'xdg-open ~/Documents/Garrett Yokley.pdf'
Try launching a certification PDF with 'xdg-open ~/Documents/Certs/Security+, CompTIA.pdf'
Try bricking your system by running 'sudo rm -rf / --no-preserve-root' (Password:Password)`,
              permissions: '-rw-r--r--',
              owner: 'garrettyokley',
              group: 'garrettyokley',
              size: 0,
              modified: new Date()
            },
            'Desktop': { type: 'dir', permissions: 'drwxr-xr-x', owner: 'garrettyokley', group: 'garrettyokley', children: {} },
            'Documents': {
              type: 'dir',
              permissions: 'drwxr-xr-x',
              owner: 'garrettyokley',
              group: 'garrettyokley',
              children: {
                'Certs': {
                  type: 'dir',
                  permissions: 'drwxr-xr-x',
                  owner: 'garrettyokley',
                  group: 'garrettyokley',
                  children: {
                    'Security+, CompTIA.pdf': { type: 'file', content: 'CompTIA Security+ Certification\n\nCertification Details:\nIssued by: CompTIA\nCertification ID: [Completed]\nValid until: [Active]', permissions: '-rw-r--r--', owner: 'garrettyokley', group: 'garrettyokley' },
                    'Linux+, CompTIA.pdf': { type: 'file', content: 'CompTIA Linux+ Certification\n\nStatus: Coming June 7, 2025\n\nThis certification validates advanced Linux administration skills and knowledge.', permissions: '-rw-r--r--', owner: 'garrettyokley', group: 'garrettyokley' },
                    'Linux Essentials (LPI-1), Linux Professional Institute.pdf': { type: 'file', content: 'Linux Professional Institute - Linux Essentials\n\nStatus: Coming June 28, 2025\n\nFoundational certification covering Linux basics and essential skills.', permissions: '-rw-r--r--', owner: 'garrettyokley', group: 'garrettyokley' },
                    'ITIL4, Information Technology Infrastructure Library.pdf': { type: 'file', content: 'ITIL 4 Foundation Certification\n\nCertification Details:\nIssued by: AXELOS\nCertification ID: [Completed]\nValid until: [Active]', permissions: '-rw-r--r--', owner: 'garrettyokley', group: 'garrettyokley' },
                    'CCNA, Cisco.pdf': { type: 'file', content: 'Cisco Certified Network Associate (CCNA)\n\nStatus: Coming July 12, 2025\n\nCertification covering networking fundamentals, routing, switching, and network security.', permissions: '-rw-r--r--', owner: 'garrettyokley', group: 'garrettyokley' },
                    'RHCSA, Red Hat.pdf': { type: 'file', content: 'Red Hat Certified System Administrator (RHCSA)\n\nStatus: Coming 2025\n\nHands-on certification demonstrating practical Linux system administration skills on Red Hat Enterprise Linux.', permissions: '-rw-r--r--', owner: 'garrettyokley', group: 'garrettyokley' }
                  }
                },
                'Projects': {
                  type: 'dir',
                  permissions: 'drwxr-xr-x',
                  owner: 'garrettyokley',
                  group: 'garrettyokley',
                  children: {
                    'Chess Game': { type: 'file', content: '#!/usr/bin/env xdg-open\n# Interactive Chess Game\nURL=/chess.html', permissions: '-rwxr-xr-x', owner: 'garrettyokley', group: 'garrettyokley' }
                  }
                },
                'Education': {
                  type: 'dir',
                  permissions: 'drwxr-xr-x',
                  owner: 'garrettyokley',
                  group: 'garrettyokley',
                  children: {
                    'Bachelor of Science in Computer Science, WGU.pdf': { type: 'file', content: 'Bachelor of Science in Computer Science\nWestern Governors University\n\nStatus: Coming September 2025\n\nCompetency-based degree program covering software development, algorithms, data structures, database design, and computer science fundamentals.', permissions: '-rw-r--r--', owner: 'garrettyokley', group: 'garrettyokley' }
                  }
                },
                'Links': {
                  type: 'dir',
                  permissions: 'drwxr-xr-x',
                  owner: 'garrettyokley',
                  group: 'garrettyokley',
                  children: {
                    'LinkedIn': { type: 'file', content: '#!/usr/bin/env xdg-open\n# LinkedIn Profile\nURL=https://linkedin.com/in/garrett-yokley', permissions: '-rwxr-xr-x', owner: 'garrettyokley', group: 'garrettyokley' },
                    'GitHub': { type: 'file', content: '#!/usr/bin/env xdg-open\n# GitHub Profile\nURL=https://github.com/garrettyokley', permissions: '-rwxr-xr-x', owner: 'garrettyokley', group: 'garrettyokley' },
                    'Email': { type: 'file', content: '#!/usr/bin/env xdg-open\n# Email Contact\nURL=mailto:garrett@example.com', permissions: '-rwxr-xr-x', owner: 'garrettyokley', group: 'garrettyokley' },
                    'Portfolio': { type: 'file', content: '#!/usr/bin/env xdg-open\n# Portfolio Website\nURL=http://localhost:3000', permissions: '-rwxr-xr-x', owner: 'garrettyokley', group: 'garrettyokley' }
                  }
                },
                'Garrett Yokley.pdf': { type: 'file', content: `Garrett Yokley – Systems Administrator
(678) 523-6062 • garrettyokley@protonmail.com • http://www.linkedin.com/in/garrettyokley
Systems Administrator skilled in securing hybrid infrastructure and automating critical processes, passionate about exploring AI-driven solutions and machine learning.
EDUCATION
Bachelor of Science in Computer Science - Western Governors University (Graduating 09/25)
CERTIFICATIONS
•	Security+, CompTIA
•	Linux+, CompTIA (Scheduled 06/2025)
•	Linux Essentials (LPI-1), Linux Professional Institute (Scheduled 06/2025)
•	ITIL4, Information Technology Infrastructure Library
•	CCNA, Cisco (Scheduled 07/2025)
WORK EXPERIENCE
Docufree Corporation - 09/2023 - Present
•	Administer Windows Server, Linux, and FreeBSD systems, managing DNS, Active Directory, Microsoft 365, and Exchange Online for large-scale infrastructure.
•	Manage virtualization and security operations, including VMware ESXi, Hyper-V clustering, Veeam backups, Linux vulnerability management, and FortiGate firewall maintenance.
•	Partner with development to deploy and troubleshoot IIS web services and Android applications.
•	Deployed a FOG Project imaging server, automating workstation and server deployments and eliminating manual build processes.
•	Deployed TinyProxy and Squid proxy servers and configured E2Guardian for web content filtering in a secured production environment.
•	Automated app deployments using PDQ Deploy and PowerShell, streamlining environment standardization and eliminating hours of manual configuration.
•	Reverse-engineered and rebuilt undocumented scanning workflows, integrating SMB shares on TrueNAS, retiring a legacy Windows Server 2008 file server, and averting a company-wide production outage and large-scale data loss.
•	Assisted in the end-to-end deployment of an enterprise-grade FortiGate firewall, working as remote hands to configure and bring the device online from its initial state.
•	Explored Azure AI and Azure ML under senior developer guidance, applying statistical techniques like confidence intervals.
SKILLS
•	Network Infrastructure & Security: Entra ID • ZFS • Ubuntu • Debian • Microsoft SSMS • MySQL • DFS • Network Troubleshooting • VPN • Load balancers • VLAN Configuration • OpenSSH • NFS • FTP/SFTP • Rapid7 Vulnerability Management
•	Development and Automation: Bash • Git • GitHub • GitLab • REST APIs • Python • Java • Node.js • Next.js • Angular • Bootstrap • Azure ML • Azure AI • Hibernate • Spring Data JPA • Vim • Excel Macros & Visual Basic
`, permissions: '-rw-r--r--', owner: 'garrettyokley', group: 'garrettyokley' }
              },
            },
            'Downloads': { type: 'dir', permissions: 'drwxr-xr-x', owner: 'garrettyokley', group: 'garrettyokley', children: {} },
            'Music': { type: 'dir', permissions: 'drwxr-xr-x', owner: 'garrettyokley', group: 'garrettyokley', children: {} },
            'Pictures': { type: 'dir', permissions: 'drwxr-xr-x', owner: 'garrettyokley', group: 'garrettyokley', children: {} },
            'Videos': { type: 'dir', permissions: 'drwxr-xr-x', owner: 'garrettyokley', group: 'garrettyokley', children: {} },
            'Public': { type: 'dir', permissions: 'drwxr-xr-x', owner: 'garrettyokley', group: 'garrettyokley', children: {} },
            'Templates': { type: 'dir', permissions: 'drwxr-xr-x', owner: 'garrettyokley', group: 'garrettyokley', children: {} },
            '.bash_logout': { type: 'file', content: '# ~/.bash_logout: executed by bash(1) when login shell exits.\n\n# Clear the console when logging out\nif [ "$SHLVL" = 1 ]; then\n    [ -x /usr/bin/clear_console ] && /usr/bin/clear_console -q\nfi', permissions: '-rw-r--r--', owner: 'garrettyokley', group: 'garrettyokley' },
            '.bashrc': { type: 'file', content: '# ~/.bashrc: executed by bash(1) for non-login shells.\n\n# If not running interactively, don\'t do anything\ncase $- in\n    *i*) ;;\n      *) return;;\nesac\n\n# Make less more friendly for non-text input files\n[ -x /usr/bin/lesspipe ] && eval "$(SHELL=/bin/sh lesspipe)"\n\n# Set variable identifying the chroot you work in\nif [ -z "${debian_chroot:-}" ] && [ -r /etc/debian_chroot ]; then\n    debian_chroot=$(cat /etc/debian_chroot)\nfi\n\nPS1="[\\u@\\h \\W]\\$ "\n\nalias ll=\'ls -alF\'\nalias la=\'ls -A\'\nalias l=\'ls -CF\'', permissions: '-rw-r--r--', owner: 'garrettyokley', group: 'garrettyokley' },
            '.profile': { type: 'file', content: '# ~/.profile: executed by the command interpreter for login shells.\n\n# If running bash\nif [ -n "$BASH_VERSION" ]; then\n    # Include .bashrc if it exists\n    if [ -f "$HOME/.bashrc" ]; then\n        . "$HOME/.bashrc"\n    fi\nfi\n\n# Set PATH so it includes user\'s private bin if it exists\nif [ -d "$HOME/bin" ] ; then\n    PATH="$HOME/bin:$PATH"\nfi\n\n# Set PATH so it includes user\'s private bin if it exists\nif [ -d "$HOME/.local/bin" ] ; then\n    PATH="$HOME/.local/bin:$PATH"\nfi', permissions: '-rw-r--r--', owner: 'garrettyokley', group: 'garrettyokley' },
            '.cache': { type: 'dir', permissions: 'drwxr-xr-x', owner: 'garrettyokley', group: 'garrettyokley', children: {} },
            '.config': {
              type: 'dir',
              permissions: 'drwxr-xr-x',
              owner: 'garrettyokley',
              group: 'garrettyokley',
              children: {
                'gtk-3.0': { type: 'dir', permissions: 'drwxr-xr-x', owner: 'garrettyokley', group: 'garrettyokley', children: {} },
                'dconf': { type: 'dir', permissions: 'drwxr-xr-x', owner: 'garrettyokley', group: 'garrettyokley', children: {} }
              }
            },
            '.local': {
              type: 'dir',
              permissions: 'drwxr-xr-x',
              owner: 'garrettyokley',
              group: 'garrettyokley',
              children: {
                'share': { type: 'dir', permissions: 'drwxr-xr-x', owner: 'garrettyokley', group: 'garrettyokley', children: {} },
                'bin': { type: 'dir', permissions: 'drwxr-xr-x', owner: 'garrettyokley', group: 'garrettyokley', children: {} }
              }
            },
            '.ssh': {
              type: 'dir',
              permissions: 'drwx------',
              owner: 'garrettyokley',
              group: 'garrettyokley',
              children: {
                'known_hosts': { type: 'file', content: 'github.com ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC7...', permissions: '-rw-r--r--', owner: 'garrettyokley', group: 'garrettyokley' },
                'config': { type: 'file', content: 'Host github.com\n    HostName github.com\n    User git\n    IdentityFile ~/.ssh/id_rsa', permissions: '-rw-------', owner: 'garrettyokley', group: 'garrettyokley' }
              }
            },
            '.gnupg': { type: 'dir', permissions: 'drwx------', owner: 'garrettyokley', group: 'garrettyokley', children: {} },
            '.mozilla': { type: 'dir', permissions: 'drwxr-xr-x', owner: 'garrettyokley', group: 'garrettyokley', children: {} }
          }
        }
      }
    },
    'var': {
      type: 'dir',
      permissions: 'drwxrwxr-x',
      owner: 'root',
      group: 'root',
      children: {
        'log': {
          type: 'dir',
          permissions: 'drwxrwxr-x',
          owner: 'root',
          group: 'syslog',
          children: {
            'syslog': { type: 'file', content: 'System log entries...', permissions: '-rw-r-----', owner: 'syslog', group: 'adm' },
            'auth.log': { type: 'file', content: 'Authentication log entries...', permissions: '-rw-r-----', owner: 'syslog', group: 'adm' },
            'kern.log': { type: 'file', content: 'Kernel log entries...', permissions: '-rw-r-----', owner: 'syslog', group: 'adm' },
            'dpkg.log': { type: 'file', content: 'Package management log...', permissions: '-rw-r--r--', owner: 'root', group: 'root' }
          }
        },
        'www': {
          type: 'dir',
          permissions: 'drwxr-xr-x',
          owner: 'root',
          group: 'root',
          children: {
            'html': {
              type: 'dir',
              permissions: 'drwxr-xr-x',
              owner: 'www-data',
              group: 'www-data',
              children: {
                'index.html': { type: 'file', content: '<html><body><h1>Apache2 Ubuntu Default Page</h1></body></html>', permissions: '-rw-r--r--', owner: 'www-data', group: 'www-data' }
              }
            }
          }
        },
        'lib': { type: 'dir', permissions: 'drwxr-xr-x', owner: 'root', group: 'root', children: {} },
        'cache': { type: 'dir', permissions: 'drwxr-xr-x', owner: 'root', group: 'root', children: {} },
        'tmp': { type: 'dir', permissions: 'drwxrwxrwt', owner: 'root', group: 'root', children: {} },
        'spool': { type: 'dir', permissions: 'drwxr-xr-x', owner: 'root', group: 'root', children: {} }
      }
    },
    'lib': { type: 'dir', permissions: 'drwxr-xr-x', owner: 'root', group: 'root', children: {} },
    'lib64': { type: 'dir', permissions: 'drwxr-xr-x', owner: 'root', group: 'root', children: {} },
    'tmp': { type: 'dir', permissions: 'drwxrwxrwt', owner: 'root', group: 'root', children: {} },
    'opt': { type: 'dir', permissions: 'drwxr-xr-x', owner: 'root', group: 'root', children: {} },
    'srv': { type: 'dir', permissions: 'drwxr-xr-x', owner: 'root', group: 'root', children: {} },
    'media': { type: 'dir', permissions: 'drwxr-xr-x', owner: 'root', group: 'root', children: {} },
    'mnt': { type: 'dir', permissions: 'drwxr-xr-x', owner: 'root', group: 'root', children: {} },
    'proc': { type: 'dir', permissions: 'dr-xr-xr-x', owner: 'root', group: 'root', children: {} },
    'sys': { type: 'dir', permissions: 'drwxr-xr-x', owner: 'root', group: 'root', children: {} },
    'dev': { type: 'dir', permissions: 'drwxr-xr-x', owner: 'root', group: 'root', children: {} },
    'boot': { type: 'dir', permissions: 'drwxr-xr-x', owner: 'root', group: 'root', children: {} },
    'root': {
      type: 'dir',
      permissions: 'drwx------',
      owner: 'root',
      group: 'root',
      children: {
        '.bash_logout': { type: 'file', content: '# ~/.bash_logout: executed by bash(1) when login shell exits.', permissions: '-rw-r--r--', owner: 'root', group: 'root' },
        '.bashrc': { type: 'file', content: '# ~/.bashrc: executed by bash(1) for non-login shells.', permissions: '-rw-r--r--', owner: 'root', group: 'root' },
        '.profile': { type: 'file', content: '# ~/.profile: executed by the command interpreter for login shells.', permissions: '-rw-r--r--', owner: 'root', group: 'root' }
      }
    }
  }
};

const TerminalText: React.FC<{
  children: React.ReactNode;
  delay?: number;
  isOutput?: boolean;
  textType?: 'normal' | 'info' | 'error' | 'dim';
}> = ({ children, delay = 0, isOutput = false, textType = 'normal' }) => {
  const getTextColor = () => {
    if (!isOutput) return 'text-[#00ff00]'; // Main green for commands
    
    switch (textType) {
      case 'info': 
        return 'text-[#00ffff]'; // Cyan for info
      case 'error': 
        return 'text-[#ff3333]'; // Bright red for errors
      case 'dim': 
        return 'text-[#00aa00]'; // Darker green for subdued text
      default: 
        return 'text-white'; // White for regular output
    }
  };

  const getTextShadow = () => {
    if (!isOutput) return { textShadow: '0 0 10px rgba(0, 255, 0, 0.5)' };
    
    switch (textType) {
      case 'info': 
        return { textShadow: '0 0 10px rgba(0, 255, 255, 0.5)' };
      case 'error': 
        return { textShadow: '0 0 10px rgba(255, 51, 51, 0.5)' };
      default: 
        return {};
    }
  };

  return (
    <ScrollAnimationWrapper animationVariants={fadeInUp} transition={{ delay, duration: 0.3 }}>
      <div 
        className={`font-mono whitespace-pre-wrap ${getTextColor()} mb-1`}
        style={{ cursor: 'default', ...getTextShadow() }}
      >
        {children}
          </div>
    </ScrollAnimationWrapper>
  );
};

const renderPrompt = (prompt: string) => {
  // Parse Ubuntu-style prompt: username@hostname:path$ 
  const match = prompt.match(/^([^@]+)@([^:]+):([^$]+)\$\s*$/);
  
  if (match) {
    const [, username, hostname, path] = match;
    return (
      <span>
        <span style={{ color: '#00ff00', textShadow: '0 0 10px rgba(0, 255, 0, 0.5)' }}>{username}@{hostname}</span>
        <span style={{ color: 'white' }}>:</span>
        <span style={{ color: '#5555ff', textShadow: '0 0 8px rgba(85, 85, 255, 0.5)' }}>{path}</span>
        <span style={{ color: 'white' }}>$ </span>
      </span>
    );
  }
  
  // Fallback to original green styling if parsing fails
  return <span style={{ color: '#00ff00', textShadow: '0 0 10px rgba(0, 255, 0, 0.5)' }}>{prompt}</span>;
};

const TerminalInput: React.FC<{
  prompt: string;
  value: string;
  cursorPosition: number;
  onChange: (value: string, cursorPos: number) => void;
  onEnter: () => void;
  onTab: () => void;
  onHistoryUp: () => void;
  onHistoryDown: () => void;
  delay?: number;
  isPasswordMode?: boolean;
}> = ({ prompt, value, cursorPosition, onChange, onEnter, onTab, onHistoryUp, onHistoryDown, delay = 0, isPasswordMode = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(true);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!focused || isPasswordMode) return; // Don't handle keys in password mode
      
      e.preventDefault();
      
      // Just handle basic terminal input - other modes will be handled by Hero component
      switch (e.key) {
        case 'Enter':
          onEnter();
          break;
        case 'Tab':
          onTab();
          break;
        case 'ArrowLeft':
          if (cursorPosition > 0) {
            onChange(value, cursorPosition - 1);
          }
          break;
        case 'ArrowRight':
          if (cursorPosition < value.length) {
            onChange(value, cursorPosition + 1);
          }
          break;
        case 'ArrowUp':
          onHistoryUp();
          break;
        case 'ArrowDown':
          onHistoryDown();
          break;
        case 'Home':
          onChange(value, 0);
          break;
        case 'End':
          onChange(value, value.length);
          break;
        case 'Backspace':
          if (cursorPosition > 0) {
            const newValue = value.slice(0, cursorPosition - 1) + value.slice(cursorPosition);
            onChange(newValue, cursorPosition - 1);
          }
          break;
        case 'Delete':
          if (cursorPosition < value.length) {
            const newValue = value.slice(0, cursorPosition) + value.slice(cursorPosition + 1);
            onChange(newValue, cursorPosition);
          }
          break;
        default:
          if (e.key.length === 1) {
            const newValue = value.slice(0, cursorPosition) + e.key + value.slice(cursorPosition);
            onChange(newValue, cursorPosition + 1);
          }
          break;
      }
    };

    const handleClick = () => {
      setFocused(true);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleClick);
    };
  }, [value, cursorPosition, onChange, onEnter, onTab, onHistoryUp, onHistoryDown, focused, isPasswordMode]);

  // For password input, use the already-masked value directly
  const displayValue = value; // This will already be masked if it's a password
  const beforeCursor = displayValue.slice(0, cursorPosition);
  const afterCursor = displayValue.slice(cursorPosition);

  const renderText = (text: string) => {
    return text.replace(/ /g, '\u00A0'); // Replace spaces with non-breaking spaces
  };

  return (
    <ScrollAnimationWrapper animationVariants={fadeInUp} transition={{ delay, duration: 0.3 }}>
      <div 
        ref={containerRef}
        className="font-mono mb-1 flex items-center"
        style={{ cursor: 'default', whiteSpace: 'pre' }}
      >
        {prompt && renderPrompt(prompt)}
        <span style={{ color: 'white' }}>{renderText(beforeCursor)}</span>
        <span className="bg-white text-black animate-pulse inline-block" style={{ width: '0.6em', height: '1.2em', lineHeight: '1.2em' }}>
          &nbsp;
        </span>
        <span style={{ color: 'white' }}>{renderText(afterCursor.slice(1))}</span>
      </div>
    </ScrollAnimationWrapper>
  );
};

const Hero: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string[]>(['/', 'home', 'garrettyokley']);
  
  // For initial server render, use a placeholder for the dynamic part.
  const initialWelcomeTextWithPlaceholder = `Welcome to my portfolio website!\nThis is an interactive Ubuntu terminal\nType 'help' for a list of available commands.\nLast login: [timestamp placeholder]`;

  const [username, setUsername] = useState('garrettyokley');
  const [isRoot, setIsRoot] = useState(false);

  const getPrompt = () => {
    let pathDisplay;
    if (currentPath.length === 1 && currentPath[0] === '/') {
      pathDisplay = '/';
    } else {
      const pathSegments = currentPath.slice(1); 
      pathDisplay = '/' + pathSegments.join('/');
    }
    const shortPath = pathDisplay.replace(`/home/${username}`, '~');
    const currentUser = isRoot ? 'root' : username;
    const hostname = 'portfolio-site';
    return `${currentUser}@${hostname}:${shortPath}$ `;
  };

  const [lines, setLines] = useState<React.ReactNode[]>(() => {
    const motdContent = initialFileSystem.children?.etc?.children?.motd?.content || '';
    const currentPromptText = getPrompt(); 

    return [
      // Use the version with the placeholder for initial render
      <React.Fragment key="welcome">{initialWelcomeTextWithPlaceholder}</React.Fragment>,
      <div key="motd-prompt" className="font-mono mb-1 flex items-center">
        {renderPrompt(currentPromptText)}
        <span style={{ color: 'white' }}>cat /etc/motd</span>
      </div>,
      <TerminalText key="motd-content" isOutput>{motdContent}</TerminalText>,
    ];
  });
  const [currentInput, setCurrentInput] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [fileSystem, setFileSystem] = useState<Directory>(initialFileSystem);
  const [editor, setEditor] = useState<EditorState>({
    isOpen: false,
    editor: null,
    filename: '',
    content: '',
    mode: 'normal',
    cursorLine: 0,
    cursorCol: 0,
    message: '',
    path: ['/']
  });
  const [sudoState, setSudoState] = useState<{
    isWaitingForPassword: boolean;
    pendingCommand: string;
    pendingPath: string[];
    attempts: number;
  }>({
    isWaitingForPassword: false,
    pendingCommand: '',
    pendingPath: [],
    attempts: 0
  });
  const [systemBricked, setSystemBricked] = useState(false);
  
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // useEffect to update the welcome message with client-side date/time after hydration
  useEffect(() => {
    const loginTime = new Date().toLocaleTimeString();
    const loginDate = new Date().toLocaleDateString();
    // Construct the full dynamic message
    const dynamicWelcomeMessage = `Welcome to my portfolio website!\nThis is an interactive Ubuntu terminal\nType 'help' for a list of available commands.\nLast login: ${loginTime} on ${loginDate}`;

    setLines(prevLines => {
      const newLines = [...prevLines];
      // Find the welcome message React Fragment and update its children
      const welcomeIndex = newLines.findIndex(
        line => React.isValidElement(line) && line.key === "welcome"
      );
      if (welcomeIndex !== -1) {
        newLines[welcomeIndex] = <React.Fragment key="welcome">{dynamicWelcomeMessage}</React.Fragment>;
      }
      return newLines;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount (client-side only)

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "auto", block: "end" });
  }, [lines]);

  // File system modification functions
  const updateFileSystem = (newFs: Directory) => {
    setFileSystem(newFs);
  };

  // Permission checking helper
  const hasWritePermission = (path: string[], target?: string): boolean => {
    // Root can do anything
    if (isRoot) return true;
    
    let currentDir = fileSystem;
    const pathSegments = path.slice(1); // Remove leading '/'
    
    // Navigate to the directory
    for (const segment of pathSegments) {
      if (currentDir.children && currentDir.children[segment] && currentDir.children[segment].type === 'dir') {
        currentDir = currentDir.children[segment] as Directory;
      } else {
        return false;
      }
    }
    
    // Check if trying to modify a specific file/directory
    if (target && currentDir.children && currentDir.children[target]) {
      const targetNode = currentDir.children[target];
      // Can only modify if user owns the file or it's in their home directory
      return targetNode.owner === username || path.includes('garrettyokley');
    }
    
    // Check if user can write to the directory
    return currentDir.owner === username || path.includes('garrettyokley');
  };

  const updateFileContent = (path: string[], filename: string, content: string): boolean => {
    // Check write permission for the specific file
    if (!hasWritePermission(path, filename)) {
      return false;
    }
    
    try {
      const newFs = JSON.parse(JSON.stringify(fileSystem));
      let currentDir = newFs;
      
      // Navigate to the directory
      for (const segment of path.slice(1)) {
        if (currentDir.children && currentDir.children[segment] && currentDir.children[segment].type === 'dir') {
          currentDir = currentDir.children[segment] as Directory;
        } else {
          return false;
        }
      }
      
      // Update the file content
      if (currentDir.children && currentDir.children[filename] && currentDir.children[filename].type === 'file') {
        currentDir.children[filename].content = content;
        updateFileSystem(newFs);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const createFile = (path: string[], filename: string, content: string = '', permissions: string = '-rw-r--r--'): boolean => {
    // Check write permission first
    if (!hasWritePermission(path)) {
      return false;
    }
    
    try {
      const newFs = JSON.parse(JSON.stringify(fileSystem));
      let currentDir = newFs;
      
      // Navigate to the directory
      for (const segment of path.slice(1)) {
        if (currentDir.children && currentDir.children[segment] && currentDir.children[segment].type === 'dir') {
          currentDir = currentDir.children[segment] as Directory;
        } else {
          return false;
        }
      }
      
      // Create the file
      if (currentDir.children) {
        currentDir.children[filename] = {
          type: 'file',
          content,
          permissions,
          owner: isRoot ? 'root' : username,
          group: isRoot ? 'root' : username
        };
        updateFileSystem(newFs);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const createDirectory = (path: string[], dirname: string, permissions: string = 'drwxr-xr-x'): boolean => {
    // Check write permission first
    if (!hasWritePermission(path)) {
      return false;
    }
    
    try {
      const newFs = JSON.parse(JSON.stringify(fileSystem));
      let currentDir = newFs;
      
      // Navigate to the directory
      for (const segment of path.slice(1)) {
        if (currentDir.children && currentDir.children[segment] && currentDir.children[segment].type === 'dir') {
          currentDir = currentDir.children[segment] as Directory;
        } else {
          return false;
        }
      }
      
      // Create the directory
      if (currentDir.children) {
        currentDir.children[dirname] = {
          type: 'dir',
          permissions,
          owner: isRoot ? 'root' : username,
          group: isRoot ? 'root' : username,
          children: {}
        };
        updateFileSystem(newFs);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const deleteFile = (path: string[], filename: string): boolean => {
    // Check write permission for the specific file
    if (!hasWritePermission(path, filename)) {
      return false;
    }
    
    try {
      const newFs = JSON.parse(JSON.stringify(fileSystem));
      let currentDir = newFs;
      
      // Navigate to the directory
      for (const segment of path.slice(1)) {
        if (currentDir.children && currentDir.children[segment] && currentDir.children[segment].type === 'dir') {
          currentDir = currentDir.children[segment] as Directory;
        } else {
          return false;
        }
      }
      
      // Delete the file/directory
      if (currentDir.children && currentDir.children[filename]) {
        delete currentDir.children[filename];
        updateFileSystem(newFs);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const deleteDirectoryRecursive = (path: string[], dirname: string): boolean => {
    // Check write permission for the specific directory
    if (!hasWritePermission(path, dirname)) {
      return false;
    }
    
    try {
      const newFs = JSON.parse(JSON.stringify(fileSystem));
      let currentDir = newFs;
      
      // Navigate to the parent directory
      for (const segment of path.slice(1)) {
        if (currentDir.children && currentDir.children[segment] && currentDir.children[segment].type === 'dir') {
          currentDir = currentDir.children[segment] as Directory;
        } else {
          return false;
        }
      }
      
      // Delete the directory recursively
      if (currentDir.children && currentDir.children[dirname]) {
        delete currentDir.children[dirname];
        updateFileSystem(newFs);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const brickSystem = (): void => {
    // This will completely wipe the file system - dangerous!
    const emptyFs: Directory = {
      type: 'dir',
      permissions: 'drwxr-xr-x',
      owner: 'root',
      group: 'root',
      children: {}
    };
    updateFileSystem(emptyFs);
    setCurrentPath(['/']);
    
    // Trigger Terry Davis easter egg after a delay
    setTimeout(() => {
      setSystemBricked(true);
    }, 3000); // 3 second delay to let the destruction messages show
  };

  // Text Editor Component
  const TextEditor: React.FC = () => {
    if (!editor.isOpen) return null;

    const handleEditorKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      
      if (editor.editor === 'vim') {
        handleVimKeyPress(e);
      } else if (editor.editor === 'nano') {
        handleNanoKeyPress(e);
      }
    };

    const handleVimKeyPress = (e: KeyboardEvent) => {
      if (editor.mode === 'normal') {
        switch (e.key) {
          case 'i':
            setEditor(prev => ({ ...prev, mode: 'insert', message: '-- INSERT --' }));
            break;
          case ':':
            setEditor(prev => ({ ...prev, mode: 'command', message: ':' }));
            break;
          case 'q':
            if (e.shiftKey) { // :q!
              closeEditor();
            }
            break;
          case 'Escape':
            setEditor(prev => ({ ...prev, mode: 'normal', message: '' }));
            break;
        }
      } else if (editor.mode === 'insert') {
        if (e.key === 'Escape') {
          setEditor(prev => ({ ...prev, mode: 'normal', message: '' }));
        } else if (e.key === 'Backspace') {
          setEditor(prev => ({ ...prev, content: prev.content.slice(0, -1) }));
        } else if (e.key.length === 1) {
          setEditor(prev => ({ ...prev, content: prev.content + e.key }));
        }
      } else if (editor.mode === 'command') {
        if (e.key === 'Enter') {
          const command = editor.message.slice(1); // Remove ':'
          if (command === 'w' || command === 'wq') {
            saveFile();
            if (command === 'wq') closeEditor();
          } else if (command === 'q!' || command === 'quit') {
            closeEditor();
          }
          setEditor(prev => ({ ...prev, mode: 'normal', message: '' }));
        } else if (e.key === 'Escape') {
          setEditor(prev => ({ ...prev, mode: 'normal', message: '' }));
        } else if (e.key === 'Backspace') {
          setEditor(prev => ({ ...prev, message: prev.message.slice(0, -1) }));
        } else if (e.key.length === 1) {
          setEditor(prev => ({ ...prev, message: prev.message + e.key }));
        }
      }
    };

    const handleNanoKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey) {
        switch (e.key) {
          case 'o': // Save
            saveFile();
            setEditor(prev => ({ ...prev, message: 'File saved' }));
            break;
          case 'x': // Exit
            saveFile();
            closeEditor();
            break;
          case 'k': // Cut line
            setEditor(prev => ({ ...prev, content: '', message: 'Line cut' }));
            break;
        }
      } else if (e.key === 'Backspace') {
        setEditor(prev => ({ ...prev, content: prev.content.slice(0, -1) }));
      } else if (e.key.length === 1) {
        setEditor(prev => ({ ...prev, content: prev.content + e.key }));
      }
    };

    const saveFile = () => {
      updateFileContent(editor.path, editor.filename, editor.content);
    };

    const closeEditor = () => {
      setEditor({
        isOpen: false,
        editor: null,
        filename: '',
        content: '',
        mode: 'normal',
        cursorLine: 0,
        cursorCol: 0,
        message: '',
        path: ['/']
      });
    };

    useEffect(() => {
      document.addEventListener('keydown', handleEditorKeyDown);
      return () => document.removeEventListener('keydown', handleEditorKeyDown);
    }, [handleEditorKeyDown]);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
        <div className="bg-black border border-green-500 rounded-md w-4/5 h-4/5 flex flex-col">
          <div className="bg-green-900 text-white px-4 py-2 text-sm">
            {editor.editor?.toUpperCase()} - {editor.filename} {editor.mode !== 'normal' && `(${editor.mode})`}
          </div>
          <div className="flex-1 p-4 font-mono text-green-400 whitespace-pre-wrap overflow-auto">
            {editor.content}
            <span className="bg-green-400 text-black">_</span>
          </div>
          <div className="bg-gray-900 text-white px-4 py-2 text-sm">
            {editor.message}
            {editor.editor === 'nano' && (
              <div className="mt-1">
                ^O Save  ^X Exit  ^K Cut
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "auto", block: "end" });
  }, [lines]);

  // Removed unused helper functions

  const colorFileName = (name: string, node: FileSystemNode, index: number): React.ReactNode => {
    
    if (node.type === 'dir') {
      // Directories in cyan
      return <span key={`dir-${index}`} style={{ color: '#00ffff', textShadow: '0 0 8px rgba(0, 255, 255, 0.5)' }}>{name}</span>;
    } else if (node.content?.startsWith('#!/')) {
      // Executable files in bright green with glow
      return <span key={`exec-${index}`} style={{ color: '#00ff00', textShadow: '0 0 8px rgba(0, 255, 0, 0.5)' }}>{name}</span>;
    } else {
      // All files (including PDFs, hidden files, text files, etc.) in white
      return <span key={`file-${index}`} style={{ color: 'white' }}>{name}</span>;
    }
  };

  const getCompletions = (partial: string): string[] => {
    // Handle command chains with && - simulate path changes
    let contextPath = [...currentPath];
    let currentCommand = partial;
    
    if (partial.includes(' && ')) {
      const chainParts = partial.split(' && ');
      currentCommand = chainParts[chainParts.length - 1].trim();
      
      // Simulate path changes from previous commands in the chain
      for (let i = 0; i < chainParts.length - 1; i++) {
        const cmd = chainParts[i].trim();
        const [cmdName, ...args] = cmd.split(/\s+/);
        
        if (cmdName.toLowerCase() === 'cd') {
          contextPath = simulatePathChange(contextPath, args[0]);
        }
      }
    }
    
    const parts = currentCommand.split(' ');
    let lastPart = parts[parts.length - 1];
    
    // Remove quotes from the last part for matching
    if ((lastPart.startsWith('"') && !lastPart.endsWith('"')) || 
        (lastPart.startsWith("'") && !lastPart.endsWith("'"))) {
      lastPart = lastPart.slice(1);
    } else if ((lastPart.startsWith('"') && lastPart.endsWith('"')) || 
               (lastPart.startsWith("'") && lastPart.endsWith("'"))) {
      lastPart = lastPart.slice(1, -1);
    }
    
    // Handle path completion in file arguments (cd path/to/dir<TAB>)
    if (lastPart.includes('/')) {
      return getPathCompletions(lastPart, contextPath);
    }
    
    if (parts.length === 1) {
      // Command completion
      const commands = [
        'help', 'ls', 'cd', 'cat', 'echo', 'clear', 'whoami', 'date', 'pwd', 'open', 'xdg-open',
        'certifications', 'certs', 'projects', 'links', 'portfolio', 'education',
        'security-plus', 'itil4', 'linux-plus', 'linux-essentials', 'ccna', 'rhcsa', 'bachelor',
        'l', 'll', 'la'  // aliases
      ];
      return commands.filter(cmd => cmd.toLowerCase().startsWith(lastPart.toLowerCase()));
    } else {
      // File/directory completion using context path
      return getDirectoryCompletions(lastPart, contextPath);
    }
  };

  const simulatePathChange = (currentPath: string[], pathArg: string | undefined): string[] => {
    if (!pathArg || pathArg === '~') {
      return ['/', 'home', 'garrettyokley'];
    } else if (pathArg === '/') {
      return ['/'];
    } else if (pathArg === '..') {
      return currentPath.length > 1 ? currentPath.slice(0, -1) : currentPath;
    } else if (pathArg.startsWith('/')) {
      // Absolute path
      const pathSegments = pathArg.split('/').filter(s => s !== '');
      if (isValidPath(['/', ...pathSegments])) {
        return ['/', ...pathSegments];
      }
      return currentPath; // Invalid path, keep current
    } else {
      // Relative path - handle multi-segment paths like Documents/Projects
      const segments = pathArg.split('/').filter(s => s !== '');
      let testPath = [...currentPath];
      
      for (const segment of segments) {
        if (segment === '..') {
          if (testPath.length > 1) {
            testPath = testPath.slice(0, -1);
          }
        } else {
          const newPath = [...testPath, segment];
          if (isValidPath(newPath)) {
            testPath = newPath;
          } else {
            return currentPath; // Invalid path, keep current
          }
        }
      }
      return testPath;
    }
  };

  const isValidPath = (pathArray: string[]): boolean => {
    let currentDir = fileSystem;
    const pathSegments = pathArray.slice(1); // Remove leading '/'
    
    for (const segment of pathSegments) {
      if (currentDir.children && currentDir.children[segment] && currentDir.children[segment].type === 'dir') {
        currentDir = currentDir.children[segment] as Directory;
      } else {
        return false;
      }
    }
    return true;
  };

  const getPathCompletions = (partialPath: string, contextPath: string[]): string[] => {
    const pathParts = partialPath.split('/');
    const lastPart = pathParts[pathParts.length - 1];
    const pathToParent = pathParts.slice(0, -1);
    
    let targetPath: string[];
    
    if (partialPath.startsWith('/')) {
      // Absolute path
      targetPath = ['/', ...pathToParent.filter(s => s !== '')];
    } else {
      // Relative path
      targetPath = [...contextPath];
      for (const segment of pathToParent) {
        if (segment === '..') {
          if (targetPath.length > 1) {
            targetPath = targetPath.slice(0, -1);
          }
        } else if (segment !== '') {
          targetPath = [...targetPath, segment];
        }
      }
    }
    
    const completions = getDirectoryCompletions(lastPart, targetPath);
    const prefix = pathToParent.join('/') + (pathToParent.length > 0 ? '/' : '');
    
    return completions.map(comp => {
      if (partialPath.startsWith('/')) {
        return '/' + prefix + comp;
      } else {
        return prefix + comp;
      }
    });
  };

  const getDirectoryCompletions = (lastPart: string, contextPath: string[]): string[] => {
    let currentDir = fileSystem;
    const pathSegments = contextPath.slice(1);
    
    for (const segment of pathSegments) {
      if (currentDir.children && currentDir.children[segment] && currentDir.children[segment].type === 'dir') {
        currentDir = currentDir.children[segment] as Directory;
      } else {
        return [];
      }
    }
    
    if (currentDir.children) {
      const matches = Object.keys(currentDir.children).filter(name => 
        name.toLowerCase().startsWith(lastPart.toLowerCase())
      );
      return matches;
    }
    return [];
  };

  const handleTabCompletion = () => {
    const completions = getCompletions(currentInput);
    if (completions.length === 1) {
      let completion = completions[0];
      
      // If the completion contains spaces, escape it
      if (completion.includes(' ') && !completion.startsWith('"')) {
        completion = `"${completion}"`;
      }
      
      let newValue;
      if (currentInput.includes(' && ')) {
        // Handle command chain completion
        const chainParts = currentInput.split(' && ');
        const lastChainPart = chainParts[chainParts.length - 1].trim();
        const lastChainWords = lastChainPart.split(' ');
        lastChainWords[lastChainWords.length - 1] = completion;
        chainParts[chainParts.length - 1] = lastChainWords.join(' ');
        newValue = chainParts.join(' && ');
      } else {
        // Handle single command completion
        const parts = currentInput.split(' ');
        parts[parts.length - 1] = completion;
        newValue = parts.join(' ');
      }
      
      setCurrentInput(newValue);
      setCursorPosition(newValue.length);
    } else if (completions.length > 1) {
      // Show available completions
      const output = completions.join('  ');
      const newLines = [
        ...lines,
        <React.Fragment key={`completion-${lines.length}`}>{output}</React.Fragment>
      ];
      setLines(newLines);
    }
  };

  const handleCommand = async (command: string) => {
    const trimmedCommand = command.trim();
    if (trimmedCommand) {
      setCommandHistory(prev => [...prev, trimmedCommand]);
      setHistoryIndex(-1);
    }
    
    // Check for && chained commands
    if (trimmedCommand.includes(' && ')) {
      await handleChainedCommands(trimmedCommand);
      return;
    }
    
    const result = await executeCommandWithPath(trimmedCommand, currentPath);
    if (result.newPath) {
      setCurrentPath(result.newPath);
    }
  };

  // Removed unused executeCommand function

  const handleChainedCommands = async (commandChain: string) => {
    const commands = commandChain.split(' && ').map(cmd => cmd.trim());
    let allOutput: React.ReactNode[] = [];
    let tempPath = [...currentPath]; // Track path changes locally
    
    for (let i = 0; i < commands.length; i++) {
      const result = await executeCommandWithPath(commands[i], tempPath, true); // silent mode for chained commands
      
      if (result.output) {
        allOutput = allOutput.concat(result.output);
      }
      
      // Update local path if command was cd
      if (result.newPath) {
        tempPath = result.newPath;
      }
      
      // If command failed, stop executing the chain
      if (!result.success) {
        break;
      }
    }
    
    // Apply final path change to actual state
    setCurrentPath(tempPath);
    
    // Display the full command and all output at once
    const newLines = [
      ...lines,
      <div key={`line-${lines.length}-prompt`} className="font-mono mb-1 flex items-center">
        {renderPrompt(getPrompt())}
        <span style={{ color: 'white' }}>{commandChain}</span>
      </div>,
      ...allOutput.map((o, i) => <TerminalText key={`line-${lines.length}-out-${i}`} isOutput>{o}</TerminalText>)
    ];
    setLines(newLines);
    setCurrentInput('');
    setCursorPosition(0);
  };

  const executeCommandWithPath = async (command: string, pathContext: string[], silent: boolean = false, forceRoot?: boolean): Promise<{ success: boolean; output: React.ReactNode[]; newPath?: string[] }> => {
    // Handle aliases
    const aliasedCommand = command
      .replace(/^ll\b/, 'ls -alF')
      .replace(/^la\b/, 'ls -A')
      .replace(/^l\b/, 'ls -CF');
    
    const [cmd, ...args] = aliasedCommand.split(/\s+/);
    
    // Handle empty commands (just Enter or whitespace) - behave like real Linux
    if (!cmd || cmd.trim() === '') {
      // If not in silent mode, just show the prompt line without any output
      if (!silent) {
        const newLines = [
          ...lines,
          <div key={`line-${lines.length}-prompt`} className="font-mono mb-1 flex items-center">
            {renderPrompt(getPrompt())}
            <span style={{ color: 'white' }}>{command}</span>
          </div>
        ];
        setLines(newLines);
        setCurrentInput('');
        setCursorPosition(0);
      }
      return { success: true, output: [], newPath: pathContext };
    }
    
    const output: React.ReactNode[] = [];
    let success = true;
    let newPath: string[] | undefined = undefined;

    // Use forceRoot if provided, otherwise use current isRoot state
    const effectiveIsRoot = forceRoot !== undefined ? forceRoot : isRoot;

    // Helper function to get directory using pathContext instead of currentPath
    const getCurrentDirectoryFromPath = (path: string[]): Directory => {
      let currentDir = fileSystem;
      const pathSegments = path.slice(1); // Remove leading '/'
      
      for (const segment of pathSegments) {
        if (currentDir.children && currentDir.children[segment] && currentDir.children[segment].type === 'dir') {
          currentDir = currentDir.children[segment] as Directory;
        }
      }
      return currentDir;
    };

    switch (cmd.toLowerCase()) {
      case 'help':
        output.push('\n');
        output.push(<TerminalText textType="info" key="help-title">Available commands:</TerminalText>);
        output.push('help            - Show this help message');
        output.push('ls              - List directory contents');
        output.push('                     - a: show all files including . and ..');
        output.push('                     - A: show hidden files but not . and ..');
        output.push('                     - l: long format with details');
        output.push('                     - F: append indicators (/ for directories)');
        output.push('cd              - Change directory (supports absolute and relative paths)');
        output.push('cat             - Display file content');
        output.push('xdg-open        - Execute/open file (links, applications)');
        output.push('open            - Open/view file (alias for xdg-open)');
        output.push('echo            - Display a line of text');
        output.push('clear           - Clear the terminal');
        output.push('whoami          - Display current user');
        output.push('date            - Display current date and time');
        output.push('pwd             - Print working directory');
        output.push('\n');
        output.push(<TerminalText textType="info" key="help-file-ops">File Operations:</TerminalText>);
        output.push('touch           - Create empty file');
        output.push('mkdir           - Create directory');
        output.push('rm              - Remove file');
        output.push('cp              - Copy file');
        output.push('mv              - Move/rename file');
        output.push('\n');
        output.push(<TerminalText textType="info" key="help-editors">Text Editors:</TerminalText>);
        output.push('vim             - Vi/Vim editor');
        output.push('\n');
        output.push(<TerminalText textType="info" key="help-tips">Tips:</TerminalText>);
        output.push('                - Use Tab for autocompletion');
        output.push('                - Use Up/Down arrows for command history');
        output.push('                - Try: cd ~/Documents && xdg-open "Garrett Yokley.pdf"');
        output.push('                - Try: touch /etc/test (will show permission error)');
        output.push('                - Try: sudo rm -rf / (Password: Password)');
        output.push('');
        output.push(<TerminalText textType="info" key="help-quick">Quick Commands:</TerminalText>);
        output.push('security-plus    - Open Security+ certification page');
        output.push('itil4           - Open ITIL4 certification page');
        output.push('linux-plus      - Open Linux+ certification page');
        output.push('linux-essentials - Open Linux Essentials certification page');
        output.push('ccna            - Open CCNA certification page');
        output.push('rhcsa           - Open RHCSA certification page');
        output.push('bachelor        - Open Bachelor\'s degree page');
        output.push('certifications  - List all certifications');
        output.push('education       - View education information');
        break;
      case 'ls':
        const showHidden = args.includes('-a') || args.includes('-A');
        const showAll = args.includes('-a'); // -a shows . and .., -A doesn't
        const longFormat = args.includes('-l');
        const classify = args.includes('-F');
        const currentDir = getCurrentDirectoryFromPath(pathContext);
        
        console.log('LS Debug - Current directory:', currentDir);
        console.log('LS Debug - Children:', currentDir.children ? Object.keys(currentDir.children) : 'No children');
        
        let entries: string[] = [];
        
        if (showAll) {
          // Add . and .. directories (only with -a, not -A)
          entries.push('.');
          if (pathContext.length > 1) {
            entries.push('..');
          }
        }
        
        if (currentDir.children) {
          const fileEntries = Object.keys(currentDir.children)
            .filter(name => {
              if (showHidden) return true;
              return !name.startsWith('.');
            })
            .sort()
            .map(name => {
              const node = currentDir.children![name];
              let displayName = name;
              
              if (classify || args.includes('-F')) {
                if (node.type === 'dir') {
                  displayName += '/';
                }
              } else if (!classify && !args.includes('-F')) {
                if (node.type === 'dir') {
                  displayName += '/';
                }
              }
              
              if (longFormat) {
                const permissions = node.type === 'dir' ? 'drwxr-xr-x' : '-rw-r--r--';
                const size = node.type === 'file' ? (node.content?.length || 0).toString().padStart(8) : '     4096';
                const date = 'Dec  5 12:34';
                return `${permissions} 1 ${username} ${username} ${size} ${date} ${displayName}`;
              }
              
              return displayName;
            });
          entries = entries.concat(fileEntries);
        }
        
        if (longFormat && entries.length > (showAll ? 2 : 0)) {
          const total = entries.filter(e => !e.startsWith('.')).length;
          output.push(`total ${total}`);
        }
        
        // Color the file entries for output
        if (entries.length > 0) {
          const currentDir = getCurrentDirectoryFromPath(pathContext);
          let entryIndex = 0;
          
          // Handle . and .. entries first
          const dotEntries = entries.filter(e => e === '.' || e === '..');
          dotEntries.forEach(entry => {
            output.push(<span key={`dot-${entryIndex++}`} style={{ color: 'white' }}>{entry}</span>);
          });
          
          // Handle regular entries with colors
          const regularEntries = entries.filter(e => e !== '.' && e !== '..');
          regularEntries.forEach(entry => {
            // Extract the original filename without long format info
            let fileName = entry;
            let prefix = '';
            
            if (longFormat) {
              // Extract filename from long format: "permissions user group size date filename"
              const parts = entry.split(' ');
              fileName = parts[parts.length - 1];
              prefix = parts.slice(0, -1).join(' ') + ' ';
            }
            
            const baseName = fileName.replace(/\/$/, '');
            const node = currentDir.children?.[baseName];
            
            if (node) {
              const coloredName = colorFileName(fileName, node, entryIndex++);
              if (longFormat) {
                output.push(<span key={`long-${entryIndex}`}>{prefix}{coloredName}</span>);
              } else {
                output.push(coloredName);
              }
            } else {
              // Fallback for entries that don't have nodes (shouldn't happen)
              output.push(<span key={`fallback-${entryIndex++}`} style={{ color: 'white' }}>{entry}</span>);
            }
          });
        } else {
          output.push(<span style={{ color: 'white' }}>{'(empty directory)'}</span>);
        }
        break;
      case 'cd':
        const newPathArg = args[0];
        if (!newPathArg || newPathArg === '~') {
          newPath = ['/', 'home', 'garrettyokley'];
        } else if (newPathArg === '/') {
          newPath = ['/'];
        } else if (newPathArg === '..') {
          if (pathContext.length > 1) {
            newPath = pathContext.slice(0, -1);
          }
        } else if (newPathArg.startsWith('/')) {
          // Absolute path
          const pathSegments = newPathArg.split('/').filter(s => s !== '');
          let tempDir = fileSystem;
          let validPath = true;
          
          for (const segment of pathSegments) {
            if (tempDir.children && tempDir.children[segment] && tempDir.children[segment].type === 'dir') {
              tempDir = tempDir.children[segment] as Directory;
            } else {
              validPath = false;
              break;
            }
          }
          
          if (validPath) {
            newPath = ['/', ...pathSegments];
          } else {
            output.push(<TerminalText textType="error" key="cd-error-abs">{`cd: no such file or directory: ${newPathArg}`}</TerminalText>);
            success = false;
          }
        } else {
          // Relative path
          const currentDir = getCurrentDirectoryFromPath(pathContext);
          if (currentDir.children && currentDir.children[newPathArg] && currentDir.children[newPathArg].type === 'dir') {
            newPath = [...pathContext, newPathArg];
          } else {
            output.push(<TerminalText textType="error" key="cd-error-rel">{`cd: no such file or directory: ${newPathArg}`}</TerminalText>);
            success = false;
          }
        }
        break;
      case 'cat':
        let filePath = args.join(' '); // Join args to handle quoted filenames
        if (!filePath) {
          output.push(<TerminalText textType="error" key="cat-missing">cat: missing operand</TerminalText>);
          success = false;
          break;
        }
        // Remove quotes if present
        if ((filePath.startsWith('"') && filePath.endsWith('"')) || 
            (filePath.startsWith("'") && filePath.endsWith("'"))) {
          filePath = filePath.slice(1, -1);
        }
        
        // Special handling for Garrett Yokley.pdf - fetch from txt file
        if (filePath === 'Garrett Yokley.pdf') {
          try {
            const response = await fetch('/Garrett Yokley.txt');
            if (response.ok) {
              const content = await response.text();
              output.push(content);
            } else {
              output.push(<TerminalText textType="error" key="cat-fetch-error">cat: {filePath}: Unable to fetch resume content</TerminalText>);
            }
          } catch (error) {
            output.push(<TerminalText textType="error" key="cat-network-error">cat: {filePath}: Network error while fetching content</TerminalText>);
          }
          break;
        }
        
        // Regular cat functionality for all other files
        const currentDir2 = getCurrentDirectoryFromPath(pathContext);
        if (currentDir2.children && currentDir2.children[filePath] && currentDir2.children[filePath].type === 'file') {
          output.push(currentDir2.children[filePath].content || '');
        } else {
          output.push(<TerminalText textType="error" key="cat-error">{`cat: ${filePath}: No such file or directory`}</TerminalText>);
        }
        break;
      case 'pwd':
        output.push(<span style={{ color: '#00ffff' }}>{pathContext.join('/') || '/'}</span>);
        break;
      case 'echo':
        output.push(<span style={{ color: '#00ff00', opacity: 0.7 }}>{args.join(' ')}</span>);
        break;
      case 'clear':
        setLines([]);
        setCurrentInput('');
        setCursorPosition(0);
        return { success: true, output: [] };
      case 'whoami':
        output.push(<span style={{ color: '#00ffff' }}>{username}</span>);
        break;
      case 'date':
        output.push(<span style={{ color: 'white' }}>{new Date().toString()}</span>);
        break;
      case 'xdg-open':
      case 'open':
        let fileName = args.join(' '); // Join args to handle quoted filenames
        if (!fileName) {
          output.push(<TerminalText textType="error" key="open-missing">{`${cmd}: missing operand`}</TerminalText>);
          success = false;
          break;
        }
        // Remove quotes if present
        if ((fileName.startsWith('"') && fileName.endsWith('"')) || 
            (fileName.startsWith("'") && fileName.endsWith("'"))) {
          fileName = fileName.slice(1, -1);
        }
        const currentDir3 = getCurrentDirectoryFromPath(pathContext);
        if (currentDir3.children && currentDir3.children[fileName]) {
          const file = currentDir3.children[fileName];
          if (file.type === 'file') {
            // Check if it's an executable link (starts with shebang)
            if (file.content?.startsWith('#!/usr/bin/env xdg-open')) {
              const lines = file.content.split('\n');
              const urlLine = lines.find(line => line.startsWith('URL='));
              if (urlLine) {
                const url = urlLine.split('=')[1];
                output.push(<span style={{ color: '#00ffff' }}>{`Opening ${fileName}...`}</span>);

                if (fileName === 'Play Chess' || fileName === 'Chess Game') {
                  output.push(<span style={{ color: 'white' }}>{'Opening Chess Game...'}</span>);
                  output.push(<span style={{ color: 'white' }}>{'Opening project page: http://localhost:3000/chess.html'}</span>);
                  // Actually open the chess game
                  window.open('/chess.html', '_blank');
                } else if (fileName === 'Certifications') {
                  output.push(<span style={{ color: 'white' }}>{'Opening new tab: ' + url}</span>);
                } else if (url.includes('projects/')) {
                  output.push(<span style={{ color: 'white' }}>{'Opening project page: ' + url}</span>);
                } else if (url.includes('linkedin.com')) {
                  output.push(<span style={{ color: 'white' }}>{'Opening LinkedIn profile in new tab'}</span>);
                } else if (url.includes('github.com')) {
                  output.push(<span style={{ color: 'white' }}>{'Opening GitHub profile in new tab'}</span>);
                } else if (url.includes('mailto:')) {
                  output.push(<span style={{ color: 'white' }}>{'Opening default email client'}</span>);
                } else {
                  output.push(<span style={{ color: 'white' }}>{'Opening in default browser: ' + url}</span>);
                }
              } else {
                output.push(`${cmd}: cannot execute ${fileName}: invalid format`);
              }
            } else if (fileName.endsWith('.pdf')) {
              const comingSoonPdfs = [
                'Linux+, CompTIA.pdf',
                'Linux Essentials (LPI-1), Linux Professional Institute.pdf',
                'CCNA, Cisco.pdf',
                'RHCSA, Red Hat.pdf',
                'Bachelor of Science in Computer Science, WGU.pdf'
              ];

              if (comingSoonPdfs.includes(fileName)) {
                // For coming soon PDFs, display their content from the filesystem
                output.push(file.content || `Content for ${fileName} (coming soon)`);
              } else {
                // For other PDFs (Resume, completed certs), attempt to open them
                output.push(<span style={{ color: '#00ffff' }}>{'Opening PDF in new tab...'}</span>);
                output.push(<span style={{ color: 'white' }}>{'File: ' + fileName}</span>);
                if (fileName === 'Garrett Yokley.pdf') { // This case might be redundant due to earlier fetch logic for .txt
                  output.push(<span style={{ color: 'white' }}>{'Opening resume PDF...'}</span>);
                } else {
                  // Generic message for other PDFs
                  output.push(<span style={{ color: 'white' }}>{'Opening document PDF...'}</span>);
                }
                window.open('/' + fileName, '_blank');
              }
            } else {
              output.push(file.content || '(empty file)');
            }
          } else {
            output.push(`${cmd}: ${fileName}: Is a directory`);
          }
        } else {
          output.push(`${cmd}: ${fileName}: No such file or directory`);
        }
        break;

      case 'certifications':
      case 'certs':
        output.push('Professional Certifications:');
        output.push('');
        output.push('Completed:');
        output.push('  - Security+, CompTIA (completed)');
        output.push('  - ITIL4, Information Technology Infrastructure Library (completed)');
        output.push('');
        output.push('Coming in 2025:');
        output.push('  - Linux+, CompTIA (June 7, 2025)');
        output.push('  - Linux Essentials (LPI-1), Linux Professional Institute (June 28, 2025)');
        output.push('  - CCNA, Cisco (July 12, 2025)');
        output.push('  - RHCSA, Red Hat (2025)');
        output.push('');
        output.push('Navigate to: cd ~/Documents/Certs');
        output.push('Open details: xdg-open "Linux+, CompTIA.pdf"');
        output.push('Or visit web pages directly with browser buttons above');
        break;
      case 'projects':
        output.push('Featured Projects:');
        output.push('');
        output.push('Available in ~/Documents/Projects:');
        output.push('  Chess Game         - Interactive chess game (try: xdg-open "Chess Game")');
        output.push('');
        output.push('This interactive terminal is itself a featured project!');
        output.push('Navigate to: cd ~/Documents/Projects');
        output.push('Explore with: ls -la');
        break;
      case 'education':
        output.push('Education:');
        output.push('');
        output.push('Coming September 2025:');
        output.push('  Bachelor of Science in Computer Science - Western Governors University');
        output.push('');
        output.push('Navigate to: cd ~/Documents/Education');
        output.push('View details: xdg-open "Bachelor of Science in Computer Science, WGU.pdf"');
        output.push('Or click the Education button in the navigation bar above');
        break;
      case 'links':
        output.push('Opening Links...');
        output.push('');
        output.push('Important Links:');
        output.push('  LinkedIn: [Your LinkedIn Profile]');
        output.push('  GitHub: [Your GitHub Profile]');
        output.push('  Portfolio: localhost:3000');
        output.push('  Email: [Your Email]');
        output.push('  Blog: [Your Blog]');
        output.push('');
        output.push('Click the "Links" button in the navigation bar to view all links.');
        break;
      case 'portfolio':
        output.push('Portfolio Navigation');
        output.push('');
        output.push('Available Sections:');
        output.push('  certifications - View my professional certifications');
        output.push('  projects      - Explore my projects and code');
        output.push('  links         - Find my social and professional links');
        output.push('  education     - View my degree progress');
        output.push('');
        output.push('You can also use the navigation buttons at the top of the page.');
        output.push('');
        output.push('This interactive terminal is itself a featured project!');
        output.push('Explore the filesystem with: ls -la, cd projects, etc.');
        break;

      // Direct certification commands
      case 'security-plus':
        output.push(<span style={{ color: '#00ffff' }}>Opening Security+ CompTIA certification PDF...</span>);
        window.open('/Security+, CompTIA.pdf', '_blank');
        break;

      case 'itil4':
        output.push(<span style={{ color: '#00ffff' }}>Opening ITIL4 Foundation certification PDF...</span>);
        window.open('/ITIL4, Information Technology Infrastructure Library.pdf', '_blank');
        break;

      case 'linux-plus':
        output.push(<span style={{ color: '#00ffff' }}>Opening Linux+ CompTIA certification page...</span>);
        window.open('/linux-plus-comptia', '_blank');
        break;

      case 'linux-essentials':
        output.push(<span style={{ color: '#00ffff' }}>Opening Linux Essentials (LPI-1) certification page...</span>);
        window.open('/linux-essentials-lpi', '_blank');
        break;

      case 'ccna':
        output.push(<span style={{ color: '#00ffff' }}>Opening CCNA Cisco certification page...</span>);
        window.open('/ccna-cisco', '_blank');
        break;

      case 'rhcsa':
        output.push(<span style={{ color: '#00ffff' }}>Opening RHCSA Red Hat certification page...</span>);
        window.open('/rhcsa-red-hat', '_blank');
        break;

      case 'bachelor':
        output.push(<span style={{ color: '#00ffff' }}>Opening Bachelor of Science in Computer Science page...</span>);
        window.open('/bachelor-computer-science-wgu', '_blank');
        break;
      
      // TEXT EDITORS
      case 'vim':
      case 'vi':
        let vimFile = args.join(' ');
        if (!vimFile) {
          vimFile = 'untitled.txt';
        }
        const currentDir4 = getCurrentDirectoryFromPath(pathContext);
        let vimContent = '';
        let isNewFile = true;
        if (currentDir4.children && currentDir4.children[vimFile] && currentDir4.children[vimFile].type === 'file') {
          vimContent = currentDir4.children[vimFile].content || '';
          isNewFile = false;
        }
        
        // Add the vim command to terminal history first (if not in silent mode)
        if (!silent) {
          const newLines = [
            ...lines,
            <div key={`line-${lines.length}-prompt`} className="font-mono mb-1 flex items-center">
              {renderPrompt(getPrompt())}
              <span style={{ color: 'white' }}>{command}</span>
            </div>
          ];
          setLines(newLines);
          setCurrentInput('');
          setCursorPosition(0);
        }
        
        // Open vim (don't clear terminal - just open editor)
        setEditor({
          isOpen: true,
          editor: 'vim',
          filename: vimFile === 'untitled.txt' ? '' : vimFile, // Use empty string for no filename
          content: vimContent,
          mode: 'normal', // Start in normal mode, not insert!
          cursorLine: 0,
          cursorCol: 0,
          message: isNewFile ? (vimFile === 'untitled.txt' ? '[No Name]' : `"${vimFile}" [New File]`) : `"${vimFile}" ${vimContent.split('\n').length}L, ${vimContent.length}C`,
          path: [...pathContext] // Store the path where vim was opened
        });
        return { success: true, output: [], newPath: pathContext };

      case 'nano':
        let nanoFile = args.join(' ');
        if (!nanoFile) {
          nanoFile = 'untitled.txt';
        }
        const currentDir5 = getCurrentDirectoryFromPath(pathContext);
        let nanoContent = '';
        if (currentDir5.children && currentDir5.children[nanoFile] && currentDir5.children[nanoFile].type === 'file') {
          nanoContent = currentDir5.children[nanoFile].content || '';
        }
        
        // Add the nano command to terminal history first (if not in silent mode)
        if (!silent) {
          const newLines = [
            ...lines,
            <div key={`line-${lines.length}-prompt`} className="font-mono mb-1 flex items-center">
              {renderPrompt(getPrompt())}
              <span style={{ color: 'white' }}>{command}</span>
            </div>
          ];
          setLines(newLines);
          setCurrentInput('');
          setCursorPosition(0);
        }
        
        // Open nano (don't clear terminal - just open editor)
        setEditor({
          isOpen: true,
          editor: 'nano',
          filename: nanoFile,
          content: nanoContent,
          mode: 'normal',
          cursorLine: 0,
          cursorCol: 0,
          message: `GNU nano - ${nanoFile}`,
          path: [...pathContext] // Add missing path property
        });
        return { success: true, output: [], newPath: pathContext };

      case 'emacs':
        const emacsFile = args.join(' ');
        if (!emacsFile) {
          output.push(<TerminalText textType="error" key="emacs-missing">emacs: missing filename</TerminalText>);
          success = false;
          break;
        }
        output.push(<span style={{ color: '#00ff00' }}>Emacs would open here... (using nano instead)</span>);
        // Fallback to nano for simplicity
        const currentDir6 = getCurrentDirectoryFromPath(pathContext);
        let emacsContent = '';
        if (currentDir6.children && currentDir6.children[emacsFile] && currentDir6.children[emacsFile].type === 'file') {
          emacsContent = currentDir6.children[emacsFile].content || '';
        }
        setEditor({
          isOpen: true,
          editor: 'nano',
          filename: emacsFile,
          content: emacsContent,
          mode: 'normal',
          cursorLine: 0,
          cursorCol: 0,
          message: `GNU Emacs (simplified) - ${emacsFile}`,
          path: [...pathContext] // Add missing path property
        });
        break;

      // FILE OPERATIONS
      case 'touch':
        const fileToTouch = args[0]; // Renamed from touchFile to fileToTouch to avoid conflict
        if (!fileToTouch) {
          output.push(<TerminalText textType="error" key="touch-missing">touch: missing file operand</TerminalText>);
          success = false;
          break;
        }
        if (createFile(pathContext, fileToTouch)) {
          output.push(<span style={{ color: '#00ff00' }}>Created file: {fileToTouch}</span>);
        } else {
          output.push(<TerminalText textType="error" key="touch-error">touch: cannot touch '{fileToTouch}': Permission denied</TerminalText>);
          success = false;
        }
        break;

      case 'mkdir':
        const dirName = args[0];
        if (!dirName) {
          output.push(<TerminalText textType="error" key="mkdir-missing">mkdir: missing operand</TerminalText>);
          success = false;
          break;
        }
        if (createDirectory(pathContext, dirName)) {
          output.push(<span style={{ color: '#00ff00' }}>Created directory: {dirName}</span>);
        } else {
          output.push(<TerminalText textType="error" key="mkdir-error">mkdir: cannot create directory '{dirName}': Permission denied</TerminalText>);
          success = false;
        }
        break;

      case 'rm':
        const recursive = args.includes('-rf') || args.includes('-r') || args.includes('-f');
        const rmTarget = args.filter(arg => !arg.startsWith('-'))[0];
        
        if (!rmTarget) {
          output.push(<TerminalText textType="error" key="rm-missing">rm: missing operand</TerminalText>);
          success = false;
          break;
        }

        // DANGEROUS: Handle rm -rf /
        if (rmTarget === '/' && recursive) {
          if (effectiveIsRoot) {
            // Even root gets the safety warning unless --no-preserve-root is used
            if (!args.includes('--no-preserve-root')) {
              output.push(<TerminalText textType="error" key="rm-root">rm: it is dangerous to operate recursively on '/'</TerminalText>);
              output.push(<TerminalText textType="error" key="rm-root2">rm: use --no-preserve-root to override this failsafe</TerminalText>);
              success = false;
              break;
            } else {
              // Root user with --no-preserve-root - allow system destruction
              output.push(<TerminalText textType="error" key="rm-bricking">*** SYSTEM DESTRUCTION IN PROGRESS ***</TerminalText>);
              output.push(<TerminalText textType="error" key="rm-warning">You have chosen... poorly.</TerminalText>);
              output.push('');
              output.push(<span style={{ color: '#ff6666' }}>Deleting /bin... goodbye bash, ls, cat, and friends</span>);
              output.push(<span style={{ color: '#ff6666' }}>Deleting /usr... farewell vim, nano, python, node</span>);
              output.push(<span style={{ color: '#ff6666' }}>Deleting /etc... adios configs, passwords, and sanity</span>);
              output.push(<span style={{ color: '#ff6666' }}>Deleting /home... so long personal files and memories</span>);
              output.push(<span style={{ color: '#ff6666' }}>Deleting /lib... libraries? who needs 'em?</span>);
              output.push(<span style={{ color: '#ff6666' }}>Deleting /var... logs and caches vanish into the void</span>);
              output.push('');
              output.push(<TerminalText textType="error" key="rm-destroyed">SYSTEM OBLITERATED</TerminalText>);
              output.push('');
              output.push(<span style={{ color: '#ffff00' }}>Fun fact: This is why production servers have backups!</span>);
              output.push(<span style={{ color: '#ffff00' }}>Famous last words: "sudo rm -rf / --no-preserve-root"</span>);
              output.push('');
              output.push(<span style={{ color: '#00ffff' }}>Don't worry, this is just a simulation. Your real computer is safe!</span>);
              output.push(<span style={{ color: '#00ffff' }}>But seriously, never run this command on a real system.</span>);
              output.push('');
              output.push(<TerminalText textType="error" key="rm-final">Welcome to the digital wasteland. Population: 0</TerminalText>);
              
              brickSystem();
              return { success: true, output, newPath: ['/'] };
            }
          } else {
            // Regular user - show safety warnings and permission errors
            output.push(<TerminalText textType="error" key="rm-root">rm: it is dangerous to operate recursively on '/'</TerminalText>);
            output.push(<TerminalText textType="error" key="rm-root2">rm: use --no-preserve-root to override this failsafe</TerminalText>);
            
            if (args.includes('--no-preserve-root')) {
              // Show realistic permission errors for system directories
              output.push(<TerminalText textType="error" key="rm-perm1">rm: cannot remove '/bin': Permission denied</TerminalText>);
              output.push(<TerminalText textType="error" key="rm-perm2">rm: cannot remove '/usr': Permission denied</TerminalText>);
              output.push(<TerminalText textType="error" key="rm-perm3">rm: cannot remove '/etc': Permission denied</TerminalText>);
              output.push(<TerminalText textType="error" key="rm-perm4">rm: cannot remove '/lib': Permission denied</TerminalText>);
              output.push(<TerminalText textType="error" key="rm-perm5">rm: cannot remove '/var': Permission denied</TerminalText>);
              output.push(<TerminalText textType="error" key="rm-perm6">rm: cannot remove '/root': Permission denied</TerminalText>);
              output.push('');
              output.push(<span style={{ color: '#ffff00' }}>As a regular user, you can only delete files you own.</span>);
              output.push(<span style={{ color: '#ffff00' }}>System files are protected by root ownership.</span>);
              output.push(<span style={{ color: '#00ffff' }}>Try: sudo rm -rf / --no-preserve-root</span>);
            }
            success = false;
            break;
          }
        }

        if (recursive) {
          if (deleteDirectoryRecursive(pathContext, rmTarget)) {
            output.push(<span style={{ color: '#00ff00' }}>Removed: {rmTarget}</span>);
          } else {
            if (!hasWritePermission(pathContext, rmTarget)) {
              output.push(<TerminalText textType="error" key="rm-error-perm">rm: cannot remove '{rmTarget}': Permission denied</TerminalText>);
            } else {
              output.push(<TerminalText textType="error" key="rm-error">rm: cannot remove '{rmTarget}': No such file or directory</TerminalText>);
            }
            success = false;
          }
        } else {
          if (deleteFile(pathContext, rmTarget)) {
            output.push(<span style={{ color: '#00ff00' }}>Removed: {rmTarget}</span>);
          } else {
            if (!hasWritePermission(pathContext, rmTarget)) {
              output.push(<TerminalText textType="error" key="rm-error2-perm">rm: cannot remove '{rmTarget}': Permission denied</TerminalText>);
            } else {
              output.push(<TerminalText textType="error" key="rm-error2">rm: cannot remove '{rmTarget}': No such file or directory</TerminalText>);
            }
            success = false;
          }
        }
        break;

      case 'rmdir':
        const rmdirTarget = args[0];
        if (!rmdirTarget) {
          output.push(<TerminalText textType="error" key="rmdir-missing">rmdir: missing operand</TerminalText>);
          success = false;
          break;
        }
        if (deleteFile(pathContext, rmdirTarget)) {
          output.push(<span style={{ color: '#00ff00' }}>Removed directory: {rmdirTarget}</span>);
        } else {
          if (!hasWritePermission(pathContext, rmdirTarget)) {
            output.push(<TerminalText textType="error" key="rmdir-error-perm">rmdir: failed to remove '{rmdirTarget}': Permission denied</TerminalText>);
          } else {
            output.push(<TerminalText textType="error" key="rmdir-error">rmdir: failed to remove '{rmdirTarget}': Directory not empty</TerminalText>);
          }
          success = false;
        }
        break;

      case 'cp':
        const cpSource = args[0];
        const cpDest = args[1];
        if (!cpSource || !cpDest) {
          output.push(<TerminalText textType="error" key="cp-missing">cp: missing file operand</TerminalText>);
          success = false;
          break;
        }
        const sourceDir = getCurrentDirectoryFromPath(pathContext);
        if (sourceDir.children && sourceDir.children[cpSource] && sourceDir.children[cpSource].type === 'file') {
          const sourceContent = sourceDir.children[cpSource].content || '';
          if (createFile(pathContext, cpDest, sourceContent)) {
            output.push(<span style={{ color: '#00ff00' }}>Copied {cpSource} to {cpDest}</span>);
          } else {
            output.push(<TerminalText textType="error" key="cp-error">cp: cannot create regular file '{cpDest}': Permission denied</TerminalText>);
            success = false;
          }
        } else {
          output.push(<TerminalText textType="error" key="cp-error2">cp: cannot stat '{cpSource}': No such file or directory</TerminalText>);
          success = false;
        }
        break;

      case 'mv':
        const mvSource = args[0];
        const mvDest = args[1];
        if (!mvSource || !mvDest) {
          output.push(<TerminalText textType="error" key="mv-missing">mv: missing file operand</TerminalText>);
          success = false;
          break;
        }
        const mvSourceDir = getCurrentDirectoryFromPath(pathContext);
        if (mvSourceDir.children && mvSourceDir.children[mvSource]) {
          const sourceNode = mvSourceDir.children[mvSource];
          
          // Check if we have permission to delete the source
          if (!hasWritePermission(pathContext, mvSource)) {
            output.push(<TerminalText textType="error" key="mv-error-perm">mv: cannot move '{mvSource}': Permission denied</TerminalText>);
            success = false;
            break;
          }
          
          // For files, copy content and then delete source
          if (sourceNode.type === 'file') {
            const sourceContent = sourceNode.content || '';
            const sourcePermissions = sourceNode.permissions || '-rw-r--r--';
            
            // Check write permissions
            if (!hasWritePermission(pathContext, mvSource)) {
              output.push(<TerminalText textType="error" key="mv-error-perm">mv: cannot move '{mvSource}': Permission denied</TerminalText>);
              success = false;
              break;
            }
            
            // Do both create and delete in a single file system update
            try {
              const newFs = JSON.parse(JSON.stringify(fileSystem));
              let currentDir = newFs;
              
              // Navigate to the directory
              for (const segment of pathContext.slice(1)) {
                if (currentDir.children && currentDir.children[segment] && currentDir.children[segment].type === 'dir') {
                  currentDir = currentDir.children[segment] as Directory;
                } else {
                  throw new Error('Directory not found');
                }
              }
              
              if (currentDir.children) {
                // Create the new file
                currentDir.children[mvDest] = {
                  type: 'file',
                  content: sourceContent,
                  permissions: sourcePermissions,
                  owner: isRoot ? 'root' : username,
                  group: isRoot ? 'root' : username
                };
                
                // Delete the source file
                delete currentDir.children[mvSource];
                
                // Update file system once
                updateFileSystem(newFs);
                output.push(<span style={{ color: '#00ff00' }}>Moved {mvSource} to {mvDest}</span>);
              } else {
                throw new Error('No children directory');
              }
            } catch (error) {
              output.push(<TerminalText textType="error" key="mv-error-create">mv: cannot move '{mvSource}' to '{mvDest}': Operation failed</TerminalText>);
              success = false;
            }
          } else {
            // For directories, we'd need recursive move logic (simplified for now)
            output.push(<TerminalText textType="error" key="mv-error-dir">mv: cannot move directory '{mvSource}': Operation not supported</TerminalText>);
            success = false;
          }
        } else {
          output.push(<TerminalText textType="error" key="mv-error2">mv: cannot stat '{mvSource}': No such file or directory</TerminalText>);
          success = false;
        }
        break;

      // SYSTEM COMMANDS
      case 'sudo':
        const sudoCmd = args.join(' ');
        if (!sudoCmd) {
          output.push(<TerminalText textType="error" key="sudo-missing">sudo: a command must be specified</TerminalText>);
          success = false;
          break;
        }
        
        // Don't add any output yet - just set up password prompt
        setSudoState({
          isWaitingForPassword: true,
          pendingCommand: sudoCmd,
          pendingPath: [...pathContext],
          attempts: 0
        });
        
        // Add the command line and password prompt on same line
        if (!silent) {
          const newLines = [
            ...lines,
            <div key={`line-${lines.length}-prompt`} className="font-mono mb-1 flex items-center">
              {renderPrompt(getPrompt())}
              <span style={{ color: 'white' }}>sudo {sudoCmd}</span>
            </div>
          ];
          setLines(newLines);
          setCurrentInput('');
          setCursorPosition(0);
        }
        
        // Don't add to output array - we're handling display manually
        return { success: true, output: [], newPath: pathContext };
        break;

      case 'su':
        const suUser = args[0] || 'root';
        output.push(<span style={{ color: '#ffff00' }}>Password: </span>);
        if (suUser === 'root') {
          output.push(<span style={{ color: '#00ff00' }}>Switching to root user...</span>);
          setIsRoot(true);
          setUsername('root');
        } else {
          output.push(<span style={{ color: '#00ff00' }}>Switching to user: {suUser}</span>);
          setIsRoot(false);
          setUsername(suUser);
        }
        break;

      case 'ps':
        output.push('  PID TTY          TIME CMD');
        output.push(' 1234 pts/0    00:00:01 bash');
        output.push(' 1235 pts/0    00:00:00 vim');
        output.push(' 1236 pts/0    00:00:00 node');
        output.push(' 1237 pts/0    00:00:00 portfolio-app');
        break;

      case 'kill':
        const killPid = args[0];
        if (!killPid) {
          output.push(<TerminalText textType="error" key="kill-missing">kill: missing process ID</TerminalText>);
          success = false;
          break;
        }
        output.push(<span style={{ color: '#00ff00' }}>Terminated process {killPid}</span>);
        break;

      case 'grep':
        const grepPattern = args[0];
        const grepFile = args[1];
        if (!grepPattern || !grepFile) {
          output.push(<TerminalText textType="error" key="grep-missing">grep: missing pattern or file</TerminalText>);
          success = false;
          break;
        }
        const grepDir = getCurrentDirectoryFromPath(pathContext);
        if (grepDir.children && grepDir.children[grepFile] && grepDir.children[grepFile].type === 'file') {
          const fileContent = grepDir.children[grepFile].content || '';
          const grepLines = fileContent.split('\n');
          const matches = grepLines.filter(line => line.includes(grepPattern));
          if (matches.length > 0) {
            matches.forEach(match => output.push(<span style={{ color: '#00ffff' }}>{match}</span>));
          }
        } else {
          output.push(<TerminalText textType="error" key="grep-error">grep: {grepFile}: No such file or directory</TerminalText>);
          success = false;
        }
        break;

      case 'find':
        const findPath = args[0] || '.';
        const findName = args.includes('-name') ? args[args.indexOf('-name') + 1] : '*';
        output.push(<span style={{ color: '#00ff00' }}>find: searching for {findName} in {findPath}</span>);
        output.push('./file1.txt');
        output.push('./documents/file2.txt');
        output.push('./projects/README.md');
        break;

      case 'chmod':
        const chmodPerms = args[0];
        const chmodFile = args[1];
        if (!chmodPerms || !chmodFile) {
          output.push(<TerminalText textType="error" key="chmod-missing">chmod: missing operand</TerminalText>);
          success = false;
          break;
        }
        output.push(<span style={{ color: '#00ff00' }}>Changed permissions of {chmodFile} to {chmodPerms}</span>);
        break;

      case 'chown':
        const chownOwner = args[0];
        const chownFile = args[1];
        if (!chownOwner || !chownFile) {
          output.push(<TerminalText textType="error" key="chown-missing">chown: missing operand</TerminalText>);
          success = false;
          break;
        }
        if (!effectiveIsRoot) {
          output.push(<TerminalText textType="error" key="chown-perm">chown: changing ownership of '{chownFile}': Operation not permitted</TerminalText>);
          success = false;
        } else {
          output.push(<span style={{ color: '#00ff00' }}>Changed ownership of {chownFile} to {chownOwner}</span>);
        }
        break;

      case 'mount':
        if (!effectiveIsRoot) {
          output.push(<TerminalText textType="error" key="mount-perm">mount: only root can do that</TerminalText>);
          success = false;
        } else {
          output.push('Filesystem      Size  Used Avail Use% Mounted on');
          output.push('/dev/sda1        20G  5.5G   14G  30% /');
          output.push('tmpfs           2.0G     0  2.0G   0% /dev/shm');
        }
        break;

      case 'umount':
        const umountTarget = args[0];
        if (!umountTarget) {
          output.push(<TerminalText textType="error" key="umount-missing">umount: missing operand</TerminalText>);
          success = false;
          break;
        }
        if (!effectiveIsRoot) {
          output.push(<TerminalText textType="error" key="umount-perm">umount: only root can do that</TerminalText>);
          success = false;
        } else {
          output.push(<span style={{ color: '#00ff00' }}>Unmounted {umountTarget}</span>);
        }
        break;

      case 'fdisk':
        if (!effectiveIsRoot) {
          output.push(<TerminalText textType="error" key="fdisk-perm">fdisk: cannot open /dev/sda: Permission denied</TerminalText>);
          success = false;
        } else {
          output.push('Disk /dev/sda: 20 GiB, 21474836480 bytes, 41943040 sectors');
          output.push('Units: sectors of 1 * 512 = 512 bytes');
          output.push('Sector size (logical/physical): 512 bytes / 512 bytes');
          output.push('');
          output.push('Device     Start      End  Sectors  Size Type');
          output.push('/dev/sda1   2048 41943039 41940992   20G Linux filesystem');
        }
        break;

      case 'iptables':
        if (!effectiveIsRoot) {
          output.push(<TerminalText textType="error" key="iptables-perm">iptables: Permission denied</TerminalText>);
          success = false;
        } else {
          output.push('Chain INPUT (policy ACCEPT)');
          output.push('target     prot opt source               destination');
          output.push('');
          output.push('Chain FORWARD (policy ACCEPT)');
          output.push('target     prot opt source               destination');
          output.push('');
          output.push('Chain OUTPUT (policy ACCEPT)');
          output.push('target     prot opt source               destination');
        }
        break;

      default:
        output.push(<TerminalText textType="error" key="cmd-not-found">{`bash: command not found: ${cmd}`}</TerminalText>);
        success = false;
        break;
    }

    // If not in silent mode, display the output immediately
    if (!silent) {
      const newLines = [
        ...lines,
        <div key={`line-${lines.length}-prompt`} className="font-mono mb-1 flex items-center">
          {renderPrompt(getPrompt())}
          <span style={{ color: 'white' }}>{command}</span>
        </div>,
        ...output.map((o, i) => <TerminalText key={`line-${lines.length}-out-${i}`} isOutput>{o}</TerminalText>)
      ];
      setLines(newLines);
      setCurrentInput('');
      setCursorPosition(0);
    }

    return { success, output, newPath };
  };

  const handleInputChange = (value: string, cursorPos: number) => {
    // Don't update input during password mode - let global handler manage it
    if (sudoState.isWaitingForPassword) {
      return;
    }
    
    setCurrentInput(value);
    setCursorPosition(cursorPos);
  };

  const handleHistoryUp = () => {
    if (commandHistory.length > 0) {
      const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIndex);
      const command = commandHistory[newIndex];
      setCurrentInput(command);
      setCursorPosition(command.length);
    }
  };

  const handleHistoryDown = () => {
    if (historyIndex >= 0) {
      const newIndex = historyIndex + 1;
      if (newIndex >= commandHistory.length) {
        setHistoryIndex(-1);
        setCurrentInput('');
        setCursorPosition(0);
      } else {
        setHistoryIndex(newIndex);
        const command = commandHistory[newIndex];
        setCurrentInput(command);
        setCursorPosition(command.length);
      }
    }
  };

  // Global key handling for different modes
  const handleGlobalKeyDown = useCallback((e: KeyboardEvent) => {
    // Handle vim mode
    if (editor.isOpen && editor.editor === 'vim') {
      e.preventDefault();
      handleVimKeyDown(e);
      return;
    }
    
    // Handle nano mode
    if (editor.isOpen && editor.editor === 'nano') {
      e.preventDefault();
      handleNanoKeyDown(e);
      return;
    }
    
    // Handle sudo password input - completely isolate this mode
    if (sudoState.isWaitingForPassword) {
      e.preventDefault();
      handleSudoPasswordInput(e);
      return;
    }
    
    // Normal terminal input - only active when not in password mode
    if (!sudoState.isWaitingForPassword && !editor.isOpen) {
      // Let TerminalInput handle normal commands
      return;
    }
  }, [editor, sudoState, currentInput, cursorPosition, lines]);

  const handleVimKeyDown = (e: KeyboardEvent) => {
    if (editor.mode === 'normal') {
      switch (e.key) {
        case 'i':
          setEditor(prev => ({ ...prev, mode: 'insert', message: '-- INSERT --' }));
          break;
        case ':':
          setEditor(prev => ({ ...prev, mode: 'command', message: ':' }));
          break;
        case 'o':
          // Open new line below and enter insert mode
          const lines = editor.content.split('\n');
          const newLines = [
            ...lines.slice(0, editor.cursorLine + 1),
            '',
            ...lines.slice(editor.cursorLine + 1)
          ];
          setEditor(prev => ({ 
            ...prev, 
            content: newLines.join('\n'),
            cursorLine: prev.cursorLine + 1,
            cursorCol: 0,
            mode: 'insert',
            message: '-- INSERT --'
          }));
          break;
        case 'x':
          // Delete character under cursor
          const currentLines = editor.content.split('\n');
          if (currentLines[editor.cursorLine]) {
            const line = currentLines[editor.cursorLine];
            const newLine = line.slice(0, editor.cursorCol) + line.slice(editor.cursorCol + 1);
            currentLines[editor.cursorLine] = newLine;
            setEditor(prev => ({ ...prev, content: currentLines.join('\n') }));
          }
          break;
        case 'ArrowLeft':
        case 'h':
          setEditor(prev => ({ ...prev, cursorCol: Math.max(0, prev.cursorCol - 1) }));
          break;
        case 'ArrowRight':
        case 'l':
          const currentLine = editor.content.split('\n')[editor.cursorLine] || '';
          setEditor(prev => ({ ...prev, cursorCol: Math.min(currentLine.length, prev.cursorCol + 1) }));
          break;
        case 'ArrowUp':
        case 'k':
          setEditor(prev => ({ ...prev, cursorLine: Math.max(0, prev.cursorLine - 1) }));
          break;
        case 'ArrowDown':
        case 'j':
          const totalLines = editor.content.split('\n').length;
          setEditor(prev => ({ ...prev, cursorLine: Math.min(totalLines - 1, prev.cursorLine + 1) }));
          break;
        case 'Escape':
          setEditor(prev => ({ ...prev, mode: 'normal', message: '' }));
          break;
      }
    } else if (editor.mode === 'insert') {
      if (e.key === 'Escape') {
        setEditor(prev => ({ ...prev, mode: 'normal', message: '' }));
      } else if (e.key === 'Backspace') {
        const lines = editor.content.split('\n');
        const currentLine = lines[editor.cursorLine] || '';
        
        if (editor.cursorCol > 0) {
          // Delete character before cursor on same line
          const newLine = currentLine.slice(0, editor.cursorCol - 1) + currentLine.slice(editor.cursorCol);
          lines[editor.cursorLine] = newLine;
          setEditor(prev => ({ 
            ...prev, 
            content: lines.join('\n'),
            cursorCol: prev.cursorCol - 1
          }));
        } else if (editor.cursorLine > 0) {
          // Join with previous line
          const prevLine = lines[editor.cursorLine - 1] || '';
          const newPrevLine = prevLine + currentLine;
          const newLines = [
            ...lines.slice(0, editor.cursorLine - 1),
            newPrevLine,
            ...lines.slice(editor.cursorLine + 1)
          ];
          setEditor(prev => ({ 
            ...prev, 
            content: newLines.join('\n'),
            cursorLine: prev.cursorLine - 1,
            cursorCol: prevLine.length
          }));
        }
      } else if (e.key === 'Enter') {
        // Insert new line
        const lines = editor.content.split('\n');
        const currentLine = lines[editor.cursorLine] || '';
        const beforeCursor = currentLine.slice(0, editor.cursorCol);
        const afterCursor = currentLine.slice(editor.cursorCol);
        
        const newLines = [
          ...lines.slice(0, editor.cursorLine),
          beforeCursor,
          afterCursor,
          ...lines.slice(editor.cursorLine + 1)
        ];
        
        setEditor(prev => ({ 
          ...prev, 
          content: newLines.join('\n'),
          cursorLine: prev.cursorLine + 1,
          cursorCol: 0
        }));
      } else if (e.key.length === 1) {
        // Insert character
        const lines = editor.content.split('\n');
        const currentLine = lines[editor.cursorLine] || '';
        const newLine = currentLine.slice(0, editor.cursorCol) + e.key + currentLine.slice(editor.cursorCol);
        lines[editor.cursorLine] = newLine;
        
        setEditor(prev => ({ 
          ...prev, 
          content: lines.join('\n'),
          cursorCol: prev.cursorCol + 1
        }));
      }
    } else if (editor.mode === 'command') {
      if (e.key === 'Enter') {
        const command = editor.message.slice(1); // Remove ':'
        handleVimCommand(command);
        // Reset to normal mode after a brief delay to ensure command executes
        setTimeout(() => {
          if (editor.isOpen) {
            setEditor(prev => ({ ...prev, mode: 'normal', message: '' }));
          }
        }, 10);
      } else if (e.key === 'Escape') {
        setEditor(prev => ({ ...prev, mode: 'normal', message: '' }));
      } else if (e.key === 'Backspace') {
        if (editor.message.length > 1) {
          setEditor(prev => ({ ...prev, message: prev.message.slice(0, -1) }));
        } else {
          setEditor(prev => ({ ...prev, mode: 'normal', message: '' }));
        }
      } else if (e.key.length === 1) {
        setEditor(prev => ({ ...prev, message: prev.message + e.key }));
      }
    }
  };

  const handleNanoKeyDown = (e: KeyboardEvent) => {
    if (e.ctrlKey) {
      switch (e.key) {
        case 'o': // Save
          updateFileContent(currentPath, editor.filename, editor.content);
          setEditor(prev => ({ ...prev, message: 'File saved' }));
          break;
        case 'x': // Exit
          updateFileContent(currentPath, editor.filename, editor.content);
          setEditor({
            isOpen: false,
            editor: null,
            filename: '',
            content: '',
            mode: 'normal',
            cursorLine: 0,
            cursorCol: 0,
            message: '',
            path: ['/'] // Add missing path property
          });
          const newLines = [
            ...lines,
            <TerminalText key="nano-saved" textType="info">File saved and nano exited</TerminalText>
          ];
          setLines(newLines);
          break;
      }
    } else if (e.key === 'Backspace') {
      setEditor(prev => ({ ...prev, content: prev.content.slice(0, -1) }));
    } else if (e.key === 'Enter') {
      setEditor(prev => ({ ...prev, content: prev.content + '\n' }));
    } else if (e.key.length === 1) {
      setEditor(prev => ({ ...prev, content: prev.content + e.key }));
    }
  };

  const handleSudoPasswordInput = async (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      // Check if password is correct (only accept "Password")
      if (currentInput === 'Password') {
        // Store the command and path before resetting state
        const commandToExecute = sudoState.pendingCommand;
        const pathToUse = [...sudoState.pendingPath];
        
        // Show the password prompt line (nothing visible was typed)
        const newLines = [
          ...lines,
          <div key={`sudo-pass-${lines.length}`} className="font-mono mb-1 flex items-center">
            <span style={{ color: '#ffff00' }}>[sudo] password for {username}: </span>
          </div>
        ];
        setLines(newLines);
        
        // Reset sudo state and input FIRST
        setSudoState({
          isWaitingForPassword: false,
          pendingCommand: '',
          pendingPath: [],
          attempts: 0
        });
        setCurrentInput('');
        setCursorPosition(0);
        
        // Execute with root privileges using stored values
        const wasRoot = isRoot;
        setIsRoot(true);
        const sudoResult = await executeCommandWithPath(commandToExecute, pathToUse, false, true);
        setIsRoot(wasRoot); // Restore original root status
        
        // Update path if changed
        if (sudoResult.newPath) {
          setCurrentPath(sudoResult.newPath);
        }
      } else {
        // Wrong password - increment attempts
        const newAttempts = sudoState.attempts + 1;
        
        const newLines = [
          ...lines,
          <div key={`sudo-pass-${lines.length}`} className="font-mono mb-1 flex items-center">
            <span style={{ color: '#ffff00' }}>[sudo] password for {username}: </span>
          </div>,
          <TerminalText key={`sudo-wrong-${lines.length}`} textType="error">Sorry, try again.</TerminalText>
        ];
        setLines(newLines);
        
        if (newAttempts >= 3) {
          // After 3 failed attempts, give up
          const finalLines = [
            ...newLines,
            <TerminalText key={`sudo-failed-${lines.length}`} textType="error">sudo: 3 incorrect password attempts</TerminalText>
          ];
          setLines(finalLines);
          
          // Reset sudo state completely
          setSudoState({
            isWaitingForPassword: false,
            pendingCommand: '',
            pendingPath: [],
            attempts: 0
          });
        } else {
          // Update attempts but stay in password mode
          setSudoState(prev => ({
            ...prev,
            attempts: newAttempts
          }));
        }
        
        setCurrentInput('');
        setCursorPosition(0);
      }
    } else if (e.key === 'Backspace') {
      if (cursorPosition > 0) {
        const newValue = currentInput.slice(0, cursorPosition - 1) + currentInput.slice(cursorPosition);
        setCurrentInput(newValue);
        setCursorPosition(cursorPosition - 1);
      }
    } else if (e.key.length === 1) {
      const newValue = currentInput.slice(0, cursorPosition) + e.key + currentInput.slice(cursorPosition);
      setCurrentInput(newValue);
      setCursorPosition(cursorPosition + 1);
    }
  };

  // Add global key listener
  useEffect(() => {
    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [handleGlobalKeyDown]);

  // Text Editor Interface (renders directly in terminal)
  const renderVimInterface = () => {
    if (!editor.isOpen || editor.editor !== 'vim') return null;

    const editorLines = editor.content ? editor.content.split('\n') : [''];
    const totalLines = Math.max(editorLines.length, 1);
    const displayLines = 20; // Number of lines to show in the editor

    return (
      <div className="w-full h-full flex flex-col">
        {/* Editor content area - fixed height */}
        <div className="flex-1 min-h-0 overflow-hidden">
          {/* Content lines */}
          {Array.from({ length: displayLines }, (_, i) => {
            const line = editorLines[i];
            const isContentLine = i < editorLines.length;
            const isCurrentLine = i === editor.cursorLine;
            
            return (
              <div key={i} className="font-mono h-8 flex items-center relative py-1">
                {isContentLine ? (
                  <span className="text-green-400 relative w-full">
                    {line || (isCurrentLine ? '' : ' ')}
                    {/* Show cursor only on current line */}
                    {isCurrentLine && (
                      <>
                        {/* Always use block cursor in both normal and insert modes */}
                        <span 
                          className="absolute bg-green-400 text-black flex items-center justify-center animate-pulse"
                          style={{ 
                            left: `${editor.cursorCol * 0.6}em`,
                            width: '0.6em',
                            height: '1.2em',
                            top: '0.1em' // Move cursor down slightly to match ~ character vertical centering
                          }}
                        >
                          {line && line[editor.cursorCol] ? line[editor.cursorCol] : ' '}
                        </span>
                      </>
                    )}
                  </span>
                ) : (
                  <span className="text-blue-500 flex items-start h-full pt-2">~</span>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Fixed status line at bottom */}
        <div className="border-t border-green-500 bg-green-900 text-white px-2 py-1 font-mono text-sm h-8 flex items-center flex-shrink-0">
          {editor.mode === 'insert' && '-- INSERT --'}
          {editor.mode === 'command' && editor.message}
          {editor.mode === 'normal' && (
            <span>
              "{editor.filename || '[No Name]'}" {totalLines}L, {editor.content.length}C
              {editor.content !== '' && ' [Modified]'}
            </span>
          )}
        </div>
      </div>
    );
  };

  const renderNanoInterface = () => {
    if (!editor.isOpen || editor.editor !== 'nano') return null;

    return (
      <div className="nano-interface w-full h-full">
        {/* Header */}
        <div className="bg-white text-black px-2 py-1 font-mono text-sm">
          GNU nano 5.4    {editor.filename}    Modified
        </div>
        
        {/* Editor content */}
        <div className="flex-1 p-2 font-mono text-green-400 whitespace-pre-wrap overflow-auto">
          {editor.content}
          <span className="bg-green-400 text-black">_</span>
        </div>
        
        {/* Bottom status */}
        <div className="bg-white text-black px-2 py-1 font-mono text-sm space-y-1">
          <div>^G Get Help  ^O Write Out  ^W Where Is   ^K Cut Text   ^J Justify</div>
          <div>^X Exit      ^R Read File  ^\ Replace    ^U Uncut Text ^T To Spell</div>
        </div>
      </div>
    );
  };

  const handleVimCommand = (command: string) => {
    const cmd = command.trim();
    
    if (cmd === 'w' || cmd === 'write') {
      // Save file
      if (!editor.filename && editor.content.trim() !== '') {
        // No filename specified and has content - require filename
        setEditor(prev => ({ 
          ...prev, 
          mode: 'normal', 
          message: 'E32: No file name' 
        }));
        return;
      }
      
      if (!editor.filename && editor.content.trim() === '') {
        // No filename and no content - nothing to save
        setEditor(prev => ({ 
          ...prev, 
          mode: 'normal', 
          message: 'E32: No file name' 
        }));
        return;
      }
      
      // Try to update existing file first, then create new file if it doesn't exist
      let success = updateFileContent(editor.path, editor.filename, editor.content);
      
      if (!success) {
        success = createFile(editor.path, editor.filename, editor.content);
      }
      
      if (success) {
        const lines = editor.content.split('\n').length;
        setEditor(prev => ({ 
          ...prev, 
          mode: 'normal', 
          message: `"${editor.filename}" ${lines}L, ${editor.content.length}C written` 
        }));
      } else {
        setEditor(prev => ({ 
          ...prev, 
          mode: 'normal', 
          message: `E13: Permission denied writing "${editor.filename}"` 
        }));
      }
    } else if (cmd.startsWith('w ')) {
      // Save with filename
      const filename = cmd.slice(2).trim();
      if (filename) {
        // Try to update existing file first, then create new file if it doesn't exist
        let success = updateFileContent(editor.path, filename, editor.content);
        if (!success) {
          success = createFile(editor.path, filename, editor.content);
        }
        
        if (success) {
          const lines = editor.content.split('\n').length;
          setEditor(prev => ({ 
            ...prev, 
            filename: filename,
            mode: 'normal', 
            message: `"${filename}" ${lines}L, ${editor.content.length}C written` 
          }));
        } else {
          setEditor(prev => ({ 
            ...prev, 
            mode: 'normal', 
            message: `E13: Permission denied writing "${filename}"` 
          }));
        }
      }
    } else if (cmd === 'wq' || cmd === 'x') {
      // Save and quit
      if (!editor.filename && editor.content.trim() !== '') {
        // No filename specified and has content - require filename
        setEditor(prev => ({ 
          ...prev, 
          mode: 'normal', 
          message: 'E32: No file name' 
        }));
        return;
      }
      
      // Save the file first
      let saveSuccess = false;
      if (!editor.filename && editor.content.trim() === '') {
        saveSuccess = true; // No filename and no content - just quit
      } else {
        // Try to update existing file first, then create new file if it doesn't exist
        saveSuccess = updateFileContent(editor.path, editor.filename, editor.content);
        if (!saveSuccess) {
          saveSuccess = createFile(editor.path, editor.filename, editor.content);
        }
      }
      
      if (saveSuccess) {
        exitVim(!editor.filename && editor.content.trim() === '' 
          ? undefined 
          : `"${editor.filename}" written`);
      } else {
        setEditor(prev => ({ 
          ...prev, 
          mode: 'normal', 
          message: `E13: Permission denied writing "${editor.filename}"` 
        }));
      }
    } else if (cmd.startsWith('wq ')) {
      // Save with filename and quit
      const filename = cmd.slice(3).trim();
      if (filename) {
        // Try to update existing file first, then create new file if it doesn't exist
        let saveSuccess = updateFileContent(editor.path, filename, editor.content);
        if (!saveSuccess) {
          saveSuccess = createFile(editor.path, filename, editor.content);
        }
        
        if (saveSuccess) {
          exitVim(`"${filename}" written`);
        } else {
          setEditor(prev => ({ 
            ...prev, 
            mode: 'normal', 
            message: `E13: Permission denied writing "${filename}"` 
          }));
        }
      }
    } else if (cmd === 'q') {
      // Quit (only if no changes or file is saved)
      exitVim();
    } else if (cmd === 'q!') {
      // Force quit without saving
      exitVim();
    } else {
      // Unknown command
      setEditor(prev => ({ 
        ...prev, 
        mode: 'normal', 
        message: `E492: Not an editor command: ${cmd}` 
      }));
    }
  };

  const exitVim = (message?: string) => {
    setEditor({
      isOpen: false,
      editor: null,
      filename: '',
      content: '',
      mode: 'normal',
      cursorLine: 0,
      cursorCol: 0,
      message: '',
      path: ['/']
    });
    
    // Only add exit message if there is one, don't add a static prompt line
    if (message) {
      const newLines = [
        ...lines,
        <TerminalText key="vim-exit" textType="info">{message}</TerminalText>
      ];
      setLines(newLines);
    }
    
    // Reset input state to ensure terminal is ready for next command
    setCurrentInput('');
    setCursorPosition(0);
  };

  return (
    <>
      <section 
        className="min-h-screen bg-black flex flex-col justify-center items-center p-4 pt-20"
        style={{ cursor: 'default' }}
      >
        {systemBricked ? (
          /* Terry Davis Easter Egg - System Completely Destroyed */
          <div className="w-full max-w-6xl h-[60vh] bg-black border border-red-500 rounded-md flex items-center justify-center relative overflow-hidden">
            <style jsx>{`
              @keyframes pulse {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.8; transform: scale(1.05); }
              }
              @keyframes glow {
                0%, 100% { box-shadow: 0 0 20px rgba(255, 0, 0, 0.5); }
                50% { box-shadow: 0 0 40px rgba(255, 0, 0, 0.8); }
              }
              .terry-container {
                animation: pulse 2s infinite, glow 3s infinite;
              }
            `}</style>
            <div className="text-center terry-container">
              <img 
                src="/terry.jfif" 
                alt="Terry Davis - TempleOS Creator" 
                className="max-w-full max-h-[400px] object-contain rounded-md shadow-2xl mx-auto"
                style={{ 
                  filter: 'brightness(1.1) contrast(1.2) saturate(1.1)',
                }}
              />
              <div className="mt-4 text-center">
                <p className="text-red-500 font-mono text-lg mb-2 font-bold">WHY DID YOU DO THAT!</p>
              </div>
            </div>
          </div>
        ) : (
          /* Normal Terminal Window */
          <div className="w-full max-w-6xl h-[60vh] bg-black border border-[#00ff00] rounded-md">
            {/* Terminal Title Bar */}
            <div className="bg-[#003300] border-b border-[#00ff00] px-3 py-2 rounded-t-md flex items-center justify-between">
              <div className="text-sm font-mono text-white font-medium flex-1 text-center">
                {isRoot ? 'root' : username}@portfolio-site
              </div>
              <div className="flex items-center space-x-1">
                {/* Windows-style controls on right */}
                <div className="w-6 h-5 bg-gray-400 hover:bg-gray-500 flex items-center justify-center text-black text-xs font-bold cursor-pointer transition-colors">−</div>
                <div className="w-6 h-5 bg-gray-400 hover:bg-gray-500 flex items-center justify-center text-black text-xs font-bold cursor-pointer transition-colors">□</div>
                <div className="w-6 h-5 bg-red-500 hover:bg-red-600 flex items-center justify-center text-white text-xs font-bold cursor-pointer transition-colors">×</div>
              </div>
            </div>
            
            {/* Terminal Content */}
            <div 
              className="terminal-section bg-black font-mono text-sm md:text-base select-none p-4 overflow-hidden rounded-b-md relative" 
              style={{ 
                cursor: 'default', 
                height: 'calc(100% - 2.5rem)',
                background: `
                  linear-gradient(transparent 50%, rgba(0, 255, 0, 0.03) 50%),
                  black
                `,
                backgroundSize: '100% 4px'
              }}
            >
              <div className="h-full flex flex-col" style={{ cursor: 'default' }}>
                <div className="overflow-y-auto flex-grow" style={{ cursor: 'default', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  {/* Show editor interface if editor is open */}
                  {editor.isOpen ? (
                    <>
                      {renderVimInterface()}
                      {renderNanoInterface()}
                    </>
                  ) : (
                    <>
                      {/* Normal terminal content */}
                      {lines.map((line, index) => (
                        React.isValidElement(line) && line.type === TerminalText ? line : <TerminalText key={index} delay={0.01 * index}>{line}</TerminalText>
                      ))}
                      {sudoState.isWaitingForPassword ? (
                        <div className="font-mono mb-1 flex items-center">
                          <span style={{ color: '#ffff00' }}>[sudo] password for {username}: </span>
                          <span className="bg-white text-black animate-pulse inline-block" style={{ width: '0.6em', height: '1.2em', lineHeight: '1.2em' }}>
                            &nbsp;
                          </span>
                        </div>
                      ) : (
                        <TerminalInput
                          prompt={getPrompt()}
                          value={currentInput}
                          cursorPosition={cursorPosition}
                          onChange={handleInputChange}
                          onEnter={() => handleCommand(currentInput)}
                          onTab={handleTabCompletion}
                          onHistoryUp={handleHistoryUp}
                          onHistoryDown={handleHistoryDown}
                          delay={0.05 * lines.length}
                          isPasswordMode={false}
                        />
                      )}
                      <div ref={terminalEndRef} />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default Hero; 