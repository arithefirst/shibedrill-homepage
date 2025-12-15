<script lang="ts">
  import { string } from 'astro:schema';
  import { onMount } from 'svelte';

  interface VCResponse {
    viewcounter?: number;
    message?: string;
  }

  interface Props {
    article: string;
  }

  const { article }: Props = $props();

  let viewCountReq = $state<VCResponse | null>();

  onMount(async () => {
    viewCountReq = await (await fetch(`https://analytics.shibedrill.site/api/view/${article}`)).json();
  });
</script>

<p>{viewCountReq?.viewcounter} Views</p>
