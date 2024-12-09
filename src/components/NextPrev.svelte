<script>
  const { posts, index } = $props();

  function truncate(str) {
    if (str.length > 30) {
      let truncated = str.slice(0, 30);
      if (truncated.endsWith(' ')) {
        truncated = truncated.trimEnd();
      }
      return truncated + '...';
    }
    return str;
  }
</script>

<div class="text-center">
  <div class="relative flex py-5 items-center">
    <div class="flex-grow border-t border-white border-1"></div>
    <span class="flex-shrink mx-4 text-base-content">Thanks for Reading! Read another post?</span>
    <div class="flex-grow border-t border-white border-1"></div>
  </div>

  {#if index > 0}
    <a class="link-primary" href="/post/{posts[index - 1].id}" title={posts[index - 1].data.title}
      >← {truncate(posts[index - 1].data.title)}</a
    >
  {/if}
  {#if posts[index + 1]}
    <a class="link-primary" href="/post/{posts[index + 1].id}" title={posts[index + 1].data.title}
      >{truncate(posts[index + 1].data.title)} →</a
    >
  {/if}
</div>
