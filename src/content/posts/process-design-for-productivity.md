---
'title': 'Process Design for Tinkers'
'date': 2026-10-08 EST
'tags': ['rant']
---

#

In the course of working on projects (of which I have many ongoing), frequently I find my productivity to be completely negated by just how disorganized and scattered my ADHD-addled brain is. I make stupid mistakes, forget results of tests and experiments, lose track of my thoughts, and just generally get in my own way. Maybe it's time I hack my own brain by designing procedures to manage my own workflows.

<!-- more -->

## The Problem

I'll start with a metaphor. Imagine you go to make a cup of coffee one morning, and discover that the coffee machine doesn't work. Perplexed, you perform a cursory inspection of the machine, but find no obvious signs of a malfunction. So you get to work trying to disassemble the machine and diagnose it, and you get it taken halfway apart (and utterly frustrate yourself in the process) before realizing that the damn thing was never plugged in. At that point, you just can't help but feel stupid. How does one miss something so obvious?

Now for an example: The other day, I was working on my 3D printer, tinkering with a few [Marlin firmware configurations](https://git.shibedrill.site/shibedrill/marlin-configs). I was editing the code on my laptop, pushing my changes to my Git server, then using my desktop via SSH to pull the most recent commits, build the firmware binary (my desktop is wildly faster than my laptop), and transfer it back over to my laptop to flash. I had just changed a movement limit to compensate for the BLtouch probe's X offset, and was about to test my changes. So I pushed my commits, switched to my SSH window, compiled the firmware, copied over the binary, and installed it, only to find that the printer was not recognizing the new limits.

So, being the scatterbrained fool that I am, my immediate response was to blame Marlin. I spent roughly half an hour googling my issue, with no relevant results to speak of. I was getting annoyed by this point, so I had to call it quits and go get something to eat. I felt defeated and, frankly, quite stupid. It really made me feel like I couldn't get anything right.

Later, though, during dinner, I realized my mistake: *I had never synced the remote changes to my desktop* before recompiling the firmware. I enabled my VPN, SSH'd into my desktop, and ran `git pull` in the config repo folder. Sure as shit, new changes got pulled from my server. I quietly swore to myself, ran the build script, and disconnected. My inattentiveness, tunnel vision, and impatience were the problem- not the firmware. I could have prevented this issue in a number of ways, such as burning config version numbers into the firmware binary, setting up a proper CI/CD pipeline on my Git server, or performing the full workflow via SSH to avoid needing to sync changes to begin with. But I let myself become blinded by frustration and my tendency to dive headfirst into problems I don't fully understand or plan for.

Looking back, I do all sorts of shit like this. Whether it's messing with code, fixing computers, or tinkering with a motorcycle engine that just refuses to start, I find myself missing obvious issues and getting wildly frustrated.

How do we avoid this? Well, with process engineering, of course!

## The Critical Fault

Time for root cause analysis! What specifically is my issue?

1. I fail to establish proper procedures for iteratively testing things.
2. Some kind of fault occurs, or is present.
3. I make false assumptions about what parts of the system, or my own process, could be at fault.
4. I focus heavily on what I *think* is the issue, without analyzing all elements in the chain.
5. The real issue goes unnoticed.
6. In investigating the red herring, I often exacerbate or change the behavior of the real issue.
7. Frustration.

I often fail to remember anything which isn't written down, so it's not surprising that I would succumb to the fallacy of "oh I'll certainly remember *that* for more than five minutes". This applies to not only what elements of a system I need to analyze, but also what steps I've taken and what parameters I've changed. Failure to accurately catalog the elements of a system and the changes I've done to them is the core of the issue.

## Process Engineering

The solution to this problem is obvious, albeit, not especially easy. I have to design robust methods of troubleshooting, and follow them closely, to avoid memoryholing random things and shooting myself in the foot. This is a multi-stage process, and it's somewhat engaging, so I need to force myself to pay attention to it. I should also mention that I'm developing this process as I write this article, so it is by no means battle-tested- I merely believe it addresses my analytical shortcomings.

### 1. Define The System

What are you working on? A printer? A computer? A motorcycle? A program? Try to define all the discrete components involved in the system, and form a traceable chain from your first inputs or changes to the desired outputs. For example, let's say you're working on a motorcycle engine. You turn a wrench, the wrench turns the crankshaft, the crankshaft moves the pistons and turns the cam chain, which turns the camshaft, which actuates valves. The combined movement of the pistons and valves create compression in the cylinders. 

Got that? Okay, cool. Now pay close attention:

**__WRITE. THIS. DOWN.__**

If you do not write these elements down, you will forget them. I promise. This is the most critical part.

### 2. Define The Problem

Compare the expected outcome with the current behavior. In an engine, we desire high compression on each cylinder, but the current behavior is 0 PSI on all cylinders. It might be tempting to start from the problem and work our way backwards, by listing all possible causes of the problem, like worn valve seats or scored cylinders. However, not all causes might be relevant! If the engine is freshly rebuilt, some issues are less likely (such as worn piston rings) while others are far more likely (such as faulty cam timings).

Lastly, ensure you also write down the problem and the expected behavior! It will come in handy later, I pinky swear.

### 3. Traverse The System

Step through the system's elements, from input to output, and consider the possible failure modes of each component *or* step in the process. Do not assume that any component is infallible, and double check each part as you consider it. Documentation and observability is very important at this stage, because you have a sanity check with regards to how things work and what you've tried. If you have photos of the pistons being installed on the connecting rods, you can be more certain that the pistons are indeed moving and generating some compression.

Identify elements that may be possible faults. Record them somewhere permanent. Follow the chain to its output before you start modifying or testing anything.

### 4. Isolation Tests

Pick one possible item, and list all the possible tests you could perform to check that component's function or efficacy. Leave no stone unturned- do not assume that a part is functioning perfectly without verifying it directly. Then perform each test, and record any changes you made, alongside the results they produced. Only change one element at a time!!! Otherwise, you will lose track of what influence your changes have. Of course, also record the part's condition or settings before you change anything, so you know how to revert it to its previous state.

Once you have completed every test for one element, and verified it is functional or tuned to specification, you can move on to the next item. It's important to leave each element in a known-good state, so they do not preclude other elements from working properly. This is also why order matters- you cannot test Item B before Item A if Item B's function *depends* on the correctness of Item A's function.

If the problem you're working on resolves after changing one element, ensure to record that result, but do not let that stop you from at least *inspecting* every other item in the chain. Don't leave anything out, because the problem could still be lurking under some edge case or fringe set of parameters, which *will* cause it to rear its ugly head at the worst time: when you think you've got it all locked down and figured out.

The same thing goes if the problem *changes* during testing. Complete all relevant analyses of the initial problem, before restarting the process from step 1 for the new problem. Don't assume you can reuse the same documentation! The new problem may involve entirely different parts of the system.

### 5. Integration Tests

If multiple components affect the outcome, but neither can resolve it individually, it's time for the sucky part. You have to take a very careful and methodical approach to maximize your success. This part is hard to generalize, but like I said before, only change one element at a time. It improves observability and allows you to prove or disprove hypotheses as you tinker. Continue to record your changes and their outcomes, so you can revert a change if you overcompensate.

Lastly, once you have every element in proper working order, perform as many sanity checks as you're able to. Cover the whole system from end to end, start to finish. If everything checks out, you can record your results, alongside the steps you took, and file it away somewhere you'll remember it. This knowledge can & will become relevant again at some point in the future, so it's helpful to keep it close to the project itself, if it's something physical.

## Habit Formation and Pattern Recognition

Hopefully, applying this methodology to problem solving consistently will rewire my brain (and the brain of anyone else who adopts it) to actually solve problems, rather than whip themselves into a frenzy over one possible cause of a multifaceted, complex issue. In the long term, the goal is to improve pattern recognition, as well as attention to detail and analytical skills. If all goes well, it will serve as my modus operandi for problem solving from here on out, which will help me to avoid further instances of issues which could reasonably be described as [PEBKAC](https://en.wiktionary.org/wiki/PEBCAK).

More tangentially, though, being able to work through problems rationally and methodically will help me feel less awful about making stupid mistakes or screwing up simple little things. We all make mistakes, but catching them and preventing future occurrences of similar mistakes are the things that matter most to those who tinker. Personally, I'm pretty sick and tired of feeling like a failure every time I miss something due to my inattention and eagerness to hurl myself at a problem I'm not fully prepared to analyze. It's finally time to utilize some kind of solid, established process to better wield my own intellect. The mind is a precision tool, and what's more important than how smart you are is learning how to use it right.

Hopefully, this helps you too, reader. Good luck, and happy tinkering.