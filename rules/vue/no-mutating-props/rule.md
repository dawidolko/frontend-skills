---
id: vue/no-mutating-props
title: A component never changes its props (or objects and arrays inside them); it emits an event or keeps a local copy.
severity: moderate
check: static
applies:
  - vue
stack:
  - vue
  - nuxt
skill: fe-vue
since: 0.1.0
sources:
  - title: Vue docs, Props (one-way data flow, mutating object and array props)
    url: https://vuejs.org/guide/components/props
  - title: eslint-plugin-vue, no-mutating-props
    url: https://eslint.vuejs.org/rules/no-mutating-props
---

## Why

Props flow one way, from parent to child. Assigning to a prop is refused with a warning; pushing into a prop array or setting a field of a prop object silently changes the parent's state from inside the child, so the data changes without the parent knowing who changed it, and the next parent render can overwrite it.

## Fix

Emit an event and let the owner change its state (`emit('update:modelValue', value)`, or `defineModel()` for a two-way binding). For a value the child edits locally, copy it: `const draft = ref(props.initialValue)`, or `computed` for a derived value. Sort a copy: `[...props.items].sort(...)` or `toSorted()`.

## Examples

```vue
<!-- bad -->
<script setup>
const props = defineProps({ items: Array, count: Number })
function add(item) { props.items.push(item); props.count++ }
</script>
<!-- good -->
<script setup>
const props = defineProps({ items: Array, count: Number })
const emit = defineEmits(['add'])
const sorted = computed(() => props.items.toSorted((a, b) => a.rank - b.rank))
function add(item) { emit('add', item) }
</script>
```
