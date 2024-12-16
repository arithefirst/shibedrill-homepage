---
'title': 'A Real POS: Upsettingly Hacky Architecture'
'date': 2024-12-15 EST
'tags': ['rant']
---

#

I work at a grocery store. As an unfortunate result, I'm rather familiar with the software my job uses, both for the normal checkout terminals and the self-checkouts. During my time here, I've made some... *uncomfortable* realizations about the way the systems are architectured. And since they didn't make me sign any NDAs, I'm here to share it with a tiny portion of the Internet.

<!-- more -->

First of all, the normal checkouts run 4690 OS, also known as TCx Sky- a Toshiba product, previously developed by IBM. It's just Linux, with a Java application handling the actual point-of-sale operations. Different stores can use different applications for the top layer, but my job uses something called "Store Configurator ACE GUI". I suspect it runs X11 due to the cursor and the screensaver, and I know it runs Java 8 from the POS application's "Java Version" button. Needless to say, this is a nearly 10 year old ecosystem. If Java 8 released in 2014, the underlying Linux system is likely based on the 3.1x.x series kernel.

At one point, the store suffered a partial power outage due to faulty wiring, and all the checkouts and servers briefly lost power and rebooted. I find it likely that the checkouts came online while the DHCP server or router was still offline, because every terminal failed to boot on account of not having an IP address. Which dropped them directly to root debug shells. I certainly hope they aren't running any kind of disk encryption, because being able to obtain a root shell by unplugging the network cable and rebooting is an awfully stupid security hole that could be patched with a single configuration change.

The self-checkout systems are another story. They run Windows 10, possibly one of the extended release versions. They're also manufactured by NCR Corporation (National Cash Register), both the hardware and the software. But despite this incongruency with the software running on the normal checkouts, transactions can be easily suspended on any self-checkout and resumed on any normal checkout. Also, "overrides" on the self-checkouts are triggered by the same conditions as they are on the normal checkouts, and require the same authentication via barcode IDs. So, logically, they must share some central infrastructure for transactions and authentication. I also know that other establishments, using different regular checkouts, also use the same NCR checkouts with the same software. So there must be some way that the self-checkouts are able to interface with the preexisting infrastructure, which is likely done to save costs. Now, I'm nosy, so let's find out how it works!

The self-checkouts have several glaring problems and strange behaviors which we, the employees, are naturally forced to work around. Sometimes, they will lock up completely, and declare themselves to be "out-of-sync"- a fatal error which will eventually result in the whole system crashing and rebooting. In the reboot process, terminals and management windows briefly pop up displaying information about the status of the software bringup, including individual "devices" involved in the system. One day I was bored, and watched one boot up, and saw it activating devices one by one: Scanners, scales, cash changers, cameras, screens... And "Virtual Simulated Retail Platform Software"?

And then a console window pops up, titled:

`4690 Console`

And the icon is the fucking Java cup.

The self-checkouts don't merely share the same API and infrastructure as the regular checkouts, no. They don't even use some kind of translation layer at the server level. They run a *simulated copy* of the TCx Sky Java components, hook into the JVM using C++ code, and manually poke memory values and call functions to translate the customer's actions on NCR's UI into *simulated actions* inside this *simulated copy* of 4690 OS. This allows the self-checkouts to use the same infrastructure as the normal checkouts without overhead, but with the added bonus of everything being perpetually broken. Because this is quite literally the *hackiest thing* I have ever seen get deployed anywhere, for any purpose. You can't even remove produce items from the cart, because the removal function searches for the items by value instead of using a reference, and the searches never return true because the software subtracts the weight of a produce bag automatically.

Oh, also, every so often the regular checkout terminals just throw random null pointer exceptions, and a little icon in the corner starts flashing that says "Check logs". Now pray tell, Toshiba, what am I (a cashier) supposed to do when the software *YOU* maintain dereferences a nullptr? I mean, I know I'm overqualified for my position. But I'm not exactly in any place to be helping you out. Mostly on account of the fact that I hate Java. I'm morally opposed to working with it, right along with the NSA and DOD.
