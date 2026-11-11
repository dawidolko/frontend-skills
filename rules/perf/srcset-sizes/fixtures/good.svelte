<script>
  let { image } = $props()
</script>

<img src="card-800.jpg" srcset="card-400.jpg 400w, card-800.jpg 800w" sizes="(width >= 60rem) 33vw, 100vw" alt="Product" width="800" height="600">
<img src="logo.png" srcset="logo.png 1x, logo@2x.png 2x" alt="Shop" width="120" height="40">
<picture>
  <source type="image/avif" srcset="card-400.avif 400w, card-800.avif 800w" sizes="(width >= 60rem) 33vw, 100vw">
  <img src="card-800.jpg" alt="Product" width="800" height="600">
</picture>
<img src={image.src} srcset={image.srcset} alt={image.alt} width="800" height="600">
