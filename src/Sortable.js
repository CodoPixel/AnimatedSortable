/**
 * Allows you to move and to reorder elements by moving them with the cursor.
 */
class Sortable {
    /**
     * @param {Document} element the container of all the draggable elements.
     * @param {Document} scrollable the container to which to refer if the container of the movable elements is scrollable. By default: `document.body`.
     * @param {boolean} column do you want a single column ? Then, `true`. By default: `false`.
     */
    constructor(element, scrollable, column) {
        if (scrollable == null) {
            scrollable = document.body;
        }

        this.column = column || false;
        this.scrollable = scrollable;

        this.element = element;
        this.items = this.element.querySelectorAll(this.element.dataset.sortable);
        this.setPositions();

        var self = this;
        window.addEventListener('resize', function() {
            self.setPositions();
        });

        /* make the items interactive with interact.js */
        
        interact(this.element.dataset.sortable, {
            context: this.element
        }).draggable({
            inertia: false,
            manualStart: ("ontouchstart" in window) || window.DocumentTouch && window.document instanceof window.DocumentTouch,
            autoScroll: {
                container: this.scrollable === window.document.body ? null : this.scrollable,
                margin: 50,
                speed: 600,
            },
            onmove: function(e) {
                self.move(e);
            }
        }).on('dragstart', function(e) {
            var rect = e.target.getBoundingClientRect();

            e.target.classList.add('is-dragged');
            self.startPosition = e.target.dataset.position;
            self.offset = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
            self.scrollTopStart = self.scrollable.scrollTop;
        }).on('dragend', function(e) {
            e.target.classList.remove('is-dragged');
            self.moveItem(e.target, e.target.dataset.position);
            self.sendResults();
        }).on('hold', function(e) {
            if (!e.interaction.interacting()) {
                e.interaction.start({
                    name: 'drag'
                }, e.interactable, e.currentTarget);
            }
        });
    }

    setPositions() {
        /* in order to make the items absolute */
        var rect = this.items[0].getBoundingClientRect();
        this.item_width = Math.floor(rect.width);
        this.item_height = Math.floor(rect.height);
        if (this.column) {
            this.cols = 1;
        } else {
            this.cols = Math.floor(this.element.offsetWidth / this.item_width);
        }
        this.element.style.height = (this.item_height * Math.ceil(this.items.length / this.cols)) + "px";

        for (var item of this.items) {
            item.style.position = 'absolute';
            item.style.top = '0px';
            item.style.left = '0px';
            item.style.transitionDuration = '0s';
            this.moveItem(item, item.dataset.position);
        }

        var self = this;
        window.setTimeout(function() {
            for (var item of self.items) {
                item.style.transitionDuration = null;
            }
        });
    }

    move(e) {
        var p = this.getXY(this.startPosition);
        var x = p.x + e.clientX - e.clientX0;
        var y = p.y + e.clientY - e.clientY0 + this.scrollable.scrollTop - this.scrollTopStart;
        e.target.style.transform = "translate3D(" + x + "px, " + y + "px, 0)";
        var oldPosition = e.target.dataset.position;
        var newPosition = this.guessPosition(x + this.offset.x, y + this.offset.y);
        if (oldPosition != newPosition) {
            this.swap(oldPosition, newPosition);
            e.target.dataset.position = newPosition;
        }
        this.guessPosition(x, y);
    }

    getXY(position) {
        var x = this.item_width * (position % this.cols);
        var y = this.item_height * Math.floor(position / this.cols);
        return {
            x: x,
            y: y
        };
    }

    guessPosition(x, y) {
        var col = Math.floor(x / this.item_width);
        if (col >= this.cols) {
            col = this.cols - 1;
        }
        if (col <= 0) {
            col = 0;
        }
        var row = Math.floor(y / this.item_height);
        if (row < 0) {
            row = 0;
        }
        var position = col + row * this.cols;
        if (position >= this.items.length) {
            return this.items.length - 1;
        }
        return position;
    }

    swap(start, end) {
        for (var item of this.items) {
            if (!item.classList.contains('is-draggable')) {
                var position = parseInt(item.dataset.position, 10);
                if (position >= end && position < start && end < start) {
                    this.moveItem(item, position + 1);
                } else if (position <= end && position > start && end > start) {
                    this.moveItem(item, position - 1);
                }
            }
        }
    }

    moveItem(item, position) {
        var p = this.getXY(position);
        item.style.webkitTransform = item.style.transform = "translate3D(" + p.x + "px, " + p.y + "px, 0)";
        item.dataset.position = position;
    }

    /**
     * Provides information about the items that have been moved.
     */
    sendResults() {
        var results = {};
        for (var item of this.items) {
            results[item.dataset.id] = item.dataset.position;
        }
        if (this.success) this.success(results);
    }
}