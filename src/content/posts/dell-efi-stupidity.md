---
'title': 'Tracking down an obscure Linux Kernel regression'
'date': 2024-11-29
'tags': ['linux']
---

*This post has been copied from [my Tumblr blog](https://tumblr.com/shibedrill1). If you've seen it before, this is why.*

So I use a shitty ancient laptop. A Dell Latitude E6420 from 2012: i5-2520m CPU, 16gb of RAM, 512gb SSD. Good enough for me. It's slow, it's thick, it's heavy, but it's got a lot of ports, it's sturdy, and it's repairable. I tried to get a newer laptop, one with a faster processor and bigger screen, but it was so thin and flimsy that it crashed if I looked at it wrong or picked it up while it was running. It was entirely plastic and shattered as soon as I dropped my backpack. With the laptop in the *padded laptop compartment*. And somehow, it had a maximum RAM capacity of 12gb- smaller than my shitty Latitude. So I switched back, and I still daily drive this hunk of shit business laptop.

<!-- more -->

I use Linux on all my laptops and mobile machines, and I run EndeavourOS on my laptop right now. Windows is too slow and bloated for my taste, and its drivers for this laptop are kind of broken due to its age. I should also mention that I use my laptop for school, and it's imperative that it boots reliably every single time I pull it out of my backpack. So when I upgraded my kernel from 6.5.9 to 6.6.1, and rebooted to discover that the system would hang before it could even boot the kernel, you can imagine how stressed I was trying to get it working again. Luckily I have a Medicat USB with an Arch ISO on it, so I was able to live boot into Arch, chroot into my installation, and install the linux-lts kernel, which booted without issue. This also gave me the first clue as to what the fuck was happening.

After reinstalling the OS a couple of times as a sanity check (sometimes I break shit by accident) and testing out the linux-zen kernel, I was able to determine the following:

1. The boot hang didn't occur with linux-lts, but did occur with linux and linux-zen. Which meant that the issue wasn't with packaging, but it was upstream, in the kernel source tree.

2. The system was not secretly booting without me realizing. I knew this because the hard drive indicator and the CPU fan didn't actually turn on during these stuck boots, whereas normally, the HDD indicator would start flashing two seconds after GRUB booted the kernel.

3. The problem wasn't anything to do with graphics drivers. I was able to reproduce it with both Nouveau and Nvidia's proprietary drivers, as well as with nomodeset enabled on both of them.

4. The hang only happened roughly half the time. Sometimes it worked, sometimes it didn't. The bug had something to do with some type of randomized function, or it was related to some type of non-deterministic hardware failure or errata.

5. The issue occurred somewhere between GRUB starting the kernel, and whatever happens after that. I was able to ascertain this by enabling debug messages from GRUB, and it showed that the hang would occur at "Starting image at 0xdeadbeef...".

6. The issue was not architecture or microarchitecture specific. I determined this by performing a fresh installation in QEMU, with the CPU topology configured to match the host CPU, and the issue couldn't be replicated.

7. The issue was not related to GRUB, since it persisted even using systemd-boot. I managed to brick my system in the process of attempting to switch back to GRUB, and had to reinstall.

With all this information in mind, I filed my first ever bug report on the Kernel Bugzilla page. I ended up finding one or two other people who had the same exact issue, after the same exact update, all on older Sandy Bridge processors. I attempted to do a git bisect to figure out the responsible commit, but this is not something that's easy or fast on a 2012 laptop. One compilation took over seven hours. Times fourteen or so steps in the bisection between 6.5.9 and 6.6.1, that's... Four straight days of compilation. Ninety eight hours. And I lost my progress about three compilations in, after reinstalling my system again due to broken graphics drivers.

Thankfully, like I said, I was not alone. Another user on the bug tracker who had the issue was able to perform a successful bisection of the kernel, and determined the offending commit. As luck would have it, the code changes related to the EFI stub and the kernel's interaction with the system EFI firmware, specifically the code responsible for decompressing the kernel image into memory. The users on the bug tracker also surmised that the problem had to do with where the kernel was getting loaded into memory, and wrote up a few patches to display some useful debug information regarding that.

The Linux kernel, in version four point something, had support for KASLR merged. KASLR, or Kernel Address Space Layout Randomization, is a functionality that makes it harder for hackers to call a kernel function with a known address or offset by loading the kernel into a random physical address with each boot. ASLR, Address Space Layout Randomization, already randomizes virtual address space layouts for user space applications, but it's performed optionally for the kernel as well. One person on the forum suggested that KASLR was the issue with the boot failures, and since the boot hang was occurring randomly, I had a feeling that they were right. Disabling KASLR through the kernel command line arguments, I confirmed that the latest kernel (6.6.5 at the time) booted four out of four times. Re-enabling KASLR, it hung on the first boot. So there was our culprit. Everyone else confirmed that KASLR being turned off would resolve the hang.

It was brought up that the Arch wiki had a short note about buggy Dell EFI firmware, which linked to a single patch diff in the 5.10-5.11 kernel update. The EFI firmware from Dell is really fucked up, and hands off more information than it needs to to the kernel, which results in some problems without custom handling code or a specialized EFI shim. That code got merged in the 5.11 update, like I mentioned, and at that time I was using BIOS to boot my laptop so I never noticed the issue.

So at long last, a patch was posted to the bug tracker, wherein it would detect older versions of EFI firmware and disable KASLR accordingly by setting the randomization seed to zero. I recompiled the kernel with the patch, and the system booted without issue three out of three times. I was ecstatic, obviously. The patch subsequently got merged into Linux v6.7-rc6, and was mainlined into Linux v6.7 soon after. I'm so happy I got to contribute to the project, even if it was as simple as reporting a bug and doing some quick testing.

Such are the joys of owning a clunker craptop from 2012. Hope you enjoyed the story of my first contribution to the Kernel Project. I don't know how many people are going to benefit from this patch, but I hope that it's gonna be more than just me.