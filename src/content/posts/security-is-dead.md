---
'title': 'Cybersecurity Is Dead (For Now)'
'date': 2025-12-13 EST
'tags': ['security']
---

#

Cybersecurity is dead- well, *has* been dead for a while- and will stay that way until the way we design and maintain our favorite software changes fundamentally.

<!-- more -->

## So What Do I Mean By This?

Cybersecurity is a field which, at least in the industry, consists of learning a few very basic concepts, applying them to your employer's existing tech in a test environment, and then spending a few months engaging in bureaucratic sparring matches with your superiors until your hardening proposals are either rejected or used as an impetus to fire you. So despite the fact that all our favorite software and hardware is deeply flawed, very little is even done to keep it as secure as it presently is- much less to harden it beyond its current state. Security is highly technical, difficult, and expensive, so nobody wants to acknowledge the work it takes to make a secure system, and people would rather talk about vibes-based solutions or trivial changes like security baselines.

The majority of the platforms and design patterns we use today have ancient lineages, many of which lead back to the 1960s or even earlier. The PC platform is a Frankenstein's Monster of modern monkey-wrench solutions, bolted onto the cold, bloated corpse of the IBM PC from 1981. The Linux Kernel began in 1991, when Linus Torvalds rewrote the Unix Kernel, which was invented in 1969 as a major improvement of Multics which began development in 1964. The NT kernel's ancestor, QDOS, is a distant child of the OS/8 operating system from 1971. Everything we use is written in C, a language from 1969, whose design roots date back to CPL in 1963. MacOS also uses a Unix-like kernel with similarly outdated roots.

Huge amounts of modern digital infrastructure were built on the concept of Linux "distributions", where a bunch of unrelated and disconnected parties maintain totally separate software projects which are then shipped downstream to another set of incommunicado developers who "package" said software for use in an OS installation. The interfaces between these programs are poorly defined, often archaic, and frequently buggy to the point of insecurity. The disconnect between developers, packagers, end users, and other developers ensures that solving major bugs with security implications take more time than necessary. Meanwhile, what remains is based on Windows, and Microsoft is too busy trying to eke out a little profit from its AI expenditure to bother making security improvements to their terribly dated OS paradigm. Their goal is to monetize the Windows platform by selling data to brokers and subscriptions to end users, and any kind of API breakage makes the lives of developers harder- which narrows the profit margins, as less software becomes available for the already struggling platform as it continues to change.

So instead of doing anything that would majorly improve the world of cybersecurity, a whole industry was built on identifying the weaknesses in the tech we already have, and figuring out ways to hammer them flat without addressing the systemic issues that underly them. We already have Windows and Linux, so what point is there in making something better? The sunk cost fallacy rears its ugly head at the slightest hint of leaving tradition behind. Software, hardware, and platforms must be **profitable** before they can be allowed to exist, which obviously presents a big chicken-and-egg problem. Something which doesn't exist cannot be profitable (unless it has shit-loads of funding and hype from venture capital investors, like AI).

Notice how good things cannot exist because they're not profitable until they're mature, but the tech industry is bending over backwards to squeeze profits out of a technology that hasn't proven a single iota of viability but has been the subject of an economic bubble the likes of which hasn't been since since 2001?

And this is the crux of our problem.

## How Our Current Systems Fall Short

Legacy compatibility is a big part of why technology today lacks security, due to the effort involved in porting anything to newer systems. The proper way around this is to use forwards-compatible API structures and adapters, but the APIs weren't designed to be forward-compatible in the first place, so we're back at square 1.

### Kernel Design

Today's kernels are majority monolithic kernel designs. This means that tons of functionality runs at the highest privilege level in the processor, which is Ring 0 on x86. Things like networking, filesystem drivers, and graphics all run within the kernel, either hardcoded or loaded dynamically as kernel modules. However, this design introduces far too much attack surface within the most privileged part of any computer system!!! Why is that?

Processors, as commanded to do so by the operating system, use special hardware such as the memory management unit (MMU) to enforce hard boundaries between processes. For example, one process may not access another process's address space unless it's explicitly mapped by the kernel. This is great, since each process can be distrusted around the others, and operate in isolation. But adding features directly to the kernel, so that any piece of code can influence any other piece of code, defeats this entirely!!! Why would we design such excellent isolation systems, only to throw it all away by running millions of lines of user-facing code outside the security boundaries the kernel is supposed to enforce?

The opposite of a monolithic kernel is a microkernel. In a microkernel, only things such as scheduling and memory/process management run in the kernel. The rest of the OS's functionality runs unprivileged as a process, with memory access fully mediated by the MMU. Now, the GPU driver cannot access *all* of physical memory- only the pages that actually lead to the GPU! Microkernels also have a far smaller maintenance burden, and are more flexible, as more software can be modified without a reboot. [seL4 is a formally verified microkernel that meets modern security requirements](https://sel4.systems/About/seL4-whitepaper.pdf), and exceeds every other extant kernel in almost every category.

### Access Control Models

Our current systems rely on old design patterns and paradigms that were created long before some of the most important security concepts of our day were formulated. For example, every operating system kernel available for general desktop, laptop, handheld, or mobile use is based on a kernel that uses a role-based access control model (Mach, Linux, and NT). This means that access to resources by some entity or process is specifically governed by a set of quantitative attributes ascribed to that object, and modulated through things such as access control lists (which provide their own quantitative restrictions). In all these systems, if you create a process as `user_A`, then that process inherits all the rights that `user_A` has, even if it's only meant to access one file. So you can run into things such as the Confused Deputy problem, which occurs when a privileged process is tricked into misusing its privilege. One applicable example is [that time a Steam install script malfunctioned and wiped a user's whole home directory](https://hackaday.com/2024/01/20/how-a-steam-bug-once-deleted-all-of-someones-user-data/), because it had all the same rights as the user *and* failed to check if a certain path was empty.

The proper way around this unsolvable problem with role-based access control is to use capabilities, which are fine-grain "keys" to individual objects, rather than ranks or roles which signify groups of objects. In a capability system, you tell a process to open a door and hand it a key. In a role system, you tell a process to open a door and hand it a fully loaded breaching shotgun.

### Packaging

Like I mentioned earlier, another major issue with today's software is the way it's distributed and packaged. Linux software developers rely on third parties to integrate their software with the rest of the software available within the ecosystem. If there's a security misconfiguration or an API incompatibility, there's always some degree of back-and-forth between the packagers and developers until it's even addressed. Hence, there's constant clashing between software developers and third parties who package the software improperly. Just look at the [fiasco regarding OBS Studio and Fedora's packaging team](https://www.gamingonlinux.com/2025/02/fedora-threatened-with-legal-action-from-obs-studio-due-to-their-flatpak-packaging/).

Not only is the way it's distributed and packaged directly damaging to security, but the way software gets installed on Linux is also a major hole in its nonexistent security model. Every single program and package in the system is part of the same package state, so any modifications require the highest privilege level possible, since dependency conflicts or transaction requests could even modify the kernel or the package manager itself. Things have improved with Flatpak, but Flatpak's sandboxing is questionable and overly permissive, and the base system is still an amalgam of packages which requires root to modify in a useful way.

Userspace software suites and kernels should be developed together, as one project, tightly coupled, and shipped as one single immutable product. This can be easily enforced using harware for a completely locked-down experience which prohibits a broken or invalid system state, including malicious tampering or accidental damage from an overly privileged user. User software should be forced to rely on a single, well-known, highly restrictive API which is enforced by more privileged software. [I talked about this at length in another post, about how these ideas could be better applied to Linux for more secure distributions](https://www.shibedrill.site/post/linux-packaging-sucks).

### Hardware Security

Think of how stupid it would be if, despite all these mitigations, someone could just modify your PC's kernel image or BIOS to include malicious code. Secure Boot helps, if your system is properly designed, manufactured, and configured. But if any kind of privileged code is unsigned or is not checked for integrity- such as your processor's built-in firmware or your UEFI firmware- the whole security model falls apart. This is why I can't stand people who willingly disable their system's security coprocessors or flash custom firmware in the name of "ditching proprietary software" or security, as it often makes security far, far worse.

Ultimately, the x86 boot chain is poorly secured (see my above remark on the dead, yet still beaten, horse of the IBM PC). Most firmware implementations are only secured by a password, which is trivial to lift from NVRAM and modify. Trusted Platform Modules often transmit data on unencrypted buses. Most systems don't disable writing to sensitive regions containing important security firmware. And because securing a system *properly* is very expensive, almost no OEMS bother to do so. The Linux Vendor Firmware Service reports that very few laptops or PCs available on the market today meet even the most basic security requirements, with trivial, glaring issues such as unsigned BIOS firmware or no support for Secure Boot. The only regions where hardware security is being even slightly innovated are the mobile and console industries. So far, though, only Google and their Pixel phones have proven themselves as secure platforms. Even Nintendo, with all their might, can't figure out how to deterr custom firmware enthusiasts.

## The Ways People *Think* They're Helping

None of these issues are actively talked about in mainstream cybersecurity discourse. For the most part, two things are mentioned: Tracking and "Free Open-Source Software". This seems to apply solely to the topic of surveillance and data exfiltration: "Anything that tracks me is bad, so I should make it impossible to track me. Anything closed-source *could* track me without knowing so it all must be bad!". This is obviously not true, on both fronts, but it's used as a talking point by open-source pundits who shill for false solutions such as "de-Googling" and using strictly open source software.

Tracking is a recurring topic in security discourse, and it mostly boils down to "I don't want anyone to even know I visited their website". Modern anti-fingerprinting and tracking resistance techniques used by actually secure software, such as the Vanadium browser from GrapheneOS, minimize *identifying* data in interactions with untrusted servers. But often, "privacy enthusiasts" will go out of their way to strip their outgoing requests of more data than is needed, which can make them stand out like a sore pimple on an itchy back. The truth of the matter is that your goal is to blend in as well as possible with the people around you. ISPs and web hosts are *going* to notice that some weirdo is browsing their site using Tor and running a billion extensions. They're not going to pay much attention to someone who uses a fairly common user-agent and exhibits no special or stand-out behavior. Blending in is a matter of being uninteresting. Don't buy a sports car if you don't want the cops to pull you over.

With regards to closed source software, the concern appears to be auditability. People believe that if they cannot understand what the software is doing, then it *must* be evil. However, auditability with regards to software behavior is **highly** limited. You can't say for sure what a program will do, even if it is open source, because that's the fucking [Halting Problem which is proven to be impossible to solve](https://en.wikipedia.org/wiki/Halting_problem). The only exception is if the program is formally, mathematically verified to be correct, and most software does not use verified compilers. In fact, because of this, [your compiler could be backdoored and infecting everything you've ever built from source](https://users.ece.cmu.edu/~ganger/712.fall02/papers/p761-thompson.pdf)! Take that, Gentoo nerds!

Furthermore, some people extend this distrust to the hardware, and go as far as to disable hardware features such as the Intel Management Engine or the AMD Platform Security Processor since these "could be spyware!" and run closed-source firmware. But of course, this is fruitless, as it is impossible to know what the processor itself is doing- unless you design and build one yourself, without a single integrated circuit or chip, or you're able to probe literally anywhere within any circuit within the silicon die at any given time. Every single processor on Earth runs *some* amount of closed-source firmware or microcode. It's impossible to escape.

[Computing is now a matter of social trust](https://users.ece.cmu.edu/~ganger/712.fall02/papers/p761-thompson.pdf). Before you use any piece of software or hardware, you must trust the entity that produced it. Which is why things like cryptographic signing and attestation matter now- while you cannot be sure of what the code will do, you have a promise from its producer that it will act within a certain specification. The rest is up to God, or whoever wrote your C compiler.

Ultimately, you can't avoid closed source software or tracking. Securing these elements has become a game of minimization and optimization. Some telemetry is good, some is bad. Some closed source software is good, even necessary. The trick is not to eliminate either, it's to find the configuration that maximizes how much you can reasonably assert about the system's correctness and behavior.

## Final Thoughts

How do we fix this catastrophe?

1. Software product development should be centralized, not decentralized.
2. Software should be *modular*, but developed as one product.
3. Software should rely heavily on well-defined, secure standards.
4. Software should be made by nonprofits with clear goals and strong governance.
5. Companies should be more willing to pay up for good security.
6. End users and developers should be more ready to embrace change.
7. People should be willing to admit that our current security concepts are outdated, and in dire need of an overhaul.

If technology in the industry cannot evolve to meet the demands of the times, and if people cannot learn that the way we're doing things is royally broken, there is no hope for cybersecurity. As it is, cybersecurity is dead and buried.

It's up to us- the newest generation of freaks, perverts, and computer jerks- to make it right.
