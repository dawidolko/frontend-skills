<template>
  <nav aria-label="Main">
    <ul>
      <li><a href="/" aria-current="page">Home</a></li>
      <li>
        <button type="button" :aria-expanded="open" aria-controls="products">Products</button>
        <ul id="products" :hidden="!open"><li><a href="/editor">Editor</a></li></ul>
      </li>
    </ul>
  </nav>
  <div role="menu" aria-label="Row actions"><button role="menuitem">Rename</button></div>
</template>
