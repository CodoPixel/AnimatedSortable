# AnimatedSortable

Allows you to rearrange HTML elements by moving them with the cursor, all with cool animations.

## Get started

First of all, you need to copy the code from `src/Sortable.js`, and add the dependency:

```html
<script src="https://cdn.jsdelivr.net/npm/interactjs/dist/interact.min.js"></script>
<script src="Sortable.js"></script>
```

## How to use Sortable() ?

Before touching Javascript, the elements to be moved must be created correctly in HTML. Indeed, there is a specific architecture to respect:

```html
<div id="container" class="all-cards" data-sortable=".card">
  <div class="card" data-position="0" data-id="1">
    <div class="content">
      <h2>Step 1</h2>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio hic
        eveniet, non.
      </p>
    </div>
  </div>

  <div class="card" data-position="1" data-id="2">
    <div class="content">
      <h2>Step 2</h2>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio hic
        eveniet, non.
      </p>
    </div>
  </div>

  <!-- etc. -->
</div>
```

As you can see, the container has to have a specific attribute:

- `data-sortable`: it has to contain the query selector of the elements to be moved (here those elements are div which have the class `card`, so the query selector is: `.card`).

Afterwards, each card must have two custom attributes:

- `data-position`: an integer starting at _0_. Each element has a position 1 higher than the previous one.
- `data-id`: an integer starting at _1_. Each element has a position 1 higher than the previous one.

Now, the HTML is done. However, these elements must have specific CSS properties:

```css
#container {
  position: relative; /* necessary */
}

.card {
  /* recommended */
  touch-action: none;

  /* necessary: */
  width: 450px; /* has to be fix */
  height: 200px; /* has to be fix */
  margin: 0; /* has to be 0 */
  box-sizing: border-box; /* necessary if you want to add padding */
  padding: 10px;

  /* better with this: */
  transition: 0.5s;
  -webkit-touch-callout: none;
  -webkit-user-select: none;

  /* your properties... */
}

/* To pretend that there is space between the elements, when this is not the case. */
.card .content {
  padding: 15px;
  background-color: #fff;
  box-shadow: 0 1px 3px 0 #d4d4d5, 0 0 0 1px #d4d4d5;
}

/* very important: */

.is-dragged {
  transition: 0s;
  opacity: 0.7;
  z-index: 9000;
}
```

_Note: all the elements must have fixed `width` & `height`. Also, you cannot use `margin` and should use `box-sizing: border-box` if you want to use `padding`._

Perfect, now we can use Javascript! Let's create a new `Sortable` object:

```javascript
var container = document.querySelector("#container");
var scrollableElement = null;
var isColumn = false;
var sortable = new Sortable(container, scrollableElement, isColumn);

// not necessary
sortable.success = function (results) {
  console.log(results);
};
```

`Sortable` takes three arguments:

| name       | type     | description                                                                                                 | default value |
| ---------- | -------- | ----------------------------------------------------------------------------------------------------------- | ------------- |
| element    | Document | The container of all the cards to be moved.                                                                 | _required_    |
| scrollable | Document | the container to which to refer if the container of the movable elements is scrollable.                     | document.body |
| column     | boolean  | You can't use CSS to define the display of your elements (row or column), so you need to use this argument. | false         |

## Responsive

`Sortable` can be used on a touch screen (mobile...) and it fits on the window changes size.

## About the code

The source code actually comes from `Grafikart` (French Youtubeur), however I have modified and slightly improved it (notably by allowing columns).

## License

MIT License.
