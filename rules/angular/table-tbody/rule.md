---
id: angular/table-tbody
title: Table rows in Angular templates sit inside an explicit tbody (or thead/tfoot); the browser inserts one and hydration fails.
severity: moderate
check: static
applies:
  - angular
stack:
  - angular
skill: fe-angular
since: 0.1.0
sources:
  - title: Angular, Hydration (valid HTML structure)
    url: https://angular.dev/guide/hydration
---

## Why

When the server sends `<table><tr>`, the browser's parser adds a `<tbody>` the template does not know about. During hydration Angular finds a different DOM than it rendered and reports a mismatch; the component is then rendered again on the client, which costs time and can flash or shift the table.

## Fix

Wrap rows in `<tbody>` (and header rows in `<thead>`) in the template itself. It is valid HTML either way and also keeps the table structure clear for assistive technology.

## Examples

```html
<!-- bad -->
<table>
  @for (order of orders(); track order.id) { <tr><td>{{ order.number }}</td></tr> }
</table>
<!-- good -->
<table>
  <tbody>
    @for (order of orders(); track order.id) { <tr><td>{{ order.number }}</td></tr> }
  </tbody>
</table>
```
