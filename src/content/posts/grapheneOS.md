---
'title': 'GrapheneOS: the Good, the Bad, and the Ugly'
'date': 2025-2-17 EST
'tags': ['security', 'privacy']
---

#

Recently, I switched my phone- a used Google Pixel 7 Pro- from LineageOS to GrapheneOS, in pursuit of a more secure mobile operating system. I discovered many things in the process, including that I miss Google Pay less than I thought I would.

<!-- more -->

For a long time, I was running LineageOS 21 on my P7P. I liked the idea of having a nonstandard, fully open source distribution of Android, but I had qualms with it- including the fact that, despite being a relatively trivial task to implement, the bootloader was not re-lockable. Growing slightly paranoid that maybe someone could rootkit my phone over USB without even unlocking it, eventually I decided to try out this operating system I had heard a lot about, called GrapheneOS.

GrapheneOS is a modification of Android that runs Google's Play Services in a sandbox, just like every other app. They don't get privileged access to the operating system, and can be uninstalled at any time. It also includes better permissions handling, including contact scopes and storage scopes, and various hardening features and exploit protections. The features that totally sold me were the lockable bootloader and the "Duress PIN", which wipes the phone if it's input.

## The Good

Installing GrapheneOS is actually dead simple. The hardest part was putting my phone in fastboot mode, which I *could* have accomplished from the Kitsune app, but instead I used the button combination. Once I got it into fastboot mode, I plugged my phone in over USB, unzipped the release folder I had downloaded, and ran the flashing script. It automatically flashed all of the necessary files to the correct partitions and re-locked the bootloader, just like that. It's even simpler if you use Chrome or any browser that supports WebUSB.

Upon reboot, I completed the setup, inlcuding disabling OEM unlocking- and was greeted with a totally blank black home screen, with a very sparse icon selection. I faltered a little bit, because I wasn't totally sure what to do. But after checking the apps drawer, I found an "App Store" app that came installed by default. In it, the Google Play Store and Android Auto were available as downloadable apps. I rely heavily on Android Auto for navigation on my car's head unit, and I get most of my apps from the Play Store, so I opted to install them both. I did have to configure Android Auto's permissions so it could work properly, but after that, everything worked perfectly.

Like I mentioned above, there's not many apps installed by default. There's not many apps in the App Store, or in Accrescent, which is a secure app store for Android devices that can be installed via the App Store. From talking to the GrapheneOS community, I found that it's discouraged to use Play Store alternatives like Aurora Store, or alternate stores like Fdroid. There are security implications to obtaining apps from sources that perform minimal verification of their apps. Hence, the recommendation from them was to use the Play Store when needed, and to use Obtainium for anything with a GitHub release.

GrapheneOS's permissions are distrustful by default, and upon installation, all of an app's permissions are set to the defaults- even if the app was installed previously and granted more permissions. This likely prevents malicious apps from disguising as legitimate apps that were previously installed, and acquiring permissions that the non-malicious version had been granted. Apps still run in isolation, just like stock Android, and certain OS components are hardened to reduce attack surface, such as `malloc`- which has been replaced by `hardened_malloc`.

One feature I really like is the "Duress PIN". It's a PIN number or password that can be input at any system-generated PIN or password dialog, and once input, it irreversibly wipes the phone, in a process that cannot be interrupted. I also like that there's a lot of exploit protection features like reboots that trigger if you go a certain time without unlocking the phone. Overall, it makes me fairly confident that if my phone were stolen by some highly skilled and funded adversary, it would be very difficult for them to get any kind of data off of it.

Graphene also includes "profiles"- a way of putting apps into separate "personas". They're not any more isolated from one another, but the idea is to isolate them in the user's mind, and to make it easier to keep "lives" separate- work, school, personal, and online lives, for examples.

## The Bad

Since Google's anticompetitive behavior allows them to globally dictate the usability of Android as an operating system, apps that use Google's Play Integrity API will likely not function properly on GrapheneOS. Google Pay is included in this, so tap-to-pay is out of the option for anyone who relies on Google Pay, rather than a regional banking app. Some apps are unaffected, though, like Duo Mobile (a 2FA app), which refused to function under rooted LineageOS but is totally fine under Graphene. The OS produces a notification every time an app uses the API.

And speaking of app compatibility, some apps may crash due to the exploit protection tweaks Graphene uses. Typically, it's for the best that users avoid disabling exploit protection for apps, but in my situation I had no choice- the app that kept crashing was my banking app, and their website is just dogshit and won't let me log in. Disabling hardened `malloc` fixed the crash for me.

Since, by default, Google Play Services are not granted location permission, all requests to the Play Services API are routed first theough GrapheneOS's own location services- which are less accurate than the Play Services location service. I found that location would often not function if I was indoors, and that I needed line of sight to the sky for satellite pings to register. It is possible and allowed to enable Google's location services, but this obviously means that Google is then able to see your location. The included location services work when I'm in the car, so I don't find myself needing anything more accurate, *especially* if it would mean Google gets to know where I am.

## The Ugly

I like some of the default apps in GrapheneOS. Vanadium, the browser, for instance- it's very well hardened, and employs the secure system webview. I don't use it since I mostly prefer Firefox, but the option is there for people who like Chromium browsers. However, most of the default apps are totally unchanged from the Android Open Source Project, and the UI style is certainly showing its age. The clock, gallery, and messaging apps are real eyesores. The colors are obnoxious and remind me of Android 7.0 Nougat. The files app is just a slight improvement over the Android file picker dialog (which I've always thought looked dated). I've been told that better default apps are on the way, which would be really nice.

Graphene also doesn't include a *lot* of apps by default. It doesn't come with a music player or a calendar app, for examples. For music, I use Auxio, but I haven't found a nice calendar app so far. I know LineageOS had a nice one, but I'm not sure how much of that is based on the AOSP version, or if there even *is* an AOSP version. But the developers of GrapheneOS have stood pretty firm on their stance that it's better to include less system apps to reduce attack surface.

## Conclusions

I found GrapheneOS easier to use than I thought I would. I don't miss Google Pay as badly as I thought I'd miss it, but erasing the muscle memory that makes me reach for my phone whenever I approach a payment terminal is proving difficult. Overall, I think it's a worthy trade-off for increased security. If I had to do this all over again, I think I would have bought a Pixel 8 Pro instead of the 7, since the 8 series has some cool hardware security features like Memory Tagging Extensions. But I bought this phone as an emergency purchase when I totally destroyed my Moto Z4, so I wasn't thinking too straight. I'm still happy with this setup, and I think I prefer GrapheneOS over Lineage, or stock Android as Google ships it. You have the option to use as much or as little of Google's software as you'd like, but you have significantly improved hardening in almost every respect.

Would I recommend GrapheneOS to someone who's *not* super into security, or doesn't own an unlockable Pixel? No. But would I recommend it to someone who already owns a compatible device and is willing to sacrifice just a little bit of convenience for some really cool features? Absolutely. If you own a Google Pixel phone with a bootloader that can be unlocked, and you think these features sound like something you want in a mobile OS, I think it's worth checking out for a little bit. And if you don't like it, you can always reflash stock Android.
