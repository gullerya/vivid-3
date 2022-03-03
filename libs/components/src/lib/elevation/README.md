# vwc-elevation

The _elevation_ component enables a user to set perceived elevation to a certain level.  
**Note: This component is responsible for the perceived visual elevation alone and not for the HTML elements stacking context.**

```js
<script type='module'>
    import '@vonage/vivid/elevation';
</script>
```

```html preview
	<vwc-elevation id="elevation" dp="0">
		<div class="card">
			Hover me!
		</div>
	</vwc-elevation>
  <script>
    const elevation = document.getElementById("elevation");
    elevation.addEventListener("mouseenter", this.onMouseEnter);
    elevation.addEventListener("mouseleave", this.onMouseLeave);

    function onMouseEnter(e) {
      e.target.setAttribute('dp', '24');
      e.target.querySelector('div').innerText = 'Get OFF of me!';
    }

    function onMouseLeave(e) {
      e.target.setAttribute('dp', '0');
      e.target.querySelector('div').innerText = 'Hover me!';
    }
  </script>
  <style>
    .card {
      padding: 20px;
      text-align: center;
    }
  </style>
```
## DP

Use the `dp` attribute to change the elevation's level in Density-Independent Pixels (DP). 

- Type: `0`|`2`|`4`|`8`|`12`|`16`|`24`
- Default: `2`

```html preview
<vwc-layout column-basis="block">
	<vwc-elevation dp="0">
		<div class="card">
			This is the content inside the elevation with DP 0
		</div>
	</vwc-elevation>
	<vwc-elevation dp="2">
		<div class="card">
			This is the content inside the elevation with DP 2
		</div>
	</vwc-elevation>
  <vwc-elevation dp="4">
		<div class="card">
			This is the content inside the elevation with DP 4
		</div>
	</vwc-elevation>
  <vwc-elevation dp="8">
		<div class="card">
			This is the content inside the elevation with DP 8
		</div>
	</vwc-elevation>
  <vwc-elevation dp="12">
		<div class="card">
			This is the content inside the elevation with DP 12
		</div>
	</vwc-elevation>
  <vwc-elevation dp="16">
		<div class="card">
			This is the content inside the elevation with DP 16
		</div>
	</vwc-elevation>
  <vwc-elevation dp="24">
		<div class="card">
			This is the content inside the elevation with DP 24
		</div>
	</vwc-elevation>
</vwc-layout>
```

## CSS Custom Properties
| Name                        | Description                                        | Default |
| --------------------------- | -------------------------------------------------- | ------- |
| `--elevation-border-radius` | Border radius of the elevation’s surface in pixels | 6px     |