/*
---
description: Class that makes table rows scrollable keeping thead and tfoot fixed.
license: MIT-style

authors:
- Massimiliano Torromeo

requires:
- core/1.2.4: '*'

provides:
- ScrollableTable

...
*/

var ScrollableTable = new Class({
	Implements: Options,

	options: {
		wrapperClass: 'scrollable-container',
		scrollbarWidth: 15
	},

	initialize: function(table, options) {
		this.setOptions(options);
		this.table = document.id(table);

		this.thead = this.table.getElement('thead');
		if (this.thead) {
			this.theadTable = new Element('table').set('class', this.table.get('class'));
			this.theadTable.adopt(this.thead).inject(this.table, 'before');
		}

		this.tfoot = this.table.getElement('tfoot');
		if (this.tfoot) {
			this.tfootTable = new Element('table').set('class', this.table.get('class'));
			this.tfootTable.adopt(this.tfoot).inject(this.table, 'after');
		}

		this.scrollableContainer = new Element('DIV', {
			'class': this.options.wrapperClass,
			styles: {
				overflow: 'auto'
			}
		}).inject(this.table, 'after').adopt(this.table);

		this.update();
	},

	update: function() {
		var widths = [];
		var column = 0;

		[this.thead, this.tfoot].each(function(tpart) {
			if (tpart && tpart.getFirst()) {
				var tds = tpart.getFirst().getChildren();
				for (var x = 0; x<tds.length; x++) {
					if (x >= widths.length)
						widths[x] = 0;
					tds[x].setStyle('width', '');
					var w = tds[x].getWidth();
					if (widths[x] < w)
						widths[x] = w;
				}
			}
		}, this);

		if (this.table.getElement('tbody').getFirst()) {
			column = 0;
			this.table.getElement('tbody').getFirst().getChildren().each(function(cell) {
				//console.log(cell);
				if (column >= widths.length)
					widths[column] = 0;
				var w = cell.getWidth();
				if (widths[column] < w)
					widths[column] = w;
				column++;
			}, this);
		}
		

		[this.thead, this.tfoot].each(function(tpart) {
			if (tpart && tpart.getFirst()) {
				var total = 0;
				var tds = tpart.getFirst().getChildren();
				for (var x = tds.length-1; x>=0; x--) {
					var w = widths[x] + (x == tds.length-1 ? this.options.scrollbarWidth : 0)
					tds[x].setStyle('width', w);
					total += w;
				}
				tpart.getParent().setStyle('width', total);
			}
		}, this);


	},

	toElement: function() {
		return this.table;
	}
});
