---
'title': 'Learning NixOS: Part 0'
'date': 2024-12-31 EST
'tags': ['linux']
---

#

I began learning NixOS recently, as I have been quickly losing my patience for Windows and its bullshit. Diving in headfirst, these are my notes from my initial investigations.

<!-- more -->

I'd heard about NixOS in the past, from youtubers like No Boilerplate, and I had tried it once in a VM- but never really caught onto it. However, Windows was proving to be a less-than-optimal OS for software development work, and I wanted to finally move to an environment where I wasn't constantly fucking around with library paths and broken installers. WSL is nice, but it can only get you so far when you're trying to work on complex projects.

The first thing I learned about NixOS is that it has a very loyal fanbase. People love it. It's just like Rust, in that while not many people use it, the people that _do_ use it are religiously enthusiastic about it. That said, I can see why. In development, you really need reproducibility. "It works on my machine" is the whole reason we have Docker, and I dislike Docker so much that I put off learning it for years. Nix seems to be the stopgap solution for reproducible environments anywhere, both on the server and on the desktop. It's versatile, and I can respect that.

The second thing I learned is that NixOS has a pretty active community, and there's a lot of open-source tools and tech built on top of the Nix language, allowing the user to make even more precise and powerful changes to their systems. Home manager is one such example, but there's also things like disko. Installing NixOS in a virtual machine to get started with my first flake, I tried to be future-proof about it- I wanted to write a configuration set that I wouldn't have to massively refactor to include something useful. So, I wanted to write a single flake that included _all_ the bells and whistles. This was my first mistake- I was immediately in over my head, utterly lost, and unsure of what I wanted to even accomplish because I was so caught up in thinking about _how_ I wanted to accomplish it. Analysis Paralysis and bikeshedding are what I do better than any other girl in the techsphere, baby!!!

The third thing I learned: The Nix language has a syntax that I, at the time of writing, hate. It's not that I think it's objectively bad, or poorly designed. It just feels utterly antithetical to anything I've ever used before, and I find that my instincts are often in contradiction with the language's intended syntax. (For context, I primarily use Rust and Java in my day-to-day programming work.) Having to explicitly declare which variables are carried into a local scope seems... wrong. Especially using Nix's `let in` syntax. Every guide I find for the language just leaves me feeling bewildered, and I wonder how the Nix language might look if it were designed to feel more familiar to users of other languages.

Other things that befuddle me about the Nix language:

- No static or strong typing.
- Functions produce lambdas instead of values.
- Functions lack names.

But maybe it's just me coming from Rust, where everything is needlessly typesafe.

Lastly, I felt overwhelmed when looking for functions and keys to configure programs like Git. I know there's websites that have information on the options Nix offers, but I just wish there was an IDE plugin that would autocomplete them for me. It would be much less of a headache.

My goals as of right now are to create a flake that I can use to configure roughly the same user environment on any PC or laptop, with very minor alterations depending on the system. The configurations I had put together beforehand were done in WSL, but the configurations I found in the VM's `configuration.nix` were far more varied and detailed. So at some point, I need to look at both configs, and think of a way to merge some of the necessary bare-metal configuration options into my incomplete WSL flake. I have a spare laptop to test it on now, though, which should help- since I can try using it for school work and get used to the environment.

My current NixOS files are available [here](https://github.com/shibedrill/nixfiles) if you're interested!
