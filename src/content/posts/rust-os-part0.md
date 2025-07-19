---
'title': 'Rust & OS Dev: Part 0'
'date': 2025-07-08 EST
'tags': ['programming', 'operating systems', 'rust']
---

#

The Rust language is, without a doubt, my favorite programming language of all
time. Strongly typed, great build system, memory safe, all that jazz. But how
good is it for building operating systems? Only one way to find out.

<!-- more -->

Recently, I resumed work on [Gila](https://git.shibedrill.site/shibedrill/gila),
a microkernel OS I began writing in Rust as I was finishing my Operating 
Systems course in college. It's not in a useful state yet, but regardless,
I've learned a lot about Rust's limitations as a language and an ecosystem. In
this post, I'll talk about the areas where Rust excels, and the areas that it
lacks in- whether that's because of the application of the language, or the
language itself.

## Build System Features

Cargo, Rust's build system, is the single most important reason I adopted Rust
as my go-to programming language. Dependency management is stupidly easy, and
I have never had to fiddle around with build scripts or linker arguments. This
is obviously complicated when building an OS kernel, as certain linker 
settings need to be tweaked for the kernel to function with the bootloader, 
but I was able to find resources that detailed specifically what needed to be
done.

Additionally, Cargo's conditional compilation system allows me to gate code
behind a `#[cfg]` statement, which I can use to compile certain architecture
specific backends to support an architecture agnostic interface. This makes for
far less complexity in the central calling code, as nothing changes if the code
is compiled for a different architecture. I also made certain parts of the OS
kernel into "features", which could be deactivated at compile-time to save space
and reduce attack surface. There's no point in compiling UEFI support into a
kernel that will only be booted on BIOS-only systems. (I did this because I 
wanted to port Gila to IA32 some day, but couldn't due to a core library not
supporting it.) In fact, you can even avoid compiling in dependencies for 
inactive features, by marking them as optional.

## Memory Safety

Rust's memory safety model ensures that no two parts of a program may
simultaneously obtain mutable access to the same value, and there cannot be a
mix of mutable and immutable references to the same value. Also, Rust does not
permit mutable static values. Allowing for this would cause race conditions,
use-after-free bugs, and TOCTOU bugs. However, in some parts of my OS, I did
need multiple parts of the code to access and mutate the same static value- for
example, the logger is a global lazy static struct which needs to be mutably
referenceable by every part of the kernel to log data to the serial terminal. To
get around the limitations of the borrow checker, I made the logger into a
mutex: a structure that can be "locked" to temporarily perform some mutation,
and then "unlocked" once it goes out of scope.

Unfortunately, widespread use of mutexes can present another problem: deadlocks.
If a piece of code attempts to gain lock on another resource, but that resource 
is being held by some other part of the code which won't release the lock, the 
section that's trying to lock it will never gain lock & continue executing. To 
avoid this, I have to be careful about where I lock mutexes, and whether it's 
possible for a piece of code to attempt to lock a resource that some other part 
of the code can lock.

