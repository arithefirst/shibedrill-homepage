---
'title': "We've Been Doing Linux All Wrong"
'date': 2025-4-21 EST
'tags': ['linux']
---

Ever since I began using Linux, I've always asked myself why there were so many issues with the way software is packaged, delivered, and managed. It's led me to think about the ways people have tried to fix this problem, and here, I provide my own thoughts on what I believe Linux packaging should begin embracing and what it needs to leave behind.

<!-- more -->

# Linux Packaging Sucks

I'd like to ask a rhetorical question to begin this thought exercise: Why do I need to become a local administrator (typically _root_, which is pretty bad for a number of reasons) to make any kinds of changes to packages on a traditional Linux system, using its native package manager?

The answer: Local admin permissions are needed because package management software- such as `dpkg`, `pacman`, and `dnf`- make zero distinction between software packages associated with the system, and those not associated with the system. To the package manager, there is no difference between the packages `spotify` (the music player) and `linux` (the operating system kernel). Hence, the user installing a package must contend with the package manager's solution to their request, possibly influencing system-critical packages in the process. Any transaction has the potential to modify some system component due to a dependency conflict. The result of this is that sometimes, installing strictly user-facing software can cause the package manager to behave unpredictably, and irreversibly damage the system, such as that one time installing Steam on Pop!\_OS would uninstall your entire desktop environment.

In response to this, a number of technologies have sprung forth. The most notable ones I can think of are backup systems like Timeshift, or BTRFS snapshots, as well as declarative systems with atomic updates like NixOS. Instead of separating user and system software, these solutions embrace the integration, and seek to allow a means by which to undo an undesirable change resulting in a broken or degraded system.

## Maladaptive Solutions

But I do not think that this is the right response to the problem at hand, which is the fact that it makes little sense to allow user software and system software to be a part of the same dependency web, and be handled as one monolithic set of functionalities. It should not be _possible_ for "Please install `steam`" to have the side effect of "Okay, your entire desktop environment has been destroyed now", much less should the development community be chasing for a way to recover from such a scenario. Installing a refrigerator in your house should not cause a dependency conflict with the load-bearing walls in your kitchen, especially if the only solution involves the mutually exclusive presence of either the fridge or the entire damn first floor. This is an understandable issue if the user was attempting to install a new infrastructural component, such as electrical or HVAC. But the role of the house is to provide a solid, reliable platform, on which additional user-facing accommodations and facilities may be furnished arbitrarily. Similarly, the role of an operating system is to provide a stable underlying system to handle hardware abstraction, user interfacing, and the bare minimum functionality needed to self-modify and self-update. Application software should be very loosely coupled with system software, wherever possible.

## Principles

The concepts I'm about to outline are intended for a Linux user who does not often tinker with their system's core components. AKA, someone who needs a stable daily driver system. Once the system is properly configured to work with the hardware, no additional changes should really be needed.

Package management on Linux should define two domains: System software, and user software.

- System software consists of a set of packages and configurations necessary to produce a functioning OS with the proper drivers and a desktop environment, as well as some means by which the user may install additional software _on top_ of the OS- not inside or alongside it.
- User software consists of anything that is not _strictly critical_ for the abstractions provided by the kernel, desktop, and software management systems to work. This is an effective separation of duties.

Furthermore, the way in which these two domains are managed should differ:

- System software should function on versioned sets of specific package versions, where all packages in the set are known to work together without issue.
  - Updating should be a single process, whereby all the necessary files to instantiate the newest working set version are downloaded and configured at once.
  - This software, being in a known good state (barring machine-specific errata), should be stored in a medium that the user normally does not have direct access to, and the kernel image may assume that this set of software is always valid, and its containing media is always available.
    - In short, it should have a dedicated partition. Since software is almost never _added_, this partition can be just small enough for the system, and remain that small throughout its lifespan.
- User software should function on individual packages (applications or libraries), be available for the user to install, modify, and uninstall.
  - It should be user-specific, and should not hinge heavily on libraries provided by the system.
  - Libraries and shared content should be managed as additional user software, and dependency conflicts may be resolved by simply installing the fewest number of different versions of the dependency needed to satisfy all constraints- even if that number is greater than one. Modern computers have plenty of power to perform such calculations, and plenty of space to handle duplicate versions of dependencies.
  - No amount of corruption or misconfiguration of user software should put the system in an unusable state, and it should always be possible to start fresh simply by purging all user software. This allows for system recovery in the event that the user's partition becomes corrupted or damaged, too.

In this model, user software depends on a well-defined set of interfaces with a small footprint, provided by a known-good system configuration. This is a stark contrast to the current model, where all software depends on any number of poorly defined versioned interfaces within different components of the operating system.

Ultimately, I think this philosophy should serve to guide Linux software development moving forwards. People with vastly more resources than me already have had the same idea- projects like Universal Blue, based on Fedora Atomci, and NixOS, in conjunction with user software technologies like Flatpak- have moved desktop Linux further and further towards a visualization of this set of ideas: an immutable host operating system, wherein the user can trivially install, modify, and uninstall any program not critical to the system's operation. Modifications to the system are versioned and applied atomically, to maintain some known-good configuration and keep the system in a usable state. And to maintain flexibility and compatibility with more standard package management models, all that is needed is a containerized environment in which a typical Linux distro can be installed and modified arbitrarily, without ever modifying the system software.

## Emergent Properties

So, let's assume we have a system that subscribes to this philosophy. What kind of interesting properties emerge from this?

### Reproducibility And Reliability

Since most systems will be running the same combination of system software, with the exception of hardware-specific software like drivers, it should be relatively easy to identify and trace problems within the system. A configuration can be easily replicated on one machine from another, and a configuration that works on one machine should work on any other- and the inverse would apply to a broken configuration. Preventing the user from directly modifying this configuration maintains this reproducibility.

### Security

Disallowing modification of the system in ways that are not well-defined (or disallowing it altogether) prevents the user or any malicious actors from introducing security holes into the software or its configuration. If the system partition is never modified, `dm-verity` can be configured so that the kernel image will refuse to boot a tampered or corrupted system, and combining this with Secure Boot extends this trust down to the hardware level (on a well-configured, well-made computer). Updates and system images can be signed by a central authority to ensure that no tampering has occurred along the wire. Applications being installed per-user allows for privacy and separation between users, possibly eliminating information side channel attacks.

### Flexibility

Separating user software from system software allows the installation of more types of software, as well as versions of applications that may be too old for their native packaging dependencies to exist at the right versions. It increases reliability, in that application functionality is not tied directly to system state. Having applications installed per-user means that different users have fully customized application profiles, including only the software that user needs. Plus, users can locate their home directories on the network, and have the same software selection available anywhere as long as their directory is mounted on a machine running a similarly designed OS.

## This Sounds Pretty Cool (Conclusion)

I agree! And like I mentioned, this paradigm isn't nonexistent in the OS space. Some operating systems perform trivial separation of user and system software, like Windows relegating user software to the Program Files directory (Really? Windows got this right? This one stings). Many game consoles employ this paradigm for security and DRM purposes. [Universal Blue](https://universal-blue.org/) and other immutable Linux distros embrace this concept, maintaining a stable base system while allowing a large amount of user freedom. Android and its derivatives take this idea to the extreme, with a totally immutable system partition protected by a hardware-based root-of-trust, and applications installed exclusively per-user. And recently, systemd released its own immutable OS, called [ParticleOS](https://github.com/systemd/particleos).

I used to dislike technologies like Flatpak, and be very gung-ho about native packaging being superior. But as the tech has improved, and its upsides became ever more obvious, my opinion has changed wildly. Now, I'm glad to see Linux moving towards a generally more usable, stable, and flexible software management philosophy. I think the issues with the old way of doing things are a big part of what's holding back widespread adoption of Linux on desktops, laptops, and handhelds. And I think immutable systems are a fantastic starting point for introducing a more well-defined security model to desktop Linux- to that end, I started the [HalogenOS project](https://git.shibedrill.site/halogenos) to realize my own implementation of an optimally secure system, based on immutability and software management that empowers end users instead of burdening them with the responsibilities of the superuser, or binding them to the archaic rules of typical package managers. I hope one day, systems such as these will allow the average user to run Linux in a way that's stupid easy, secure, reliable, and fun.

## If You Want To Try (Further Reading)

Here are a few Linux distributions that employ immutability in the manner I described, while providing a means by which the user can still modify application software:

- [ParticleOS](https://github.com/systemd/particleos), a tightly integrated OS based on systemd
- [Universal Blue](https://universal-blue.org/), based on Fedora Atomic
- [Bazzite](https://bazzite.gg/), based on Universal Blue and specialized for gaming
- [carbonOS](https://carbon.sh/), an independent immutable distro with security in mind
- [chromeOS](https://www.chromium.org/chromium-os/chromiumos-design-docs/filesystem-autoupdate/), an operating system designed for seamless UX on Chromebooks

Enjoy!
