<script lang="ts">
  import { Checkbox, Label, useId, type WithoutChildrenOrChild } from "bits-ui";
	import Check from "lucide-svelte/icons/check";
	import Minus from "lucide-svelte/icons/minus";

	let {
		checked = $bindable(false),
		ref = $bindable(null),
		labelRef = $bindable(null),
		labelText = $bindable(""),
	}: WithoutChildrenOrChild<Checkbox.RootProps> & {
		labelText: string;
		labelRef?: HTMLLabelElement | null;
	} = $props();
</script>

<div class="flex items-center space-x-3">
  <Checkbox.Root
    id="terms"
    aria-labelledby="terms-label"
    class="border-muted bg-foreground data-[state=unchecked]:border-border-input data-[state=unchecked]:bg-background data-[state=unchecked]:hover:border-dark-40 peer inline-flex size-[25px] items-center justify-center rounded-md border"
    name="hello"
		bind:checked
  >
    {#snippet children({ checked, indeterminate })}
      <div class="text-background inline-flex items-center justify-center">
        {#if indeterminate}
          <Minus class="size-[15px]" />
        {:else if checked}
          <Check class="size-[15px]"/>
        {/if}
      </div>
    {/snippet}
  </Checkbox.Root>
  <Label.Root
    id="terms-label"
    for="terms"
    class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
  >
    {labelText}
  </Label.Root>
</div>