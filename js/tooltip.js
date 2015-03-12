var ToolTip = Class.create();
var divIdNum = 0;

ToolTip.prototype = Object.extend(ToolTip.prototype, {
	/**
	 * @param string elemId
	 * @param array options
	 */
	initialize: function(elemId, options) {
		this.effectInAction = false;
		this.tooltipStatus = 0;
		this.containerId = this.generateId();
		this.elementId = elemId;
		
		this.options = {
	      tooltipText: "Test tooltip",
		  followMouse: false,
		  tooltipOffsetX: 0,
		  tooltipOffsetY: 0
	    };
		Object.extend(this.options, options || {});
		
		if (this.options.followMouse == true) {
			var bottomTipClass = 'tip_btm_bg_simple';
		}
		else {
			var bottomTipClass = 'tip_btm_bg_dialog';
		}
		
		var tip_template = new Template("<div id='#{tip_id}' class='tooltip_div' style='display:none;'><table cellpadding='0' cellspacing='0'><tr><td class='tip_top_bg'></td></tr><tr><td class='tip_mdl_bg'><div style='padding:5px'>#{tip_text}</div></td></tr><tr><td class='#{bottom_class}'></td></tr></table></div>");
		
		new Insertion.Bottom(document.body, tip_template.evaluate({
			tip_id: this.containerId,
			tip_text: this.options.tooltipText,
			bottom_class: bottomTipClass
		}));
		
		$(elemId).observe('mouseover',
			function(event) {
				this.changeTipState();
				this.setTooltipPosition(event);
			}.bind(this)
		);
		
		$(elemId).observe('mouseout',
			this.changeTipState.bind(this)
		);
		
		if (this.options.followMouse == true) {
			$(elemId).observe('mousemove', 
				function(event){
					this.setTooltipPosition(event);
				}.bind(this)
			);
		}
	},
	
	generateId: function() {
		var div_id = '';
		
		do {
			div_id = 'tip_div_' + divIdNum;
			divIdNum++;
		} while ($(div_id));
		
		return div_id;
	},

	setTooltipPosition: function(event) {
		if (this.options.followMouse == true) {
			var mouseX = Event.pointerX(event);
			var mouseY = Event.pointerY(event);
			
			var viewportWidth = document.viewport.getWidth();
			var viewportHeight = document.viewport.getHeight();
			
			var scrollOffsets = document.viewport.getScrollOffsets();
			var scrollLeft = scrollOffsets[0];
			var scrollTop = scrollOffsets[1];
			
			var containerWidth = $(this.containerId).getWidth();
			var containerHeight = $(this.containerId).getHeight();
			
			if ((mouseX - scrollLeft + containerWidth) >= viewportWidth) {
				mouseX = mouseX - containerWidth - 5 + this.options.tooltipOffsetX;
			} else {
				mouseX = mouseX + 5 + this.options.tooltipOffsetX;
			}
			
			if ((mouseY - scrollTop + containerHeight) >= viewportHeight) {
				mouseY = mouseY - containerHeight - 10 + this.options.tooltipOffsetY;
			} else {
				mouseY = mouseY + 10 + this.options.tooltipOffsetY;
			}
			
			$(this.containerId).setStyle({
				left: mouseX + 'px',
				top: mouseY + 'px'
			});
		}
		else {
			if (this.options.tooltipOffsetX == 0 && this.options.tooltipOffsetY == 0) {
				var elementWidth = $(this.elementId).getWidth();
				var containerWidth = $(this.containerId).getWidth();
				var offsetLeft = parseInt((elementWidth / 2) - (containerWidth / 2));
				$(this.containerId).clonePosition($(this.elementId), {setWidth: false, setHeight: false, offsetLeft: offsetLeft, offsetTop: 0});
			}
			else {
				$(this.containerId).setStyle({
					left: this.options.tooltipOffsetX + 'px',
					top: this.options.tooltipOffsetY + 'px'
				});
			}
		}
	},
	
	show: function() {
		this.effectInAction = true;
		new Effect.Appear(this.containerId, {duration:0.5});
		setTimeout(function(){this.effectInAction = false; this.tooltipStatus = 1;}.bind(this), 500);
	},
	
	hide: function () {
		this.effectInAction = true;
		new Effect.Fade(this.containerId, {duration:0.5});
		setTimeout(function(){this.effectInAction = false; this.tooltipStatus = 0;}.bind(this), 500);
	},
	
	changeTipState: function () {
		if (this.effectInAction == false) {
			if (this.tooltipStatus == 0) {
				this.show();
			}
			else {
				this.hide();
			}
		}
		else {
			setTimeout(function(){this.changeTipState()}.bind(this), 600);
		}
	}
}
);