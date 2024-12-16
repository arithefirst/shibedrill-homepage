<script>
  const { next, prev } = $props();
</script>

<div class="join grid grid-cols-2 self-center pb-6">
  {#if next && prev}
    <a href={prev} class="join-item btn btn-primary">Previous Page</a>
    <a href={next} class="join-item btn btn-primary">Next Page</a>
  {:else if next && !prev}
    <a href={next} class="btn btn-primary col-span-2">Next Page</a>
  {:else if prev && !next}
    <a href={prev} class="btn btn-primary col-span-2">Previous Page</a>
  {/if}
</div>
