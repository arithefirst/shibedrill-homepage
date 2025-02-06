---
'title': 'Operational Security For The New-Age Antifascist'
'date': 2025-2-6 EST
'tags': ['security', 'privacy']
---

#

With the rising threats of state-actor-backed censorship, surveillance, and exploitation, right now is a fantastic time to lean into a more cybersecurity focused mindset with regards to the tech we use every single day. But where do you start if you're not the typical Linux power-user?

<!-- more -->

*You can download this post as a Markdown file [here](/src/content/posts/security-for-the-antifascist.md).*

- A quick foreword: This guide does not assume any preexisting knowledge with regards to Linux, cybersecurity, cryptography, or any other fields. This is strictly a layman's handbook. You do not need to install any specific operating system or buy any specific hardware for this guide to be useful to you. If you wanted a QubesOS review, maybe look elsewhere.

So. The United States elected a rather unsavory *(cough, cough, FASCIST)* figure to the Presidency, and his billionaire handler has begun [*literally breaking into government offices*](https://newrepublic.com/post/191019/elon-musk-aides-opm-lock-out-federal-workers-computer-systems) to install his own lackeys and backdoor federal data-handling systems. Websites about critical information are [being taken down overnight](https://www.npr.org/sections/shots-health-news/2025/01/31/nx-s1-5282274/trump-administration-purges-health-websites), without warning. Who's to say this isn't the start of a larger campaign of censorship and information control that might eventually (directly) target civilians? There's already been reports that spyware vendors like Paragon [do serve the United States](https://techcrunch.com/2025/02/04/spyware-maker-paragon-confirms-u-s-government-is-a-customer/) as a customer. Us USAmericans need to step up our cybersecurity game in the face of the new age of fully-automated computerized fascism.

## Prologue

This guide goes out to a lot of people. Namely, my friend Dev, who taught me how to use and embrace cryptography. It also goes out to some real life friends who wanted me to tell them more about cybersecurity, but weren't familiar with all the jargon.

This guide is all about reducing attack surface. The more things that can go wrong, the more things that can be leaked or lost or tampered, the greater your attack surface is. The recommendations here are not all-or-nothing. I intentionally kept things tame, because I want this to be accessible to people who have NO IDEA what the fuck security is all about, and aren't as willing to sacrifice conveniences as I am. Take whichever steps feel right to you, don't take the ones you don't feel confident about. Always consult the manual, don't do anything rash. Try to understand how everything affects *your* personal attack surface, and take steps to reduce it or map it out.

DISCLAIMER: This guide is not perfect! Some of the information in this guide is going to be wrong. I do not claim to be an expert, and I acknowledge that I have the capacity to make mistakes, even big ones. To the best of my knowledge at the time of writing, this guide is accurate, and representative of consensus best practices in the security world.

Some practical advice for you before we begin:

- Use strong, unique passwords wherever possible. If you can't remember them, use a password manager. I use [Bitwarden](https://bitwarden.com/).
- Do not ever download software from sources you do not trust.
- When adopting new software, try to go for options that are open source.
- Do not ever follow advice from strangers on the internet telling you to modify your system somehow. If you are uncomfortable, stop, step back, and look at where you are and what you've done. Take instructions only from sources you trust.
- Security is a journey, not a destination. Do not chase "perfect". Anything that makes an adversary's life harder is worthwhile.
- Never plug in random USBs. Never use airport phone chargers.

Let's begin.

## Part 1: Threat Models

The first step to a more secure lifestyle in the digital age is to identify the things you want to protect. Typically, this includes things like:

- Chat logs and emails
- Real-world identifying data
- Photos and videos
- Passwords, usernames, other credentials
- Activities
- Purchase histories
- Location and location history
- Credit cards and financial data
- Web traffic and history
- Search engine queries and history
- Controlled data from a job or institution
- Social media posts, likes, follows, and replies

And if you're one of the people who's a little less... "orthodox" in their Internet usage, or you happen to be some kind of journalist or whistleblower, your list might be a little longer:

- Cryptographic keys
- Cryptocurrency wallets and transaction logs
- Encryption keys
- Controlled or illegal data
- Evidence or incriminating data
- Censored information
- Activities on illegal or monitored forums
- Product invoices

Look at your digital life and create a list of the other things you want to protect- make sure to consider the services you use, and what kind of data they might have from you, both stored & temporarily. Think about how important each item and piece of data is, and begin brainstorming the possible consequences for the data being lost or leaked, what entities pose threats to this data, as well as measures which could possibly protect that data.

So what can be done? To determine what we can do to protect a piece of data, we have to look at the nature of that data. Do you continuously produce this data? Does this data ever travel across the internet? Looking at these factors, data can be classified into two types: Data at rest, and data in motion. Data at rest typically stays in one place, and does not travel across the internet frequently. Data in motion is produced constantly, and does often travel across the internet.

## Part 2: Data At Rest

### Protecting User Data

To protect data at rest, the best method is via encryption. Encryption can be used to obscure and protect the contents of an entire hard drive on a computer, the contents of a USB drive, or even individual files. When you access data on an encrypted drive, that drive must first be mounted & decrypted, and all the data on the drive is directly available in the OS as long as that drive remains mounted. For a full-disk encryption setup, this means that all the data on the drive is vulnerable once the machine is booted and the password is input. A good practice might be to secure highly sensitive data in an encrypted file or partition which is only ever mounted when the data inside *needs* to be accessed.

Most Android and iOS devices are encrypted by default. Your specific make/model *might* not support encryption, but almost all modern phones do. This encryption is backed by your phone's password or PIN, not your biometrics, so make sure you choose a strong password. Same as your computer, this encryption is rendered useless as soon as the phone boots and is unlocked for the first time, which is when the user data partition is decrypted.

- Side note: You may want to consider disabling biometric login on your devices, as you can be legally compelled to give your biometrics over to the authorities.

To encrypt your computer's hard drive, you have quite a few options available to you. Windows can use BitLocker or VeraCrypt, Linux uses the Linux Unified Key Setup (LUKS), and macOS uses FileVault. Most of these solutions also allow you to create encrypted container files, which are individual files that act like encrypted disk volumes. The options for doing this on mobile phones are virtually nonexistant, though, so you will probably *need* a PC or mac for that. Apps that claim to encrypt or hide files are typically either falsely advertising or poorly implemented to the point where you might as well not be encrypting the data at all.

- Tip: If you regularly use a USB drive to transfer data between your devices... Please encrypt it. And if you have a USB (or any kind of) drive that you've *previously stored* sensitive data on, it would be a good idea to securely erase it, as files are typically recoverable after deleting until all of the used blocks have been overwritten. Linux offers the `shred` command, as well as the good ol' `dd if=/dev/urandom`, but I am unfamiliar with whatever Windows or macOS alternatives might exist.

Securing data on a booted operating system is a little harder. It's important to set proper access controls on your files, so other users on a multi-user system cannot access it. Only give permissions to programs and users when it is strictly necessary. Use an antivirus such as Windows Defender (Windows) or ClamAV (Linux) to keep malware from spreading on a booted system.

Lastly, like I mentioned, encryption is useless once your system is booted. As such, you should never leave a booted system unattended, for any length of time. Running to the bathroom at a coffee shop? Shut it down fully. Put it in your bag if you want to prevent tampering or theft. Leaving your system running (and especially unlocked) while you're away from it leaves too much of an opportunity for nefarious deeds and defeats the point of encryption.

### Tamper-Proofing Bootable Code

While encryption may protect data on the user partition of a computer, the kernel still needs to boot first to mount and decrypt that data. Hence, the operating system code itself is still vulnerable to modification, even on an encrypted machine. Secure Boot is a technology present in newer UEFI firmwares that aims to combat this by "signing" the bootable code, and refusing to boot if the signature is incorrect. This is mainly a tamper-evident mechanism to prevent users from unknowingly booting a kernel that is tainted with malware.

Again, mobile phone operating systems have their own implementation of this. Android has `dm-verity`, and iOS likely has something similar. The phone will simply refuse to boot if the system partition has been modified without the permission of the operating system, which would trigger the re-signing of the boot image.

### Cold Storage

Another way to protect infrequently used data is via secure backups and airgapping. If you almost never access the data, you might want to put it into "cold storage", so to speak. The best ways to do this (in decreasing order of reliability) are tape drives, archival grade CDs, hard disk drives, and flash storage like USB flash drives and SSDs.

| Method | Cost | Complexity | Reliability | Notes |
|---|---|---|---|---|
| Tape drives | $$$ | High | High | Requires good climate control, and one extra tape for accounting and metadata. |
| Compact disks | $$ | Low | High | Requires a CD drive that can burn. Also, CDs are only writable once. |
| Hard disk drives | $$ | High | Medium | Hard drives have a habit of failing due to their mechanical nature. You also cannot ever drop them. |
| Flash cells | $ | Low | Low | Flash cells naturally leak charge over time and have a very limited shelf life. |

Before archiving or backing up a piece of data, consider: Do you *need* it? What would happen if you were to lose it? It is unlikely that you will need to store your full rip of every Mythbusters episode, but you might want to archive important financial records or ownership documents so you can reference them down the line. If this data is sensitive, you may consider encrypting it. To protect it against physical damage or theft, you might want to store it in a safe or a fireproof, floodproof document box or a safe. Make sure it's certified by a reputable organization, like the Underwriter's Laboratories.

## Part 3: Data In Transit

### Encryption In Motion

Encryption isn't *purely* for data at rest, though. Using public-key cryptography, all sorts of data can be encrypted in transit. You unknowingly use this technology every single day in the form of HTTPS, a public-key protocol used to encrypt web traffic. You can use PKC to encrypt emails, chat communications, files to transfer, and text messages sent over insecure channels. You can also use it to prove the identity of an individual, or the integrity of a file, via signing. Pretty Good Privacy, PGP, is one of the more commonly used cryptographic standards, and there does exist cross-platform software to handle it. The Mozilla Thunderbird email client supports creating and using PGP encryption within the application itself. Consider learning how to use PKC, and using services that implement their own cryptography, such as [Signal](https://signal.org).

Public-Key Cryptography is a means by which data is encrypted by a "public" key, and decrypted with a "private" key. This means you can share data across an insecure channel, without having to communicate a password across that channel. Data intended for Bob is encrypted using his public key, which results in it only being able to be decrypted using his corresponding private key, which only Bob will ever see.

Signing data cryptographically means using your private key to produce a value that can be verified using your public key. It would be impossible to produce a working signature for Jill's public key, without being in posession of Jill's private key as well. Therefore, a working signature proves that Jill is the real owner of the private key... all without divulging its actual contents. It also proves that the signed data originated from Jill.

If you're interested in using PKC for ensuring confidentiality or integrity of data in transport, you can either use Thunderbird as mentioned earlier, or use Kleopatra (available on Linux, as well as on Windows via GPG4win) to generate a keypair. Then you can send your public key to trusted parties, and import their public keys, to begin sending encrypted or signed data between each other.

### Obscuring Internet Traffic

And now that we're talking about data in transit, it's time to discuss the matter of web browsing and web services. Search engines like Google, and websites like Facebook, collect and aggregate terabytes of data about their users, and it is well known that this data is *not* private. You can reduce your data footprint by using alternative services for searching, as well as refraining from using sites that do not respect user privacy. You can use extensions to block cookies and trackers, and alternative search engines like DuckDuckGo may provide marginally better privacy than Google or Bing. For the utmost privacy, you may want to consider using Tor Browser, which anonymizes network traffic by splitting it across many different network nodes. VPNs may also increase your privacy by obscuring your IP address and its location, but a VPN does not provide any more security with regards to the contents of your web traffic, unless you browse exclusively HTTP-only sites. If you are especially worried about your traffic being monitored, use public Wi-Fi networks with passwords set, in conjunction with Tor.

If you are looking for a privacy-respecting VPN, I suggest [Mullvad](https://mullvad.net/).

| Method | How It Works | Drawbacks |
|---|---|---|
| HTTPS | Encrypts web traffic | Domain names visible to ISP, network |
| VPN | Tunnels traffic elsewhere | Most VPN providers keep logs, not much more secure |
| Tor | Splits connection and routes elsewhere | Very, very slow |

### You Are The Data

You produce a lot of data as you move through the world. Your phone, your laptop, your credit card, even your *car* transmit data that can be used to identify you. Facial recognition technology is advanced enough to pick you out from a crowd of hundreds, and America's highway system is littered with automatic license plate readers which transmit your car's whereabouts to huge databases, timestamps included. There is data literally pouring off of you, all the time, and there's always ears listening for it.

One thing you can look at is what kinds of wireless technologies your devices use, and what kinds of information they transmit. Does your device work with Apple's tracker network? Do you have Wi-Fi roaming enabled? Does your phone have Bluetooth searching on all the time? These technologies, while convenient, make it easy for other entities to pinpoint your whereabouts at any given time. Wireless-capable devices have unique identifiers, called addresses, that can possibly identify their holders. It also goes without saying that if your phone automatically connects to a wireless network, that event is recorded somewhere. This applies to Wi-Fi, Bluetooth, and cellular data. If you want to be certain that your presence in a location is mostly undetected, either put your phone on airplane mode and disable all its wireless connectivity, or shut it down entirely. Your laptop may also transmit information while sleeping, so keep it shut down as long as it's not in use.

### Which Means Your Face Is Data, Too

Have you ever been to an ATM? A self-checkout kiosk? A Coca-Cola Freestyle soda fountain? Have you ever seen a screen displaying ads outside a store, or displaying drinks on a drink cooler door? Well, let me tell you something. Anywhere there's a *screen*, there's a *camera*, and wherever there's a camera, it's pointed at your face. They have many purposes- cameras on ATMs and self-checkouts are for monitoring potential criminal use, and cameras on advertising displays and drink coolers gauge your reactions to the content on the screen to more finely-tune ad content. But regardless, the abundance of cameras ensures that your face is being perpetually transmitted to some unknown location, for uses which are not immediately clear or disclosed. One way to throw a wrench in the works is to wear a mask when in public. N95 masks and surgical masks work, but in the winter and fall, you can get away with cold-weather face coverings, such as scarves, balaclavas, ski masks, and neck gaiters. Just be careful not to run into a police officer who might shoot you dead because he felt "threatened" by you.

### Dirty Money

It should go without saying that almost any form of electronic payment is traceable and trackable. If you intend to avoid leaving a paper trail while moving around in an urban area, then abstain from using cards, aside from cards that can be purchased anonymously with cash (such as Metro cards). With cards such as those, only buy in small amounts, and use and dispose of the entire thing before you turn towards home. If you're super paranoid, use gloves to ensure your fingerprints aren't left behind on the card or any point of payment.

One last thing: Any machine that is designed to dispense bills likely also keeps track of the serial numbers of every bill inserted or dispensed. Self checkout machines also keep a record of your face in conjunction with your purchase receipt, and whichever membership cards, credit cards, gift cards, or paper bills you used to pay for your items. Keep this in mind while buying items that may be potentially regulated in the future. Purchasing things such as birth control, Plan B, basically any other contraceptive, pregnancy tests, prescribed or OTC hormone medication, prepaid phones or SIM/eSIM cards, and banned or challenged books, might produce transaction metadata that could be used to identify you in the future. When buying these items, use cash that you've obtained from a *cash drawer* as change for a larger bill, and avoid using gift/membership/reward/credit/debit cards. If you want to be extra careful, only handle your "laundered" bills with gloves, and make your purchases at stores you don't usually visit, in conjunction with facial coverings to make you harder to recognize.

### Social Media And Web Services

Social media is a huge dumping ground for tons of data that we produce. Snapchat harvests users' contacts, location, browsing habits, posting habits, and more. Almost all social media tracks its userbase. So reducing your data footprint is very much a matter of "how much do I want to give up?" and "how transparent is this platform?". Consider deleting posts from, and even deactivating/deleting, old social media profiles. Also consider auditing content posted to profiles you still use or don't intend to delete, to remove possibly identifying information. Keep in mind that images taken with your phone's camera can possibly contain the exact GPS coordinates of where they were taken, when they were taken, and what model of phone was used. Social media users may want to take care to strip the EXIF metadata from images before posting them online, and scour their profiles for images that do have such data. And lastly, think of what pieces of information tie your social profiles to your real-life profile. Could somebody find your real name or address from your social profile or vice versa? Is your account connected to another service, to which you're publicly registered under your full name?

When using a social platform, consider who owns it, and what their interests are. What do the owners of Facebook have to gain from handing your information to nefarious actors? Reddit? TikTok? GitHub? Think carefully before posting something that could be misinterpreted as against terms of service, or against the grain of that platform's sociocultural attitudes, or could serve as evidence of an illegal act at the state or federal level. Don't stand out if that's not your aim, and never miss a good chance to shut up. Never post photos or videos from protests or other acts of civil disobedience. Do not mention your presence, or the presence of others. If you are dead set on uploading media regarding a protest or demonstration, ensure the photos and videos have zero metadata attached, and blur the faces and identifying features of anyone in them. Do not post anything until long after it has concluded and everybody involved is safely home.

What types of web services do you use every day? What kind of data passes through servers that you do not control? Phone calls? Texts? Emails? Calendar events? Boarding passes? Location data? Are these services things you absolutely need? What kinds of benefits and drawbacks would there be to removing these services from your workflow or replacing them with something more transparent? What would happen if this data was sensitive, or leaked? Try to avoid using a service unless you really need it. The more services you use, the less control you have over your data, as it's less centralized.

## Thank You

I must give you my most heartfelt thanks for reading this. If I've piqued your interest in operational security, and you want to learn more advanced topics, please [contact me](/contact) and let me know. I'll be more than happy to write a Part 2!

I hope you thorougly enjoyed this guide, and learned a thing or two from it along the way. Be safe.

Revision: 0.1.0  
Last modified: 2025-02-06  
