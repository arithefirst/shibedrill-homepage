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
  <div class="flex gap-2 flex-col justify-center">
    {#if index > 0}
      <div class="w-full">
        <a class="btn btn-primary btn-sm w-full" href="/post/{posts[index - 1].id}" title={posts[index - 1].data.title}
          ><span>←</span>{truncate(posts[index - 1].data.title)}</a
        >
      </div>
    {/if}
    {#if posts[index + 1]}
      <div class="w-full">
        <a class="btn btn-primary btn-sm w-full" href="/post/{posts[index + 1].id}" title={posts[index + 1].data.title}
          >{truncate(posts[index + 1].data.title)}<span>→</span></a
        >
      </div>
    {/if}
  </div>
</div>
